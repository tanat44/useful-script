import sys
import numpy as np
import cv2 as cv
from qreader import QReader
 
# camera param
SENSOR_WIDTH = 2 #mm
PIXEL_WIDTH = 640
PIXEL_HEIGHT = 480
FOV_HORIZONTAL = 60 #degree
FMM = (SENSOR_WIDTH/2) / np.tan(np.deg2rad(FOV_HORIZONTAL/2))
FX = FMM / (SENSOR_WIDTH/PIXEL_WIDTH)  #focal length in pixel
INTRINSIC_MATRIX = np.array([[FX, 0, PIXEL_WIDTH/2],
                             [0, FX, PIXEL_HEIGHT/2],
                             [0, 0, 1]])

# qr code
QR_WIDTH = 60 #mm
QR_POINTS = np.array([[-QR_WIDTH/2, QR_WIDTH/2, 0],
                          [ QR_WIDTH/2, QR_WIDTH/2, 0],
                          [ QR_WIDTH/2, -QR_WIDTH/2, 0],
                          [-QR_WIDTH/2, -QR_WIDTH/2, 0]])

# start
qreader = QReader()
cap = cv.VideoCapture(0, cv.CAP_V4L2)
cap.set(cv.CAP_PROP_FOURCC, cv.VideoWriter_fourcc('M', 'J', 'P', 'G'))
cap.set(cv.CAP_PROP_FRAME_WIDTH, PIXEL_WIDTH)
cap.set(cv.CAP_PROP_FRAME_HEIGHT, PIXEL_HEIGHT)

if not cap.isOpened():
    print("Cannot open camera")
    exit()
while True:
    # Capture frame-by-frame
    ret, frame = cap.read()
    
    # if frame is read correctly ret is True
    if not ret:
        print("Can't receive frame (stream end?). Exiting ...")
        break
    results = qreader.detect(image=frame)

    for result in results:
        count = 0
        for center in result["quad_xy"]:
            color = (0,0,0)
            if count == 1:
                color = (0,0,255)
            elif count == 2:
                color = (0,255,0)
            elif count == 3:
                color = (255,0,0)
            count += 1
            cv.circle(frame, center.astype(np.int32), 5, color, -1)

        # perspective n point
        success, rot, tran = cv.solvePnP(QR_POINTS,
                                         result["quad_xy"].astype(np.float32),
                                         INTRINSIC_MATRIX,
                                         None)
        if success:
            rot = np.rad2deg(rot.flatten()).astype(np.int32)
            tran = tran.flatten().astype(np.int32)
            print(f'rot[{rot[0]} {rot[1]} {rot[2]}]\ttran[{tran[0]} {tran[1]} {tran[2]}]')
        
        # decode text
        text = qreader.decode(frame, result)
        if not text:
            continue
        top_left = result["quad_xy"][0].astype(np.int32)
        cv.putText(frame, text, top_left, cv.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)

    # flipped = cv.flip(frame, 1)
    cv.imshow('live qr reader', frame)

    if cv.waitKey(1) == ord('q'):
        break
 
# When everything done, release the capture
cap.release()
cv.destroyAllWindows()