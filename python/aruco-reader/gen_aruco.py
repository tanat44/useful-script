import cv2 as cv

dictionary = cv.aruco.getPredefinedDictionary(cv.aruco.DICT_6X6_250)
marker_image = cv.aruco.generateImageMarker(dictionary, 44, 200)
cv.imwrite("marker44.png", marker_image)
