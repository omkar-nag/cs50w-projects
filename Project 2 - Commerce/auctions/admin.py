from django.contrib import admin
from .models import User,Listings,Categories,Watchlist,Bid,Comment

# Register your models here.
admin.site.register(User)
admin.site.register(Listings)
admin.site.register(Categories)
admin.site.register(Watchlist)
admin.site.register(Bid)
admin.site.register(Comment)
