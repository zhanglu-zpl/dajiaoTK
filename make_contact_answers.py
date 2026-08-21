from PIL import Image, ImageOps, ImageDraw
from pathlib import Path

ps = sorted(Path('assets/answers/aux-practice').glob('page-*.jpg'))
thumb = (275, 390)
imgs = [ImageOps.fit(Image.open(p).convert('RGB'), thumb) for p in ps]
cols = 4
rows = (len(imgs) + cols - 1) // cols
sheet = Image.new('RGB', (thumb[0] * cols, (thumb[1] + 28) * rows), (240, 240, 240))
d = ImageDraw.Draw(sheet)
for i, im in enumerate(imgs):
    x, y = (i % cols) * thumb[0], (i // cols) * (thumb[1] + 28)
    sheet.paste(im, (x, y))
    d.text((x + 8, y + thumb[1] + 6), ps[i].stem, fill=(20, 20, 20))
sheet.save('assets/answers/aux-practice/contact.jpg')
