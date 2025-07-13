from django.contrib.auth import get_user_model

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import SignupSerializer, TokenObtainPairSerializerByEmail

User = get_user_model()

class TokenObtainPairViewByEmail(TokenObtainPairView):
    serializer_class = TokenObtainPairSerializerByEmail

# class Login(APIView):
#     permission_classes = [AllowAny]

#     def get(self, request):
#         if request.user.is_authenticated:
#             user = request.user
#             return Response({
#                 'full_name': user.get_full_name(),
#                 'username': user.username,
#                 'email': user.email,
#             }, status=200)

#         return Response({}, status=400)

#     def post(self, request):
#         if request.user.is_authenticated:
#             return Response({"message": "You are already logged in."}, status=400)

#         email = request.data.get("email")
#         password = request.data.get("password")

#         try:
#             user_get = User.objects.get(email=email)
#         except User.DoesNotExist:
#             return Response({"error": "Invalid credentials"}, status=401)

#         user = authenticate(request, username=user_get.username, password=password)

#         if user is None:
#             return Response({"error": "Invalid credentials"}, status=401)

#         refresh = RefreshToken.for_user(user)
#         access_token = str(refresh.access_token)

#         return Response({
#             "access": access_token,
#             "refresh": str(refresh),
#         })

class Signup(APIView):
    def post(self, request):
        serializer = SignupSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            access = str(refresh.access_token)
            return Response({
                "refresh": str(refresh),
                "access": access,
                "full_name": user.get_full_name(),
                "email": user.email,
                "username": user.username,
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)