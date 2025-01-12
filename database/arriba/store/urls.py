from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductViewSet, CategoryViewSet, BrandViewSet, UserViewSet, RoleViewSet,
    BasketViewSet, PurchaseViewSet, ReviewViewSet, PriceChangeViewSet, InvoiceEntryViewSet,
    OrderViewSet
)


router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'brands', BrandViewSet, basename='brand')
router.register(r'users', UserViewSet, basename='user')
router.register(r'roles', RoleViewSet, basename='role')
router.register(r'basket', BasketViewSet, basename='basket')
router.register(r'purchases', PurchaseViewSet, basename='purchase')
router.register(r'reviews', ReviewViewSet, basename='review')
router.register(r'price-changes', PriceChangeViewSet, basename='pricechange')
router.register(r'invoice-entries', InvoiceEntryViewSet, basename='invoiceentry')
router.register(r'orders', OrderViewSet, basename='order')

urlpatterns = [
    path('', include(router.urls)),
]