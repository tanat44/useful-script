import sys
import numpy as np
import cv2 as cv
import json
from dataclasses import asdict

from fps_counter import FpsCounter
from data.markers import Marker, RecogMarkers
from data.vector3 import Vector3


# load camera param
data = np.load('../camera-calibrate/macairm2.npy', allow_pickle=True).item()
camera_matrix, dist_coefs = data['camera_matrix'], data['dist_coefs']

# marker
MARKER_LENGTH = 90  # mm
MARKER_POINTS = np.array([[-MARKER_LENGTH/2, MARKER_LENGTH/2, 0],
                          [MARKER_LENGTH/2, MARKER_LENGTH/2, 0],
                          [MARKER_LENGTH/2, -MARKER_LENGTH/2, 0],
                          [-MARKER_LENGTH/2, -MARKER_LENGTH/2, 0]])

# start
dictionary = cv.aruco.getPredefinedDictionary(cv.aruco.DICT_6X6_250)
detector_params = cv.aruco.DetectorParameters()
fps_counter = FpsCounter()

cap = cv.VideoCapture("video.mov")
if not cap.isOpened():
    print("Cannot open camera")
    exit()
fps = cap.get(cv.CAP_PROP_FPS);
frame_time = 1/fps
time = 0

while True:
    # Capture frame-by-frame
    ret, frame = cap.read()
    print(time)
    time += frame_time
    frame = cv.undistort(frame, camera_matrix, dist_coefs)
    fps = fps_counter.tick()
    cv.putText(frame, "{:.2f}".format(fps), np.array(
        [10, 30]), cv.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)

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

    markers = []

    for i in range(len(marker_corners)):
        corners = marker_corners[i]
        id = marker_ids[i][0].item()
        corners = marker_corners[0][0]
        success, rot, tran = cv.solvePnP(
            MARKER_POINTS, corners, camera_matrix, None)
        if not success:
            continue
        marker = Marker(id, tran.flatten(), rot.flatten(), 123.0)
        markers.append(marker)
        # rot = np.rad2deg(rot.flatten()).astype(np.int32)
        # tran = tran.flatten().astype(np.int32)
        # print(
        #     f'rot[{rot[0]} {rot[1]} {rot[2]}]\ttran[{tran[0]} {tran[1]} {tran[2]}]\tw{corners[0][0]-corners[1][0]}')

    recog_marker = RecogMarkers(time, markers)
    print(json.dumps(asdict(recog_marker)))

    cv.imshow('aruco playback', frame)

    if cv.waitKey(1) == ord('q'):
        break

# When everything done, release the capture
cap.release()
cv.destroyAllWindows()
