# Generated by Django 5.1.2 on 2024-11-25 13:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0002_book"),
    ]

    operations = [
        migrations.AddField(
            model_name="book",
            name="text_data",
            field=models.TextField(blank=True, null=True),
        ),
    ]
