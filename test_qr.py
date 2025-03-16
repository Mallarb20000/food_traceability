import qrcode
from PIL import Image

# Data to encode in the QR code
data = "http://127.0.0.1:8000/api/food-items/1"

# Generate QR code
qr = qrcode.QRCode(
    version=1,  # Controls size (1-40)
    error_correction=qrcode.constants.ERROR_CORRECT_L,  # Error correction level
    box_size=10,  # Size of each box in pixels
    border=4,  # Border thickness
)
qr.add_data(data)
qr.make(fit=True)

# Create an image from the QR code
img = qr.make_image(fill_color="black", back_color="white")

# Save the image
img.save("test_qr.png")
print("QR code saved as test_qr.png")