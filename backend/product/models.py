from django.db import models


# Create your models here.

class Product(models.Model):
    keywords = models.TextField(max_length=500)
    image_count = models.PositiveIntegerField(default=0, blank=True, null=False)


class ProductImage(models.Model):
    product = models.ForeignKey('Product',null=True, related_name='images', on_delete=models.SET_NULL)
    url = models.URLField(null=False, blank=False)
    score = models.IntegerField(null=False, blank=True, max_length=255, default=0)
