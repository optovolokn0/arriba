from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import Group
from .models import Product, Category, Brand, User, Role, Basket, Purchase, Rating, ProductPriceChange, InvoiceRecord, Review

# Register your models here.
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('product_name', 'category', 'brand', 'seller', 'product_price', 'average_rating')
    search_fields = ('product_name',)
    list_filter = ('category', 'brand')
    def average_rating(self, obj):
        return obj.get_average_rating()

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('category_name',)

@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ('brand_name',)

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'role')
    search_fields = ('email',)
    list_filter = ('role',)

@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ('name',)

@admin.register(Basket)
class BasketAdmin(admin.ModelAdmin):
    list_display = ('user',)

@admin.register(Purchase)
class PurchaseAdmin(admin.ModelAdmin):
    list_display = ('purchase_date', 'customer', 'seller')

@admin.register(Rating)
class RatingAdmin(admin.ModelAdmin):
    list_display = ('user', 'product', 'rate')

@admin.register(ProductPriceChange)
class PriceChangeAdmin(admin.ModelAdmin):
    list_display = ('product', 'date_price_change', 'new_price')

@admin.register(InvoiceRecord)
class InvoiceEntryAdmin(admin.ModelAdmin):
    list_display = ('product', 'product_price', 'product_count')

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('user', 'product', 'created_at')