from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from parcing_data_from_excel.services import (
    parse_excel_data_to_code_directions,
    parse_excel_data_to_disciplines,
    parse_excel_data_to_lesson_types,
    parse_excel_data_to_teachers,
    parse_excel_data_to_groups,
    parse_excel_data_to_semesters,
    parse_excel_data_to_group_courses,
    parse_students_from_all_excels,  # Fixed import
    parse_output_for_parcing_module_grade
)


class ParseExcelView(APIView):
    """
    API view to trigger parsing of the Excel file.
    """
    def post(self, request):
        try:
            # Dynamically import to avoid circular dependencies
            from parcing_data_from_excel.services import parse_excel_data_to_code_directions
            parse_excel_data_to_code_directions()
            return Response({"status": "success", "message": "Excel file parsed successfully!"})
        except FileNotFoundError as e:
            return Response({"status": "error", "message": str(e)}, status=404)
        except Exception as e:
            return Response({"status": "error", "message": str(e)}, status=400)




class ParseDisciplinesView(APIView):
    """
    API view to trigger parsing of the Excel file for disciplines.
    """
    def post(self, request):
        try:
            from parcing_data_from_excel.services import parse_excel_data_to_disciplines
            parse_excel_data_to_disciplines()
            return Response({"status": "success", "message": "Disciplines table parsed successfully!"})
        except FileNotFoundError as e:
            return Response({"status": "error", "message": str(e)}, status=404)
        except Exception as e:
            return Response({"status": "error", "message": str(e)}, status=400)


class ParseLessonTypesView(APIView):
    """
    API view to trigger parsing of the Excel file for lesson types.
    """
    def post(self, request):
        try:
            from parcing_data_from_excel.services import parse_excel_data_to_lesson_types
            parse_excel_data_to_lesson_types()
            return Response({"status": "success", "message": "Lesson types table parsed successfully!"})
        except FileNotFoundError as e:
            return Response({"status": "error", "message": str(e)}, status=404)
        except Exception as e:
            return Response({"status": "error", "message": str(e)}, status=400)


class ParseTeachersView(APIView):
    """
    API view to trigger parsing of the Excel file for teachers.
    """
    def post(self, request):
        try:
            from parcing_data_from_excel.services import parse_excel_data_to_teachers
            parse_excel_data_to_teachers()
            return Response({"status": "success", "message": "Teachers table parsed successfully!"})
        except FileNotFoundError as e:
            return Response({"status": "error", "message": str(e)}, status=404)
        except Exception as e:
            return Response({"status": "error", "message": str(e)}, status=400)


class ParseGroupsView(APIView):
    """
    API view to trigger parsing of the Excel file for groups.
    """
    def post(self, request):
        try:
            from parcing_data_from_excel.services import parse_excel_data_to_groups
            parse_excel_data_to_groups()
            return Response({"status": "success", "message": "Groups table parsed successfully!"})
        except FileNotFoundError as e:
            return Response({"status": "error", "message": str(e)}, status=404)
        except Exception as e:
            return Response({"status": "error", "message": str(e)}, status=400)


class ParseSemestersView(APIView):
    """
    API view to trigger parsing of the Excel file for semesters.
    """
    def post(self, request):
        try:
            from parcing_data_from_excel.services import parse_excel_data_to_semesters
            parse_excel_data_to_semesters()
            return Response({"status": "success", "message": "Semesters table parsed successfully!"})
        except FileNotFoundError as e:
            return Response({"status": "error", "message": str(e)}, status=404)
        except Exception as e:
            return Response({"status": "error", "message": str(e)}, status=400)




class ParseGroupCoursesView(APIView):
    """
    API view to trigger parsing of the Excel file for group courses.
    """
    def post(self, request):
        try:
            from parcing_data_from_excel.services import parse_excel_data_to_group_courses
            parse_excel_data_to_group_courses()
            return Response({"status": "success", "message": "Group courses table parsed successfully!"})
        except FileNotFoundError as e:
            return Response({"status": "error", "message": str(e)}, status=404)
        except Exception as e:
            return Response({"status": "error", "message": str(e)}, status=400)


class ParseAllDataView(APIView):
    """
    API view to trigger parsing of all Excel data and synchronize the database tables.
    """
    def post(self, request):
        try:
            # Call all parsing functions without additional checks
            parse_excel_data_to_code_directions()
            parse_excel_data_to_disciplines()
            parse_excel_data_to_lesson_types()
            parse_excel_data_to_teachers()
            parse_excel_data_to_groups()
            parse_excel_data_to_semesters()
            parse_excel_data_to_group_courses()
            return Response({"status": "success", "message": "All tables synchronized successfully!"})
        except Exception as e:
            return Response({"status": "error", "message": str(e)}, status=400)


#
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from module_grades.services import parse_students_from_all_excels

class ParseAllStudentsView(APIView):
    """
    API Endpoint to trigger parsing of all Excel files in the directory.
    """
    def post(self, request):
        try:
            parse_students_from_all_excels()
            return Response({"status": "success", "message": "All student data parsed successfully!"})
        except FileNotFoundError as e:
            return Response({"status": "error", "message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ParseDataForModuleGrade(APIView):
    """
    API view to trigger parsing of the Excel file for OutputForParcingModuleGrade.
    """
    def post(self, request):
        try:
            parse_output_for_parcing_module_grade()
            return Response({"status": "success", "message": "OutputForParcingModuleGrade table parsed successfully!"})
        except FileNotFoundError as e:
            return Response({"status": "error", "message": str(e)}, status=404)
        except Exception as e:
            return Response({"status": "error", "message": str(e)}, status=400)