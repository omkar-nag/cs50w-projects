from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render,redirect
from django.urls import reverse
from django.contrib.auth.decorators import login_required


from .models import User,Listings,Categories,Watchlist,Bid,Comment


def index(request):
    return render(request, "auctions/index.html", {
        "listings": Listings.objects.all()
    })

def inactive(request):
    return render(request, "auctions/inactive.html", {
        "listings": Listings.objects.all()
    })
def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "auctions/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "auctions/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "auctions/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "auctions/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "auctions/register.html")
@login_required

def create(request):
    cats = list(Categories.objects.all())
    str1="hello"
    if request.user.is_authenticated:
        
        if request.method == "POST":
            user= request.user
            title = request.POST["title"]
            description = request.POST["description"]
            category = request.POST["category"]
            catz=Categories.objects.get(cat=category)
            baseprice = request.POST["baseprice"]
            image= request.POST["image"]
            try:
                item = Listings(user=user,title=title,description=description,category=catz,baseprice=baseprice,image=image)
                item.save()
                bid = Bid(user=user,listing=item,bid=baseprice)
                bid.save()
            except:
                pass
            return render(request, "auctions/item.html",{
                "item":item,
                "bid" : Bid.objects.get(listing=item),
                "message":"Listing was added!"
            })
        elif request.method=="GET":
            return render(request, "auctions/create.html",{
                "cat":cats,
                "approve":True
                
            })
    else:
        return render(request, "auctions/create.html",{
            "message": "Please login to continue."
        })
    

def items(request, item_id ,message='',):
    item=Listings.objects.get(pk=item_id)
    all_comments=Comment.objects.filter(listing=item)
    return render(request,"auctions/item.html", {
        "bid" : Bid.objects.get(listing=item),
        "message":message,
        "comments": all_comments,
        "item": item,
    })
    
@login_required
def watch(request, item_id):
    item=Listings.objects.get(pk=item_id)
    watchlist=Watchlist.objects.filter(user=request.user,listing=item).first()
    if item.user!=request.user:
        user=request.user
        if watchlist is not None:
            watchlist.delete()
        #     return render(request,"auctions/item.html",{
        #     "bid" : Bid.objects.get(listing=item),
        #     "item": item,
        #     "message":"Removed from wishlist!"
        # })
            return redirect('items',item_id=item_id,message="Removed from wishlist!")
        else:
            wish=Watchlist(user=user,listing=item)
            wish.save()
            # return render(request,"auctions/item.html",{
            #     "bid" : Bid.objects.get(listing=item),
            #     "item": item,
            #     "message":"Added to watchlist!"
            # })
            return redirect('items',item_id=item_id,message="Added to watchlist!")
    else:
        # return render(request,"auctions/item.html",{
        #         "bid" : Bid.objects.get(listing=item),
        #     "item": item,
        #     "message":"You cant add your own item"
        # })
        return redirect('items',item_id=item_id,message="You cant add your own item")
@login_required
def watchlist(request):
    watch=Watchlist.objects.filter(user=request.user)
    listings=[]
    for i in watch:
        listings.append(i.listing)
    return render(request, "auctions/watchlist.html", {
        "listings":listings
    })
@login_required
def bid(request,item_id):
    if request.method=="POST":
        newbid=request.POST["bid"]
        newbid=float(newbid)
        item=Listings.objects.get(pk=item_id)
        user=request.user
        
        max_bid=Bid.objects.filter(listing=item).first()
        if newbid>max_bid.bid or (newbid==max_bid.bid and item.user==max_bid.user):
            max_bid.bid=newbid
            max_bid.user=user
            max_bid.save()
            # return render(request,"auctions/item.html",{
            #     "item": item,
            #     "bid":max_bid,
            #     "message":"Your bid was successful"
            # })
            return redirect('items',item_id=item_id,message="Your bid was successful!")
            
        else:
            # return render(request,"auctions/item.html",{
            #     "bid" : Bid.objects.get(listing=item),
            #     "item": item,
            #     "message":"Try a higher bid!"
            # })
            return redirect('items',item_id=item_id,message="Try a higher bid!")
            

                
    else:
        # item=Listings.objects.get(pk=item_id)
        # return render(request,"auctions/item.html",{
        #     "bid" : Bid.objects.get(listing=item),
        #     "item": item,
        #     "message":"Oops, you aren't permitted to that!"
            
        # })
        return redirect('items',item_id=item_id,message="Oops, you aren't permitted to that!")

def endauc(request,item_id):
    item=Listings.objects.get(pk=item_id)
    if request.user==item.user:
        item.isactive=False
        item.bidder_id=Bid.objects.get(listing=item).user.username
        item.save()
        # return render(request,"auctions/item.html",{
        #         "bid" : Bid.objects.get(listing=item),
        #         "item": item,
        #         "message":"Auction is inactive",
        #     })
        return redirect('items',item_id=item_id,message="Auction is inactive")

@login_required
def comment(request,item_id):
    if request.method=="POST":
        com=request.POST["comment"]
        user=request.user
        item=Listings.objects.get(pk=item_id)
        comment=Comment(user=user,listing=item,comment=com)
        comment.save()
        all_comments=Comment.objects.filter(listing=item)
        # return render(request,"auctions/item.html",{
        #         "bid" : Bid.objects.get(listing=item),
        #         "item": item,
        #         "message":"Comment added",
        #         "comments": all_comments
        #     })
        return redirect('items',item_id=item_id,message="Comment added")
    elif request.method=="GET":
        item=Listings.objects.get(pk=item_id)
        all_comments=Comment.objects.filter(listing=item)
        # return render(request,"auctions/item.html", {
        #         "bid" : Bid.objects.get(listing=item),
        #         "item": item,
        #         "comments": all_comments
        #     })
        return redirect('items',item_id=item_id,message="Comment added")

def categories(request):
    categories=Categories.objects.all()
    return render(request, "auctions/categories.html",{
        "categories":categories
    })

def category(request,cat):
    print(cat)
    cats=Categories.objects.filter(cat=cat).first()
    items=Listings.objects.filter(isactive=True,category=cats)
    return render(request, "auctions/category.html",{
        "items":items,
        "category":cats
    })
    




    

