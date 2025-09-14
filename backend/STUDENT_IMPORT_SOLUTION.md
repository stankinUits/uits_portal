# Student Import Issue and Solution

## Problem Summary
After running the `clean_invalid_students` command to remove invalid entries like "Поток" (headers), you noticed that many students are missing from the database.

## Root Cause
The `clean_invalid_students` command removed entries where student names matched common Excel headers in Russian:
- "Поток", "Поток групп" (Stream/Flow)
- "Имя", "Фамилия", "Отчество" (First name, Last name, Middle name)
- "ФИО", "Студент", "Группа" (Full name, Student, Group)
- Empty names and numeric-only names

## Solution Steps

### 1. First, analyze the current situation:
```bash
cd /home/ivan/PyCharmPr/uits/uits_portal
source .venv/bin/activate
cd backend
python manage.py analyze_student_data
```

This will show you:
- How many students are currently in the database
- How many students are in the Excel files
- The difference between them

### 2. Re-import all students from Excel files:
```bash
# Dry run first to see what would happen
python manage.py reimport_students --dry-run

# If everything looks good, do the actual import
python manage.py reimport_students

# Or if you want to start fresh, clear all students first
python manage.py reimport_students --clear
```

### 3. Clean invalid entries after import (if needed):
```bash
python manage.py clean_invalid_students
```

## How the Import Works

The `parse_students_from_all_excels` function in `services.py`:
1. Reads all Excel files in `media/excel_files/`
2. Looks for group headers (ИДБ-, АДБ-, МДБ-, etc.)
3. Extracts student data from rows below group headers
4. Skips invalid entries automatically
5. Uses `update_or_create` to avoid duplicates

## Excel File Structure Expected
```
| № | Group-Name | Middle Name | Last Name | Code Direction |
|---|------------|-------------|-----------|----------------|
| 1 | Иванов     | Иван        | Иванович  | 09.03.01      |
| 2 | Петров     | Петр        | Петрович  | 09.03.01      |
```

## Preventing Future Issues

1. **Always use the import commands** instead of manually adding data
2. **Run analysis first** before cleaning to understand the impact
3. **Keep backups** of your database before major operations
4. **Test with dry-run** option when available

## Custom Management Commands Created

1. `analyze_student_data` - Analyzes database vs Excel files
2. `reimport_students` - Safely re-imports all students
3. `clean_invalid_students` - Removes invalid entries (use carefully)

## Notes
- The import process automatically handles duplicates using `update_or_create`
- Invalid names are filtered during import, not just during cleaning
- The system expects Russian Excel files with specific group prefixes 