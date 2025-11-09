import threading
from queue import Queue, Empty
from qreader import QReader
import cv2
from result import Result
import time


class ReaderWorker(threading.Thread):
    count = 0

    def __init__(self, in_queue: Queue, out_queue: Queue):
        threading.Thread.__init__(self)
        self.in_queue = in_queue
        self.out_queue = out_queue
        self.id = ReaderWorker.count
        self.qreader = QReader()
        self.stop_event = threading.Event()
        ReaderWorker.count += 1

    def run(self):
        print(f'thread {self.id}: start')
        while not self.stop_event.is_set():
            try:
                job_id = self.in_queue.get(block=True, timeout=1)   # blocking operation
                time.sleep(1)
                # do actual work
                image = cv2.cvtColor(cv2.imread("../qr-reader/test.png"), cv2.COLOR_BGR2RGB)
                text = self.qreader.detect_and_decode(image=image)
                self.out_queue.put(Result(self.id, job_id, result = text))
            except Empty: 
                # queue.get will raise EmptyException when timeout
                pass
        print(f'thread {self.id}: end')

    def stop(self):
        self.stop_event.set()
        