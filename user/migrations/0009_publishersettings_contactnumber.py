# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2017-10-10 19:53
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0008_publishersettings_verifiedpublisher'),
    ]

    operations = [
        migrations.AddField(
            model_name='publishersettings',
            name='contactNumber',
            field=models.CharField(default='', max_length=10),
        ),
    ]
