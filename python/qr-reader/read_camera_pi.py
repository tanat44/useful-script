import numpy as np
from qreader import QReader
import cv2
from picamera2 import Picamera2


# Create a QReader instance
qreader = QReader()

cv2.startWindowThread()
picam2 = Picamera2()
picam2.configure(picam2.create_preview_configuration(main={"format": 'RGB888', "size": (640, 480)}))
picam2.start()

while True:
    picam2.autofocus_cycle()
    frame = picam2.capture_array()
    results = qreader.detect(image=frame)

    for result in results:
        for center in result["quad_xy"]:

            cv2.circle(frame, center.astype(np.int32), 5, (0,0,255), -1)
        text = qreader.decode(frame, result)
        if not text:
            continue

        top_left = result["quad_xy"][0].astype(np.int32)
        cv2.putText(frame, text, top_left, cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)

    # flipped = cv2.flip(frame, 1)
    cv2.imshow('live qr reader', frame)

    if cv2.waitKey(1) == ord('q'):
        break
 