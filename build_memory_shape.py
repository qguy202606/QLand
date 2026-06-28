from pathlib import Path

BASE = Path('stories/memory-shape')
files = sorted(BASE.glob('ch*.md'))

idx = {}
for p in files:
    n = int(p.name.split('-', 1)[0].replace('ch', ''))
    lines = p.read_text(encoding='utf-8').strip().splitlines()
    idx[n] = {
        'title': lines[0].replace('# ', '').strip(),
        'body': '\n'.join(lines[1:]).strip()
    }

max_n = max(idx)
cn = [
    '', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十',
    '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
    '二十一', '二十二', '二十三', '二十四', '二十五', '二十六', '二十七', '二十八', '二十九', '三十'
]

entries = []
for i in range(1, max_n + 1):
    body = idx[i]['body'].replace('\\', '\\\\').replace('\n', '</p><p>')
    # 用單引號避免 triple double-quote 衝突
    entries.append("  {}: ".format(i) + "{\n" +
                   '    title: "{}",\n'.format(idx[i]['title']) +
                   '    body: `<p>{}</p>`\n  '.format(body))
js = 'const chapters = {\n' + ',\n'.join(entries) + '\n};'
nav_digits = str(cn[:max_n + 1]).replace("'", '"')

# 用 list append，不用任何 triple string
P = []
P.append("<!DOCTYPE html>")
P.append('<html lang="zh-Hant">')
P.append("<head>")
P.append('<meta charset="UTF-8">')
P.append('<meta name="viewport" content="width=device-width, initial-scale=1.0">')
P.append("<title>未寄出的明信片 — QLand</title>")
P.append("<style>")
P.append("  :root{--bg:#0b0a10;--text:#e4d8c4;--text-dim:#a89a82;--accent:#d4a574;--border:#2a2420}")
P.append("  *{box-sizing:border-box;margin:0;padding:0}")
P.append("  html{scroll-behavior:smooth}")
P.append("  body{background:var(--bg);color:var(--text);font-family:\"Noto Serif TC\",\"Songti TC\",\"PMingLiU\",serif;line-height:1.9;min-height:100vh;display:flex;flex-direction:column}")
P.append("  .site-header{background:linear-gradient(180deg,#f5ecda 0%,#eadcbe 100%);border-bottom:1px solid #dbcdb0;padding:32px 24px}")
P.append("  .header-inner{max-width:960px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:24px}")
P.append("  .back-link{color:#5a4638;text-decoration:none;font-size:20px;letter-spacing:2px;font-weight:700;flex-shrink:0;transition:opacity .2s}")
P.append("  .back-link:hover{opacity:.65}")
P.append("  .title-group{text-align:center;flex:1;min-width:0}")
P.append("  .site-title{font-size:38px;font-weight:800;color:#2a1008;letter-spacing:6px;line-height:1.2}")
P.append("  .site-subtitle{font-size:17px;color:#3e2212;letter-spacing:3px;font-weight:700;margin-top:6px}")
P.append("  .header-spacer{width:120px;flex-shrink:0}")
P.append("  .container{max-width:760px;margin:0 auto;padding:44px 28px 32px;flex:1;width:100%}")
P.append("  .chapter-num{font-size:19px;color:#c8a878;letter-spacing:4px;margin-bottom:10px;opacity:1}")
P.append("  .chapter-title{font-size:30px;font-weight:500;color:#f1e4cc;letter-spacing:3px;margin-bottom:28px;padding-bottom:14px;border-bottom:1px dashed #2a2420}")
P.append("  .chapter-body p{margin-bottom:18px;font-size:19px;text-align:justify;text-indent:2em;color:#efe3c8;line-height:1.95}")
P.append("  .chapter-body p:first-child{text-indent:0}")
P.append("  .chapter-body p:last-child{margin-bottom:0}")
P.append("  .chapter-nav{margin-top:44px;padding-top:24px;border-top:1px solid #2a2420;display:flex;justify-content:space-between;gap:18px}")
P.append("  .chapter-nav a{flex:1;max-width:220px;text-align:center;padding:14px 16px;background:#0c0a08;border:1.5px solid #4a3c2f;color:#ddd6c4;text-decoration:none;font-size:15px;letter-spacing:4px;transition:all .25s}")
P.append("  .chapter-nav a:hover{border-color:#7a6d5a;color:#fff;background:#14110d}")
P.append("  .chapter-nav .disabled{opacity:.25;pointer-events:none;color:#777}")
P.append("  .site-footer{background:#0c0a08;border-top:1px solid #1f1b16;padding:22px 20px;text-align:center}")
P.append("  .footer-text{color:#b8a88a;font-size:13px;letter-spacing:2px;opacity:1}")
P.append("  @media(max-width:600px){.container{padding:26px 18px}.chapter-title{font-size:22px}}")
P.append("</style>")
P.append("</head>")
P.append("<body>")
P.append('<header class="site-header">')
P.append('  <div class="header-inner">')
P.append('    <a class="back-link" href="/QLand/">← 故事目錄</a>')
P.append('    <div class="title-group">')
P.append('      <div class="site-title">未寄出的明信片</div>')
P.append('      <div class="site-subtitle">memory shape</div>')
P.append('    </div>')
P.append('    <div class="header-spacer"></div>')
P.append('  </div>')
P.append('</header>')
P.append('<div class="container">')
P.append('  <div id="chapterContent"></div>')
P.append('  <div class="chapter-nav" id="chapterNav"></div>')
P.append('</div>')
P.append('<footer class="site-footer">')
P.append('  <div class="footer-text">QLand — 繁體中文小說平台</div>')
P.append('</footer>')
P.append("<script>")
P.append(js)
P.append("let currentChapter = 1;")
P.append("function renderChapter(n){")
P.append("  const ch = chapters[n];")
P.append("  if (!ch) return;")
P.append("  currentChapter = n;")
P.append('  document.getElementById("chapterContent").innerHTML = `<div class="chapter-num">第` + nav_digits + `[n]` + '}</div><h1 class="chapter-title">${ch.title}</h1><div class="chapter-body">${ch.body}</div>`;')
P.append('  const prev = n > 1 ? `<a href="#" data-ch="${n-1}">← 上一章</a>` : "";')
P.append('  const next = n < Object.keys(chapters).length ? `<a href="#" data-ch="${n+1}">下一章 →</a>` : "";')
P.append("  document.getElementById('chapterNav').innerHTML = prev + next || '<span></span>';")
P.append("  document.querySelectorAll('#chapterNav a[data-ch]').forEach(a=>{a.onclick=e=>{e.preventDefault();renderChapter(+a.dataset.ch)}});")
P.append("  window.scrollTo({top:0, behavior:'smooth'});")
P.append("}")
P.append("renderChapter(1);")
P.append("</script>")
P.append("</body>")
P.append("</html>")

Path('memory-shape.html').write_text('\n'.join(P), encoding='utf-8')
print('built memory-shape.html', max_n, 'chs', len('\n'.join(P)), 'bytes')
