from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("wiki/<str:titlepage>",views.pages,name="pages"),
    path("search",views.search,name="search"),
    path("newpage",views.newpage,name="newpage"),
    path("edit/<str:title>",views.editpage,name="edit"),
    path("random",views.randompage,name='random')
]
