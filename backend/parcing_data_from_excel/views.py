from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .services import (
    parse_excel_data_to_code_directions,
    parse_excel_data_to_disciplines,
    parse_excel_data_to_lesson_types,
    parse_excel_data_to_teachers,
    parse_excel_data_to_groups,
    parse_excel_data_to_semesters,
    parse_excel_data_to_group_courses,
    parse_students_from_all_excels,
    parse_output_for_parcing_module_grade
)
import os
from django.conf import settings
from django.http import FileResponse
import zipfile


class ParseExcelView(APIView):
    def post(self, request):
        try:
            parse_excel_data_to_code_directions()
            return Response({"message": "Code directions parsed successfully"})
        except FileNotFoundError as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ParseDisciplinesView(APIView):
    def post(self, request):
        try:
            parse_excel_data_to_disciplines()
            return Response({"message": "Disciplines parsed successfully"})
        except FileNotFoundError as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ParseLessonTypesView(APIView):
    def post(self, request):
        try:
            parse_excel_data_to_lesson_types()
            return Response({"message": "Lesson types parsed successfully"})
        except FileNotFoundError as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ParseTeachersView(APIView):
    def post(self, request):
        try:
            parse_excel_data_to_teachers()
            return Response({"message": "Teachers parsed successfully"})
        except FileNotFoundError as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ParseGroupsView(APIView):
    def post(self, request):
        try:
            parse_excel_data_to_groups()
            return Response({"message": "Groups parsed successfully"})
        except FileNotFoundError as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ParseSemestersView(APIView):
    def post(self, request):
        try:
            parse_excel_data_to_semesters()
            return Response({"message": "Semesters parsed successfully"})
        except FileNotFoundError as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ParseGroupCoursesView(APIView):
    def post(self, request):
        try:
            parse_excel_data_to_group_courses()
            return Response({"message": "Group courses parsed successfully"})
        except FileNotFoundError as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ParseAllDataView(APIView):
    def post(self, request):
        try:
            parse_excel_data_to_code_directions()
            parse_excel_data_to_disciplines()
            parse_excel_data_to_lesson_types()
            parse_excel_data_to_teachers()
            parse_excel_data_to_groups()
            parse_excel_data_to_semesters()
            parse_excel_data_to_group_courses()
            return Response({"message": "All data parsed successfully"})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ParseAllStudentsView(APIView):
    def post(self, request):
        try:
            parse_students_from_all_excels()
            return Response({"message": "Students parsed successfully"})
        except FileNotFoundError as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ParseDataForModuleGrade(APIView):
    def post(self, request):
        try:
            parse_output_for_parcing_module_grade()
            return Response({"message": "Output module grade parsed successfully"})
        except FileNotFoundError as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class DownloadOutputFilesView(APIView):
    def get(self, request):
        try:
            output_dir = os.path.join(settings.MEDIA_ROOT, 'output_module_grade_by_teacher_discipline')
            if not os.path.exists(output_dir):
                return Response({"error": "Output directory not found"}, status=status.HTTP_404_NOT_FOUND)
            
            files = [f for f in os.listdir(output_dir) if f.endswith('.xlsx')]
            if not files:
                return Response({"error": "No files to download"}, status=status.HTTP_404_NOT_FOUND)
            
            zip_path = os.path.join(output_dir, 'all_output_files.zip')
            with zipfile.ZipFile(zip_path, 'w') as zipf:
                for file in files:
                    zipf.write(os.path.join(output_dir, file), arcname=file)
            
            response = FileResponse(open(zip_path, 'rb'), as_attachment=True, filename='all_output_files.zip')
            return response
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)