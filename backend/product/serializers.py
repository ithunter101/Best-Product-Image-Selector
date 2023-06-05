from rest_framework import serializers

from .models import ProductImage, Product


class ProductImageSerializer(serializers.ModelSerializer):
    url = serializers.CharField(required=True)

    class Meta:
        model = ProductImage
        fields = ('id', 'product_id', 'score', 'url')


class ProductSerializer(serializers.ModelSerializer):
    images = serializers.ListSerializer(child=ProductImageSerializer(read_only=True), read_only=True)

    class Meta:
        model = Product
        fields = ('id', 'keywords', 'image_count', 'images')


class FileUploadDataSerializer(serializers.Serializer):
    keywords = serializers.CharField(required=True)
    image_urls = serializers.ListSerializer(child=serializers.URLField())


class FileUploadSerializer(serializers.Serializer):
    file = serializers.FileField()
