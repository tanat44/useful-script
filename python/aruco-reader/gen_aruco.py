import cv2 as cv

MARKER_ID = 23

dictionary = cv.aruco.getPredefinedDictionary(cv.aruco.DICT_6X6_250)
marker_image = cv.aruco.generateImageMarker(dictionary, MARKER_ID, 200)
cv.imwrite(f'marker{MARKER_ID}.png', marker_image)
