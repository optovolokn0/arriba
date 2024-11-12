from django.shortcuts import render
from rest_framework import viewsets
from .models import Category, Manufacturer, Product, Customer, Store, Purchase, InvoiceRecord, ProductPriceChange
from .serializers import CategorySerializer, ManufacturerSerializer, ProductSerializer, CustomerSerializer, StoreSerializer, PurchaseSerializer, InvoiceRecordSerializer, ProductPriceChangeSerializer
# Create your views here.
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']

class ManufacturerViewSet(viewsets.ModelViewSet):
    queryset = Manufacturer.objects.all()
    serializer_class = ManufacturerSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']

class StoreViewSet(viewsets.ModelViewSet):
    queryset = Store.objects.all()
    serializer_class = StoreSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']

class PurchaseViewSet(viewsets.ModelViewSet):
    queryset = Purchase.objects.all()
    serializer_class = PurchaseSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']

class InvoiceRecordViewSet(viewsets.ModelViewSet):
    queryset = InvoiceRecord.objects.all()
    serializer_class = InvoiceRecordSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']

class ProductPriceChangeViewSet(viewsets.ModelViewSet):
    queryset = ProductPriceChange.objects.all()
    serializer_class = ProductPriceChangeSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']