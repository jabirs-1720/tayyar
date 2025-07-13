from django.contrib.auth import authenticate, get_user_model
from django.utils.translation import gettext_lazy as _

from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class TokenObtainPairSerializerByEmail(TokenObtainPairSerializer):
    username_field = 'email'

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        user = authenticate(request=self.context.get('request'), email=email, password=password)

        if not user:
            raise serializers.ValidationError("Invalid email or password.")

        data = super().validate(attrs)

        data.update({
            'full_name': user.get_full_name(),
            'email': user.email,
            'username': user.username,
        })

        return data

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # # You can add custom claims here if needed
        # # Note: These claims stores in the token
        # token['username'] = user.username
        # token['email'] = user.email
        # token['full_name'] = user.get_full_name()

        return token

class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    name = serializers.CharField(write_only=True)  # ensure 'name' is declared

    class Meta:
        model = User
        fields = ['email', 'password', 'name']

    def validate_email(self, email):
        if User.objects.filter(email=email).exists():
            raise ValidationError(_('Email is already exists.'))
        return email

    def create(self, validated_data):
        name_parts = validated_data.pop('name').split()
        base_username = '-'.join(name_parts)
        
        # Generate a unique username by appending a counter if needed
        identity = 0
        while True:
            username = f"{base_username}" if identity == 0 else f"{base_username}-{identity}"
            if not User.objects.filter(username=username).exists():
                break
            identity += 1

        first_name, last_name = name_parts[0], ' '.join(name_parts[1:]) if len(name_parts) > 1 else ''

        user = User.objects.create_user(
            first_name=first_name,
            last_name=last_name,
            username=username,
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user
