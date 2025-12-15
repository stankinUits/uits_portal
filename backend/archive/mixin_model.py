from django.db import models


class ArchiveModelBase(models.base.ModelBase):
    """Метакласс, который автоматически копирует поля из original_model"""

    def __new__(cls, name, bases, attrs, **kwargs):
        original_model = attrs.get("original_model")

        new_class = super().__new__(cls, name, bases, attrs, **kwargs)

        if original_model:
            for field in original_model._meta.fields:
                if field.name == "id":
                    continue
                # Делаем копию поля
                field_clone = field.clone()
                new_class.add_to_class(field.name, field_clone)

        return new_class


class ArchiveMixin(models.Model, metaclass=ArchiveModelBase):
    """Базовый миксин для всех архивных моделей"""
    original_model = None

    archived_at = models.DateField(verbose_name="Дата архивирования", auto_now_add=True)

    class Meta:
        abstract = True

    def __str__(self):
        if self.original_model:
            # создаём временный объект оригинала с теми же полями
            field_values = {}
            for f in self.original_model._meta.fields:
                if hasattr(self, f.name):
                    field_values[f.name] = getattr(self, f.name)

            # создаём временный объект
            temp_obj = self.original_model(**field_values)
            base_str = str(temp_obj)
        else:
            base_str = super().__str__()

        return f"Архивировано: {base_str}"
