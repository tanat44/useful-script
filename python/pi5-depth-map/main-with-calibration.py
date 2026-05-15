from matplotlib import pyplot as plt
import numpy as np
import cv2
from picamera2 import Picamera2
from libcamera import Transform

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
disparity_multiple = 7
block_size = 15
stereo = cv2.StereoSGBM.create(numDisparities=disparity_multiple * 16, blockSize=block_size)
w = 320
h = 240

# load calibration
data = np.load('../pi5-camera-tool/stereo.npy', allow_pickle=True).item()
Kl, Dl, Kr, Dr, R, T, img_size = data['Kl'], data['Dl'], data['Kr'], data['Dr'], \
                                 data['R'], data['T'], data['img_size']
R1, R2, P1, P2, Q, validRoi1, validRoi2 = cv2.stereoRectify(Kl, Dl, Kr, Dr, img_size, R, T)
xmap1, ymap1 = cv2.initUndistortRectifyMap(Kl, Dl, R1, P1, img_size, cv2.CV_32FC1)
xmap2, ymap2 = cv2.initUndistortRectifyMap(Kr, Dr, R2, P2, img_size, cv2.CV_32FC1)

while True:
    # capture
    frame_l = camL.capture_array()
    frame_l = cv2.remap(frame_l, xmap1, ymap1, cv2.INTER_LINEAR)
    frame_l = cv2.resize(frame_l, (w,h))
    frame_r = camR.capture_array()
    frame_r = cv2.remap(frame_r, xmap2, ymap2, cv2.INTER_LINEAR)
    frame_r = cv2.resize(frame_r, (w,h))

    # disparity
    frame_l_gray = cv2.cvtColor(frame_l, cv2.COLOR_BGR2GRAY)
    frame_r_gray = cv2.cvtColor(frame_r, cv2.COLOR_BGR2GRAY)
    disparity = stereo.compute(frame_l_gray, frame_r_gray).astype(np.float32)
    disparity = disparity / disparity_multiple

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

    if cv2.waitKey(1) == 27:
        break