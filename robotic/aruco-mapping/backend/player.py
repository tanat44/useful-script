import sys
import numpy as np
import cv2 as cv
import json
from dataclasses import asdict
from time import sleep
from multiprocessing import Queue
from enum import Enum
from data.markers import Marker, RecogMarkers
from data.vector3 import Vector3
from mqttclient import connect_mqtt

# load camera param
data = np.load('../../../python/camera-calibrate/macairm2.npy', allow_pickle=True).item()
camera_matrix, dist_coefs = data['camera_matrix'], data['dist_coefs']

# marker
MARKER_LENGTH = 90  # mm
MARKER_POINTS = np.array([[-MARKER_LENGTH/2, MARKER_LENGTH/2, 0],
                          [MARKER_LENGTH/2, MARKER_LENGTH/2, 0],
                          [MARKER_LENGTH/2, -MARKER_LENGTH/2, 0],
                          [-MARKER_LENGTH/2, -MARKER_LENGTH/2, 0]])
dictionary = cv.aruco.getPredefinedDictionary(cv.aruco.DICT_6X6_250)
detector_params = cv.aruco.DetectorParameters()

def start_player(q: Queue):
    cap = None
    frame_time = 0
    video_time = 0
    pausing = True
    client = connect_mqtt("player")

    while True:
        # read ipc command
        if not q.empty():
            command = q.get()
            if command == PlayerCommand.START or command == PlayerCommand.LIVE:
                if command == PlayerCommand.START:
                    cap = cv.VideoCapture("video.mov")
                else:
                    cap = cv.VideoCapture(1)
                fps = cap.get(cv.CAP_PROP_FPS)
                frame_time = 1/fps
                pausing = False
                video_time = 0
            elif command == PlayerCommand.PAUSE:
                pausing = True
            elif command == PlayerCommand.UNPAUSE:
                pausing = False
            

        if pausing or not cap.isOpened():
            sleep(0.2)
            continue

        # Capture frame-by-frame
        ret, frame = cap.read()
        if not ret:
            pausing = True
            continue

        video_time += frame_time
        frame = cv.undistort(frame, camera_matrix, dist_coefs)
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
            marker = Marker(id, tran.flatten()/1000, rot.flatten(), 123.0)
            markers.append(marker)

        recog_marker = RecogMarkers(video_time, markers)
        payload = json.dumps(asdict(recog_marker))
        client.publish("player/aruco", payload=payload, qos=0)  # qos = 0 fire and forget
        cv.imshow("player", frame)
    
    cap.release()

class PlayerCommand(Enum):
    LIVE="live"
    START='start'
    PAUSE='pause'
    UNPAUSE='unpause'