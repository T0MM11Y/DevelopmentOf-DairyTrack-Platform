# Generated by Django 5.1.6 on 2025-03-06 02:27

import datetime
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('health', '0002_symptom_anus_condition_symptom_behavior_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='ProcessedMilk',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('processing_time', models.DateTimeField(auto_now_add=True)),
                ('product_type', models.CharField(max_length=50)),
                ('new_expiration_time', models.DateTimeField()),
                ('volume_liters', models.DecimalField(decimal_places=2, max_digits=5)),
            ],
        ),
        migrations.AddField(
            model_name='cow',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=datetime.datetime(2025, 3, 6, 2, 26, 5, 947967, tzinfo=datetime.timezone.utc)),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='cow',
            name='lactation_phase',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AddField(
            model_name='cow',
            name='lactation_status',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='cow',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name='notification',
            name='type',
            field=models.CharField(default='General', max_length=50),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='diseasehistory',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.CreateModel(
            name='Farmer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=50)),
                ('last_name', models.CharField(max_length=50)),
                ('birth_date', models.DateField()),
                ('contact', models.CharField(max_length=15)),
                ('religion', models.CharField(blank=True, max_length=50, null=True)),
                ('address', models.TextField(blank=True, null=True)),
                ('gender', models.CharField(max_length=10)),
                ('total_cattle', models.IntegerField(default=0)),
                ('join_date', models.DateField()),
                ('status', models.CharField(max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='cow',
            name='farmer',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='health.farmer'),
        ),
        migrations.AddField(
            model_name='notification',
            name='processed_milk',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='health.processedmilk'),
        ),
        migrations.CreateModel(
            name='RawMilk',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('production_time', models.DateTimeField(auto_now_add=True)),
                ('expiration_time', models.DateTimeField()),
                ('volume_liters', models.DecimalField(decimal_places=2, max_digits=5)),
                ('previous_volume', models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True)),
                ('status', models.CharField(default='Fresh', max_length=20)),
                ('cow', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='health.cow')),
            ],
        ),
        migrations.AddField(
            model_name='processedmilk',
            name='raw_milk',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='health.rawmilk'),
        ),
        migrations.AddField(
            model_name='notification',
            name='raw_milk',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='health.rawmilk'),
        ),
    ]
