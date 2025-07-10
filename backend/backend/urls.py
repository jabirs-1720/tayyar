from django.contrib import admin
from django.urls import path, include
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class LoginAPIView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(request, email=email, password=password)
        if user is not None:
            # من الأفضل استخدام JWT أو أي نوع من توكن المصادقة
            return Response({"message": "Login successful", "token": "jwt_or_session"}, status=status.HTTP_200_OK)
        return Response({"message": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth', include('authentication.urls', namespace='authentication')),
    path('api/login/', LoginAPIView.as_view(), name='login'),
]
