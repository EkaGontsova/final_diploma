from django.urls import path
from knox import views as knox_views
from . import views

urlpatterns = [
    path('signup/', views.SignupView.as_view(), name='signup'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', knox_views.LogoutView.as_view(), name='knox_logout'),

    path('profile/', views.ProfileView.as_view(), name='profile'),
    path('', views.UserListView.as_view(), name='user-list'),
    path('<int:pk>/', views.UserDetailView.as_view(), name='user-detail'),
    path('<int:pk>/status/', views.UpdateAdminStatusView.as_view(), name='user-update-status'),
    path('<int:pk>/delete/', views.DeleteUserView.as_view(), name='user-delete'),
]

