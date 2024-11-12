from django.db import models
from simple_history.models import HistoricalRecords

# Create your models here.
class Category(models.Model):
    category_id = models.AutoField(primary_key=True)
    category_name = models.CharField(max_length=100)
    history = HistoricalRecords()
    def __str__(self):
        return self.category_name

class Manufacturer(models.Model):
    manufacturer_id = models.AutoField(primary_key=True)
    manufacturer_name = models.CharField(max_length=100)
    history = HistoricalRecords()
    def __str__(self):
        return self.manufacturer_name

class Product(models.Model):
    product_id = models.CharField(max_length=20, unique=True, editable=False)  # Артикул товара
    product_name = models.CharField(max_length=100)
    product_price = models.FloatField()
    product_description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    manufacturer = models.ForeignKey(Manufacturer, on_delete=models.CASCADE)
    history = HistoricalRecords()

    def save(self, *args, **kwargs):
        if not self.product_id:
            # Формат SKU
            category_code = str(self.category.category_id).zfill(3)  # Пример: 001
            manufacturer_code = str(self.manufacturer.manufacturer_id).zfill(3)  # Пример: 005
            product_code = str(Product.objects.count() + 1).zfill(4)  # Пример: 0001
            
            self.product_id = f"{category_code}-{manufacturer_code}-{product_code}"  # Пример SKU: 001-005-0001
        super().save(*args, **kwargs)

class Customer(models.Model):
    customer_id = models.AutoField(primary_key=True)
    customer_name = models.CharField(max_length=100)
    history = HistoricalRecords()

class Store(models.Model):
    store_id = models.AutoField(primary_key=True)
    store_name = models.CharField(max_length=100)
    history = HistoricalRecords()

class Purchase(models.Model):
    purchase_id = models.AutoField(primary_key=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    store = models.ForeignKey(Store, on_delete=models.CASCADE)
    purchase_date = models.DateTimeField(auto_now_add=True)
    history = HistoricalRecords()

class InvoiceRecord(models.Model):
    invoice_record_id = models.AutoField(primary_key=True)
    purchase = models.ForeignKey(Purchase, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    product_count = models.IntegerField()
    product_price = models.FloatField()
    history = HistoricalRecords()

class ProductPriceChange(models.Model):
    price_change_id = models.AutoField(primary_key=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    date_price_change = models.DateField()
    new_price = models.FloatField()
    history = HistoricalRecords()