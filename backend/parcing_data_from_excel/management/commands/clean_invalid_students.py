from django.core.management.base import BaseCommand
from django.db import transaction
from parcing_data_from_excel.models import Student


class Command(BaseCommand):
    help = 'Remove invalid student entries (like headers) from the database'

    def handle(self, *args, **options):
        # Define invalid student names to remove
        invalid_names = ["Поток", "Поток групп", "Имя", "Фамилия", "Отчество", "ФИО", "№", 
                        "Студент", "Группа", "Направление", "Код", "nan", "NaN"]
        
        self.stdout.write('Cleaning invalid student entries...')
        
        with transaction.atomic():
            # Find and delete students with invalid first names
            invalid_first_names = Student.objects.filter(
                first_name__in=invalid_names
            )
            first_count = invalid_first_names.count()
            if first_count > 0:
                invalid_first_names.delete()
                self.stdout.write(self.style.SUCCESS(f'✓ Removed {first_count} students with invalid first names'))
            
            # Find and delete students with invalid last names
            invalid_last_names = Student.objects.filter(
                last_name__in=invalid_names
            )
            last_count = invalid_last_names.count()
            if last_count > 0:
                invalid_last_names.delete()
                self.stdout.write(self.style.SUCCESS(f'✓ Removed {last_count} students with invalid last names'))
            
            # Find and delete students where first name is empty or just whitespace
            empty_names = Student.objects.filter(first_name__exact='')
            empty_count = empty_names.count()
            if empty_count > 0:
                empty_names.delete()
                self.stdout.write(self.style.SUCCESS(f'✓ Removed {empty_count} students with empty first names'))
            
            # Find and delete students where first name is just numbers
            all_students = Student.objects.all()
            numeric_count = 0
            for student in all_students:
                if student.first_name.replace(" ", "").replace("-", "").isdigit():
                    student.delete()
                    numeric_count += 1
            
            if numeric_count > 0:
                self.stdout.write(self.style.SUCCESS(f'✓ Removed {numeric_count} students with numeric first names'))
            
            total_removed = first_count + last_count + empty_count + numeric_count
            
            if total_removed == 0:
                self.stdout.write(self.style.SUCCESS('No invalid student entries found!'))
            else:
                self.stdout.write(self.style.SUCCESS(f'\nTotal removed: {total_removed} invalid entries')) 