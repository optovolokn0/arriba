import datetime
import random
from django.db import models
from django.dispatch import receiver
from simple_history.models import HistoricalRecords
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, Group, Permission
from django.contrib.auth.models import PermissionsMixin
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from django.db.models.signals import pre_save
from django.conf import settings
import uuid

# Create your models here.
class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)
   
class User(AbstractBaseUser, PermissionsMixin):
    id = models.AutoField(primary_key=True)
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    role = models.ForeignKey('Role', on_delete=models.SET_NULL, null=True)
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    # groups = models.ManyToManyField(
    #     Group,
    #     related_name='custom_user_set', 
    #     blank=True,
    #     help_text='The groups this user belongs to.',
    #     verbose_name='groups',
    # )
    # user_permissions = models.ManyToManyField(
    #     Permission,
    #     related_name='custom_user_permissions_set', 
    #     blank=True,
    #     help_text='Specific permissions for this user.',
    #     verbose_name='user permissions',
    # )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = [email]

    def __str__(self):
        return self.email
    
    
class UserToken(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    token = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    def __str__(self):
        return f"Token for {self.user.email}"


class Role(models.Model):
    CLIENT = 'client'
    SELLER = 'seller'  
    ADMIN = 'admin'
    
    ROLE_CHOICES = [
        (CLIENT, 'Client'),
        (SELLER, 'Seller'),     
        (ADMIN, 'Admin'),
    ]
    name = models.CharField(max_length=7, choices=ROLE_CHOICES, unique=True)

    def __str__(self):
        return self.name

class Brand(models.Model):
    brand_id = models.AutoField(primary_key=True)
    brand_name = models.CharField(max_length=100)
    # history = HistoricalRecords()

    def __str__(self):
        return self.brand_name

class Category(models.Model):
    category_id = models.AutoField(primary_key=True)
    category_name = models.CharField(max_length=100)
    # history = HistoricalRecords()

    def __str__(self):
        return self.category_name

# class Manufacturer(models.Model):
#     manufacturer_id = models.AutoField(primary_key=True)
#     manufacturer_name = models.CharField(max_length=100)
#     history = HistoricalRecords()
#     def __str__(self):
#         return self.manufacturer_name

class Product(models.Model):
    product_id = models.CharField(max_length=20, unique=True, editable=False)  # Артикул товара
    product_name = models.CharField(max_length=100)
    product_price = models.DecimalField(max_digits=10, decimal_places=2)
    product_description = models.TextField()
    seller = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, limit_choices_to={'role_id': 12})
    brand = models.ForeignKey(Brand, on_delete=models.SET_NULL, null=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    # history = HistoricalRecords()

    def save(self, *args, **kwargs):
        if not self.product_id:
            category_code = str(self.category.category_id).zfill(3) 
            manufacturer_code = str(self.brand.brand_id).zfill(3)  
            product_code = str(Product.objects.count() + 1).zfill(4)  
            
            self.product_id = f"{category_code}-{manufacturer_code}-{product_code}"  # Пример SKU: 001-005-0001
        super().save(*args, **kwargs)

    def get_average_rating(self):
        return Rating.objects.filter(product=self).aggregate(models.Avg('rate'))['rate__avg'] or 0

    def __str__(self):
        return self.product_name

class Characteristic(models.Model):
    product = models.ForeignKey(Product, related_name='characteristics', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    value = models.CharField(max_length=255)

class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='product_images/')

    def __str__(self):
        return f"Image for {self.product.product_name}"

class Customer(models.Model):
    customer_id = models.AutoField(primary_key=True)
    customer_name = models.CharField(max_length=100)
    history = HistoricalRecords()

class Review(models.Model):
    review_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    # history = HistoricalRecords()

    def __str__(self):
        return f"Review by {self.user.email} on {self.product.product_name}"

class Rating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, related_name='ratings', on_delete=models.CASCADE)
    rate = models.IntegerField()

    def __str__(self):
        return f"Rating {self.rate} by {self.user.email} for {self.product.product_name}"


# class Store(models.Model):
#     store_id = models.AutoField(primary_key=True)
#     store_name = models.CharField(max_length=100)
#     history = HistoricalRecords()

class Purchase(models.Model):
    purchase_id = models.AutoField(primary_key=True)
    customer = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role__name': Role.CLIENT})
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sales', limit_choices_to={'role__name': Role.SELLER})
    purchase_date = models.DateTimeField(auto_now_add=True)
    products = models.ManyToManyField(Product, through='PurchaseProduct')
    # history = HistoricalRecords()

    def __str__(self):
        return f'Purchase {self.purchase_id} by {self.customer} on {self.purchase_date}'

#Отслеживание артикулов товаров в заказах 
class PurchaseProduct(models.Model):
    purchase = models.ForeignKey(Purchase, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)  # Добавим количество товаров в заказе
    purchase_sku = models.CharField(max_length=20, unique=True, editable=False)
    def __str__(self):
        return f'{self.product} in Purchase {self.purchase.purchase_id}'
    
# Генерация артикула покупки
def generate_purchase_sku(purchase):
    # Используем ID покупателя, ID продавца и текущий timestamp для уникальности
    customer_id = str(purchase.customer.id).zfill(4)  # ID покупателя (4 цифры)
    seller_id = str(purchase.seller.id).zfill(4)      # ID продавца (4 цифры)
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')  # Текущая дата и время (14 цифр)
    random_part = str(random.randint(1000, 9999))  # Случайные 4 цифры
    # Формируем артикул
    return f"{customer_id}{seller_id}{timestamp}{random_part}"
# Сигнал для автоматической генерации артикула
@receiver(pre_save, sender=Purchase)
def set_purchase_sku(sender, instance, **kwargs):
    if not instance.purchase_sku:
        instance.purchase_sku = generate_purchase_sku(instance)


class InvoiceRecord(models.Model):
    invoice_record_id = models.AutoField(primary_key=True)
    purchase = models.ForeignKey(Purchase, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    product_count = models.IntegerField()
    product_price = models.DecimalField(max_digits=10, decimal_places=2)
    # history = HistoricalRecords()

    def __str__(self):
        return f"Invoice entry for {self.product.product_name} - {self.product_count} items"

class ProductPriceChange(models.Model):
    price_change_id = models.AutoField(primary_key=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    date_price_change = models.DateField()
    new_price = models.DecimalField(max_digits=10, decimal_places=2)
    # history = HistoricalRecords()

    def __str__(self):
        return f"Price change for {self.product.product_name} to {self.new_price}"
    
class Basket(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    products = models.ManyToManyField(Product, through='BasketProduct')
    # history = HistoricalRecords()

    def __str__(self):
        return f"Basket for {self.user.email}"
    
    def get_total_price(self):
        total = 0
        for basket_product in BasketProduct.objects.filter(basket=self):
            total += basket_product.product.product_price * basket_product.quantity
        return total
    
class BasketProduct(models.Model):
    basket = models.ForeignKey(Basket, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    # history = HistoricalRecords()

    def __str__(self):
        return f"{self.quantity} of {self.product.product_name} in basket"
    

class VerificationToken(models.Model):
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    token = models.UUIDField(default=uuid.uuid4, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)

    def __str__(self):
        return f"Token for {self.user}" 
    
class PaymentLog(models.Model):
    payment_id = models.CharField(max_length=100)
    event_type = models.CharField(max_length=50)
    status = models.CharField(max_length=20)
    raw_data = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment {self.payment_id} - {self.status}"
    
class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Ожидает оплаты'),
        ('paid', 'Оплачено'),
        ('shipped', 'Отправлено'),
        ('completed', 'Завершено'),
        ('canceled', 'Отменено'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    payment_id = models.CharField(max_length=100, null=True, blank=True)
    metadata = models.JSONField(null=True, blank=True) 

    def __str__(self):
        return f"Order {self.id} by {self.user.name} - {self.status}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2) 
    
    def __str__(self):
        return f"{self.product.name} x {self.quantity}"