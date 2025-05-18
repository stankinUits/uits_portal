import os

from django.conf import settings
from django.http import HttpResponse
from django.views import View

import openpyxl
from openpyxl.cell.cell import MergedCell

from parcing_data_from_excel.models import Student


def _set_cell_value(ws, row: int, col: int, value):
    """
    Write `value` into ws.cell(row, col), even if that cell
    lives in a merged range (redirects to the top-left cell).
    """
    cell = ws.cell(row=row, column=col)
    if isinstance(cell, MergedCell):
        for merged in ws.merged_cells.ranges:
            if cell.coordinate in merged:
                cell = ws.cell(row=merged.min_row, column=merged.min_col)
                break
    cell.value = value


class FillTemplateView(View):
    """
    GET  /api/export/fill-template/<group_name>/
    Fills the template for <group_name>, then writes it out into
    MEDIA_ROOT/output_module_template_for_groups/.
    If a file already exists, appends an incremental suffix:
      <group_name>.xlsx
      <group_name>_1.xlsx
      <group_name>_2.xlsx
      ...
    """
    TEMPLATE_SUBPATH = 'excel_files/template_for_module.xlsx'
    OUTPUT_DIR       = 'output_module_template_for_groups'
    START_ROW        = 11

    # Excel columns: 1=A, 2=B, 3=C, 4=D
    COL_FIRST   = 2  # B
    COL_MIDDLE  = 3  # C
    COL_LAST    = 4  # D

    def get(self, request, group_name):
        # 1) Load template
        tpl_path = os.path.join(settings.MEDIA_ROOT, self.TEMPLATE_SUBPATH)
        if not os.path.exists(tpl_path):
            return HttpResponse(f"Template not found: {tpl_path}", status=404)

        wb = openpyxl.load_workbook(tpl_path)

        # 2) Select the worksheet matching the group (or fallback to active)
        if group_name in wb.sheetnames:
            ws = wb[group_name]
        else:
            ws = wb.active

        # 3) Fetch students and fill starting at row 11
        students = (
            Student.objects
            .filter(group_name=group_name)
            .order_by('student_num_in_list')
        )

        for idx, stu in enumerate(students):
            row = self.START_ROW + idx
            _set_cell_value(ws, row, self.COL_FIRST,  stu.first_name)
            _set_cell_value(ws, row, self.COL_MIDDLE, stu.middle_name)
            _set_cell_value(ws, row, self.COL_LAST,   stu.last_name)

        # 4) Ensure output directory exists
        out_dir = os.path.join(settings.MEDIA_ROOT, self.OUTPUT_DIR)
        os.makedirs(out_dir, exist_ok=True)

        # 5) Choose a unique filename
        base = group_name
        ext = ".xlsx"
        filename = f"{base}{ext}"
        out_path = os.path.join(out_dir, filename)

        counter = 1
        while os.path.exists(out_path):
            filename = f"{base}_{counter}{ext}"
            out_path = os.path.join(out_dir, filename)
            counter += 1

        # 6) Save and respond
        wb.save(out_path)
        return HttpResponse(f"Saved: {out_path}", content_type="text/plain")
