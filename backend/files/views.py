import logging
from uuid import uuid4
from django.utils import timezone
from django.http import FileResponse
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.generics import get_object_or_404
from rest_framework.views import APIView
import mimetypes
from .models import File
from .serializers import FileSerializer
from users.permissions import IsOwnerOrAdmin

logger = logging.getLogger(__name__)

class FileViewSet(viewsets.ModelViewSet):
    queryset = File.objects.all()
    serializer_class = FileSerializer

    def get_permissions(self):
        if self.action in ['download', 'get_link', 'partial_update', 'destroy', 'retrieve']:
            return [IsAuthenticated(), IsOwnerOrAdmin()]
        if self.action in ['list', 'create']:
            return [IsAuthenticated()]
        return [AllowAny()]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            user_id = self.request.query_params.get('user_id')
            if user_id:
                return File.objects.filter(user__id=user_id)
            return File.objects.all()
        return File.objects.filter(user=user)

    def perform_create(self, serializer):
        file_obj = serializer.validated_data['file']
        serializer.save(
            user=self.request.user,
            file_name=file_obj.name,
            size=file_obj.size,
            uploaded=timezone.now()
        )
        logger.info(f"File '{file_obj.name}' uploaded by user {self.request.user.username}")

    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def view(self, request, pk=None):
        file_instance = self.get_object()
        content_type, encoding = mimetypes.guess_type(file_instance.file.path)
        if content_type is None:
            content_type = 'application/octet-stream'

        response = FileResponse(file_instance.file.open('rb'), content_type=content_type)
        response['Content-Disposition'] = f'inline; filename="{file_instance.file_name}"'
        return response

        response = FileResponse(file_obj.file.open('rb'), content_type=mime_type)
        response['Content-Disposition'] = f'inline; filename="{file_obj.file_name}"'
        return response
    
    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        file_instance = self.get_object()
        file_instance.downloaded = timezone.now()
        file_instance.save()
        logger.info(f"File '{file_instance.file_name}' downloaded by user {request.user.username}")
        return FileResponse(
            open(file_instance.file.path, 'rb'),
            as_attachment=True,
            filename=file_instance.file_name
        )

    @action(detail=True, methods=['get'], url_path='link')
    def link(self, request, pk=None):
        file_instance = self.get_object()
        if not file_instance.special_link:
            file_instance.special_link = uuid4().hex[:32]
            file_instance.save()
        link = request.build_absolute_uri(f'/api/files/share/{file_instance.special_link}/')
        return Response({'link': link})

    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        file_instance = self.get_object()
        logger.warning(f"File '{file_instance.file_name}' deleted by user {request.user.username}")
        return super().destroy(request, *args, **kwargs)

class ShareFileView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, code):
        file_instance = get_object_or_404(File, special_link=code)
        file_instance.downloaded = timezone.now()
        file_instance.save()
        logger.info(f"File '{file_instance.file_name}' downloaded via share link {code}")
        return FileResponse(
            open(file_instance.file.path, 'rb'),
            as_attachment=True,
            filename=file_instance.file_name
        )
