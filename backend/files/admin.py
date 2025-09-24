from django.contrib import admin
from .models import File


@admin.register(File)
class FileAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "file_name",
        "user",
        "uploaded",
        "downloaded",
        "size",
    )
    list_filter = ("uploaded", "user")
    ordering = ("-uploaded",)
    readonly_fields = ("file", "special_link")
    search_fields = ("file_name", "comment")
