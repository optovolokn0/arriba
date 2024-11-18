from rest_framework import serializers
from .models import Product, Category, Brand, User, Role, Basket, Purchase, Rating, ProductPriceChange, InvoiceRecord, Review

class ProductSerializer(serializers.ModelSerializer):
    rating = serializers.FloatField(read_only=True)
    
    class Meta:
        model = Product
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['name', 'email', 'password', 'role']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # Создание пользователя с захэшированным паролем
        user = User.objects.create_user(**validated_data)
        return user


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ['name', 'email', 'password', 'password_confirm', 'role']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def validate(self, data):
        # Проверка, что пароли совпадают
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        # Удаляем поле подтверждения пароля, так как оно не нужно для создания пользователя
        validated_data.pop('password_confirm')
        # Создаём нового пользователя
        user = User.objects.create_user(
            name=validated_data['name'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data.get('role', 'client'),  # По умолчанию "client"
        )
        return user

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = '__all__'

class BasketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Basket
        fields = '__all__'

class PurchaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Purchase
        fields = '__all__'

class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = '__all__'

class PriceChangeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductPriceChange
        fields = '__all__'

class InvoiceEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceRecord
        fields = '__all__'

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'