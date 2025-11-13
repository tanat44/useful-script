from matplotlib import pyplot as plt
import numpy as np
import cv2
from picamera2 import Picamera2
from libcamera import controls, Transform
import time

def create_camera(id: int):
    cam = Picamera2(id)
    cam.configure(cam.create_preview_configuration(main={"format": 'RGB888'}, transform=Transform(hflip=True)))
    cam.set_controls({'AfMode': controls.AfModeEnum.Continuous})
    cam.start()
    return cam

cv2.startWindowThread()
camL = create_camera(1)
camR = create_camera(0)
y_shift = -55
shift_matrix = np.float32([[1, 0, 0], [0, 1, y_shift]])
stereo = cv2.StereoBM.create(numDisparities=16, blockSize=15)

while True:
    # capture
    frameL = camL.capture_array()
    frameR = camR.capture_array()
    frameR = cv2.warpAffine(frameR, shift_matrix, (frameR.shape[1], frameR.shape[0]))

    # disparity
    frame_l_gray =  cv2.cvtColor(frameL, cv2.COLOR_BGR2GRAY)
    frame_r_gray =  cv2.cvtColor(frameR, cv2.COLOR_BGR2GRAY)
    disparity = stereo.compute(frame_l_gray,frame_r_gray).astype(np.float32)
    
    # display image
    w = 640
    h = 480
    row0 = np.concatenate((cv2.resize(frameL, (w,h)), cv2.resize(frameR, (w,h))), axis=1)
    row1 = np.concatenate((cv2.resize(frame_l_gray, (w,h)), cv2.resize(frame_r_gray, (w,h))), axis=1)
    row1 = cv2.cvtColor(row1, cv2.COLOR_GRAY2BGR)

    output = np.concatenate((row0, row1), axis=0)
    cv2.imshow('stereo camera', output)

    if cv2.waitKey(1) == ord('q'):
        break
 