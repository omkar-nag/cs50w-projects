from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Categories(models.Model):
    cat = models.CharField(max_length=64)
    def __str__(self):
        return f"{self.cat}"

class Listings(models.Model):
    user = models.ForeignKey(User, on_delete = models.CASCADE, related_name = "user")
    title = models.CharField(max_length = 64)
    description = models.CharField(max_length = 512)
    category = models.ForeignKey(Categories, on_delete = models.CASCADE, related_name = "category")
    baseprice = models.FloatField()
    image = models.CharField(max_length=500)
    bidder_id = models.CharField(max_length=64,blank=True)
    isactive=models.BooleanField(default=True)

    def __str__(self):
        return f"{self.title} by {self.user}"

class Watchlist(models.Model):
    user = models.ForeignKey(User, on_delete = models.CASCADE, related_name = "watchuser")
    listing = models.ForeignKey(Listings, on_delete = models.CASCADE, related_name = "watchlisting")
    
    def __str__(self):
        return f"{self.listing} is being watched by {self.user}"

class Bid(models.Model):
    user = models.ForeignKey(User, on_delete = models.CASCADE, related_name = "biduser")
    listing = models.ForeignKey(Listings, on_delete = models.CASCADE, related_name = "bidlisting")
    bid = models.FloatField()

    def __str__(self):
        return f"{self.bid} by {self.user}"

class Comment(models.Model):
    user = models.ForeignKey(User, on_delete = models.CASCADE, related_name = "commentator")
    listing = models.ForeignKey(Listings, on_delete = models.CASCADE, related_name = "listitem")
    comment = models.CharField(max_length=256)

    def __str__(self):
        return f"Comment by {self.user} : '{self.comment}'"
