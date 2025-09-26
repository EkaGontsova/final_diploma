from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from knox.models import AuthToken
from knox.views import LoginView as KnoxLoginView, LogoutView as KnoxLogoutView
from django.contrib.auth import authenticate
from .models import User
from .serializers import UserSerializer, AdminSerializer
from .permissions import IsOwnerOrAdmin
from rest_framework.permissions import IsAdminUser


class SignupView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = []

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token = AuthToken.objects.create(user)[1]
        return Response(
            {"user": serializer.data, "token": token},
            status=status.HTTP_201_CREATED,
        )


class LoginView(KnoxLoginView):
    permission_classes = []

    def post(self, request, *args, **kwargs):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(request, username=username, password=password)
        if user is None:
            return Response(
                {"error": "Invalid credentials"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        self.request.user = user

        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            if user.is_staff:
                serializer = AdminSerializer(user)
            else:
                serializer = UserSerializer(user)
            response.data["user"] = serializer.data

        return response


class LogoutView(KnoxLogoutView):
    permission_classes = [IsAuthenticated]


class ProfileView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]

    def get_serializer_class(self):
        if self.request.user.is_staff:
            return AdminSerializer
        return UserSerializer

    def get_object(self):
        return self.request.user


class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = AdminSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


class UserDetailView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = AdminSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


class UpdateAdminStatusView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user
        if user.id == instance.id or instance.is_superuser:
            return Response(
                {"error": "Нельзя изменить статус для себя или superuser."},
                status=status.HTTP_403_FORBIDDEN,
            )
        instance.is_staff = request.data.get("is_staff", instance.is_staff)
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class DeleteUserView(generics.DestroyAPIView):
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated, IsAdminUser]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user
        if user.id == instance.id or instance.is_superuser:
            return Response(
                {"error": "Нельзя удалить себя или superuser."},
                status=status.HTTP_403_FORBIDDEN,
            )
        self.perform_destroy(instance)
        return Response(
            {"message": "Пользователь удалён."},
            status=status.HTTP_204_NO_CONTENT,
        )
