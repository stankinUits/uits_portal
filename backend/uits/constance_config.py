# settings.py
import datetime

class Constance:
    CONSTANCE_CONFIG = {
        # Весенний семестр
        "ARCHIVE_SPRING_SEMESTER_START": (
            datetime.date(2025, 9, 1),
            "Дата начала весеннего семестра",
            datetime.date
        ),
        "ARCHIVE_SPRING_SEMESTER_END": (
            datetime.date(2025, 12, 31),
            "Дата окончания весеннего семестра",
            datetime.date
        ),

        # Осенний семестр
        'ARCHIVE_AUTUMN_SEMESTER_START': (
            datetime.date(2025, 2, 1),
            'Дата начала осеннего семестра',
            datetime.date
        ),
        "ARCHIVE_AUTUMN_SEMESTER_END": (
            datetime.date(2025, 6, 30),
            "Дата окончания осеннего семестра",
            datetime.date
        ),
        "ARCHIVE_FILTER_YEARS_BACK": (
            10,
            "Количество лет для отображения фильтрации",
            int
        )
    }

    # settings.py
    CONSTANCE_CONFIG_FIELDSETS = {
        'Семестры в архиве': {
            'fields': (
                'ARCHIVE_AUTUMN_SEMESTER_START',
                'ARCHIVE_AUTUMN_SEMESTER_END',
                'ARCHIVE_SPRING_SEMESTER_START',
                'ARCHIVE_SPRING_SEMESTER_END',
                'ARCHIVE_FILTER_YEARS_BACK',
            ),
            'description': 'Настройки учебных семестров'
        },
    }
