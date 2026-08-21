from PIL import Image, ImageOps, ImageDraw
from pathlib import Path

ps = sorted(Path('assets/questions/aux-practice').glob('page-*.jpg'))
thumb = (275, 390)
imgs = [ImageOps.fit(Image.open(p).convert('RGB'), thumb) for p in ps]
sheet = Image.new('RGB', (thumb[0] * 4, (thumb[1] + 28) * 4), (240, 240, 240))
d = ImageDraw.Draw(sheet)
for i, im in enumerate(imgs):
    x, y = (i % 4) * thumb[0], (i // 4) * (thumb[1] + 28)
    sheet.paste(im, (x, y))
    d.text((x + 8, y + thumb[1] + 6), ps[i].stem, fill=(20, 20, 20))
sheet.save('assets/questions/aux-practice/contact.jpg')
