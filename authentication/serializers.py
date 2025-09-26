from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate

from rest_framework import serializers

User = get_user_model()

class LoginSerializer(serializers.Serializer):
    job_number = serializers.CharField(
        label=_('job number'),
        max_length=20,
        write_only=True
    )
    password = serializers.CharField(
        label=_('password'),
        write_only=True
    )

    class Meta:
        fields = '__all__'

    def validate_job_number(self, value):
        if not User.objects.filter(profile__job_number=value).exists():
            return serializers.ValidationError(_('Job number not found.'))
        return value

    def validate(self, validated_data):
        job_number = validated_data.get('job_number')
        password = validated_data.get('password')

        user = authenticate(job_number=job_number, password=password)
        if user is None:
            return serializers.ValidationError(_('The login details are incorrect.'))
        validated_data['user'] = user

        return validated_data

class SignupSerializer(serializers.ModelSerializer):
    name = serializers.CharField(
        label=_('name'),
        max_length=100
    )
    company_name = serializers.CharField(
        label=_('company name'),
        max_length=100
    )
    job_number = serializers.CharField(
        label=_('job number'),
        max_length=20
    )

    class Meta:
        model = User
        fields = ['name', 'job_number', 'company_name', 'password']
