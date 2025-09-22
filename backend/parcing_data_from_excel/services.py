import os
import pandas as pd
from django.conf import settings
import re


from parcing_data_from_excel.models import (
    CodeDirection, Discipline, LessonType,
    Teacher, Group, Semester, GroupCourse, Student, OutputForParcingModuleGrade
)


def read_excel_file(file_name):
    """Helper function to read an Excel file."""
    file_path = os.path.join(settings.MEDIA_ROOT, 'excel_files', file_name)
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Excel file not found: {file_path}")
    try:
        df = pd.read_excel(file_path)
        return df
    except Exception as e:
        raise ValueError(f"Error reading Excel file: {e}")


def sync_data(model, data, field):
    """Helper function to sync data in a model."""
    current_data = set(model.objects.values_list(field, flat=True))
    new_data_set = set(data)
    to_delete = current_data - new_data_set
    to_add = new_data_set - current_data

    if to_delete:
        model.objects.filter(**{f"{field}__in": to_delete}).delete()
        print(f"Deleted: {to_delete}")

    if to_add:
        model.objects.bulk_create([model(**{field: item}) for item in to_add])
        print(f"Added: {to_add}")

    print(f"Successfully synchronized '{model.__name__}' table with data.")


def parse_excel_data_to_code_directions():
    df = read_excel_file('Data_for_module_gradebook.xlsx')
    if "Направление подготовки" in df.columns:
        directions = df["Направление подготовки"].dropna().unique().tolist()
        sync_data(CodeDirection, directions, 'name')
    else:
        print("Column 'Направление подготовки' not found in the Excel file.")


def parse_excel_data_to_disciplines():
    df = read_excel_file('Data_for_module_gradebook.xlsx')
    if "Дисциплина" in df.columns:
        disciplines = df["Дисциплина"].dropna().unique().tolist()
        sync_data(Discipline, disciplines, 'name')
    else:
        print("Column 'Дисциплина' not found in the Excel file.")


def parse_excel_data_to_lesson_types():
    df = read_excel_file('Data_for_module_gradebook.xlsx')
    if "Вид занятия" in df.columns:
        lesson_types = df["Вид занятия"].dropna().unique().tolist()
        sync_data(LessonType, lesson_types, 'name')
    else:
        print("Column 'Вид занятия' not found in the Excel file.")


def parse_excel_data_to_teachers():
    df = read_excel_file('Data_for_module_gradebook.xlsx')
    if "Преподаватель" in df.columns:
        teachers = df["Преподаватель"].dropna().unique().tolist()
        sync_data(Teacher, teachers, 'name')
    else:
        print("Column 'Преподаватель' not found in the Excel file.")


def parse_excel_data_to_groups():
    df = read_excel_file('Data_for_module_gradebook.xlsx')
    if "Группа" in df.columns:
        groups = df["Группа"].dropna().unique().tolist()
        sync_data(Group, groups, 'name')
    else:
        print("Column 'Группа' not found in the Excel file.")


def parse_excel_data_to_semesters():
    df = read_excel_file('Data_for_module_gradebook.xlsx')
    if "Семестр" in df.columns:
        semesters = df["Семестр"].dropna().unique().tolist()
        valid_semesters = [int(sem) for sem in semesters if int(sem) > 0]
        sync_data(Semester, valid_semesters, 'semester')
    else:
        print("Column 'Семестр' not found in the Excel file.")


def parse_excel_data_to_group_courses():
    df = read_excel_file('Data_for_module_gradebook.xlsx')
    if "Курс" in df.columns:
        courses = df["Курс"].dropna().unique().tolist()
        valid_courses = [int(course) for course in courses if int(course) > 0]
        sync_data(GroupCourse, valid_courses, 'course')
    else:
        print("Column 'Курс' not found in the Excel file.")


def parse_students_from_all_excels():
    """
    Parses all Excel files in the 'excel_files' directory for student data and saves it into the database.
    Automatically overwrites existing data if the student already exists based on unique fields.
    """

    # Path to the Excel files directory
    excel_directory = os.path.join(settings.MEDIA_ROOT, 'excel_files')

    # Ensure the directory exists
    if not os.path.exists(excel_directory):
        raise FileNotFoundError(f"Excel directory not found: {excel_directory}")

    # Define the group prefixes for identification
    group_prefixes = ["ИДБ-", "АДБ-", "МДБ-", "ЭДБ-", "МДС-", "ЭДМ-", "АДМ-", "ИДМ-", "МДМ-", "ЭВМ-"]
    
    # Define invalid student names to skip (headers, etc.)
    invalid_names = ["Поток", "Поток групп", "Имя", "Фамилия", "Отчество", "ФИО", "№", 
                     "Студент", "Группа", "Направление", "Код", "nan", "NaN", ""]

    # Collect all Excel files in the directory
    excel_files = [file for file in os.listdir(excel_directory) if file.endswith(('.xls', '.xlsx'))]

    # If no files are found, print a warning and return
    if not excel_files:
        print("No Excel files found in the specified directory.")
        return

    # Inside parse_students_from_all_excels, before the for excel_file in excel_files loop:
    name_regex = re.compile(r'^[А-Яа-яЁё\-\s]+$')
    def is_valid_name(name):
        return bool(name_regex.match(name)) and len(name) > 1

    # Iterate over each Excel file
    for excel_file in excel_files:
        file_path = os.path.join(excel_directory, excel_file)
        try:
            print(f"\n📂 Processing file: {excel_file}")
            xls = pd.ExcelFile(file_path)

            # Iterate through all sheets in the Excel file
            for sheet_name in xls.sheet_names:
                df = pd.read_excel(file_path, sheet_name=sheet_name, header=None)
                seen_positions = set()
                group_cells = []

                # Detect group headers in the sheet
                for row_idx in range(df.shape[0]):
                    row_values = df.iloc[row_idx].fillna("").astype(str).values
                    for col_idx, cell_value in enumerate(row_values):
                        if any(cell_value.startswith(pref) for pref in group_prefixes) and (row_idx, col_idx) not in seen_positions:
                            group_cells.append((row_idx, col_idx, cell_value))
                            seen_positions.add((row_idx, col_idx))

                if not group_cells:
                    print(f"⚠️ No groups detected in sheet: {sheet_name} of file: {excel_file}")
                    continue

                group_cells = sorted(group_cells, key=lambda x: (x[0], x[1]))
                total_rows, total_cols = df.shape

                # Process each group block
                for row_start, group_col, group_text in group_cells:
                    row_idx = row_start + 1  # Start after header row
                    code_col = group_col + 2
                    code_direction_str = str(df.iat[row_start, code_col]).strip() if code_col < total_cols else ""
                    has_comma = "," in code_direction_str

                    while row_idx < total_rows:
                        # Stop if we detect another group header
                        if any(str(df.iat[row_idx, col]).startswith(pref) for col in range(total_cols) for pref in group_prefixes):
                            break

                        # Validate student number
                        try:
                            student_num = int(df.iat[row_idx, group_col - 1]) if group_col - 1 >= 0 else None
                        except (ValueError, TypeError):
                            row_idx += 1
                            continue

                        # Extract student data
                        first_name = str(df.iat[row_idx, group_col]).strip()
                        middle_name = str(df.iat[row_idx, group_col + 1]).strip() if group_col + 1 < total_cols else ""
                        raw_last_name = df.iat[row_idx, group_col + 2] if group_col + 2 < total_cols else ""
                        if pd.isna(raw_last_name):
                            last_name = ""
                        else:
                            last_name = str(raw_last_name).strip()

                        # Skip if first name is invalid or looks like a header
                        if not first_name or first_name in invalid_names or first_name.lower() in [name.lower() for name in invalid_names]:
                            row_idx += 1
                            continue
                        
                        # Skip if the first name looks like it's all numbers or special characters
                        if first_name.replace(" ", "").replace("-", "").isdigit():
                            row_idx += 1
                            continue
                        
                        # Skip if last name is a header or forbidden value (but allow empty last names)
                        forbidden_last_names = [name for name in invalid_names if name != ""]
                        if last_name in forbidden_last_names or last_name.lower() in [name.lower() for name in forbidden_last_names]:
                            row_idx += 1
                            continue

                        # Skip if first name is invalid
                        if not is_valid_name(first_name):
                            row_idx += 1
                            continue
                        # Skip if middle name is invalid
                        if middle_name and not is_valid_name(middle_name):
                            row_idx += 1
                            continue
                        # Skip if last name is invalid
                        if last_name and not is_valid_name(last_name):
                            row_idx += 1
                            continue

                        # Assign code direction
                        if has_comma:
                            student_code_col = group_col + 3
                            student_code_direction = df.iat[row_idx, student_code_col] if student_code_col < total_cols else ""
                        else:
                            student_code_direction = code_direction_str

                        student_code_direction = str(student_code_direction).strip() if not pd.isna(student_code_direction) else ""

                        # ✅ Automatic Overwriting Logic:
                        # If a student already exists (based on student_num_in_list, group_name, code_direction), update it.
                        try:
                            student, created = Student.objects.update_or_create(
                                student_num_in_list=student_num,
                                group_name=group_text,
                                code_direction=student_code_direction,
                                defaults={
                                    "first_name": first_name,
                                    "middle_name": middle_name,
                                    "last_name": last_name,
                                }
                            )
                            if created:
                                print(f"✅ Added student: {first_name} {last_name} (Group: {group_text})")
                            else:
                                print(f"🔄 Updated student: {first_name} {last_name} (Group: {group_text})")
                        except Exception as db_error:
                            print(f"❌ Database Error in file '{excel_file}', sheet '{sheet_name}': {db_error}")

                        row_idx += 1

            print(f"✅ Successfully parsed and saved students for file: {excel_file}")

        except Exception as e:
            print(f"❌ Error processing file '{excel_file}': {e}")

    print("✅ Finished parsing all available Excel files.")


def parse_output_for_parcing_module_grade():
    """
    Parses 'input_data_for_excel_output.xlsx' for teacher (col B), discipline (col C), and group_name (col G),
    and parses 'Data_for_module_gradebook.xlsx' for id_teachers_in_discipline (col A),
    starting from row 2, and saves them to OutputForParcingModuleGrade.
    """
    import numpy as np
    # Parse id_teachers_in_discipline from Data_for_module_gradebook.xlsx
    id_teachers_in_discipline_list = []
    id_file_path = os.path.join(settings.MEDIA_ROOT, 'excel_files', 'Data_for_module_gradebook.xlsx')
    if os.path.exists(id_file_path):
        try:
            id_df = pd.read_excel(id_file_path, header=0)
            if id_df.shape[1] > 0:
                id_teachers_in_discipline_list = id_df.iloc[:, 0].dropna().astype(str).tolist()
        except Exception as e:
            print(f"❌ Error parsing Data_for_module_gradebook.xlsx: {e}")
    # Parse main data from input_data_for_excel_output.xlsx
    file_path = os.path.join(settings.MEDIA_ROOT, 'excel_files', 'input_data_for_excel_output.xlsx')
    if not os.path.exists(file_path):
        print(f"Excel file not found: {file_path}")
        return
    try:
        df = pd.read_excel(file_path, header=0)
        required_cols = [1, 2, 6]
        max_col = df.shape[1] - 1
        if any(col > max_col for col in required_cols):
            print("One or more required columns (B, C, G) are missing in the Excel file.")
            return
        data = df.iloc[:, required_cols].dropna(how='all')
        data.columns = ['teacher', 'discipline', 'group_name']
        count = 0
        for idx, row in data.iterrows():
            teacher = str(row['teacher']).strip()
            discipline = str(row['discipline']).strip()
            group_name = str(row['group_name']).strip()
            id_teacher = id_teachers_in_discipline_list[idx] if idx < len(id_teachers_in_discipline_list) else ''
            if not (teacher or discipline or group_name):
                continue
            obj, created = OutputForParcingModuleGrade.objects.update_or_create(
                teacher=teacher,
                discipline=discipline,
                group_name=group_name,
                defaults={
                    'id_teachers_in_discipline': id_teacher
                }
            )
            count += 1
        print(f"✅ Parsed and saved {count} rows to OutputForParcingModuleGrade from input_data_for_excel_output.xlsx and Data_for_module_gradebook.xlsx.")
    except Exception as e:
        print(f"❌ Error parsing input_data_for_excel_output.xlsx: {e}")
