from django.shortcuts import render
from django.http import HttpResponse

from rest_framework_simplejwt.tokens import AccessToken

# Create your views here.

def test(request):
    if request.user.is_authenticated:
        token = AccessToken.for_user(request.user)
        print(f'--{token}--')
    return HttpResponse("Hello world")