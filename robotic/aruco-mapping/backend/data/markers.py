import numpy as np
from dataclasses import dataclass, asdict
from data.vector3 import Vector3

@dataclass
class Marker:
  id: int
  pos: Vector3
  rot: Vector3
  size: float

  def __init__(self, id: int, pos: np.ndarray, rot: np.ndarray, size: float):
    self.id = id
    self.pos = Vector3(pos)
    self.rot = Vector3(rot)
    self.size = size


@dataclass
class RecogMarkers:
  time: float
  markers: array.array(Marker)

  def __init__(self, time: float, markers: array.array(Marker)):
    self.time = time
    self.markers = markers