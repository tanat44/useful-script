import cv2 as cv

from_id = 30
to_id = 40
pixel_per_cm = 2.8328
size_mm = 90
width = round(size_mm * pixel_per_cm)
dictionary = cv.aruco.getPredefinedDictionary(cv.aruco.DICT_6X6_250)

for i in range(from_id, to_id):
    marker_image = cv.aruco.generateImageMarker(dictionary, i, width)
    cv.imwrite(f'output/marker{i}.png', marker_image)
