from django.apps import AppConfig
import os
import zipfile
from django.contrib import admin
from django.urls import path
from django.http import FileResponse, HttpResponse, Http404
from django.conf import settings
from django.shortcuts import render
from django.db import models

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

class OutputFilesAdminView(admin.ModelAdmin):
    change_list_template = "admin/output_files_changelist.html"

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('download-all-zip/', self.admin_site.admin_view(self.download_all_zip), name='download-all-output-files-zip'),
            path('output-files/', self.admin_site.admin_view(self.output_files_view), name='output-files'),
        ]
        return custom_urls + urls

    def output_files_view(self, request):
        output_dir = os.path.join(settings.MEDIA_ROOT, 'output_module_grade_by_teacher_discipline')
        files = []
        if os.path.exists(output_dir):
            files = [f for f in os.listdir(output_dir) if f.endswith('.xlsx')]
        context = dict(
            self.admin_site.each_context(request),
            files=files,
            output_dir=output_dir,
        )
        return render(request, "admin/output_files_changelist.html", context)

    def download_all_zip(self, request):
        output_dir = os.path.join(settings.MEDIA_ROOT, 'output_module_grade_by_teacher_discipline')
        if not os.path.exists(output_dir):
            return HttpResponse("No output directory found.", status=404)
        files = [f for f in os.listdir(output_dir) if f.endswith('.xlsx')]
        if not files:
            return HttpResponse("No files to zip.", status=404)
        zip_path = os.path.join(output_dir, 'all_output_files.zip')
        with zipfile.ZipFile(zip_path, 'w') as zipf:
            for file in files:
                zipf.write(os.path.join(output_dir, file), arcname=file)
        response = FileResponse(open(zip_path, 'rb'), as_attachment=True, filename='all_output_files.zip')
        return response

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def changelist_view(self, request, extra_context=None):
        return self.output_files_view(request)

class CurlCommandsAdminView(admin.ModelAdmin):
    change_list_template = "admin/curl_commands_changelist.html"

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('curl-commands/', self.admin_site.admin_view(self.curl_commands_view), name='curl-commands'),
        ]
        return custom_urls + urls

    def curl_commands_view(self, request):
        base_url = request.build_absolute_uri('/').rstrip('/')
        commands = {
            'parse_code_directions': f'curl -X POST {base_url}/api/parse-code-directions/',
            'parse_disciplines': f'curl -X POST {base_url}/api/parse-disciplines/',
            'parse_lesson_types': f'curl -X POST {base_url}/api/parse-lesson-types/',
            'parse_teachers': f'curl -X POST {base_url}/api/parse-teachers/',
            'parse_groups': f'curl -X POST {base_url}/api/parse-groups/',
            'parse_semesters': f'curl -X POST {base_url}/api/parse-semesters/',
            'parse_group_courses': f'curl -X POST {base_url}/api/parse-group-courses/',
            'parse_students': f'curl -X POST {base_url}/api/parse-students/',
            'parse_output_module_grade': f'curl -X POST {base_url}/api/parse-output-module-grade/',
            'download_output_files': f'curl -X GET {base_url}/api/download-output-files/',
        }

        context = dict(
            self.admin_site.each_context(request),
            commands=commands,
            base_url=base_url,
        )
        return render(request, "admin/curl_commands_changelist.html", context)

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def changelist_view(self, request, extra_context=None):
        return self.curl_commands_view(request)

admin.site.register(OutputFilesDummy, OutputFilesAdminView)
admin.site.register(CurlCommandsDummy, CurlCommandsAdminView)
