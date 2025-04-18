from django.db.models import Sum
from rest_framework import serializers
from .models import Order, OrderItem, ProductType, ProductStock
from stock.serializers import ProductTypeSerializer
import logging

logger = logging.getLogger(__name__)

class OrderItemSerializer(serializers.ModelSerializer):
    product_type = serializers.PrimaryKeyRelatedField(
        queryset=ProductType.objects.all(),
        write_only=True  # Hanya untuk input
    )
    product_type_detail = ProductTypeSerializer(source='product_type', read_only=True)  # Untuk output detail

    class Meta:
        model = OrderItem
        fields = ['id', 'product_type', 'product_type_detail', 'quantity', 'total_price']
        read_only_fields = ['total_price'] # Tambahkan product_stock agar tidak bisa diubah setelah dibuat

    # Override untuk menangani penulisan (write) product_type saat create/update
    def create(self, validated_data):
        # Saat create, product_type diharapkan sebagai objek (bukan hanya ID)
        return OrderItem.objects.create(**validated_data)

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

class OrderSerializer(serializers.ModelSerializer):
    order_items = OrderItemSerializer(many=True, required=False)

    class Meta:
        model = Order
        fields = ['id', 'order_no', 'customer_name', 'email', 'phone_number',
                  'location', 'shipping_cost', 'total_price', 'status',
                  'payment_method', 'created_at', 'order_items', 'notes']
        read_only_fields = ['order_no', 'total_price', 'created_at']

    def create(self, validated_data):
        logger.debug(f"Validated data: {validated_data}")
        validated_data.setdefault('shipping_cost', 0)
        order_items_data = validated_data.pop('order_items', [])
        logger.debug(f"Order items data: {order_items_data}")

        if not order_items_data:
            raise serializers.ValidationError({"order_items": "Minimal satu item harus dipesan."})

        order = Order.objects.create(**validated_data)

        for item_data in order_items_data:
            product_type_obj = item_data.get('product_type')
            logger.debug(f"Product type: {product_type_obj}")
            if not product_type_obj:
                order.delete()
                raise serializers.ValidationError({"order_items": "Product type tidak valid."})

            total_stock = ProductStock.objects.filter(product_type=product_type_obj).aggregate(total=Sum('quantity'))['total'] or 0
            if item_data['quantity'] > total_stock:
                order.delete()
                raise serializers.ValidationError({"order_items": f"Stok untuk {product_type_obj.product_name} tidak mencukupi."})

            price_per_unit = product_type_obj.price
            OrderItem.objects.create(
                order=order,
                product_type=product_type_obj,
                quantity=item_data.get('quantity'),
                price_per_unit=price_per_unit
            )

        order.update_total_price()
        order.refresh_from_db()
        return order

    def update(self, instance, validated_data):
        current_shipping_cost = instance.shipping_cost
        new_shipping_cost = validated_data.get("shipping_cost", current_shipping_cost)
        shipping_cost_changed = current_shipping_cost != new_shipping_cost

        if shipping_cost_changed and instance.status == 'Requested':
            validated_data['status'] = 'Processed'

        new_status = validated_data.get("status", instance.status)
        payment_method = validated_data.get("payment_method", instance.payment_method)

        if new_status == "Completed" and not payment_method:
            raise serializers.ValidationError(
                {"payment_method": "Metode pembayaran harus diisi sebelum menyelesaikan pesanan."}
            )

        if new_status == "Completed":
            for item in instance.order_items.all():
                total_stock = ProductStock.objects.filter(product_type=item.product_type).aggregate(total=Sum('quantity'))['total'] or 0
                if item.quantity > total_stock:
                    raise serializers.ValidationError(
                        {"error": f"Stok untuk {item.product_type.product_name} tidak mencukupi!"}
                    )

        for attr, value in validated_data.items():
            if attr != 'order_items':  # Jangan update order_items langsung
                setattr(instance, attr, value)

        instance.save()
        instance.refresh_from_db()
        return instance
