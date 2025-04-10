# Generated by Django 5.1.3 on 2025-04-07 07:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stock', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='stockhistory',
            name='change_type',
            field=models.CharField(choices=[('sold', 'Sold'), ('expired', 'Expired'), ('contamination', 'Contamination')], max_length=20),
        ),
    ]
