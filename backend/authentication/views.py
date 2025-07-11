from django.contrib.auth import authenticate

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken

class Login(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        print(request.COOKIES)
        if request.user.is_authenticated:
            user = request.user
            return Response({
                'full_name': user.full_name,
                'username': user.username,
                'job_number': user.job_number,
            }, status=200)

        return Response({
            'full_name': 'user.full_name',
            'username': 'user.username',
            'job_number': 'user.job_number',
        }, status=200)

    def post(self, request):
        if request.user.is_authenticated:
            return Response({"message": "You are already logged in."}, status=400)
        email = request.data.get("email")
        password = request.data.get("password")
        user = authenticate(request, email=email, password=password)

        if user is None:
            return Response({"error": "Invalid credentials"}, status=401)

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        client_type = request.headers.get("Client-Type", "web")

        if client_type == "mobile":
            return Response({
                "access": access_token,
                "refresh": str(refresh),
            })
        else:
            response = Response({"message": "Login successful"})
            response.set_cookie("access_token", access_token, httponly=True, secure=False, samesite="none")
            response.set_cookie("refresh_token", str(refresh), httponly=True, secure=False, samesite="none")
            return response

class Signup(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(request, email=email, password=password)
        if user is not None:
            # من الأفضل استخدام JWT أو أي نوع من توكن المصادقة
            return Response({"message": "Login successful", "token": "jwt_or_session"}, status=status.HTTP_200_OK)
        return Response({"message": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)