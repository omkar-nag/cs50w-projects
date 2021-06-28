from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.crypto import get_random_string

def CREATE_CODE():
    return get_random_string(length=8)

USER_ROLE = (
                ("Student", "Student"),
                ("Faculty", "Faculty")
            )

NOTIFICATION_TYPE = (
                ("Material","Material"),
                ("Post","Post")
)
class User(AbstractUser):
    user_role = models.CharField( max_length = 20, choices = USER_ROLE, default = 'Student')
    user_roll = models.CharField(max_length=10)
    

class Classroom(models.Model):
    classroom_code = models.CharField(max_length=32,default = CREATE_CODE)
    classroom_subject = models.CharField(max_length=20)
    classroom_faculty = models.ForeignKey("User", on_delete=models.CASCADE, related_name="class_faculty")
    classroom_students = models.ManyToManyField("User",blank=True)

    def serialize(self):
        return {
            "classroom_code":self.classroom_code,
            "classroom_subject" : self.classroom_subject,
            "classroom_faculty" : self.classroom_faculty.username,
            "classroom_students" : [student.username for student in self.classroom_students.all()]
        }

    def __str__(self):
        return f'{self.classroom_subject.upper()}'

class Assignment(models.Model):
    
    assignment_topic = models.CharField(max_length=20,default="")
    assignment_content = models.TextField()
    assigned_student = models.ForeignKey("User", on_delete=models.CASCADE, related_name='assigned_student')
    assigned_classroom = models.ForeignKey("Classroom", on_delete=models.CASCADE, related_name="assigned_classroom")

    def serialize(self):
        return {
            "assignment_topic" : self.assignment_topic,
            "assignment_content" : self.assignment_content,
            "assigned_student" : self.assigned_student.username,
            "assigned_classroom" : self.assigned_classroom.classroom_subject,
            "assigned_classroom_code" : self.assigned_classroom.classroom_code,
        }

    def __str__(self):
        return f'submitted {self.assignment_topic} for {self.assigned_classroom}'

class Post(models.Model):

    post_user= models.ForeignKey("User", on_delete=models.CASCADE, related_name="original_poster")
    post_topic = models.CharField(max_length=50,default="")
    post_content= models.TextField()
    post_classroom= models.ForeignKey("Classroom", on_delete=models.CASCADE, related_name="post_classroom", default=None)
    post_timestamp = models.DateTimeField(auto_now_add=True)
    
    def serialize(self):
        return {
            "post_user": self.post_user.username,
            "post_topic":self.post_topic,
            "post_content":self.post_content,
            "post_classroom":self.post_classroom.classroom_subject,
            "post_classroom_code":self.post_classroom.classroom_code,
            "post_timestamp":self.post_timestamp
        }

    def __str__(self):
        return f'Post by {self.post_user} in {self.post_classroom} at {self.post_timestamp}'

# class Material(models.Model):

#     material_topic= models.CharField(max_length=50, default=None)
#     material_content= models.TextField(max_length=1000,default=None)
#     material_classroom= models.ForeignKey("Classroom", on_delete=models.CASCADE, related_name="material_classroom"  ,default=None)

#     def serialize(self):
#         return {
#             "material_topic" : self.material_topic,
#             "material_content" : self.material_content,
#             "material_classroom" : self.material_classroom.classroom_subject
#         }

#     def __str__(self):
#         return f'{self.material_classroom} - {self.material_topic}'

class Notification(models.Model):

    notification_clicked= models.BooleanField(default=False)
    notification_classroom= models.ForeignKey("Classroom", on_delete=models.CASCADE, related_name="notification_classroom",default=None)
    notification_student= models.ForeignKey("User", on_delete=models.CASCADE, related_name="notification_student",default=None)
    notification_type = models.CharField( max_length = 20,default=None)
    def serialize(self):
        return {
            "id":self.id,
            "notification_clicked" : self.notification_clicked,
            "notification_classroom" : self.notification_classroom.classroom_subject,
            "notification_classroom_code" : self.notification_classroom.classroom_code,
            "notification_student" : self.notification_student.username,
            "notification_type" : self.notification_type,
        }

    def __str__(self):
        return f'{self.notification_classroom} - 1 New {self.notification_type}'