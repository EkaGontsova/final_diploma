from django.db import models
from django.conf import settings
from django.db.models.signals import pre_delete
from django.dispatch import receiver
import os
import logging
import uuid

logger = logging.getLogger(__name__)

def get_parts_of_file_name(user, file_name):
    name, extension = os.path.splitext(file_name)
    unique_name = file_name
    counter = 1
    while user.files.filter(file_name=unique_name).exists():
        unique_name = f'{name}({counter}){extension}'
        counter += 1
    file_path = f'{user.storage_path}/{unique_name}' if user.storage_path else f'{user.username}/{unique_name}'
    return unique_name, file_path

def user_directory_path(instance, filename):
    name, path = get_parts_of_file_name(instance.user, filename)
    instance.file_name = name
    return path

class File(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='files'
    )
    file = models.FileField(upload_to=user_directory_path)
    file_name = models.CharField(max_length=255, blank=True)
    comment = models.TextField(blank=True, null=True)
    size = models.PositiveBigIntegerField(blank=True, null=True)
    uploaded = models.DateTimeField(auto_now_add=True)
    downloaded = models.DateTimeField(blank=True, null=True)
    special_link = models.CharField(max_length=32, unique=True, blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.pk:
            if self.file:
                self.size = self.file.size
            if not self.special_link:
                self.special_link = uuid.uuid4().hex[:32]
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.file_name} ({self.user.username})'

    class Meta:
        verbose_name = 'Файл'
        verbose_name_plural = 'Файлы'
        ordering = ['file_name']

@receiver(pre_delete, sender=File)
def auto_delete_file(sender, instance, **kwargs):
    if instance.file:
        instance.file.delete(save=False)
