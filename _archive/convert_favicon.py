from PIL import Image
import os
import sys

# Accept command line argument or search for common names
if len(sys.argv) > 1:
    source_image = sys.argv[1]
else:
    # The source image path - update this to the actual path of the uploaded image
    source_paths = [
        "dububu-logo.png",
        "logo.png", 
        "favicon-source.png",
        "icon.png",
    ]
    
    source_image = None
    for path in source_paths:
        if os.path.exists(path):
            source_image = path
            break

if source_image is None or not os.path.exists(source_image):
    print("Usage: python convert_favicon.py <path_to_image>")
    print("Or save the image as 'dububu-logo.png' in the project root")
    sys.exit(1)

print(f"Using source image: {source_image}")

# Open the source image
img = Image.open(source_image)

# Convert to RGBA if necessary
if img.mode != 'RGBA':
    img = img.convert('RGBA')

# Create various sizes for the ICO file
sizes = [(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]
icons = []

for size in sizes:
    resized = img.copy()
    resized.thumbnail(size, Image.Resampling.LANCZOS)
    # Create a new image with exact size and paste the resized image centered
    icon = Image.new('RGBA', size, (0, 0, 0, 0))
    offset = ((size[0] - resized.width) // 2, (size[1] - resized.height) // 2)
    icon.paste(resized, offset)
    icons.append(icon)

# Save as ICO file with multiple sizes
icons[0].save(
    'public/favicon.ico',
    format='ICO',
    sizes=[(i.width, i.height) for i in icons],
    append_images=icons[1:]
)

# Also save as PNG for apple-touch-icon
apple_icon = img.copy()
apple_icon.thumbnail((180, 180), Image.Resampling.LANCZOS)
final_apple = Image.new('RGBA', (180, 180), (0, 0, 0, 0))
offset = ((180 - apple_icon.width) // 2, (180 - apple_icon.height) // 2)
final_apple.paste(apple_icon, offset)
final_apple.save('public/apple-touch-icon.png', format='PNG')

# Save as favicon-32x32.png
favicon_32 = img.copy()
favicon_32.thumbnail((32, 32), Image.Resampling.LANCZOS)
final_32 = Image.new('RGBA', (32, 32), (0, 0, 0, 0))
offset = ((32 - favicon_32.width) // 2, (32 - favicon_32.height) // 2)
final_32.paste(favicon_32, offset)
final_32.save('public/favicon-32x32.png', format='PNG')

# Save as favicon-16x16.png  
favicon_16 = img.copy()
favicon_16.thumbnail((16, 16), Image.Resampling.LANCZOS)
final_16 = Image.new('RGBA', (16, 16), (0, 0, 0, 0))
offset = ((16 - favicon_16.width) // 2, (16 - favicon_16.height) // 2)
final_16.paste(favicon_16, offset)
final_16.save('public/favicon-16x16.png', format='PNG')

# Also save in app directory for Next.js App Router
icons[1].save('app/favicon.ico', format='ICO')  # 32x32 single size for app dir

print("✅ Favicon files created successfully!")
print("   - public/favicon.ico (multi-size)")
print("   - public/apple-touch-icon.png (180x180)")
print("   - public/favicon-32x32.png")
print("   - public/favicon-16x16.png")
print("   - app/favicon.ico (32x32)")
