from flask import Blueprint, jsonify, request
from app import db
from app.models import RawMilk
from datetime import datetime, timedelta
import pytz

# Timezone lokal (misalnya, Asia/Jakarta)
local_tz = pytz.timezone('Asia/Jakarta')

# Define Blueprint
raw_milks_bp = Blueprint('raw_milks', __name__)


@raw_milks_bp.route('/raw_milks', methods=['GET'])
def get_raw_milks():
    raw_milks = RawMilk.query.order_by(RawMilk.id).all()
    result = []
    for raw_milk in raw_milks:
        raw_milk_dict = raw_milk.to_dict()
        # Gunakan timeLeft langsung dari to_dict()
        result.append(raw_milk_dict)
    return jsonify(result)

@raw_milks_bp.route('/raw_milks/<int:id>', methods=['GET'])
def get_raw_milk(id):
    raw_milk = RawMilk.query.get_or_404(id)
    return jsonify(raw_milk.to_dict())


@raw_milks_bp.route('/raw_milks', methods=['POST'])
def create_raw_milk():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No input data provided'}), 400

    try:
        production_time = datetime.fromisoformat(data.get('production_time'))
        if production_time.tzinfo is None:
            production_time = local_tz.localize(production_time)
    except (ValueError, TypeError):
        return jsonify({'error': 'Invalid or missing production_time'}), 400

    # Set expiration time to 8 hours from production time
    expiration_time = production_time + timedelta(hours=8)
    current_time = datetime.now(local_tz)
    time_left = max((expiration_time - current_time).total_seconds(), 0)

    raw_milk = RawMilk(
        cow_id=data.get('cow_id'),
        production_time=production_time,
        volume_liters=data.get('volume_liters'),
        previous_volume=float(data.get('previous_volume', 0.0)),
        status=data.get('status', 'fresh'),
        session=data.get('session'),
        daily_total_id=data.get('daily_total_id'),
        available_stocks=data.get('available_stocks', data.get('volume_liters')),
        expiration_time=expiration_time
    )

    db.session.add(raw_milk)
    db.session.commit()
    response_data = raw_milk.to_dict()
    response_data['time_left'] = time_left
    return jsonify(response_data), 201

@raw_milks_bp.route('/raw_milks/<int:id>', methods=['PUT'])
def update_raw_milk(id):
    raw_milk = RawMilk.query.get_or_404(id)
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No input data provided'}), 400

    raw_milk.cow_id = data.get('cow_id', raw_milk.cow_id)
    raw_milk.production_time = data.get('production_time', raw_milk.production_time)
    raw_milk.volume_liters = data.get('volume_liters', raw_milk.volume_liters)
    raw_milk.previous_volume = float(data.get('previous_volume', raw_milk.previous_volume))
    raw_milk.status = data.get('status', raw_milk.status)
    raw_milk.session = data.get('session', raw_milk.session)
    raw_milk.available_stocks = data.get('available_stocks', raw_milk.available_stocks)

    db.session.commit()
    return jsonify(raw_milk.to_dict())
    
@raw_milks_bp.route('/raw_milks/cow/<int:cow_id>', methods=['GET'])
def get_raw_milks_by_cow_id(cow_id):
    raw_milks = RawMilk.query.filter_by(cow_id=cow_id).order_by(RawMilk.id).all()
    if not raw_milks:
        return jsonify({'message': f'No raw milk records found for cow_id {cow_id}'}), 404

    result = [raw_milk.to_dict() for raw_milk in raw_milks]
    return jsonify(result)    


@raw_milks_bp.route('/raw_milks/today_last_session/<int:cow_id>', methods=['GET'])
def get_today_last_session_by_cow_id(cow_id):
    # Get today's date in YYYY-MM-DD format
    today = datetime.utcnow().date()

    # Query RawMilk entries for today and the given cow_id, and get the maximum session
    last_session = db.session.query(db.func.max(RawMilk.session)).filter(
        RawMilk.cow_id == cow_id,
        db.func.date(RawMilk.production_time) == today
    ).scalar()

    # If no sessions are found, return 0 as default
    if last_session is None:
        last_session = 0

    # Return the last session as a JSON response
    return jsonify({'cow_id': cow_id, 'date': str(today), 'session': last_session}), 200
    
@raw_milks_bp.route('/raw_milks/<int:id>/is_expired', methods=['GET'])
def check_raw_milk_expired(id):
    # Perbarui semua entri yang sudah kedaluwarsa di database
    current_time = datetime.now(local_tz)  # Offset-aware datetime
    expired_milks = RawMilk.query.filter(RawMilk.expiration_time < current_time, RawMilk.is_expired == False).all()

    for milk in expired_milks:
        milk.is_expired = True
        milk.status = "expired"
    
    # Commit perubahan ke database
    db.session.commit()

    # Ambil entri raw milk berdasarkan ID
    raw_milk = RawMilk.query.get_or_404(id)

    # Hitung waktu tersisa atau tandai sebagai expired
    if raw_milk.is_expired:
        time_remaining = None
    else:
        # Pastikan expiration_time memiliki timezone yang sama dengan current_time
        expiration_time = raw_milk.expiration_time
        if expiration_time.tzinfo is None:
            expiration_time = local_tz.localize(expiration_time)
        time_remaining = expiration_time - current_time

    return jsonify({
        'id': raw_milk.id,
        'cow_id': raw_milk.cow_id,
        'expiration_time': raw_milk.expiration_time.isoformat(),
        'is_expired': raw_milk.is_expired,
        'status': raw_milk.status,
        'time_remaining': str(time_remaining) if time_remaining else "Expired"
    }), 200

@raw_milks_bp.route('/raw_milks/<int:id>', methods=['DELETE'])
def delete_raw_milk(id):
    raw_milk = RawMilk.query.get_or_404(id)
    db.session.delete(raw_milk)
    db.session.commit()
    return jsonify({'message': 'Raw milk production has been deleted!'})