from django.conf.urls import url
from . import views

urlpatterns = [
	url(r'getEvents', views.getEvents, name='getEvents'),
	url(r'pageData',views.pageData,name='pageData')
]