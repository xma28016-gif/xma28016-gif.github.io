'use strict';
const content = window.siteContent;
const grid = document.querySelector('#work-grid');
const noteList = document.querySelector('#note-list');
const dialog = document.querySelector('#detail-dialog');
const dialogContent = document.querySelector('#dialog-content');
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
function artwork(type) {
  const art = {
    mountain: '<div class="poster art-object"><small>INTO THE WILD</small><div class="poster-title">山野<br>之间</div><div class="poster-sun"></div><div class="poster-hill"></div><div class="poster-hill front"></div><div class="poster-bottom">A STUDY OF NATURE / 01</div></div>',
    focus: '<div class="mini-app art-object"><div class="mini-top"><b>◒ 留白</b><span>FOCUS MODE</span></div><div class="timer">25:00</div><div class="timer-caption">专注于当下这一刻</div><div class="mini-line"></div><div class="mini-controls"><span>开始专注</span></div></div>',
    journal: '<div class="book art-object"><small>EVERYDAY FRAGMENTS</small><div class="book-title">日常<br>切片</div><span class="book-flower">✳</span></div>'
  };
  return '<div class="work-visual visual-' + type + '" aria-hidden="true">' + (art[type] || art.journal) + '</div>';
}
document.querySelectorAll('[data-site-name]').forEach(el => { el.textContent = content.name + '.'; });
document.querySelector('[data-footer-name]').textContent = content.name;
document.querySelector('#about-greeting').textContent = content.greeting;
document.querySelector('#about-bio').textContent = content.bio;
document.querySelector('#year').textContent = new Date().getFullYear();
document.title = content.name + ' — 保持好奇，慢慢生长';
grid.innerHTML = content.works.map(work => '<button class="work-card" type="button" data-category="' + escapeHTML(work.category) + '" data-work="' + escapeHTML(work.id) + '" aria-label="查看' + escapeHTML(work.title) + '详情">' + artwork(work.type) + '<div class="work-meta"><h3>' + escapeHTML(work.title) + '</h3><span class="arrow" aria-hidden="true">↗</span></div><div class="work-category"><span>' + escapeHTML(work.label) + '</span><span>示例项目</span></div></button>').join('');
noteList.innerHTML = content.notes.map((note, i) => '<button class="note-row" type="button" data-note="' + escapeHTML(note.id) + '"><span class="note-num">0' + (i + 1) + '</span><div class="note-main"><h3>' + escapeHTML(note.title) + '</h3><p>' + escapeHTML(note.tag) + ' · ' + escapeHTML(note.duration) + '阅读 · 示例随笔</p></div><span class="note-arrow" aria-hidden="true">↗</span></button>').join('');
document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.filter').forEach(item => { const selected = item === button; item.classList.toggle('active', selected); item.setAttribute('aria-pressed', String(selected)); });
  document.querySelectorAll('.work-card').forEach(card => { card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter; });
}));
function openDetail(markup) { dialogContent.innerHTML = markup; dialog.showModal(); document.body.classList.add('modal-open'); dialog.scrollTop = 0; }
function closeDetail() { dialog.close(); }
dialog.querySelector('.dialog-close').addEventListener('click', closeDetail);
dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
dialog.addEventListener('click', event => { if (event.target !== dialog) return; const rect = dialog.getBoundingClientRect(); if(event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeDetail(); });
grid.addEventListener('click', event => {
  const button = event.target.closest('[data-work]'); if (!button) return;
  const work = content.works.find(item => item.id === button.dataset.work);
  openDetail('<p class="dialog-kicker">' + escapeHTML(work.label) + ' / 示例项目</p><h2 id="dialog-title">' + escapeHTML(work.title) + '</h2>' + artwork(work.type) + '<p>' + escapeHTML(work.description) + '</p>' + work.sections.map(section => '<h3>' + escapeHTML(section.title) + '</h3><p>' + escapeHTML(section.text) + '</p>').join(''));
});
noteList.addEventListener('click', event => {
  const button = event.target.closest('[data-note]'); if (!button) return;
  const note = content.notes.find(item => item.id === button.dataset.note);
  openDetail('<p class="dialog-kicker">' + escapeHTML(note.tag) + ' · ' + escapeHTML(note.duration) + '阅读 / 示例随笔</p><h2 id="dialog-title">' + escapeHTML(note.title) + '</h2>' + note.paragraphs.map(paragraph => '<p>' + escapeHTML(paragraph) + '</p>').join('') + '<p class="placeholder">这是一篇展示阅读效果的示例随笔，你可以替换为自己的文字。</p>');
});
document.querySelector('#contact-button').addEventListener('click', () => {
  const email = content.email.trim();
  if (email && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) {
    openDetail('<p class="dialog-kicker">SAY HELLO</p><h2 id="dialog-title">很高兴认识你。</h2><p>可以通过邮件联系我，期待与你交流。</p><a class="button primary" href="mailto:' + encodeURIComponent(email) + '">给我写信 ↗</a><p>' + escapeHTML(email) + '</p>');
  } else {
    openDetail('<p class="dialog-kicker">SAY HELLO</p><h2 id="dialog-title">期待与你连接。</h2><p>这个小站的联系方式还没有填写。</p><p class="placeholder">联系方式即将补充，感谢你的来访。</p>');
  }
});
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (!entry.isIntersecting) return; document.querySelectorAll('.nav-link').forEach(link => { const active = link.hash === '#' + entry.target.id; link.classList.toggle('active', active); if (active) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current'); }); });
}, { rootMargin: '-10% 0px -55% 0px', threshold: 0 });
document.querySelectorAll('#home,#works,#notes,#about').forEach(section => sectionObserver.observe(section));
