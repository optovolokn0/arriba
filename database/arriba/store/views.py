import datetime
import logging
logger = logging.getLogger(__name__)
from django.db import IntegrityError
from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework.parsers import MultiPartParser, FormParser
from django.utils.timezone import now
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .yookassa import create_payment_from_basket
from .permissions import IsAdminOrSeller, IsClient, IsClientOrAdmin, IsOwnerOrAdmin, IsAdmin
from .models import BasketProduct, Order, OrderItem, PaymentLog, Product, Category, Brand, ProductImage, User, Role, Basket, Purchase, Rating, ProductPriceChange, InvoiceRecord, Review, UserToken, VerificationToken, Characteristic
from .serializers import (
    OrderSerializer, PasswordResetConfirmSerializer, PasswordResetRequestSerializer, ProductImageUploadSerializer, ProductSerializer, CategorySerializer, BrandSerializer, UserSerializer, RoleSerializer, BasketSerializer,
    PurchaseSerializer, RatingSerializer, PriceChangeSerializer, InvoiceEntrySerializer, ReviewSerializer, RegisterSerializer, VerifyEmailSerializer, ProductImageSerializer
)
# Create your views here.

User = get_user_model()

def save_access_token(user):
    token = AccessToken.for_user(user)
    
    UserToken.objects.create(
        user=user,
        token=str(token),
        expires_at=now + token.lifetime,
    )
    return token

def generate_developer_token(user):

    token = AccessToken()
    token['user_id'] = user.id
    token['is_admin'] = True
    token.set_exp(lifetime=datetime.timedelta(days=365 * 100))

    # Сохранение токена в базе
    UserToken.objects.create(
        user=user,
        token=str(token),
        expires_at=now() + datetime.timedelta(days=365 * 100)
    )
    print(str(token))
    return str(token)

class RegisterUserView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user, activation_link = serializer.save()
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)
            return Response({
                    "user": {
                        "id": user.id,
                        "name": user.name,
                        "email": user.email,
                        "role_id": user.role.id,
                        "role": user.role.name,        
                    },
                    "tokens": {
                        "access": access_token,
                        "refresh": refresh_token,
                    },
                    "activation_link": activation_link,
                }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        # user = self.request.user
        refresh_token = response.data['refresh']
        access_token = response.data['access']
        # if access_token:
        #     UserToken.objects.create(
        #         user=user,
        #         token=access_token,
        #         expires_at=AccessToken(access_token)['exp']
        #     )
        
        response.set_cookie(
            key='refresh_token',
            value=refresh_token,
            httponly=True,
            secure=False,
            samesite='None',
            max_age=7776000,
            path='/',
        )


        response.data['access'] = access_token
        response.data['refresh'] = refresh_token
        return response

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    http_method_names = ['get', 'post', 'head', 'patch', 'delete']
    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def add_rating(self, request, pk=None):
        product = self.get_object()
        user = request.user
        rate = request.data.get('rate')

        Rating.objects.create(user=user, product=product, rate=rate)
        product.update_rating()
        return Response({'status': 'rating added'})
    
    @swagger_auto_schema(
        operation_description="Add an image to a product.",
        request_body=ProductImageUploadSerializer,
        responses={
            201: "Image added successfully.",
            400: "Bad request."
        }
    )
    @action(detail=True, methods=['post'], parser_classes=[MultiPartParser, FormParser], permission_classes=[IsAuthenticated, IsAdminOrSeller])
    def add_image(self, request, pk=None):
        product = self.get_object()
        image_file = request.FILES.get('image')

        if not image_file:
            return Response(
                {"error": "No image file provided."},
                status=status.HTTP_400_BAD_REQUEST
            )

        product_image = ProductImage.objects.create(product=product, image=image_file)
        serializer = ProductImageSerializer(product_image)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['delete'], permission_classes=[IsAuthenticated, IsAdminOrSeller])
    def delete_image(self, request, pk=None):
        image_id = request.data.get('image_id')
        try:
            image = ProductImage.objects.get(id=image_id, product_id=pk)
            image.delete()
            return Response({"status": "Image deleted"}, status=status.HTTP_204_NO_CONTENT)
        except ProductImage.DoesNotExist:
            return Response({"error": "Image not found."}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=True, methods=['post', 'delete'], permission_classes=[IsAuthenticated])
    def add_characteristic(self, request, pk=None):
        product = self.get_object() 
        data = request.data

        name = data.get('name')
        value = data.get('value')
        if not name or not value:
            return Response(
                {"error": "Both 'name' and 'value' are required fields."},
                status=status.HTTP_400_BAD_REQUEST
            )

        characteristic = Characteristic.objects.create(
            product=product,
            name=name,
            value=value
        )
        return Response(
            {
                "id": characteristic.id,
                "name": characteristic.name,
                "value": characteristic.value,
                "product_id": product.id,
            },
            status=status.HTTP_201_CREATED
        )

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated, IsAdminOrSeller]
        return [permission() for permission in permission_classes]

class BasketPaymentView(APIView):
    queryset = Basket.objects.all()
    permission_classes = [IsAuthenticated]
    def post(self, request):
        user = request.user
        description = request.data.get("description", "Оплата корзины")
        try:
            payment = create_payment_from_basket(user=user, description=description)
            return Response({
                "id": payment.id,
                "status": payment.status,
                "confirmation_url": payment.confirmation.confirmation_url,
                "created_at": payment.created_at
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    # def post(self, request):
    #     print("Метод post вызван")
    #     return Response({"message": "POST работает!"}, status=status.HTTP_200_OK)
class PaymentWebhookView(APIView):
    def post(self, request):
        print("Webhook вызван")
        print("Данные запроса:", request.data)

        event_data = request.data
        event_type = event_data.get("event")
        if not event_type:
            print("Ошибка: отсутствует тип события")
            return Response({"error": "Invalid event data"}, status=status.HTTP_400_BAD_REQUEST)

        print("Тип события:", event_type)
        payment_object = event_data.get("object", {})
        payment_status = payment_object.get("status")
        payment_id = payment_object.get("id")

        if (event_type == "payment.succeeded" and payment_status == "succeeded") or event_type == "payment.waiting_for_capture":
            user_id = payment_object.get("metadata", {}).get("user_id")
            if not user_id:
                print("Ошибка: отсутствует user_id в метаданных")
                return Response({"error": "User ID not found in metadata"}, status=status.HTTP_400_BAD_REQUEST)

            try:
                user = User.objects.get(id=user_id)
                basket = Basket.objects.filter(user=user).first()
                if not basket:
                    print("Ошибка: корзина не найдена")
                    return Response({"error": "Basket not found"}, status=status.HTTP_400_BAD_REQUEST)

                order = Order.objects.create(
                    user=user,
                    total_price=basket.get_total_price(),
                    status='paid',
                    payment_id=payment_id,
                )
                print("Заказ создан:", order)

                for basket_item in BasketProduct.objects.filter(basket=basket):
                    OrderItem.objects.create(
                        order=order,
                        product=basket_item.product,
                        quantity=basket_item.quantity, 
                        price=basket_item.product.product_price,  
                    )
                    print(f"Добавлен OrderItem для продукта {basket_item.product.product_name}")

                basket.products.clear()
                print("Корзина очищена")

                return Response({"status": "Order created and basket cleared"}, status=status.HTTP_200_OK)

            except Exception as e:
                print("Ошибка при создании заказа или очистке корзины:", e)
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"status": "Webhook received, but no action taken"}, status=status.HTTP_200_OK)

class OrderViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post']
    queryset = OrderItem.objects.all()
    serializer_class = OrderSerializer
    @action(detail=False, methods=['get'], url_path=r'user/(?P<user_id>\d+)', permission_classes=[IsAuthenticated, IsAdminOrSeller])
    def user_orders(self, request, user_id=None):
        try:
            orders = Order.objects.filter(user_id=user_id)
            if not orders.exists():
                return Response({"detail": "Заказы не найдены."}, status=404)
            serializer = OrderSerializer(orders, many=True)
            return Response(serializer.data, status=200)
        except Exception as e:
            return Response({"detail": str(e)}, status=400)

    def list(self, request):
        orders = Order.objects.filter(user=request.user)
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

class CategoryViewSet(viewsets.ModelViewSet):
    http_method_names = ['get', 'post', 'head', 'patch', 'delete']
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated, IsAdmin]
        return [permission() for permission in permission_classes]

class BrandViewSet(viewsets.ModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    http_method_names = ['get', 'post', 'head', 'patch', 'delete']
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated, IsAdmin]
        return [permission() for permission in permission_classes]

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    http_method_names = ['get', 'head', 'patch', 'delete']
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [IsAuthenticated]
        elif self.action in ['create']:
            permission_classes = [IsAdmin]
        elif self.action in ['partial_update']:
            if self.request.user.is_admin:
                permission_classes = [IsAuthenticated, IsAdmin]
            else:
                permission_classes = [IsAuthenticated]
        elif self.action in ['destroy']:
            permission_classes = [IsAuthenticated, IsAdmin]

        return [permission() for permission in permission_classes]

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        data = {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role_id": user.role.id,
            "role": user.role.name,
        }
        return Response(data)

class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    http_method_names = ['get', 'head']

    def get_permissions(self):
        permission_classes = [IsAuthenticated, IsAdmin]
        return [permission() for permission in permission_classes]

class BasketViewSet(viewsets.ModelViewSet):
    serializer_class = BasketSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post', 'head', 'put', 'delete']

    def get_queryset(self):
        if not self.request.user.is_authenticated:
            return Basket.objects.none()
        return Basket.objects.filter(user=self.request.user)
    def get_permissions(self):
        permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    @action(detail=False, methods=['get', 'post', 'put', 'delete'], url_path=r'user/(?P<user_id>\d+)')
    def user_basket(self, request, user_id=None):
        if request.method == 'GET':
            basket = Basket.objects.filter(user_id=user_id).first()
            if not basket:
                return Response({"error": "Basket not found"}, status=status.HTTP_404_NOT_FOUND)

            serializer = self.serializer_class(basket)
            return Response(serializer.data, status=status.HTTP_200_OK)

        if request.method == 'POST':
            product_id = request.data.get('product_id')
            quantity = request.data.get('quantity', 1) 
            if not product_id:
                return Response({"error": "Product ID is required"}, status=status.HTTP_400_BAD_REQUEST)

            if int(quantity) < 1:
                return Response({"error": "Quantity must be at least 1"}, status=status.HTTP_400_BAD_REQUEST)

            basket, _ = Basket.objects.get_or_create(user_id=user_id)

            product = Product.objects.filter(pk=product_id).first()
            if not product:
                return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

            try:
                basket_product, created = BasketProduct.objects.get_or_create(
                    basket=basket,
                    product=product,
                    defaults={'quantity': int(quantity)} 
                )

                if not created:
                    basket_product.quantity += int(quantity)
                    basket_product.save()

                return Response(
                    {
                        "message": "Product added to basket",
                        "basket_product": {
                            "product": product.product_name,
                            "quantity": basket_product.quantity
                        }
                    },
                    status=status.HTTP_200_OK
                )
            except IntegrityError as e:
                return Response({"error": "Database integrity error", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        if request.method == 'PUT':
            product_id = request.data.get('product_id')
            quantity = request.data.get('quantity')

            if not product_id or quantity is None:
                return Response(
                    {"error": "Product ID and quantity are required"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if int(quantity) < 1:
                return Response({"error": "Quantity must be at least 1"}, status=status.HTTP_400_BAD_REQUEST)

            basket = Basket.objects.filter(user_id=user_id).first()
            if not basket:
                return Response({"error": "Basket not found"}, status=status.HTTP_404_NOT_FOUND)

            basket_product = BasketProduct.objects.filter(basket=basket, product_id=product_id).first()
            if not basket_product:
                return Response({"error": "Product not found in basket"}, status=status.HTTP_404_NOT_FOUND)

            basket_product.quantity = int(quantity)
            basket_product.save()

            return Response(
                {
                    "message": "Product quantity updated",
                    "basket_product": {
                        "product": basket_product.product.product_name,
                        "quantity": basket_product.quantity
                    }
                },
                status=status.HTTP_200_OK
            )

        if request.method == 'DELETE':
            product_id = request.data.get('product_id')

            if not product_id:
                return Response({"error": "Product ID is required"}, status=status.HTTP_400_BAD_REQUEST)

            basket = Basket.objects.filter(user_id=user_id).first()
            if not basket:
                return Response({"error": "Basket not found"}, status=status.HTTP_404_NOT_FOUND)

            basket_product = BasketProduct.objects.filter(basket=basket, product_id=product_id).first()
            if not basket_product:
                return Response({"error": "Product not found in basket"}, status=status.HTTP_404_NOT_FOUND)

            basket_product.delete()

            return Response({"message": "Product removed from basket"}, status=status.HTTP_200_OK)
class RatingViewSet(viewsets.ModelViewSet):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        elif self.action in ['partial_update']:
            permission_classes = [IsAdmin]
        return [permission() for permission in permission_classes]

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    http_method_names = ['get', 'post', 'head', 'patch', 'delete']
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        elif self.action in ['create']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
        return [permission() for permission in permission_classes]
    
    @action(detail=False, methods=['get', 'post'], url_path=r'(?P<product_id>\d+)')
    def reviews_for_product(self, request, product_id=None):
        if request.method == 'GET':
            reviews = self.queryset.filter(product_id=product_id)
            serializer = self.serializer_class(reviews, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        if request.method == 'POST':
            serializer = self.serializer_class(data=request.data)
            if serializer.is_valid():
                serializer.save(user=request.user, product_id=product_id)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PurchaseViewSet(viewsets.ModelViewSet):
    queryset = Purchase.objects.all()
    serializer_class = PurchaseSerializer
    http_method_names = ['get', 'post', 'head', 'patch', 'delete']
    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'create']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        if not self.request.user.is_authenticated:
            return Basket.objects.none()
        purchase_id = self.request.query_params.get('purchase_id', None)
        if purchase_id:
            return self.queryset.filter(purchase_id=purchase_id)
        return self.queryset

class PriceChangeViewSet(viewsets.ModelViewSet):
    queryset = ProductPriceChange.objects.all()
    serializer_class = PriceChangeSerializer
    http_method_names = ['get', 'post', 'head']
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        elif self.action in ['create']:
            permission_classes = [IsAuthenticated, IsAdminOrSeller]
        else:
            permission_classes = [IsAuthenticated, IsAdmin]
        return [permission() for permission in permission_classes]

class InvoiceEntryViewSet(viewsets.ModelViewSet):
    http_method_names = ['get', 'post', 'head', 'patch', 'delete']
    queryset = InvoiceRecord.objects.all()
    serializer_class = InvoiceEntrySerializer
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [IsAuthenticated]
        elif self.action in ['create']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAuthenticated, IsAdmin]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        if not self.request.user.is_authenticated:
            return Basket.objects.none()
        if self.request.user.is_staff:
            return InvoiceRecord.objects.all()
        
        return InvoiceRecord.objects.filter(user=self.request.user)
    

class VerifyEmailView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = VerifyEmailSerializer
    def get(self, request, token, *args, **kwargs):
        try:
            token_obj = VerificationToken.objects.get(token=token, is_used=False)
            user = token_obj.user
            user.is_active = True
            user.save()
            token_obj.is_used = True 
            token_obj.save()
            return Response({'message': 'Email успешно подтверждён!'}, status=status.HTTP_200_OK)
        except VerificationToken.DoesNotExist:
            return Response({'message': 'Недействительный или использованный токен.'}, status=status.HTTP_400_BAD_REQUEST)



class PasswordResetRequestView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = PasswordResetRequestSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'message': 'Инструкция по сбросу пароля отправлена на ваш email.'}, status=status.HTTP_200_OK)

class PasswordResetConfirmView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = PasswordResetConfirmSerializer

    def post(self, request, token, *args, **kwargs):
        try:
            token_obj = VerificationToken.objects.get(token=token, is_used=False)
            user = token_obj.user
        except VerificationToken.DoesNotExist:
            return Response({'message': 'Недействительный или использованный токен.'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=user)

        token_obj.is_used = True 
        token_obj.save()
        return Response({'message': 'Пароль успешно изменён.'}, status=status.HTTP_200_OK)
    
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')
        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except Exception:
                return Response({'detail': 'Invalid token.'}, status=status.HTTP_400_BAD_REQUEST)
            
            response = Response({'detail': 'Successfully logged out.'}, status=status.HTTP_204_NO_CONTENT)
            response.delete_cookie('refresh_token')
            return response        
        return Response({'detail': 'Refresh token missing.'}, status=status.HTTP_400_BAD_REQUEST)
    
class TokenRefreshView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')

        if not refresh_token:
            return Response({'error': 'Refresh token not provided'}, status=400)

        try:
            refresh = RefreshToken(refresh_token)
            new_access_token = refresh.access_token

            UserToken.objects.filter(token=refresh_token).delete()

            UserToken.objects.create(
                user=request.user,
                token=str(new_access_token),
                expires_at=new_access_token['exp'],
            )

            return Response({
                'access': str(new_access_token)
            })

        except Exception as e:
            return Response({'error': 'Invalid refresh token'}, status=401)