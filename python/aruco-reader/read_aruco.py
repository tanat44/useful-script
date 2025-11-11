import sys
import numpy as np
import cv2 as cv
from fps_counter import FpsCounter
 
# camera param
SENSOR_WIDTH = 2 #mm
PIXEL_WIDTH = 1920
PIXEL_HEIGHT = 1080
FOV_HORIZONTAL = 60 #degree
FMM = (SENSOR_WIDTH/2) / np.tan(np.deg2rad(FOV_HORIZONTAL/2))
FX = FMM / (SENSOR_WIDTH/PIXEL_WIDTH)  #focal length in pixel
INTRINSIC_MATRIX = np.array([[FX, 0, PIXEL_WIDTH/2],
                             [0, FX, PIXEL_HEIGHT/2],
                             [0, 0, 1]])

# marker
MARKER_LENGTH = 60 #mm
MARKER_POINTS = np.array([[-MARKER_LENGTH/2, MARKER_LENGTH/2, 0],
                          [ MARKER_LENGTH/2, MARKER_LENGTH/2, 0],
                          [ MARKER_LENGTH/2, -MARKER_LENGTH/2, 0],
                          [-MARKER_LENGTH/2, -MARKER_LENGTH/2, 0]])

# start
cap = cv.VideoCapture(0, cv.CAP_V4L2)
cap.set(cv.CAP_PROP_FOURCC, cv.VideoWriter_fourcc('M', 'J', 'P', 'G'))
cap.set(cv.CAP_PROP_FRAME_WIDTH, PIXEL_WIDTH)
cap.set(cv.CAP_PROP_FRAME_HEIGHT, PIXEL_HEIGHT)
dictionary = cv.aruco.getPredefinedDictionary(cv.aruco.DICT_6X6_250)
detector_params = cv.aruco.DetectorParameters()
fps_counter = FpsCounter()

if not cap.isOpened():
    print("Cannot open camera")
    exit()

while True:
    # Capture frame-by-frame
    ret, frame = cap.read()
    fps = fps_counter.tick()
    cv.putText(frame, "{:.2f}".format(fps), np.array([10,30]), cv.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)
    
    # if frame is read correctly ret is True
    if not ret:
        print("Can't receive frame (stream end?). Exiting ...")
        break
    
    # aruco detection
    detector = cv.aruco.ArucoDetector(dictionary, detector_params)
    results = detector.detectMarkers(frame)
    marker_corners = results[0]
    marker_ids = results[1]
    cv.aruco.drawDetectedMarkers(frame, marker_corners, marker_ids)

    if len(marker_corners) == 1:
      # perspective n point
      corners = marker_corners[0][0]
      success, rot, tran = cv.solvePnP(MARKER_POINTS, corners, INTRINSIC_MATRIX, None)
      if success:
          rot = np.rad2deg(rot.flatten()).astype(np.int32)
          tran = tran.flatten().astype(np.int32)
          print(f'rot[{rot[0]} {rot[1]} {rot[2]}]\ttran[{tran[0]} {tran[1]} {tran[2]}]\tw{corners[0][0]-corners[1][0]}')

    cv.imshow('live aruco reader', frame)

    if cv.waitKey(1) == ord('q'):
        break
 
# When everything done, release the capture
cap.release()
cv.destroyAllWindows()