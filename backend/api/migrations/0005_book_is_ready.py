# Generated by Django 5.1.2 on 2024-12-02 08:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0004_lectureprogress"),
    ]

    operations = [
        migrations.AddField(
            model_name="book",
            name="is_ready",
            field=models.BooleanField(default=False),
        ),
    ]
