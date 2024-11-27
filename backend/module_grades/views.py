from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponseRedirect
import csv
import pandas as pd
from django.shortcuts import render
from django.conf import settings
import os
from django.urls import reverse

def load_csv_and_render(request):
    csv_path = os.path.join(settings.BASE_DIR, 'module_grades', 'data', 'groupMarks.csv')
    df = pd.read_csv(csv_path, header=None)  # Read CSV without headers

    # Extract header information based on the specific rows and columns in your CSV
    header_info = {
        'Семестр': df.iloc[0, 0],               # Semester
        'Код_направления': df.iloc[1, 0],       # Course code
        'Time': "Time",                         # Date and time (adjust as needed)
        'Дисциплина': df.iloc[3, 1],            # Discipline
        'Группа': df.iloc[5, 1],                # Group
        'Кафедра': df.iloc[5, 2],               # Department
        'Преподаватель': df.iloc[6, 2]          # Teacher
    }

    # Remove the rows containing header info from the DataFrame to isolate student data
    student_data = df.iloc[10:].dropna(how='all').reset_index(drop=True)

    # Define the expected column headers for student data
    expected_headers = [
        '№', 'Фамилия', 'Имя', 'Отчество', 'М1', 'М2',
        'Курсовой проект Балл', 'Курсовой проект Оценка', 'Курсовой проект Дата', 'Курсовой проект Преподаватель',
        'Экзамен Балл', 'Экзамен Оценка', 'Экзамен Дата', 'Экзамен Преподаватель',
        'Повторный экзамен (1) Балл', 'Повторный экзамен (1) Оценка', 'Повторный экзамен (1) Дата', 'Повторный экзамен (1) Преподаватель',
        'Повторный экзамен (2) Балл', 'Повторный экзамен (2) Оценка', 'Повторный экзамен (2) Дата', 'Повторный экзамен (2) Преподаватель'
    ]

    # Ensure student_data has the correct number of columns
    current_columns = student_data.shape[1]
    if current_columns != len(expected_headers):
        if current_columns > len(expected_headers):
            student_data = student_data.iloc[:, :len(expected_headers)]
        else:
            for _ in range(len(expected_headers) - current_columns):
                student_data[f"Extra_{_}"] = None

    # Assign column headers
    student_data.columns = expected_headers

    # Convert student data to dictionary for template rendering
    student_data_dict = student_data.to_dict(orient='records')

    # Render template with the extracted context
    return render(request, 'module_grades/csv_output.html', {
        'header_info': header_info,
        'student_data': student_data_dict
    })

@csrf_exempt  # Consider removing this and using CSRF tokens in your template
def save_grades(request):
    if request.method == 'POST':
        # Load the data from POST request into a list of dictionaries
        updated_data = []
        for i in range(len(request.POST) // len(request.POST.keys())):
            row = {key.split('_')[0]: request.POST.get(f"{key}_{i + 1}") for key in request.POST.keys()}
            updated_data.append(row)

        # Save back to CSV (or handle with database in production)
        csv_path = os.path.join(settings.BASE_DIR, 'module_grades', 'data', 'groupMarks.csv')
        with open(csv_path, mode='w', newline='') as file:
            writer = csv.DictWriter(file, fieldnames=updated_data[0].keys())
            writer.writeheader()
            writer.writerows(updated_data)

        # Redirect using reverse
        return HttpResponseRedirect(reverse('module_grades:index'))
