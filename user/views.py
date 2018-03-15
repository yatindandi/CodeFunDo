from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from user.models import baseUser, userSettings, publisherSettings, Event, Category, userCategory, EventCategory
from django.views.decorators.csrf import csrf_exempt
from django import forms
import json
from django.core import serializers
import datetime

@csrf_exempt
def getEvents(request):
	print(json.dumps(request.POST))
	# print(request.POST.lists())
	print(post)
	data = json.loads(open("data/score{}.json".format(post)))
	print(data)
	return JsonResponse(data)


@csrf_exempt
def pageData(request):
	baseUserData=baseUser.objects.get(profileId=request.session['profileId'])
	if(baseUserData.userType=='publisher'):
		settings=publisherSettings.objects.filter(profileId=baseUserData)
		if(len(settings)!=0):
			data={"name" : settings.first().displayName}
			print(data)
			return JsonResponse(data)
		elif(len(settings)==0):
			data={"name" : "Name"}
			return JsonResponse(data)
	elif(baseUserData.userType=='user'):
		settings=userSettings.objects.filter(profileId=baseUserData)
		if(len(settings)!=0):
			return JsonResponse({"name" : baseUserData.name, "roll" : settings.first().rollNumber, "dept" : settings.first().department})
		elif(len(settings)==0):
			return JsonResponse({"name" : "Name", "roll" : "Roll Number", "dept" : "Department"})