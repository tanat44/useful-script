from matplotlib import pyplot as plt
import numpy as np
import cv2
from picamera2 import Picamera2
from libcamera import controls, Transform
import time


def create_camera(id: int):
    cam = Picamera2(id)
    cam.configure(cam.create_preview_configuration(
        main={"format": 'RGB888'}, transform=Transform(hflip=False)))
    # AfMode: 0=manual, 1=auto, 2=continuous
    # LensPosition: 0-15 (0 is infinite, 15 is closest)
    cam.set_controls({'AfMode': 0, 'LensPosition': 2})
    cam.start()
    return cam

cv2.startWindowThread()
camL = create_camera(1)
camR = create_camera(0)
stereo = cv2.StereoBM.create(numDisparities=16, blockSize=15)
w = 640
h = 480

while True:
    # capture
    frame_l = camL.capture_array()
    frame_l = cv2.resize(frame_l, (w,h))
    frame_r = camR.capture_array()
    frame_r = cv2.resize(frame_r, (w,h))

    # disparity
    frame_l_gray = cv2.cvtColor(frame_l, cv2.COLOR_BGR2GRAY)
    frame_r_gray = cv2.cvtColor(frame_r, cv2.COLOR_BGR2GRAY)
    disparity = stereo.compute(frame_l_gray, frame_r_gray).astype(np.float32)
    disparity = cv2.resize(disparity, (w, h))

    # display raw
    row_0 = np.hstack((frame_l, frame_r))
    row_1 = np.hstack((frame_l_gray, frame_r_gray))
    row_1 = cv2.cvtColor(row_1, cv2.COLOR_GRAY2BGR)
    output = np.vstack((row_0, row_1))

    # display disparity
    disparity_col = np.zeros((np.size(output,0), w, 3), np.uint8)
    disparity_col[0:h,0:w] = cv2.cvtColor(disparity, cv2.COLOR_GRAY2BGR)
    output = np.hstack((output, disparity_col))
    cv2.imshow('stereo camera', output)

    if cv2.waitKey(1) == ord('q'):
        break