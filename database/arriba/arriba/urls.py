"""
URL configuration for arriba project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from store import views
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi


schema_view = get_schema_view(
    openapi.Info(
        title="Marketplace API",
        default_version='v1',
        description="API documentation for the marketplace",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('store.urls')),
    path('api/token/', views.CustomTokenObtainPairView.as_view()),
    path('api/token/refresh/', TokenRefreshView.as_view()),
    path('api/register/', views.RegisterUserView.as_view()),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0)),
    path('api/verify-email/<uuid:token>/', views.VerifyEmailView.as_view()),
    path('api/reset-password/', views.PasswordResetRequestView.as_view()),
    path('api/reset-password-confirm/<uuid:token>/', views.PasswordResetConfirmView.as_view()),
    path('api/logout/', views.LogoutView.as_view()),
    path('api/profile/', views.UserProfileView.as_view()),
    path('api/basket/payment/', views.BasketPaymentView.as_view()),
    path('api/payments/webhook/', views.PaymentWebhookView.as_view()),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
