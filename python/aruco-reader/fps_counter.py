import time

class FpsCounter():
    def __init__(self):
        self._prev_time = time.time()
        self._fps = 0.0

    def tick(self) -> float:
        delta_time = time.time() - self._prev_time
        fps = 1.0 / delta_time
        self._prev_time = time.time()
        return fps
