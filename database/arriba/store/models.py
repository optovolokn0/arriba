from django.db import models
from simple_history.models import HistoricalRecords
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, Group, Permission
from django.contrib.auth.models import PermissionsMixin

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
    
class Role(models.Model):
    SELLER = 'seller'
    CLIENT = 'client'
    ADMIN = 'admin'
    
    ROLE_CHOICES = [
        (SELLER, 'Seller'),
        (CLIENT, 'Client'),
        (ADMIN, 'Admin'),
    ]
    name = models.CharField(max_length=50, choices=ROLE_CHOICES, unique=True)

    def __str__(self):
        return self.name

class Brand(models.Model):
    brand_id = models.AutoField(primary_key=True)
    brand_name = models.CharField(max_length=100)
    history = HistoricalRecords()

    def __str__(self):
        return self.brand_name

class Category(models.Model):
    category_id = models.AutoField(primary_key=True)
    category_name = models.CharField(max_length=100)
    history = HistoricalRecords()

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
    seller = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, limit_choices_to={'role__name': Role.SELLER})
    brand = models.ForeignKey(Brand, on_delete=models.SET_NULL, null=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    # manufacturer = models.ForeignKey(Manufacturer, on_delete=models.CASCADE)
    history = HistoricalRecords()

    def save(self, *args, **kwargs):
        if not self.product_id:
            # Формат SKU
            category_code = str(self.category.category_id).zfill(3)  # Пример: 001
            manufacturer_code = str(self.manufacturer.manufacturer_id).zfill(3)  # Пример: 005
            product_code = str(Product.objects.count() + 1).zfill(4)  # Пример: 0001
            
            self.product_id = f"{category_code}-{manufacturer_code}-{product_code}"  # Пример SKU: 001-005-0001
        super().save(*args, **kwargs)

    def get_average_rating(self):
        return Rating.objects.filter(product=self).aggregate(models.Avg('rate'))['rate__avg'] or 0

    def __str__(self):
        return self.product_name

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
    history = HistoricalRecords()

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
    history = HistoricalRecords()

class InvoiceRecord(models.Model):
    invoice_record_id = models.AutoField(primary_key=True)
    purchase = models.ForeignKey(Purchase, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    product_count = models.IntegerField()
    product_price = models.DecimalField(max_digits=10, decimal_places=2)
    history = HistoricalRecords()

    def __str__(self):
        return f"Invoice entry for {self.product.product_name} - {self.product_count} items"

class ProductPriceChange(models.Model):
    price_change_id = models.AutoField(primary_key=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    date_price_change = models.DateField()
    new_price = models.DecimalField(max_digits=10, decimal_places=2)
    history = HistoricalRecords()

    def __str__(self):
        return f"Price change for {self.product.product_name} to {self.new_price}"
    
class Basket(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    products = models.ManyToManyField(Product, through='BasketProduct')
    history = HistoricalRecords()

    def __str__(self):
        return f"Basket for {self.user.email}"
    
class BasketProduct(models.Model):
    basket = models.ForeignKey(Basket, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    history = HistoricalRecords()

    def __str__(self):
        return f"{self.quantity} of {self.product.product_name} in basket"