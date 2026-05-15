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


def do_nothing(value: int):
    pass


cv2.namedWindow('raw', cv2.WINDOW_NORMAL)
cv2.namedWindow('disparity', cv2.WINDOW_NORMAL)
cv2.resizeWindow('disparity', 900, 900)
cv2.createTrackbar('wls_lambda', 'disparity', 1, 100, do_nothing)
cv2.createTrackbar('wls_sigma_color', 'disparity', 16, 100, do_nothing)
cv2.createTrackbar('depth_min', 'disparity', 0, 255, do_nothing)
cv2.createTrackbar('depth_max', 'disparity', 111, 255, do_nothing)

camL = create_camera(1)
camR = create_camera(0)
disp_multiplier = 8
wsize = 17
left_matcher = cv2.StereoSGBM_create(
    minDisparity=0,
    numDisparities=16*disp_multiplier,
    blockSize=16,
    # P1=8 * 3 * 5**2,
    # P2=32 * 3 * 5**2,
    # disp12MaxDiff=1,
    # uniquenessRatio=15,
    # speckleWindowSize=0,
    # speckleRange=2,
    # preFilterCap=63,
    # mode=cv2.STEREO_SGBM_MODE_SGBM_3WAY
)
right_matcher = cv2.ximgproc.createRightMatcher(left_matcher)
w = 320
h = 240

# load calibration
data = np.load('../pi5-camera-tool/stereo.npy', allow_pickle=True).item()
Kl, Dl, Kr, Dr, R, T, img_size = data['Kl'], data['Dl'], data['Kr'], data['Dr'], \
    data['R'], data['T'], data['img_size']
R1, R2, P1, P2, Q, validRoi1, validRoi2 = cv2.stereoRectify(
    Kl, Dl, Kr, Dr, img_size, R, T)
xmap1, ymap1 = cv2.initUndistortRectifyMap(
    Kl, Dl, R1, P1, img_size, cv2.CV_32FC1)
xmap2, ymap2 = cv2.initUndistortRectifyMap(
    Kr, Dr, R2, P2, img_size, cv2.CV_32FC1)

while True:
    # capture
    frame_l = camL.capture_array()
    frame_l = cv2.remap(frame_l, xmap1, ymap1, cv2.INTER_LINEAR)
    frame_l = cv2.resize(frame_l, (w, h))
    frame_r = camR.capture_array()
    frame_r = cv2.remap(frame_r, xmap2, ymap2, cv2.INTER_LINEAR)
    frame_r = cv2.resize(frame_r, (w, h))

    # disparity
    left_disp = left_matcher.compute(
        frame_l, frame_r).astype(np.float32) / 16.0
    right_disp = right_matcher.compute(
        frame_r, frame_l).astype(np.float32) / 16.0
    wls_filter = cv2.ximgproc.createDisparityWLSFilter(left_matcher)
    wls_filter.setLambda(cv2.getTrackbarPos(
        'wls_lambda', 'disparity')*1000)    # 8000
    wls_filter.setSigmaColor(cv2.getTrackbarPos(
        'wls_sigma_color', 'disparity') * 0.1)   # 1.5
    filtered_disp = wls_filter.filter(
        left_disp, frame_l, disparity_map_right=right_disp)

    # display raw
    raw = np.hstack((frame_l, frame_r))
    cv2.imshow('raw', raw)

    # display disparity
    disp_gray = (filtered_disp).astype(np.uint8)
    min_depth = cv2.getTrackbarPos('depth_min', 'disparity')
    max_depth = cv2.getTrackbarPos('depth_max', 'disparity')
    disp_gray = np.clip(disp_gray, a_min=min_depth, a_max=max_depth)
    disp_color = cv2.applyColorMap(disp_gray, cv2.COLORMAP_JET)
    cv2.imshow('disparity', disp_color)

    if cv2.waitKey(1) == 27:
        break
