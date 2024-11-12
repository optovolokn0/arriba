from rest_framework import serializers
from .models import Category, Manufacturer, Product, Customer, Store, Purchase, InvoiceRecord, ProductPriceChange

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ManufacturerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Manufacturer
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'

class StoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = '__all__'

class PurchaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Purchase
        fields = '__all__'

class InvoiceRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceRecord
        fields = '__all__'

class ProductPriceChangeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductPriceChange
        fields = '__all__'