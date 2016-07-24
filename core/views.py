import json
from django.http import HttpResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from chart_project import settings
import xlrd


def excel_to_array(file_path):
    book = xlrd.open_workbook(file_path, formatting_info=True)
    sheet = book.sheet_by_index(0)

    return [sheet.col_values(0), sheet.col_values(1)]


def file_writer(file):
    file_name = file.name
    file_path = ''

    if file_name[-3:] == 'xls':
        with open(settings.MEDIA_ROOT + 'dataXLS.xls', 'wb+') as dest:
            for chunk in file.chunks():
                dest.write(chunk)
        file_path = dest.name

    if file_name[-4:] == 'xlsx':
        with open(settings.MEDIA_ROOT + 'dataXLSX.xlsx', 'wb+') as dest:
            for chunk in file.chunks():
                dest.write(chunk)
        file_path = dest.name

    return file_path


def main_view(request):
    return render(request, 'core/index.html', {})


@csrf_exempt
def upload_file(request):
    response_data = {'success': 0}

    if request.method == 'POST':
        file = request.FILES['file']
        file_path = file_writer(file)

        response_data['data'] = excel_to_array(file_path)
        response_data['success'] = 1

    return HttpResponse(json.dumps(response_data), content_type="application/json")
