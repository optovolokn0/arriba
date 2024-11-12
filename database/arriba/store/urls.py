from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, ManufacturerViewSet, ProductViewSet, CustomerViewSet, StoreViewSet, PurchaseViewSet, InvoiceRecordViewSet, ProductPriceChangeViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'manufacturers', ManufacturerViewSet)
router.register(r'products', ProductViewSet)
router.register(r'customers', CustomerViewSet)
router.register(r'stores', StoreViewSet)
router.register(r'purchases', PurchaseViewSet)
router.register(r'invoice-records', InvoiceRecordViewSet)
router.register(r'product-price-changes', ProductPriceChangeViewSet)

urlpatterns = [
    path('', include(router.urls)),
]