from django.core.management.base import BaseCommand
from parcing_data_from_excel.models import Student
import pandas as pd
import os
from django.conf import settings
from collections import defaultdict


class Command(BaseCommand):
    help = 'Analyze student data in database and Excel files'

    def handle(self, *args, **options):
        self.stdout.write('Analyzing student data...\n')
        
        # 1. Database Analysis
        self.stdout.write(self.style.MIGRATE_HEADING('DATABASE ANALYSIS:'))
        self.stdout.write(f'Total students in database: {Student.objects.count()}')
        
        # Group by group_name
        groups = defaultdict(int)
        for student in Student.objects.all():
            groups[student.group_name] += 1
        
        self.stdout.write('\nStudents per group:')
        for group, count in sorted(groups.items()):
            self.stdout.write(f'  {group}: {count} students')
        
        # Check for suspicious entries
        suspicious = Student.objects.filter(
            first_name__in=["", " ", "nan", "NaN", "None"]
        ) | Student.objects.filter(
            last_name__in=["", " ", "nan", "NaN", "None"]
        )
        
        if suspicious.exists():
            self.stdout.write(f'\n⚠️  Found {suspicious.count()} suspicious entries')
        
        # 2. Excel Files Analysis
        self.stdout.write('\n' + self.style.MIGRATE_HEADING('EXCEL FILES ANALYSIS:'))
        excel_directory = os.path.join(settings.MEDIA_ROOT, 'excel_files')
        excel_files = [f for f in os.listdir(excel_directory) 
                      if f.endswith(('.xls', '.xlsx')) and not f.startswith('.~lock')]
        
        total_students_in_excel = 0
        group_prefixes = ["ИДБ-", "АДБ-", "МДБ-", "ЭДБ-", "МДС-", "ЭДМ-", "АДМ-", "ИДМ-", "МДМ-", "ЭВМ-"]
        
        for excel_file in excel_files:
            if excel_file in ['Data_for_module_gradebook.xlsx', 'input_data_for_excel_output.xlsx', 'template_for_module.xlsx']:
                continue
                
            file_path = os.path.join(excel_directory, excel_file)
            self.stdout.write(f'\nFile: {excel_file}')
            
            try:
                xls = pd.ExcelFile(file_path)
                file_total = 0
                
                for sheet_name in xls.sheet_names:
                    df = pd.read_excel(file_path, sheet_name=sheet_name, header=None)
                    sheet_students = 0
                    
                    # Find groups in sheet
                    for row_idx in range(df.shape[0]):
                        row_values = df.iloc[row_idx].fillna("").astype(str).values
                        for col_idx, cell_value in enumerate(row_values):
                            if any(cell_value.startswith(pref) for pref in group_prefixes):
                                # Count students in this group (look below for numeric first column)
                                student_count = 0
                                for i in range(row_idx + 1, df.shape[0]):
                                    try:
                                        # Check if first column has a number (student number)
                                        if col_idx > 0 and pd.notna(df.iloc[i, col_idx - 1]):
                                            int(df.iloc[i, col_idx - 1])
                                            # Check if name column has a non-empty string
                                            name = str(df.iloc[i, col_idx]).strip()
                                            if name and name not in ["", "nan", "NaN"]:
                                                student_count += 1
                                    except:
                                        break
                                
                                if student_count > 0:
                                    self.stdout.write(f'  Sheet "{sheet_name}", Group {cell_value}: ~{student_count} students')
                                    sheet_students += student_count
                
                file_total += sheet_students
                total_students_in_excel += file_total
                self.stdout.write(f'  Total in file: ~{file_total} students')
                
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'  Error reading file: {e}'))
        
        self.stdout.write(f'\nTotal students in Excel files: ~{total_students_in_excel}')
        
        # 3. Comparison
        self.stdout.write('\n' + self.style.MIGRATE_HEADING('COMPARISON:'))
        self.stdout.write(f'Students in database: {Student.objects.count()}')
        self.stdout.write(f'Students in Excel files: ~{total_students_in_excel}')
        
        difference = total_students_in_excel - Student.objects.count()
        if difference > 0:
            self.stdout.write(self.style.WARNING(f'\n⚠️  Missing approximately {difference} students in the database!'))
            self.stdout.write('\nPossible reasons:')
            self.stdout.write('1. Invalid entries were cleaned (headers, empty rows, etc.)')
            self.stdout.write('2. Import process might have skipped some valid students')
            self.stdout.write('3. Some Excel sheets might have different formats')
            self.stdout.write('\nRecommendation: Re-run the import command to ensure all valid students are imported') 