from pathlib import Path
import re

STORY = Path('stories/memory-shape')
OUT = Path('memory-shape.html')

files = sorted(STORY.glob('ch*.md'))
idx = {}
for p in files:
    n = int(re.search(r'ch(\d+)', p.stem).group(1))
    lines = p.read_text(encoding='utf-8').splitlines()
    idx[n] = {
        'title': lines[0].replace('# ', '').strip(),
        'body': '<p>' + '</p><p>'.join(line.rstrip() for line in lines[1:] if line.strip()) + '</p>'
    }
max_n = max(idx)
cn = ['','一','二','三','四','五','六','七','八','九','十','十一','十二','十三','十四','十五','十六','十七','十八','十九','二十']

rows = []
for i in range(1, max_n+1):
    body = idx[i]['body'].replace('\\', '\\\\').replace('`', chr(96))
    rows.append(
        f"  {i}: " + "{\n" +
        f'    title: "{idx[i]["title"]}",\n' +
        f'    body: `{body}`\n' + "  }"
    )
js = 'const chapters = {\n' + ',\n'.join(rows) + '\n};'
nav = ''.join(cn[:max_n+1])

tmpl = (Path('memory-shape.html').read_text(encoding='utf-8'))
start = tmpl.index('\n<script id="chapters-js"')
end = tmpl.index('\n</script>', start) + len('\n</script>')
new_script = '\n<script id="chapters-js" type="text/template">\n' + js + '\n</script>\n'
# rebuild full
html_end = tmpl[end:]
html = tmpl[:start] + new_script + html_end
OUT.write_text(html, encoding='utf-8')
print('updated', max_n, 'chapters', end='', sep=' ')
