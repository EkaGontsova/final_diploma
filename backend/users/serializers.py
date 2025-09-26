import re

from django.core.exceptions import ValidationError as DjangoValidationError
from django.core.validators import validate_email
from django.contrib.auth.hashers import make_password
from rest_framework import serializers

from .models import User
from files.models import File


class UserFilesSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = File
        fields = (
            "id",
            "name",
            "size",
            "uploaded",
        )

    def get_name(self, obj):
        if hasattr(obj, "file") and obj.file:
            return obj.file.name
        return ""


class AdminSerializer(serializers.ModelSerializer):
    files = UserFilesSerializer(read_only=True, many=True)
    files_count = serializers.SerializerMethodField()
    total_size = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "full_name",
            "email",
            "is_staff",
            "storage_path",
            "files",
            "files_count",
            "total_size",
        )
        read_only_fields = (
            "id",
            "files",
            "files_count",
            "total_size",
        )

    def get_files_count(self, obj):
        return obj.files.count()

    def get_total_size(self, obj):
        return sum(file.size for file in obj.files.all())


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "full_name",
            "email",
            "password",
            "is_staff",
            "storage_path",
        )
        read_only_fields = (
            "id",
            "storage_path",
        )
        extra_kwargs = {
            "password": {"write_only": True},
        }

    def validate_username(self, value):
        pattern = r"^[a-zA-Z][a-zA-Z0-9]{3,19}$"
        if not re.match(pattern, value):
            raise serializers.ValidationError(
                "Логин должен начинаться с буквы и содержать от 4 до 20 "
                "символов (буквы и цифры)."
            )
        if User.objects.filter(username=value.lower()).exists():
            raise serializers.ValidationError(
                "Пользователь с таким логином уже существует."
            )
        return value.lower()

    def validate_full_name(self, value):
        if not value.strip():
            raise serializers.ValidationError(
                "Полное имя не может быть пустым."
            )
        return value.strip()

    def validate_email(self, value):
        try:
            validate_email(value)
        except DjangoValidationError:
            raise serializers.ValidationError("Неверный формат email.")
        if User.objects.filter(email=value.lower()).exists():
            raise serializers.ValidationError(
                "Пользователь с таким email уже существует."
            )
        return value.lower()

    def validate_password(self, value):
        if len(value) < 6:
            raise serializers.ValidationError(
                "Пароль должен быть не менее 6 символов."
            )
        if not any(char.isupper() for char in value):
            raise serializers.ValidationError(
                "Пароль должен содержать хотя бы одну заглавную букву."
            )
        if not any(char.isdigit() for char in value):
            raise serializers.ValidationError(
                "Пароль должен содержать хотя бы одну цифру."
            )
        special_chars = "!@#$%^&*()_+-=[]{}|;':,.<>?"
        if not any(char in special_chars for char in value):
            raise serializers.ValidationError(
                "Пароль должен содержать хотя бы один специальный символ."
            )
        return value

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

    def update(self, instance, validated_data):
        request = self.context.get("request")
        user = getattr(request, "user", None)
        if user and "is_staff" in validated_data:
            if (
                not user.is_staff
                or user.id == instance.id
                or instance.is_superuser
            ):
                validated_data.pop("is_staff")
        if "password" in validated_data:
            validated_data["password"] = make_password(
                validated_data["password"]
            )
        return super().update(instance, validated_data)
