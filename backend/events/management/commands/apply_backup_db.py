import os

from django.core.management import BaseCommand

from events.tasks import restore_db_dump_file
from uits.settings import BASE_DIR


class Command(BaseCommand):
    help = "Восстановление базы данных из выбранного дампа"

    def handle(self, *args, **options):
        dumps_dir = os.path.join(BASE_DIR, "dumps")

        # Получаем список файлов дампов
        dumps = sorted(
            [f for f in os.listdir(dumps_dir) if f.endswith(".dump")],
            reverse=True
        )

        if not dumps:
            self.stdout.write(self.style.ERROR("В папке 'dumps' нет файлов бэкапов."))
            return

        options_list = ["Последний бэкап"] + dumps

        # Выводим меню выбора
        self.stdout.write("Выберите бэкап для восстановления:\n")
        for i, name in enumerate(options_list, start=1):
            self.stdout.write(f"  {i}. {name}")

        # Получаем выбор пользователя
        while True:
            choice = input("\nВведите номер варианта (1–{0}): ".format(len(options_list)))
            if not choice.isdigit():
                self.stdout.write("Введите число.")
                continue
            choice = int(choice)
            if 1 <= choice <= len(options_list):
                break
            else:
                self.stdout.write("Неверный номер, попробуйте снова.")

        # Обработка выбора
        selected = options_list[choice - 1]

        if selected == "Последний бэкап":
            self.stdout.write("Запуск восстановления последнего бэкапа...")
            restore_db_dump_file.delay()
        else:
            self.stdout.write(f"Запуск восстановления из файла: {selected}")
            restore_db_dump_file.delay(selected)

        self.stdout.write(self.style.SUCCESS("Задача восстановления запущена. Отследить ее статус можно во Flower."))