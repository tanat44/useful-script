from pathlib import Path
import os
from shutil import copyfile

outputFolder = 'C:/Users/tanat/Desktop/Autolandmark project/LandmarksProject/Input/images'

images = []
for path in Path(outputFolder).rglob('diff.png'):
    images.append(path)

for i in images:
    dir = os.path.dirname(i)
    cam = os.path.basename(os.path.normpath(dir))
    imagePath = str(i)
    outputFilePath = os.path.join(outputFolder, cam + '.png')
    copyfile(imagePath, outputFilePath)