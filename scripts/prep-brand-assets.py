"""Cut web images out of the client's brand files into public/images."""
import io
import os
import sys

import pypdf
from PIL import Image

root = sys.argv[1]
src = os.path.join(root, "docs", "company", "source")
out = os.path.join(root, "public", "images")
os.makedirs(out, exist_ok=True)


def find(prefix):
    return os.path.join(src, next(f for f in os.listdir(src) if f.startswith(prefix)))


def page_image(pdf_prefix, index):
    reader = pypdf.PdfReader(find(pdf_prefix))
    img = max(reader.pages[index].images, key=lambda x: len(x.data))
    return Image.open(io.BytesIO(img.data)).convert("RGB")


def save_jpg(im, name, width):
    im = im.copy()
    if im.width > width:
        im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    im.save(os.path.join(out, name), "JPEG", quality=84, optimize=True, progressive=True)


# --- logo: split the vertical lockup into mark + wordmark, then build a horizontal one
logo = Image.open(find("Logo_")).convert("RGBA")
alpha = logo.split()[3]
w, h = logo.size
# find the empty band between mark and wordmark
rows = [any(alpha.getpixel((x, y)) > 20 for x in range(0, w, 4)) for y in range(h)]
gap_start = None
for y in range(int(h * 0.4), int(h * 0.7)):
    if not rows[y]:
        gap_start = y
        break
mark = logo.crop((0, 0, w, gap_start))
mark = mark.crop(mark.getbbox())
word = logo.crop((0, gap_start, w, h))
word = word.crop(word.getbbox())
mark.save(os.path.join(out, "logo-mark.png"))
logo.crop(logo.getbbox()).save(os.path.join(out, "logo-vertical.png"))

target_h = word.height
mark_s = mark.resize((round(mark.width * target_h / mark.height), target_h), Image.LANCZOS)
gap = round(target_h * 0.12)
horiz = Image.new("RGBA", (mark_s.width + gap + word.width, target_h), (0, 0, 0, 0))
horiz.paste(mark_s, (0, 0), mark_s)
horiz.paste(word, (mark_s.width + gap, 0), word)
horiz = horiz.resize((900, round(horiz.height * 900 / horiz.width)), Image.LANCZOS)
horiz.save(os.path.join(out, "logo-horizontal.png"), optimize=True)

# white variant for the navy footer: navy strokes become white, yellow stays
px = horiz.load()
white = horiz.copy()
wpx = white.load()
for y in range(horiz.height):
    for x in range(horiz.width):
        r, g, b, a = px[x, y]
        if a and b > r + 40:  # blue-ish pixel
            wpx[x, y] = (255, 255, 255, a)
white.save(os.path.join(out, "logo-horizontal-white.png"), optimize=True)

# --- photos
cover = Image.open(find("COVER_")).convert("RGB")
save_jpg(cover, "cover.jpg", 2400)

facade = page_image("PH", 0)
save_jpg(facade, "facade.jpg", 1800)
for i, name in [(2, "interior-pharmacy.jpg"), (8, "interior-waiting.jpg"), (3, "interior-reception.jpg"), (7, "interior-exam-room.jpg")]:
    save_jpg(page_image("PH", i), name, 1400)

book_p1 = page_image("SO", 0)
save_jpg(book_p1.crop((1078, 300, 1900, 1060)), "family.jpg", 1000)
book_p8 = page_image("SO", 6)
save_jpg(book_p8.crop((0, 640, 990, 1405)), "screening.jpg", 1000)
book_p9 = page_image("SO", 8)
save_jpg(book_p9.crop((1001, 0, 1981, 1060)), "doctor-do-van-tam.jpg", 900)

print("ok", sorted(os.listdir(out)))
