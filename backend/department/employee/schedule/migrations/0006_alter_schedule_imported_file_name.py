from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('schedule', '0005_alter_schedulelesson_options_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='schedule',
            name='imported_file_name',
            field=models.CharField(blank=True, default='-', editable=False, max_length=256, null=True, verbose_name='Название импортированного файла'),
        ),
    ]
