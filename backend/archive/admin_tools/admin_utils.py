# utils/archive.py
import datetime

from constance import config
from django.apps import apps
from django.contrib import admin
from django.db import transaction


def _md(d: datetime.date) -> tuple[int, int]:
    return d.month, d.day


def is_date_in_semester(
        semester_start: datetime.date,
        semester_end: datetime.date,
        date: datetime.date,
) -> bool:
    start_md = _md(semester_start)
    end_md = _md(semester_end)
    date_md = _md(date)

    if start_md <= end_md:
        return start_md <= date_md <= end_md
    return date_md >= start_md or date_md <= end_md


def semester_year(
        semester_start: datetime.date,
        semester_end: datetime.date,
        date: datetime.date,
) -> int:
    start_md = _md(semester_start)
    end_md = _md(semester_end)
    date_md = _md(date)

    year = date.year

    if start_md > end_md and date_md <= end_md:
        year -= 1

    return year


def semester_label(
        semester_name: str,
        semester_start: datetime.date,
        semester_end: datetime.date,
        archive_date: datetime.date,
) -> str:
    """
    Возвращает строку вида: SEMESTER_NAME_YYYY,
    где YYYY определяется по дате архивирования.
    Сравнение дат происходит без учёта года.
    """

    in_semester = is_date_in_semester(semester_start, semester_end, archive_date)
    year = semester_year(semester_start, semester_end, archive_date)

    if not in_semester:
        raise ValueError('Дата архивирования не входит в указанный семестр')

    return f'{semester_name}_{year}'


def get_semester_label(archived_date):
    try:
        archive_autumn_semester_start = config.ARCHIVE_AUTUMN_SEMESTER_START
        archive_autumn_semester_end = config.ARCHIVE_AUTUMN_SEMESTER_END
        is_autumn_semester = semester_label(
            semester_name="Осень",
            semester_start=archive_autumn_semester_start,
            semester_end=archive_autumn_semester_end,
            archive_date=archived_date,
        )
        return is_autumn_semester
    except ValueError:
        pass

    try:
        archive_spring_semester_start = config.ARCHIVE_SPRING_SEMESTER_START
        archive_spring_semester_end = config.ARCHIVE_SPRING_SEMESTER_END
        is_spring_semester = semester_label(
            semester_name="Весна",
            semester_start=archive_spring_semester_start,
            semester_end=archive_spring_semester_end,
            archive_date=archived_date,
        )
        return is_spring_semester
    except ValueError as e:
        error = str(e)

    return error


@admin.action(description="Архивирование записей")
def archive_objects(modeladmin, request, queryset, delete_original=False):
    """
    Универсальная функция архивации для Django Admin.
    Предполагается, что для модели <Model> существует связанная модель Archive<Model>,
    использующая ArchiveMixin.
    """

    model = queryset.model
    archive_model_name = f"Archive{model.__name__}"
    archive_model = apps.get_model("archive", archive_model_name)

    if not archive_model:
        modeladmin.message_user(request, f"Архивная модель {archive_model_name} не найдена.", level="error")
        return

    with transaction.atomic():
        for obj in queryset:
            # Собираем словарь полей (без PK)
            data = {
                f.name: getattr(obj, f.name)
                for f in model._meta.fields
                if f.name != "id"
            }
            archive_model.objects.create(**data)

            if delete_original:
                obj.delete()

    modeladmin.message_user(request, f"Архивировано объектов: {len(queryset)}.")
