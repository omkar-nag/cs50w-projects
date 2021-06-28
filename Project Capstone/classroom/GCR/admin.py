from django.contrib import admin
from .models import User,Classroom,Post,Assignment,Notification


admin.site.register(User)
admin.site.register(Classroom)
admin.site.register(Post)
admin.site.register(Assignment)
admin.site.register(Notification)
