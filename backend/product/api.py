import pandas as pd
from rest_framework import viewsets, generics, status, pagination
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError

from .serializers import ProductSerializer, ProductImageSerializer, FileUploadSerializer
from .models import ProductImage, Product

import cv2
import numpy as np
import pytesseract
import requests

class ProductPagination(pagination.PageNumberPagination):
    page_size = 8


class ProductViewSet(viewsets.ModelViewSet):
    pagination_class = ProductPagination
    serializer_class = ProductSerializer
    queryset = Product.objects.prefetch_related('images').order_by('id').all()


class ProductImageViewSet(viewsets.ModelViewSet):
    serializer_class = ProductImageSerializer
    queryset = ProductImage.objects.order_by('id').all()


class UploadFileView(generics.CreateAPIView):
    http_method_names = ['post']
    serializer_class = FileUploadSerializer
    MAX_ROWS = 1000  # Maximum allowed rows

    def get_queryset(self):
        return None

    def post(self, request, *args, **kwargs):
        # serializer = FileUploadSerializer(data=request.data)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        file = serializer.validated_data['file']
        reader = pd.read_csv(file)
        num_rows = len(reader)

        if num_rows > self.MAX_ROWS:
            raise ValidationError(f"Number of rows exceeds the maximum limit of {self.MAX_ROWS} - now {len(reader)}.")

        # Check if "Keywords" column exists
        if "Keywords" not in reader.columns:
            raise ValidationError("The 'Keywords' column is missing in the CSV file.")

        # Process each row and save to the database
        for i, row in reader.iterrows():
            # Create Product instance
            product_data = {
                'keywords': row['Keywords'],
                'image_count': row.count() - 1  # Subtract 1 to exclude 'Keywords' column
            }
            product_serializer = ProductSerializer(data=product_data)

            product_serializer.is_valid(raise_exception=True)
            product = product_serializer.save()

            # Create ProductImage instances
            images = []
            for j in range(1, len(row)):
                url = row[f'Image {j}']
                if url and not pd.isna(url):
                    image_data = {
                        'product_id': product.id,
                        'score': score_image(url),  # Leave it blank as per your requirement
                        'url': url
                    }
                    image_serializer = ProductImageSerializer(data=image_data)
                    image_serializer.is_valid(raise_exception=True)
                    image = image_serializer.save()
                    images.append(image)

            # Update the product's image relation
            product.images.set(images)
        return Response(
            {"message": "File uploaded successfully."},
            status=status.HTTP_201_CREATED,
            content_type="application/json"
        )
    

# Define the criteria check function
def check_criteria(image):
    try:
        # Check if there is only one object in the image
        contours, _ = cv2.findContours(cv2.cvtColor(image, cv2.COLOR_BGR2GRAY), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        if len(contours) > 1:
            return False
        
        # Check if the background is plain (ideally white)
        hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
        lower_white = np.array([0, 0, 200])
        upper_white = np.array([255, 30, 255])
        mask = cv2.inRange(hsv, lower_white, upper_white)
        res = cv2.bitwise_and(image, image, mask=mask)
        gray = cv2.cvtColor(res, cv2.COLOR_BGR2GRAY)
        _, thresh = cv2.threshold(gray, 1, 255, cv2.THRESH_BINARY)
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        if len(contours) > 1:
            return False
        
        # Check if there is any artificial text in the image
        # text = pytesseract.image_to_string(image)
        # print(text)
        # if text != '':
        #     return False
        
        return True
    except:
        return False

# Define the scoring function
def score_image(url):
    response = requests.get(url)
    arr = np.asarray(bytearray(response.content), dtype=np.uint8)
    image = cv2.imdecode(arr, -1)

    score = 0
    
    if check_criteria(image):
        score += 10
    else:
        score += 2
    
    return score