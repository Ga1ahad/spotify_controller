# Generated by Django 4.2.7 on 2023-12-03 18:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='room',
            name='host',
            field=models.CharField(max_length=50),
        ),
    ]