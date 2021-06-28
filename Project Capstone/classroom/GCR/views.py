import json
# from django.contrib.auth import authenticate, login, logout
# from django.db import IntegrityError
# from django.http import HttpResponse, HttpResponseRedirect
# from django.urls import reverse
from django.http import  JsonResponse
from django.views.decorators.csrf import csrf_exempt
# from django.contrib.auth.decorators import login_required
from .models import User,Classroom,Post,Assignment,Notification
from django.shortcuts import  render
from .serializers import *
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import permissions

def home(request):
    return render(request,'home')

@api_view(['GET'])
def get_current_user(request):

    serializer = GetFullUserSerializer(request.user)
    return Response(serializer.data)

class CreateUserView(APIView):
    permission_classes = (permissions.AllowAny, )
    def post(self,request):
        user = request.data.get('user')
        if not user:
            return Response({'response' : 'error', 'message' : 'No data found'})
        serializer = UserSerializerWithToken(data = user)        
        if serializer.is_valid():
            saved_user = serializer.save()
        else:
            return Response({"response" : "error", "message" : serializer.errors})        
        return Response({"response" : "success", "message" : "user created succesfully"})

def studentClasses(request,student):
    us=User.objects.get(username=student)
    classes = Classroom.objects.filter(classroom_students=us)
    return JsonResponse([cl.serialize() for cl in reversed(classes)], safe=False)

def studentAssignments(request,student):
    current_student= User.objects.get(username=student)
    assignments= Assignment.objects.filter(assigned_student=current_student)
    return JsonResponse([asmt.serialize() for asmt in reversed(assignments)], safe=False)

def studentNotifications(request,student):
    current_student= User.objects.get(username=student)
    notifications=Notification.objects.filter(notification_clicked=False,notification_student=current_student)
    return JsonResponse([notifs.serialize() for notifs in notifications],safe=False)

def classPosts(request,class_code):
    classroom= Classroom.objects.get(classroom_code=class_code)
    posts=Post.objects.filter(post_classroom=classroom)
    return JsonResponse([post.serialize() for post in reversed(posts)], safe=False)

def classStudents(request,class_code):
    classroom= Classroom.objects.get(classroom_code=class_code)
    return JsonResponse(classroom.serialize()['classroom_students'],safe=False)

def classAssignments(request,code):
    current_class= Classroom.objects.get(classroom_code=code)
    assignments= Assignment.objects.filter(assigned_classroom=current_class)
    return JsonResponse([asmt.serialize() for asmt in reversed(assignments)], safe=False)

@csrf_exempt
@api_view(['PUT'])
def joinClass(request,code,student):
    if request.method=="PUT":
        user=User.objects.get(username=student)
        requested_class=Classroom.objects.get(classroom_code=code)
        requested_class.classroom_students.add(user)
        return Response({"response" : "success", "message" : "User added to classroom"})
    return Response({"response" : "failed", "message" : "error"})

@api_view(['PUT'])
def createClass(request,faculty,subject):
    user=User.objects.get(username=faculty)
    classroom=Classroom.objects.filter(classroom_subject=subject)
    if classroom:
        return Response({"response" : "unsuccessful", "message" : "Already exists"})
    new_classroom=Classroom(classroom_subject=subject,classroom_faculty=user)
    new_classroom.save()
    requested_class=Classroom.objects.get(classroom_subject=subject,classroom_faculty=user)
    requested_class.classroom_students.add(user)
    return Response({"response" : "success", "message" : "Created"})

@api_view(['PUT'])
def newpost(request):
    if request.method=='PUT':
        data = request.body.decode()
        data = json.loads(data)
        title=data['title']
        desc=data['desc']
        is_assignment=data['type']
        username=data['username']
        class_code=data['class_code']
        classroom=Classroom.objects.get(classroom_code=class_code)
        user=User.objects.get(username=username)
        
        if is_assignment:
            newAsmt=Assignment(assigned_classroom=classroom, assigned_student=user, assignment_topic=title, assignment_content=desc)
            newAsmt.save()
            
            return Response({"response" : "success", "message" : "Assignment Added"})


        newPost=Post(post_classroom=classroom,post_content=desc,post_topic=title,post_user=user)
        newPost.save()
        return Response({"response" : "success", "message" : "Post Added"})
    return Response({"response" : "Not Successful", "message" : "error"})


@csrf_exempt
@api_view(['PUT'])
def newNotification(request):
    if request.method=='PUT':
        data = request.body.decode()
        data = json.loads(data)
        class_code=data['class_code']
        classroom= Classroom.objects.get(classroom_code=class_code)
        post_type = data['post_type']
        faculty=classroom.classroom_faculty

        if post_type :
            newNotif= Notification(notification_classroom=classroom,notification_student=faculty,notification_type="Assignment submission")
            newNotif.save()
            return Response({"response" : "success", "message" : "Assignment notification saved"})
            
        else:
            students = classroom.classroom_students.all()
            for student in students:
                newNotif = Notification(notification_classroom=classroom,notification_student=student,notification_type="Post")
                newNotif.save()
            facultyNotif = Notification.objects.filter(notification_classroom=classroom,notification_student=faculty,notification_type='Post').delete()
            return Response({"response" : "DONE", "message" : "Post notification saved"})
    return Response({"response" : "failed", "message" : "err"})


@api_view(['PUT'])

def deleteNotif(request):
    if request.method=='PUT':
        data=request.body.decode()
        data=json.loads(data)
        notif_id=data['id']
        ntf=Notification.objects.get(id=notif_id)
        ntf.notification_clicked=True
        ntf.save()
        return Response({"response" : "DONE", "message" : "Post notification saved"})
    return Response({"response" : "failed", "message" : "error"})
