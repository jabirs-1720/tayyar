from django.urls import path

from rest_framework_simplejwt.views import TokenRefreshView

from . import views

app_name = 'authentication'

urlpatterns = [
    path('token/', views.TokenObtainPairViewByEmail.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('signup', views.Signup.as_view(), name='signup'),
]