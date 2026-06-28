from pathlib import Path
import re

base = Path('stories/qu-min-tian-di')
files = sorted(base.glob('ch*.md'))
idx = {}
for p in files:
    n = int(p.name.split('-',1)[0].replace('ch',''))
    text = p.read_text(encoding='utf-8').strip().splitlines()
    idx[n] = {'title': text[0].replace('# ', '').strip(), 'body': '\n'.join(text[1:]).strip()}

text = Path('qu-min-tian-di.html').read_text(encoding='utf-8')

entries = []
for i in range(1, max(idx)+1):
    body = idx[i]['body'].replace('\\', '\\\\').replace('`', chr(96)).replace('\n', '</p><p>')
    entries.append(f'  {i}: {{\n    title: "{idx[i]["title"]}",\n    body: `<p>{body}</p>`\n  }}')
new_chapters = '\n' + ',\n'.join(entries) + '\n'

# patch chapters object
start = text.find('const chapters = {')
end = text.find('};', start)
text = text[:start + len('const chapters = {')] + new_chapters + text[end:]

# patch numerals array
old = "['','一','二','三','四','五','六','七','八'][n]"
new = "['','一','二','三','四','五','六','七','八','九','十','十一','十二','十三','十四','十五','十六','十七','十八','十九','二十'][n]"
text = text.replace(old, new)
Path('qu-min-tian-di.html').write_text(text, encoding='utf-8')
print('patched to', max(idx), 'chs')
