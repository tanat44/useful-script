import numpy as np
import cv2 as cv
from qreader import QReader
 
 # Create a QReader instance
qreader = QReader()

cap = cv.VideoCapture(1)
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
        for center in result["quad_xy"]:

            cv.circle(frame, center.astype(np.int32), 5, (0,0,255), -1)
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