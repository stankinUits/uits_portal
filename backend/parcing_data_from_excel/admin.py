from django.apps import AppConfig
import os
import zipfile
from django.contrib import admin
from django.urls import path
from django.http import FileResponse, HttpResponse, Http404
from django.conf import settings
from django.shortcuts import render, redirect
from django.db import models
from django.contrib import messages
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django import forms
from django.db import transaction
from .models import (
    CodeDirection, Discipline, LessonType, Teacher,
    Group, Semester, GroupCourse, Student,
    OutputForParcingModuleGrade
)

class ParcinDataFromExcel(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'pacing_data_from_excel'

class OutputFilesDummy(models.Model):
    class Meta:
        managed = False
        verbose_name = "Output Excel Files"
        verbose_name_plural = "Output Excel Files"

class CurlCommandsDummy(models.Model):
    class Meta:
        managed = False
        verbose_name = "Curl Commands"
        verbose_name_plural = "Curl Commands"

class FileUploadsDummy(models.Model):
    class Meta:
        managed = False
        verbose_name = "File Uploads"
        verbose_name_plural = "File Uploads"

class ExcelFileUploadForm(forms.Form):
    # Main data files
    data_for_module_gradebook = forms.FileField(
        label='Data for Module Gradebook (Data_for_module_gradebook.xlsx)',
        required=False,
        help_text='Main data source for parsing'
    )
    input_data_for_excel_output = forms.FileField(
        label='Input Data for Excel Output (input_data_for_excel_output.xlsx)',
        required=False,
        help_text='Teacher-discipline-group mapping'
    )
    template_for_module = forms.FileField(
        label='Template for Module (template_for_module.xlsx)',
        required=False,
        help_text='Template for generating output files'
    )
    
    # Student data files
    course_1 = forms.FileField(
        label='1st Year Students (1 курс.xlsx)',
        required=False,
        help_text='1st year student data'
    )
    course_2 = forms.FileField(
        label='2nd Year Students (2 курс.xlsx)',
        required=False,
        help_text='2nd year student data'
    )
    course_3 = forms.FileField(
        label='3rd Year Students (3 курс.xlsx)',
        required=False,
        help_text='3rd year student data'
    )
    course_4 = forms.FileField(
        label='4th Year Students (4 курс.xlsx)',
        required=False,
        help_text='4th year student data'
    )
    masters_1 = forms.FileField(
        label='1st Year Masters (1 курс магистратуры.xlsx)',
        required=False,
        help_text='1st year master\'s student data'
    )
    masters_2 = forms.FileField(
        label='2nd Year Masters (2 курс магистратуры.xlsx)',
        required=False,
        help_text='2nd year master\'s student data'
    )

class OutputFilesAdminView(admin.ModelAdmin):
    change_list_template = 'admin/output_files_changelist.html'

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('download/', self.download_files_view, name='download_output_files'),
        ]
        return custom_urls + urls

    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}
        output_dir = os.path.join(settings.MEDIA_ROOT, 'output_module_grade_by_teacher_discipline')
        
        if os.path.exists(output_dir):
            files = [f for f in os.listdir(output_dir) if f.endswith('.xlsx')]
            file_list = []
            for file in files:
                file_path = os.path.join(output_dir, file)
                file_stat = os.stat(file_path)
                file_list.append({
                    'name': file,
                    'size': f"{file_stat.st_size / 1024:.2f} KB",
                    'created': file_stat.st_ctime
                })
            extra_context['output_files'] = file_list
        else:
            extra_context['output_files'] = []
        
        return render(request, 'admin/output_files_changelist.html', extra_context)

    def download_files_view(self, request):
        output_dir = os.path.join(settings.MEDIA_ROOT, 'output_module_grade_by_teacher_discipline')
        if not os.path.exists(output_dir):
            messages.error(request, 'Output directory not found')
            return redirect('../')
        
        files = [f for f in os.listdir(output_dir) if f.endswith('.xlsx')]
        if not files:
            messages.error(request, 'No files to download')
            return redirect('../')
        
        zip_path = os.path.join(output_dir, 'all_output_files.zip')
        with zipfile.ZipFile(zip_path, 'w') as zipf:
            for file in files:
                zipf.write(os.path.join(output_dir, file), arcname=file)
        
        response = FileResponse(open(zip_path, 'rb'), as_attachment=True)
        response['Content-Disposition'] = 'attachment; filename="all_output_files.zip"'
        return response

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

class CurlCommandsAdminView(admin.ModelAdmin):
    change_list_template = 'admin/curl_commands_changelist.html'

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('curl-commands/', self.admin_site.admin_view(self.curl_commands_view), name='curl-commands'),
        ]
        return custom_urls + urls

    def curl_commands_view(self, request):
        base_url = f"{request.scheme}://{request.get_host()}"
        commands = {
            'parse_code_directions': f'curl -X POST {base_url}/api/grades/parse-code-directions/',
            'parse_disciplines': f'curl -X POST {base_url}/api/grades/parse-disciplines/',
            'parse_lesson_types': f'curl -X POST {base_url}/api/grades/parse-lesson-types/',
            'parse_teachers': f'curl -X POST {base_url}/api/grades/parse-teachers/',
            'parse_groups': f'curl -X POST {base_url}/api/grades/parse-groups/',
            'parse_semesters': f'curl -X POST {base_url}/api/grades/parse-semesters/',
            'parse_group_courses': f'curl -X POST {base_url}/api/grades/parse-group-courses/',
            'parse_students': f'curl -X POST {base_url}/api/grades/parse-students/',
            'parse_output_module_grade': f'curl -X POST {base_url}/api/grades/parse-output-module-grade/',
            'download_output_files': f'curl -X GET {base_url}/api/grades/download-output-files/',
        }

        context = {
            'commands': commands,
            'title': 'Curl Commands',
        }
        
        return render(request, 'admin/curl_commands_changelist.html', context)

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def changelist_view(self, request, extra_context=None):
        return self.curl_commands_view(request)

class FileUploadsAdminView(admin.ModelAdmin):
    change_list_template = 'admin/file_uploads_changelist.html'

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('upload/', self.upload_files_view, name='upload_excel_files'),
        ]
        return custom_urls + urls

    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}
        
        excel_dir = os.path.join(settings.MEDIA_ROOT, 'excel_files')
        file_status = {
            'data_for_module_gradebook': os.path.exists(os.path.join(excel_dir, 'Data_for_module_gradebook.xlsx')),
            'input_data_for_excel_output': os.path.exists(os.path.join(excel_dir, 'input_data_for_excel_output.xlsx')),
            'template_for_module': os.path.exists(os.path.join(excel_dir, 'template_for_module.xlsx')),
            'course_1': os.path.exists(os.path.join(excel_dir, '1 курс.xlsx')),
            'course_2': os.path.exists(os.path.join(excel_dir, '2 курс.xlsx')),
            'course_3': os.path.exists(os.path.join(excel_dir, '3 курс.xlsx')),
            'course_4': os.path.exists(os.path.join(excel_dir, '4 курс.xlsx')),
            'masters_1': os.path.exists(os.path.join(excel_dir, '1 курс магистратуры.xlsx')),
            'masters_2': os.path.exists(os.path.join(excel_dir, '2 курс магистратуры.xlsx')),
        }
        
        extra_context['file_status'] = file_status
        extra_context['form'] = ExcelFileUploadForm()
        
        return render(request, 'admin/file_uploads_changelist.html', extra_context)

    def upload_files_view(self, request):
        if request.method == 'POST':
            form = ExcelFileUploadForm(request.POST, request.FILES)
            if form.is_valid():
                excel_dir = os.path.join(settings.MEDIA_ROOT, 'excel_files')
                os.makedirs(excel_dir, exist_ok=True)
                
                file_mappings = {
                    'data_for_module_gradebook': 'Data_for_module_gradebook.xlsx',
                    'input_data_for_excel_output': 'input_data_for_excel_output.xlsx',
                    'template_for_module': 'template_for_module.xlsx',
                    'course_1': '1 курс.xlsx',
                    'course_2': '2 курс.xlsx',
                    'course_3': '3 курс.xlsx',
                    'course_4': '4 курс.xlsx',
                    'masters_1': '1 курс магистратуры.xlsx',
                    'masters_2': '2 курс магистратуры.xlsx',
                }
                
                uploaded_files = []
                for field_name, target_name in file_mappings.items():
                    uploaded_file = form.cleaned_data.get(field_name)
                    if uploaded_file:
                        file_path = os.path.join(excel_dir, target_name)
                        
                        if os.path.exists(file_path):
                            os.remove(file_path)
                        
                        with open(file_path, 'wb+') as destination:
                            for chunk in uploaded_file.chunks():
                                destination.write(chunk)
                        
                        uploaded_files.append(target_name)
                
                if uploaded_files:
                    messages.success(request, f'Successfully uploaded: {", ".join(uploaded_files)}')
                else:
                    messages.warning(request, 'No files were uploaded')
                
                return redirect('../../')
        
        return redirect('../../')

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

class ClearTablesDummy(models.Model):
    class Meta:
        managed = False
        verbose_name = "Clear Tables"
        verbose_name_plural = "Clear Tables"

admin.site.register(OutputFilesDummy, OutputFilesAdminView)
admin.site.register(CurlCommandsDummy, CurlCommandsAdminView)
admin.site.register(FileUploadsDummy, FileUploadsAdminView)

class ClearTablesAdminView(admin.ModelAdmin):
    change_list_template = 'admin/clear_tables_changelist.html'

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('clear-tables/', self.clear_tables_view, name='clear_tables'),
            path('clear-files/', self.clear_files_view, name='clear_files'),
            path('clear-all/', self.clear_all_view, name='clear_all'),
        ]
        return custom_urls + urls

    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}
        
        # Get table counts
        table_counts = {
            'OutputForParcingModuleGrade': OutputForParcingModuleGrade.objects.count(),
            'Student': Student.objects.count(),
            'GroupCourse': GroupCourse.objects.count(),
            'Semester': Semester.objects.count(),
            'Group': Group.objects.count(),
            'Teacher': Teacher.objects.count(),
            'LessonType': LessonType.objects.count(),
            'Discipline': Discipline.objects.count(),
            'CodeDirection': CodeDirection.objects.count(),
        }
        
        # Get file count
        output_dir = os.path.join(settings.MEDIA_ROOT, 'output_module_grade_by_teacher_discipline')
        file_count = 0
        if os.path.exists(output_dir):
            file_count = len([f for f in os.listdir(output_dir) if f.endswith('.xlsx')])
        
        extra_context['table_counts'] = table_counts
        extra_context['total_records'] = sum(table_counts.values())
        extra_context['file_count'] = file_count
        
        return render(request, 'admin/clear_tables_changelist.html', extra_context)

    def clear_tables_view(self, request):
        if request.method == 'POST':
            try:
                with transaction.atomic():
                    # Clear in reverse order of dependencies
                    OutputForParcingModuleGrade.objects.all().delete()
                    Student.objects.all().delete()
                    GroupCourse.objects.all().delete()
                    Semester.objects.all().delete()
                    Group.objects.all().delete()
                    Teacher.objects.all().delete()
                    LessonType.objects.all().delete()
                    Discipline.objects.all().delete()
                    CodeDirection.objects.all().delete()
                    
                    messages.success(request, 'All tables cleared successfully!')
            except Exception as e:
                messages.error(request, f'Error clearing tables: {str(e)}')
        
        return redirect('../')

    def clear_files_view(self, request):
        if request.method == 'POST':
            try:
                output_dir = os.path.join(settings.MEDIA_ROOT, 'output_module_grade_by_teacher_discipline')
                if os.path.exists(output_dir):
                    # Remove all xlsx files
                    xlsx_files = [f for f in os.listdir(output_dir) if f.endswith('.xlsx')]
                    for file in xlsx_files:
                        os.remove(os.path.join(output_dir, file))
                    
                    # Remove zip file if exists
                    zip_file = os.path.join(output_dir, 'all_output_files.zip')
                    if os.path.exists(zip_file):
                        os.remove(zip_file)
                    
                    messages.success(request, f'Removed {len(xlsx_files)} Excel files')
                else:
                    messages.warning(request, 'Output directory not found')
            except Exception as e:
                messages.error(request, f'Error clearing files: {str(e)}')
        
        return redirect('../')

    def clear_all_view(self, request):
        if request.method == 'POST':
            # Clear tables
            try:
                with transaction.atomic():
                    OutputForParcingModuleGrade.objects.all().delete()
                    Student.objects.all().delete()
                    GroupCourse.objects.all().delete()
                    Semester.objects.all().delete()
                    Group.objects.all().delete()
                    Teacher.objects.all().delete()
                    LessonType.objects.all().delete()
                    Discipline.objects.all().delete()
                    CodeDirection.objects.all().delete()
                    
                # Clear files
                output_dir = os.path.join(settings.MEDIA_ROOT, 'output_module_grade_by_teacher_discipline')
                if os.path.exists(output_dir):
                    xlsx_files = [f for f in os.listdir(output_dir) if f.endswith('.xlsx')]
                    for file in xlsx_files:
                        os.remove(os.path.join(output_dir, file))
                    
                    zip_file = os.path.join(output_dir, 'all_output_files.zip')
                    if os.path.exists(zip_file):
                        os.remove(zip_file)
                
                messages.success(request, 'All data and files cleared successfully!')
            except Exception as e:
                messages.error(request, f'Error clearing data: {str(e)}')
        
        return redirect('../')

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

admin.site.register(ClearTablesDummy, ClearTablesAdminView)
