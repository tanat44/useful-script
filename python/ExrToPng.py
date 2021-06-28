import numpy as np
import cv2

def exrToPng(pathIn, pathOut):
    print(f'Converting {pathIn}')
    im=cv2.imread(str(pathIn),-1)
    im=im*65535
    im[im>65535]=65535
    im=np.uint16(im)
    cv2.imwrite(pathOut,im)

from pathlib import Path
import os

exrs = []
for path in Path('C:/Users/tanat/Desktop/TestFace/photos_sh').rglob('*.exr'):
    exrs.append(path)

for f in exrs:
    dir = os.path.dirname(f)
    name = os.path.basename(f)
    newName = name.replace(".exr", ".png")
    newPath = os.path.join(dir, newName)
    exrToPng(f, newPath)