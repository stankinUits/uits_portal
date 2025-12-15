from django.contrib.admin import SimpleListFilter
from constance import config
from django.utils.timezone import now

from archive.admin_tools.admin_utils import is_date_in_semester, semester_year


class SemesterFilter(SimpleListFilter):
    title = 'Семестр'
    parameter_name = 'semester'

    SEMESTERS = {
        'autumn': {
            'label': 'Осенний',
            'start': config.ARCHIVE_AUTUMN_SEMESTER_START,
            'end': config.ARCHIVE_AUTUMN_SEMESTER_END,
        },
        'spring': {
            'label': 'Весенний',
            'start': config.ARCHIVE_SPRING_SEMESTER_START,
            'end': config.ARCHIVE_SPRING_SEMESTER_END,
        },
    }

    def lookups(self, request, model_admin):
        years_back = config.ARCHIVE_FILTER_YEARS_BACK

        current_year = now().year
        lookups = []

        for year in range(current_year, current_year - years_back, -1):
            for key, semester in self.SEMESTERS.items():
                value = f'{key}_{year}'
                label = f'{semester["label"]} {year}'
                lookups.append((value, label))

        return lookups

    def queryset(self, request, queryset):
        value = self.value()
        if not value:
            return queryset

        try:
            semester_key, year = value.split('_')
            year = int(year)
        except ValueError:
            return queryset

        semester = self.SEMESTERS.get(semester_key)
        if not semester:
            return queryset

        start = semester['start']
        end = semester['end']

        ids = [
            obj.pk
            for obj in queryset.only('pk', 'archived_at')
            if obj.archived_at
               and is_date_in_semester(start, end, obj.archived_at)
               and semester_year(start, end, obj.archived_at) == year
        ]

        return queryset.filter(pk__in=ids)
