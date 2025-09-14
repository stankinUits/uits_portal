from django.core.management.base import BaseCommand
from django.db import transaction
import os
import shutil
from django.conf import settings
from parcing_data_from_excel.models import (
    CodeDirection, Discipline, LessonType, Teacher,
    Group, Semester, GroupCourse, Student,
    OutputForParcingModuleGrade
)


class Command(BaseCommand):
    help = 'Clear all parsing data from database and optionally remove output files'

    def add_arguments(self, parser):
        parser.add_argument(
            '--include-files',
            action='store_true',
            help='Also remove generated Excel output files',
        )

    def handle(self, *args, **options):
        with transaction.atomic():
            # Clear all data from tables
            self.stdout.write('Clearing database tables...')
            
            # Clear in reverse order of dependencies
            OutputForParcingModuleGrade.objects.all().delete()
            self.stdout.write(self.style.SUCCESS('✓ Cleared OutputForParcingModuleGrade'))
            
            Student.objects.all().delete()
            self.stdout.write(self.style.SUCCESS('✓ Cleared Student'))
            
            GroupCourse.objects.all().delete()
            self.stdout.write(self.style.SUCCESS('✓ Cleared GroupCourse'))
            
            Semester.objects.all().delete()
            self.stdout.write(self.style.SUCCESS('✓ Cleared Semester'))
            
            Group.objects.all().delete()
            self.stdout.write(self.style.SUCCESS('✓ Cleared Group'))
            
            Teacher.objects.all().delete()
            self.stdout.write(self.style.SUCCESS('✓ Cleared Teacher'))
            
            LessonType.objects.all().delete()
            self.stdout.write(self.style.SUCCESS('✓ Cleared LessonType'))
            
            Discipline.objects.all().delete()
            self.stdout.write(self.style.SUCCESS('✓ Cleared Discipline'))
            
            CodeDirection.objects.all().delete()
            self.stdout.write(self.style.SUCCESS('✓ Cleared CodeDirection'))
            
            self.stdout.write(self.style.SUCCESS('\nAll database tables cleared successfully!'))
            
            # Optionally clear output files
            if options['include_files']:
                output_dir = os.path.join(settings.MEDIA_ROOT, 'output_module_grade_by_teacher_discipline')
                if os.path.exists(output_dir):
                    # Remove all xlsx files
                    xlsx_files = [f for f in os.listdir(output_dir) if f.endswith('.xlsx')]
                    for file in xlsx_files:
                        os.remove(os.path.join(output_dir, file))
                    self.stdout.write(self.style.SUCCESS(f'\n✓ Removed {len(xlsx_files)} Excel files'))
                    
                    # Remove zip file if exists
                    zip_file = os.path.join(output_dir, 'all_output_files.zip')
                    if os.path.exists(zip_file):
                        os.remove(zip_file)
                        self.stdout.write(self.style.SUCCESS('✓ Removed ZIP file')) 