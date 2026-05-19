import numpy as np
from dataclasses import dataclass, asdict

@dataclass
class Vector3:
  x: float
  y: float
  z: float

  def __init__(self, np_array: np.ndarray):
    self.x = np_array[0].item()
    self.y = np_array[2].item()
    self.z = np_array[1].item()
