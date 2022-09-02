from Dxf2Png import Dxf2Png

import subprocess
import os
import sys

def clearFolder(folderPath):
    for filename in os.listdir(folderPath):
        print(filename)
        os.remove(os.path.join(folderPath, filename))

def convertDwg(IN_DIR, OUT_DIR):
    if len(os.listdir(IN_DIR)) != 1:
        return None

    # ODA's exe location on Windows machine r'C:\Program Files\ODA\ODAFileConverter_title 22.7.0\ODAFileConverter.exe'
    subprocess.run([ r'C:\Program Files\ODA\ODAFileConverter_title 22.7.0\ODAFileConverter.exe', IN_DIR, OUT_DIR, "ACAD2018", "DXF", "0", "1"])
    # subprocess.run([ r'ODAFileConverter', IN_DIR, OUT_DIR, "ACAD2018", "DXF", "0", "1"])

    for filename in os.listdir(IN_DIR):
        converter = Dxf2Png()

        if filename.endswith(".dwg"):
            dxfFile = os.path.join(OUT_DIR, f'{os.path.splitext(filename)[0]}.dxf')
            pngFile = os.path.join(OUT_DIR, f'{os.path.splitext(filename)[0]}.png')
            converter.convert(dxfFile, pngFile)
            return pngFile