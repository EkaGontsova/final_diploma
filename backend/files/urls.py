from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FileViewSet, ShareFileView

router = DefaultRouter()
router.register(r'', FileViewSet)  

urlpatterns = [
    path('', include(router.urls)),
    path('share/<str:code>/', ShareFileView.as_view(), name='share_file'),
]

