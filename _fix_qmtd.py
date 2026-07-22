from pathlib import Path
import re

chapters_dir = Path('stories/qu-min-tian-di')
chapter_files = sorted(chapters_dir.glob('ch*.md'))

entries = {}
for p in chapter_files:
    text = p.read_text(encoding='utf-8')
    lines = text.splitlines()
    title = ''
    body_lines = []
    for line in lines:
        if not title and line.startswith('# '):
            title = line.lstrip('# ').strip()
            continue
        if not line.startswith('![') and line.strip():
            body_lines.append(line)
    body = '<p></p>'.join(body_lines)
    n = int(re.search(r'ch(\d+)', p.stem).group(1))
    entries[n] = {'title': title or p.stem, 'body': body}

parts = []
for n in sorted(entries):
    e = entries[n]
    safe_title = e['title'].replace('\\', '\\\\').replace('"', '\\"')
    safe_body = e['body'].replace('\\', '\\\\').replace('"', '\\"')
    entry = str(n) + ':{title:"' + safe_title + '",body:`' + safe_body + '`}'
    parts.append(entry)
ch_js = ',\n    '.join(parts)

header = '''<header class="site-header">
  <div class="header-inner">
    <a class="back-link" href="../stories.html">← 故事目錄</a>
    <div>
      <div class="site-title">屈民天地</div>
      <div class="site-subtitle">屈民天地</div>
    </div>
    <div style="width:80px"></div>
  </div>
</header>'''

js = '''const chapters = {
    ''' + ch_js + '''
};
let currentChapter = 1;
function renderChapter(n){
  const ch = chapters[n];
  if (!ch) return;
  currentChapter = n;
  const bodyParts = ch.body.split('<p></p>');
  const bodyHtml = bodyParts.map(part => '<p>' + part + '</p>').join('');
  document.getElementById('chapterContent').innerHTML = '<div class="chapter-num">第' + ['','一','二','三','四','五','六','七','八','九','十','十一','十二','十三','十四','十五','十六','十七','十八','十九','二十'][n] + '章</div><h1 class="chapter-title">' + ch.title + '</h1><div class="chapter-body">' + bodyHtml + '</div>';
  const prev = n > 1 ? '<a href="#" data-ch="' + (n-1) + '">← 上一章</a>' : '';
  const next = n < Object.keys(chapters).length ? '<a href="#" data-ch="' + (n+1) + '">下一章 →</a>' : '';
  document.getElementById('chapterNav').innerHTML = prev + next || '<span></span>';
  document.querySelectorAll('#chapterNav a[data-ch]').forEach(function(a){ a.onclick = function(e){ e.preventDefault(); renderChapter(+a.dataset.ch); }; });
  window.scrollTo({top:0, behavior:'smooth'});
}
renderChapter(1);'''

html = '<!DOCTYPE html>\n<html lang="zh-Hant">\n<head>\n<meta charset="utf-8"/>\n<meta content="width=device-width, initial-scale=1.0" name="viewport"/>\n<title>屈民天地｜橘子園</title>\n<link rel="preconnect" href="https://fonts.googleapis.com"/>\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>\n<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;600;900&display=swap" rel="stylesheet"/>\n<style>\n  :root{--bg:#0a0806;--surface:#241e17;--surface2:#352c22;--text:#f5efe4;--text-dim:#d8cbb8;--accent:#e8c08a;--border:#5a4a38;--line:#4a3f33}\n  *{box-sizing:border-box;margin:0;padding:0}\n  html{scroll-behavior:smooth}\n  body{background:var(--bg);color:var(--text);font-family:"Noto Serif TC","Songti TC","PMingLiU",serif;line-height:1.95;min-height:100vh;display:flex;flex-direction:column}\n  .site-header{background:#f5ecda;border-bottom:1px solid #000;padding:28px 24px;color:#1a1510}\n  .header-inner{max-width:980px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:18px}\n  .site-title{font-size:42px;font-weight:800;letter-spacing:6px;color:#1a1510}\n  .site-subtitle{font-size:18px;color:#3d2610;letter-spacing:2px;font-weight:700;margin-top:4px}\n  .back-link{text-decoration:none;color:#6b4226;font-size:14px;letter-spacing:2px}\n  .container{max-width:760px;margin:0 auto;padding:44px 24px 40px;flex:1;width:100%}\n  .chapter-num{font-size:13px;color:var(--accent);letter-spacing:4px;margin-bottom:8px}\n  .chapter-title{font-size:32px;color:#faf4e4;margin-bottom:18px;font-weight:700;line-height:1.3}\n  .chapter-body p{color:#f5efe4;margin:0 0 14px}\n  .chapter-nav{display:flex;justify-content:space-between;gap:12px;margin-top:32px;padding-top:18px;border-top:1px dashed var(--line)}\n  .chapter-nav a{color:#e8c08a;text-decoration:none;font-size:14px;letter-spacing:1px}\n  .site-footer{background:#0a0806;border-top:1px solid #1a1510;padding:22px 20px;text-align:center;margin-top:40px;color:#6a5d4f;font-size:13px;letter-spacing:2px}\n  @media(max-width:640px){.container{padding:28px 18px}.site-title{font-size:30px}.chapter-title{font-size:24px}}\n</style>\n</head>\n<body>\n' + header + '\n<main class="container">\n  <div id="chapterContent"></div>\n  <div class="chapter-nav" id="chapterNav"></div>\n</main>\n<footer class="site-footer">QLand — 繁體中文小說平台</footer>\n<script>\n' + js + '\n</script>\n</body>\n</html>'

Path('qu-min-tian-di.html').write_text(html, encoding='utf-8')
print('rebuilt qu-min-tian-di.html clean, size=', len(html.encode('utf-8')))
