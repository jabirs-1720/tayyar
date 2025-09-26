from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import User

# Create your models here.

class Company(models.Model):
    name = models.CharField(_('company name'), max_length=100)

    def __str__(self):
        return self.name

class Profile(models.Model):
    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        verbose_name=_('company')
    )
    job_number = models.CharField(
        _('job number'),
        max_length=20,
        null=True,
        blank=True,
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE, verbose_name=_('user'))

    def __str__(self):
        return f'{self.user.get_full_name()}, {self.job_number}'
