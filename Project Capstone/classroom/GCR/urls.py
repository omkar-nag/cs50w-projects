from django.urls import path

from .views import *

urlpatterns = [
    path('', home, name='home'),
    path('current_user/', get_current_user),
    path('users/create', CreateUserView.as_view()),
    path('rooms/<str:student>', studentClasses),
    path('assignments/<str:student>', studentAssignments),
    path('classassignments/<str:code>', classAssignments),
    path('notifications/<str:student>', studentNotifications),
    path('classposts/<str:class_code>', classPosts),
    path('joinroom/<str:code>/<str:student>', joinClass),
    path('createroom/<str:faculty>/<str:subject>', createClass),
    path('newpost', newpost),
    path('newnotif', newNotification),
    path('delnotif', deleteNotif),
    path('classroomstudents/<str:class_code>',classStudents)
]