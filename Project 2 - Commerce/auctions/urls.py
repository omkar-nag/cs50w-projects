from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("item/<int:item_id>", views.items, name="items"),
    path("item/<int:item_id>/<str:message>", views.items, name="items"),
    path("create", views.create, name="create"),
    path("watch/<int:item_id>",views.watch,name="watch"),
    path("watchlist",views.watchlist,name="watchlist"),
    path("bid/<int:item_id>",views.bid,name="bid"),
    path("end/<int:item_id>",views.endauc,name="end"),
    
    path("comment/<int:item_id>",views.comment,name="comment"),
    path("inactive", views.inactive, name="inactive"),
    path("categories",views.categories,name="categories"),
    path("category/<str:cat>",views.category,name="category")
]
