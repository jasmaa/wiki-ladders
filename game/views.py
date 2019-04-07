from django.shortcuts import render

import wikipedia

# Create your views here.

def home(request):
    """Home page
    """
    return render(request, "game/home.html", {})

def game(request):
    """Game page
    """
    start = wikipedia.random()
    end = wikipedia.random()

    return render(request, "game/game.html", {
        "start": start,
        "end": end,
    })