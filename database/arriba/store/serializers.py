from rest_framework import serializers, status
from .models import BasketProduct, Characteristic, Order, OrderItem, Product, Category, Brand, ProductImage, PurchaseProduct, User, Role, Basket, Purchase, Rating, ProductPriceChange, InvoiceRecord, Review, UserToken, VerificationToken
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.utils import timezone
from rest_framework.response import Response

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import AccessToken



class CharacteristicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Characteristic
        fields = ['id', 'name', 'value']

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'product']

class ProductSerializer(serializers.ModelSerializer):
    rating = serializers.FloatField(read_only=True)
    characteristics = CharacteristicSerializer(many = True)
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = '__all__'

    def create(self, validated_data):
        characteristics_data = validated_data.pop('characteristics')
        product = Product.objects.create(**validated_data)
        for char_data in characteristics_data:
            Characteristic.objects.create(product=product, **char_data)
        return product

class ProductImageUploadSerializer(serializers.Serializer):
    image = serializers.ImageField(required=True)

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
        fields = ['id', 'name', 'email', 'password', 'role']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
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
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(
            name=validated_data['name'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data.get('role', 'client'), 
        )
        user.is_active = False  
        user.save()

        token = VerificationToken.objects.create(user=user)
        current_site = "https://arriba.ru.tuna.am/"
        verification_link = f"{current_site}api/verify-email/{token.token}/"
        return user, verification_link
        # send_mail(
        #     'Подтверждение регистрации',
        #     f'Для завершения регистрации перейдите по ссылке: {verification_link}',
        #     'webmaster@localhost',
        #     [user.email],
        #     fail_silently=False,
        # )
        # return Response({"message": f"{current_site}/api/verify-email/{token.token}/"}, status=status.HTTP_201_CREATED)
        # return user

class VerifyEmailSerializer(serializers.Serializer):
    token = serializers.CharField()

    def validate_token(self, value):
        from rest_framework.exceptions import ValidationError
        from django.contrib.auth.models import User
        from rest_framework_simplejwt.tokens import UntypedToken

        try:
            UntypedToken(value)
        except Exception as e:
            raise ValidationError(f"Invalid or expired token: {str(e)}")
        return value

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Пользователь с таким email не найден.")
        return value

    def save(self):
        email = self.validated_data['email']
        user = User.objects.get(email=email)
        
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

class BasketProductSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.product_name', read_only=True)

    class Meta:
        model = BasketProduct
        fields = ['product', 'product_name', 'quantity']

class BasketSerializer(serializers.ModelSerializer):
    products = BasketProductSerializer(source='basketproduct_set', many=True)

    class Meta:
        model = Basket
        fields = ['id', 'user', 'products']

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

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        return super().create(validated_data)

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['product', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = ['id', 'status', 'created_at', 'updated_at', 'total_price', 'items']


# class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
#     def validate(self, attrs):
#         data = super().validate(attrs)
#         refresh = self.get_token(self.user)
#         access_token = refresh.access_token

#         if access_token:
#             expires_at_timestamp = AccessToken(access_token)['exp']
#             expires_at = timezone.make_aware(
#                 timezone.datetime.fromtimestamp(expires_at_timestamp),
#                 timezone.get_current_timezone()
#             )

#         UserToken.objects.create(
#             user=self.user, 
#             token=str(access_token),
#             expires_at=expires_at 
#         )

#         data['access'] = str(access_token)
#         data['refresh'] = str(refresh)

#         return data