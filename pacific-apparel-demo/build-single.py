"""Bundle the demo pages into self-contained HTML files (CSS, JS and images inlined).

Usage: python3 build-single.py
Writes pacific-apparel-demo.html (home) and pacific-apparel-products.html (products)
next to this script; the two files link to each other when kept in the same folder.
Fonts and animation libraries still load from their CDNs, so an internet connection is needed.
"""
import base64
import pathlib
import re

root = pathlib.Path(__file__).parent
css = (root / "styles.css").read_text()
js = (root / "main.js").read_text()
pages = {"index.html": "pacific-apparel-demo.html", "products.html": "pacific-apparel-products.html"}


def inline_images(text):
    def repl(m):
        data = base64.b64encode((root / m.group(1)).read_bytes()).decode()
        return f"data:image/webp;base64,{data}"
    return re.sub(r"(img/[\w-]+\.webp)", repl, text)


for src, dest in pages.items():
    html = (root / src).read_text()
    html = html.replace('<link rel="stylesheet" href="styles.css">', f"<style>\n{css}\n</style>")
    html = html.replace('<script src="main.js"></script>', f"<script>\n{js}\n</script>")
    for page, bundled in pages.items():
        html = re.sub(rf'href="{re.escape(page)}', f'href="{bundled}', html)
    html = inline_images(html)
    out = root / dest
    out.write_text(html)
    print(f"wrote {out.name} ({out.stat().st_size / 1024 / 1024:.1f} MB)")
