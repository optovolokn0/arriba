from django.contrib import admin
from .models import Category, Manufacturer, Product, Customer, Store, Purchase, InvoiceRecord, ProductPriceChange
# Register your models here.
admin.site.register(Category)
admin.site.register(Manufacturer)
admin.site.register(Product)
admin.site.register(Customer)
admin.site.register(Store)
admin.site.register(Purchase)
admin.site.register(InvoiceRecord)
admin.site.register(ProductPriceChange)