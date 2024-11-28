from rest_framework import serializers
from .models import Product, Category, Brand, PurchaseProduct, User, Role, Basket, Purchase, Rating, ProductPriceChange, InvoiceRecord, Review, VerificationToken
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse



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

User = get_user_model()

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
        user.is_active = False  # Делаем пользователя неактивным до подтверждения email
        user.save()

        # Отправляем email для подтверждения
        token = VerificationToken.objects.create(user=user)
        current_site = "localhost:8000"
        verification_link = f"http://{current_site}/api/verify-email/{token.token}/"
        send_mail(
            'Подтверждение регистрации',
            f'Для завершения регистрации перейдите по ссылке: {verification_link}',
            'webmaster@localhost',
            [user.email],
            fail_silently=False,
        )
        return user

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Пользователь с таким email не найден.")
        return value

    def save(self):
        email = self.validated_data['email']
        user = User.objects.get(email=email)
        
        # Создаём токен для сброса пароля
        token = VerificationToken.objects.create(user=user)
        current_site = "localhost:8000"
        reset_link = f"http://{current_site}/api/reset-password-confirm/{token.token}/"
        send_mail(
            'Сброс пароля',
            f'Для сброса пароля перейдите по ссылке: {reset_link}',
            'webmaster@localhost',
            [user.email],
            fail_silently=False,
        )

class PasswordResetConfirmSerializer(serializers.Serializer):
    new_password = serializers.CharField(write_only=True)
    new_password_confirm = serializers.CharField(write_only=True)

    def validate(self, data):
        if data['new_password'] != data['new_password_confirm']:
            raise serializers.ValidationError("Пароли не совпадают.")
        return data

    def save(self, user):
        user.set_password(self.validated_data['new_password'])
        user.save()

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = '__all__'

class BasketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Basket
        fields = '__all__'

class PurchaseProductSerializer(serializers.ModelSerializer):
    product_sku = serializers.CharField(source='product.sku', read_only=True)
    class Meta:
        model = PurchaseProduct
        fields = ['product_sku', 'quantity']

class PurchaseSerializer(serializers.ModelSerializer):
    products = PurchaseProductSerializer(many=True, source='purchaseproduct_set')
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