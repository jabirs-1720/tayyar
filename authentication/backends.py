from django.contrib.auth.backends import BaseBackend
from django.contrib.auth import get_user_model

User = get_user_model()

class JobNumberBackend(BaseBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        job_number = kwargs.get('job_number')

        try:
            user = User.objects.get(profile__job_number=job_number)
        except User.DoesNotExist:
            return None

        if user.check_password(password) and self.user_can_authenticate(user):
            return user

        return None
