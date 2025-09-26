from django.shortcuts import render
from django.contrib.auth import login

from rest_framework.generics import GenericAPIView

from .serializers import LoginSerializer, SignupSerializer
from .permissions import GuestOnly

# Create your views here.

class Login(GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [GuestOnly]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid:
            user = serializer.validated_data['user']
            login(request, user)

class Signup(GenericAPIView):
    serializer_class = SignupSerializer
    permission_classes = [GuestOnly]

    def post(self, request, *args, **kwargs):
        pass
