from django.contrib import admin

from .models import Product, ProductImage

admin.site.register(Product, admin.ModelAdmin)
admin.site.register(ProductImage, admin.ModelAdmin)
