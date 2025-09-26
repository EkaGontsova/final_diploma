from rest_framework.permissions import BasePermission


class IsAdminOrIsOwner(BasePermission):
    """
    Разрешение: админ или владелец объекта.
    """

    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True
        return request.user == obj.user
