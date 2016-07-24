from django.conf.urls import url

from core import views

urlpatterns = [
    url(r'^core/$', views.main_view, name='main'),
    url(r'^core/upload/$', views.upload_file, name='upload_file'),
]