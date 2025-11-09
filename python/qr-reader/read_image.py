from qreader import QReader
import cv2


# Create a QReader instance
qreader = QReader()

# Get the image that contains the QR code
image = cv2.cvtColor(cv2.imread("test.png"), cv2.COLOR_BGR2RGB)

# Use the detect_and_decode function to get the decoded QR data
result = qreader.detect(image=image)

print(result)