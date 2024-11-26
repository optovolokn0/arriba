from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from .permissions import IsAdminOrSeller, IsClient, IsOwnerOrAdmin
from .models import Product, Category, Brand, User, Role, Basket, Purchase, Rating, ProductPriceChange, InvoiceRecord, Review, VerificationToken
from .serializers import (
    PasswordResetConfirmSerializer, PasswordResetRequestSerializer, ProductSerializer, CategorySerializer, BrandSerializer, UserSerializer, RoleSerializer, BasketSerializer,
    PurchaseSerializer, RatingSerializer, PriceChangeSerializer, InvoiceEntrySerializer, ReviewSerializer, RegisterSerializer
)
# Create your views here.

User = get_user_model()

class RegisterUserView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def perform_create(self, serializer):
        # Создаем товар с текущим продавцом
        serializer.save(seller=self.request.user)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def add_rating(self, request, pk=None):
        product = self.get_object()
        user = request.user
        rate = request.data.get('rate')

        # Добавление рейтинга для товара
        Rating.objects.create(user=user, product=product, rate=rate)
        product.update_rating()
        return Response({'status': 'rating added'})
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            # Любой пользователь может просматривать список и детали товаров
            permission_classes = [AllowAny]
        else:
            # Только аутентифицированные администраторы и продавцы могут создавать и редактировать
            permission_classes = [IsAuthenticated, IsAdminOrSeller]
        return [permission() for permission in permission_classes]

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            # Любой пользователь может просматривать категории
            permission_classes = [AllowAny]
        else:
            # Только администраторы могут редактировать категории
            permission_classes = [IsAuthenticated, IsAdminUser]
        return [permission() for permission in permission_classes]

class BrandViewSet(viewsets.ModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            # Любой пользователь может просматривать бренды
            permission_classes = [AllowAny]
        else:
            # Только администраторы могут редактировать бренды
            permission_classes = [IsAuthenticated, IsAdminUser]
        return [permission() for permission in permission_classes]

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            # Только аутентифицированные пользователи могут просматривать свой профиль
            permission_classes = [IsAuthenticated]
        elif self.action in ['update', 'partial_update']:
            # Пользователи могут редактировать свой профиль, администраторы - всех
            if self.request.user.is_admin:
                permission_classes = [IsAuthenticated, IsAdminUser]
            else:
                permission_classes = [IsAuthenticated]
        else:
            # Только администраторы могут удалять пользователей
            permission_classes = [IsAuthenticated, IsAdminUser]
        return [permission() for permission in permission_classes] 


class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    def get_permissions(self):
        # Только администраторы могут управлять ролями
        permission_classes = [IsAuthenticated, IsAdminUser]
        return [permission() for permission in permission_classes]

class BasketViewSet(viewsets.ModelViewSet):
    serializer_class = BasketSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Отображаем корзину только для текущего пользователя
        return Basket.objects.filter(user=self.request.user)
    def get_permissions(self):
        # Только аутентифицированные пользователи могут управлять корзиной
        permission_classes = [IsAuthenticated, IsClient]
        return [permission() for permission in permission_classes]

class RatingViewSet(viewsets.ModelViewSet):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    def get_permissions(self):
        # Разрешаем всем просматривать рейтинги, но редактировать могут только администраторы
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    def get_permissions(self):
        # Просмотр отзывов доступен всем, добавление/изменение/удаление - только аутентифицированным пользователям
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        elif self.action in ['create']:
            permission_classes = [IsAuthenticated]
        else:
            # Изменение и удаление только владельцем отзыва или админом
            permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
        return [permission() for permission in permission_classes]

class PurchaseViewSet(viewsets.ModelViewSet):
    queryset = Purchase.objects.all()
    serializer_class = PurchaseSerializer
    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'create']:
            # Доступ к списку, деталям и созданию - только для аутентифицированных пользователей
            permission_classes = [IsAuthenticated]
        else:
            # Изменение и удаление только для администратора или владельца покупки
            permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        # Ограничиваем доступ к покупкам текущего пользователя
        purchase_id = self.request.query_params.get('purchase_id', None)
        if purchase_id:
            return self.queryset.filter(purchase_id=purchase_id)
        return self.queryset

class PriceChangeViewSet(viewsets.ModelViewSet):
    queryset = ProductPriceChange.objects.all()
    serializer_class = PriceChangeSerializer
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            # Просмотр изменений цен доступен только всем
            permission_classes = [AllowAny]
        elif self.action in ['create']:
            # Добавление записей об изменении цен доступно продавцам и администраторам
            permission_classes = [IsAuthenticated, IsAdminOrSeller]
        else:
            # Изменение и удаление записей доступно только администраторам
            permission_classes = [IsAuthenticated, IsAdminUser]
        return [permission() for permission in permission_classes]

class InvoiceEntryViewSet(viewsets.ModelViewSet):
    queryset = InvoiceRecord.objects.all()
    serializer_class = InvoiceEntrySerializer
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            # Просмотр записей счетов доступен только владельцу и администраторам
            permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
        elif self.action in ['create']:
            # Создание записи доступно продавцам и администраторам
            permission_classes = [IsAuthenticated, IsAdminOrSeller]
        else:
            # Изменение и удаление доступно только администраторам
            permission_classes = [IsAuthenticated, IsAdminUser]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        # Ограничиваем доступ к счетам текущего пользователя
        if self.request.user.is_staff:
            return InvoiceRecord.objects.all()
        return InvoiceRecord.objects.filter(user=self.request.user)
    

class VerifyEmailView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    #TODO: add serializer
    def get(self, request, token, *args, **kwargs):
        try:
            token_obj = VerificationToken.objects.get(token=token, is_used=False)
            user = token_obj.user
            user.is_active = True  # Активируем пользователя
            user.save()
            token_obj.is_used = True  # Отмечаем токен как использованный
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

        token_obj.is_used = True  # Отмечаем токен как использованный
        token_obj.save()
        return Response({'message': 'Пароль успешно изменён!'}, status=status.HTTP_200_OK)