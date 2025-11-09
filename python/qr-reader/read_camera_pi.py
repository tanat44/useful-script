import numpy as np
from qreader import QReader
import cv2
from picamera2 import Picamera2
from libcamera import controls
import time


# Create a QReader instance
qreader = QReader()

cv2.startWindowThread()
picam2 = Picamera2()
picam2.configure(picam2.create_preview_configuration(main={"format": 'RGB888'}))
picam2.set_controls({'AfMode': controls.AfModeEnum.Continuous})
picam2.start()
current_time = time.time()
sum_frame = 0
sum_fps = 0

while True:
    # capture
    frame = picam2.capture_array()

    # detect qr
    results = qreader.detect(image=frame)
    for result in results:
        for center in result["quad_xy"]:

            cv2.circle(frame, center.astype(np.int32), 5, (0,0,255), -1)
        text = qreader.decode(frame, result)
        if not text:
            continue

        top_left = result["quad_xy"][0].astype(np.int32)
        cv2.putText(frame, text, top_left, cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)

    # calculate fps
    frame_time = time.time() - current_time
    current_time = time.time()
    fps = 1 / frame_time
    sum_fps += fps
    sum_frame += 1
    avr_fps = sum_fps/sum_frame
    fps_string = 'fps: ' + "{:.2f}".format(fps) + ", avr: " + "{:.2f}".format(avr_fps)
    cv2.putText(frame, fps_string, [10,30], cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 1)

    # display image
    cv2.imshow('live qr reader', frame)
    if cv2.waitKey(1) == ord('q'):
        break
 