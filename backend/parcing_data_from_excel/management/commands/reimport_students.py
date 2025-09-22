from django.core.management.base import BaseCommand
from django.db import transaction
from parcing_data_from_excel.models import Student
from parcing_data_from_excel.services import parse_students_from_all_excels


class Command(BaseCommand):
    help = 'Re-import all students from Excel files'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear all existing students before importing',
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be imported without actually importing',
        )

    def handle(self, *args, **options):
        clear = options.get('clear', False)
        dry_run = options.get('dry_run', False)
        
        if dry_run:
            self.stdout.write(self.style.WARNING('DRY RUN MODE - No changes will be made'))
        
        # Show current state
        current_count = Student.objects.count()
        self.stdout.write(f'Current students in database: {current_count}')
        
        if clear and not dry_run:
            self.stdout.write('Clearing all existing students...')
            with transaction.atomic():
                Student.objects.all().delete()
            self.stdout.write(self.style.SUCCESS('✓ All students cleared'))
        
        # Re-import students
        self.stdout.write('\nImporting students from Excel files...')
        
        if not dry_run:
            try:
                # Call the import function
                parse_students_from_all_excels()
                
                # Show results
                new_count = Student.objects.count()
                imported = new_count - (0 if clear else current_count)
                
                self.stdout.write(self.style.SUCCESS(f'\n✓ Import completed!'))
                self.stdout.write(f'Total students now: {new_count}')
                if imported > 0:
                    self.stdout.write(self.style.SUCCESS(f'New students imported: {imported}'))
                
                # Show summary by group
                from collections import defaultdict
                groups = defaultdict(int)
                for student in Student.objects.all():
                    groups[student.group_name] += 1
                
                self.stdout.write('\nStudents per group:')
                for group, count in sorted(groups.items()):
                    self.stdout.write(f'  {group}: {count} students')
                    
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'Error during import: {e}'))
        else:
            self.stdout.write('\nDry run completed - no changes made.')
            self.stdout.write('Run without --dry-run to actually import students.') 