"""Bundle the demo into one self-contained HTML file (CSS, JS and images inlined).

Usage: python3 build-single.py  ->  writes pacific-apparel-demo.html next to this script.
Fonts and animation libraries still load from their CDNs, so an internet connection is needed.
"""
import base64
import pathlib
import re

root = pathlib.Path(__file__).parent
html = (root / "index.html").read_text()
css = (root / "styles.css").read_text()
js = (root / "main.js").read_text()


def inline_images(text):
    def repl(m):
        path = root / m.group(1)
        data = base64.b64encode(path.read_bytes()).decode()
        return f"data:image/webp;base64,{data}"
    return re.sub(r"(img/[\w-]+\.webp)", repl, text)


html = html.replace('<link rel="stylesheet" href="styles.css">', f"<style>\n{css}\n</style>")
html = html.replace('<script src="main.js"></script>', f"<script>\n{js}\n</script>")
html = inline_images(html)

out = root / "pacific-apparel-demo.html"
out.write_text(html)
print(f"wrote {out} ({out.stat().st_size / 1024 / 1024:.1f} MB)")
