from django.conf.urls import url
from django.views.generic.base import RedirectView
from . import views

urlpatterns = [
    url(r'^$', RedirectView.as_view(url='http://worldnewsense.herokuapp.com/theme.html'), name='themed-webpage'),
	url(r'getEvents', views.getEvents, name='getEvents'),
	url(r'pageData',views.pageData,name='pageData')
]