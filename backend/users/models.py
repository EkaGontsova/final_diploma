from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.signals import pre_delete
from django.dispatch import receiver
import os
import shutil
import logging

logger = logging.getLogger(__name__)


class User(AbstractUser):
    is_staff = models.BooleanField(default=False, verbose_name="Администратор")
    storage_path = models.CharField(
        max_length=255, blank=True, default="", verbose_name="Путь к хранилищу"
    )
    full_name = models.CharField(
        max_length=255, blank=True, default="", verbose_name="Полное имя"
    )

    def save(self, *args, **kwargs):
        if not self.storage_path and self.username:
            self.storage_path = self.username
        super().save(*args, **kwargs)

    def __str__(self):
        return self.username


@receiver(pre_delete, sender=User)
def auto_delete_user_storage(sender, instance, **kwargs):
    if instance.storage_path:
        storage_path = os.path.join(settings.MEDIA_ROOT, instance.storage_path)
        if os.path.isdir(storage_path):
            try:
                shutil.rmtree(storage_path)
                logger.info(
                    "Хранилище пользователя %s (%s) удалено.",
                    instance.username,
                    instance.storage_path,
                )
            except Exception as e:
                logger.error(
                    "Ошибка при удалении хранилища пользователя %s: %s",
                    instance.username,
                    e,
                )
    else:
        logger.warning(
            "Путь к хранилищу для пользователя %s не задан.",
            instance.username,
        )
