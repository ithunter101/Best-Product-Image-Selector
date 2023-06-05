import cv2
import os
import numpy as np
import pytesseract
import requests
import csv
import re

# Define the criteria check function
def check_criteria(image):
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
    text = pytesseract.image_to_string(image) + 'asdf'
    new_text = re.sub(r'\w+', '', text)
    print(new_text)
    if new_text != 'asdf':
        return False
    
    return True

# Define the scoring function
def score_image(image):
    score = 0
    
    if check_criteria(image):
        score += 10
    else:
        score += 2
    
    return score

# Define the function to select the best image
def select_best_image(image_urls):
    images = []
    for url in image_urls:
        response = requests.get(url)
        arr = np.asarray(bytearray(response.content), dtype=np.uint8)
        image = cv2.imdecode(arr, -1)
        images.append(image)
    
    best_image = None
    best_score = -1
    
    for i in range(len(images)):
        image = images[i]
        score = score_image(image)
        print(str(i + 1) + ": " + str(score))
        
        if score > best_score:
            best_score = score
            best_image = image
    
    return best_image

# Call the function with the path to the directory containing the images
image_urls = [
    # "https://ae01.alicdn.com/kf/Hba29f0bbb22f45908fc27f76ec49ff1fB.jpg_960x960.jpg",
    # "https://ae01.alicdn.com/kf/H48110e6ed14d46dc9b3eda7ca23cb851n.jpg_960x960.jpg",
    # "https://ae01.alicdn.com/kf/Hb03e472ae3214b8aa0388845ef211075q.jpg_960x960.jpg",
    # "https://ae01.alicdn.com/kf/Hd6a2f26c393c45e88779c066aea9c1edi.jpg_960x960.jpg",
    # "https://ae01.alicdn.com/kf/H51a438d092e045519227fdb651affd43n.jpg_960x960.jpg",
    # "https://ae01.alicdn.com/kf/H659d013ca884471f81f570eab81049b6Q.jpg_960x960.jpg",
    # "https://ae01.alicdn.com/kf/S2ea528a2945f48a7bd3672e9a4f8e2377.jpg_960x960.jpg",
    "https://ae01.alicdn.com/kf/S76cc9e124f40418a9f12b748c6161120f.jpg_960x960.jpg",
    # "https://ae01.alicdn.com/kf/S8b184b79d66a46d08fc5851cfe9379c65.jpg_960x960.jpg",
    # "https://ae01.alicdn.com/kf/Sf587dad3dcb64832bb7f9056567efa88A.jpg_960x960.jpg",
    # "https://ae01.alicdn.com/kf/Sdbf29e1e6f37427dad924162973293bf6.jpg_960x960.jpg",
    # "https://ae01.alicdn.com/kf/S3282e2b9758a4f08ae8658670a7c25a0f.jpg_960x960.jpg"
]
best_image = select_best_image(image_urls)
# text = pytesseract.image_to_string(best_image)
# print(text)

# Display the best image
# cv2.imshow("Best Image", best_image)
# cv2.waitKey(0)
# cv2.destroyAllWindows()
