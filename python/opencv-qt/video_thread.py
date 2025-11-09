from PyQt5.QtCore import pyqtSignal, QThread
import numpy as np
import cv2
import time
import time

class VideoThread(QThread):
    change_pixmap_signal = pyqtSignal(np.ndarray)

    def __init__(self):
        super().__init__()
        self.running = True
        self.playing = False
        time.sleep(2.0)
        
    def run(self):        
        while self.running:
            canvas = np.zeros((500, 500, 3), dtype="uint8")
            red = (0, 0, 255)
            cv2.line(canvas, (300, 0), (0, 300), red, 3)
            self.change_pixmap_signal.emit(canvas)
            while not self.playing:
                time.sleep(0.5)
            time.sleep(0.03)

    def stop(self):
        self.running = False
        self.playing = True
        self.wait()


    def resizeToFit(self, targetWidth, targetHeight, image):
        h, w, c = image.shape
        wRatio = targetWidth / w
        hRatio = targetHeight / h
        ratio = 1
        if wRatio < hRatio:
            ratio = wRatio
        else:
            ratio = hRatio
        image = cv2.resize(image, (int(ratio*w), int(ratio*h)), interpolation=cv2.INTER_AREA)
        h, w, c = image.shape
        vPad = targetHeight - h
        hPad = targetWidth - w
        return cv2.copyMakeBorder(image, 0, vPad, 0, hPad, borderType=cv2.BORDER_CONSTANT, value=[0,0,0])