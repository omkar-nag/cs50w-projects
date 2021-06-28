from django.shortcuts import render
from django.http import HttpResponseRedirect
import markdown2
import random
from . import util


def index(request):
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries()
    })

def pages(request,titlepage):
    content = util.get_entry(titlepage)
    if content==None:
        return render(request, "encyclopedia/error.html")
    content = markdown2.markdown(content)
    return render(request, "encyclopedia/content.html", {
            "title" : titlepage, 
            "content": content
        })

def search(request):
    query=request.GET['q']
    pages=util.list_entries()
    results=[]
    if query in pages:
        return HttpResponseRedirect(f"/wiki/{query}")
    for i in pages:
        if query.lower() in i.lower():
            results.append(i)
    return render(request, "encyclopedia/search.html", {
        "results": results,
        "query":query
    })

def newpage(request,method=["GET","POST"]):
    if request.method=="POST":
        title=request.POST['title']
        content=request.POST['content']
        if title is not '' and content is not '':
            if title not in util.list_entries(): 
                util.save_entry(title,content)
                return HttpResponseRedirect(f"/wiki/{title}")
            else:
                return render(request, "encyclopedia/error.html", {
                    'message': "Page already exists"
                })

    return render(request, "encyclopedia/newpage.html")

def editpage(request,title,method=["GET","POST"]):
    content = util.get_entry(title)
    if request.method=="POST":
        content=request.POST['content']
        util.save_entry(title,content)
        return HttpResponseRedirect(f"/wiki/{title}")

    return render(request, "encyclopedia/edit.html",{
    "title": title,
    "content": content
    })
def randompage(request):
    pglist=util.list_entries()
    if not pglist:
        return render(request,"encyclopedia/error.html")
    title=random.choice(pglist)
    return HttpResponseRedirect(f"/wiki/{title}")

    
    
