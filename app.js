'use strict';
const content = window.siteContent;
const stage = document.querySelector('#work-stage');
const noteList = document.querySelector('#note-list');
const dialog = document.querySelector('#detail-dialog');
const dialogContent = document.querySelector('#dialog-content');
const dots = document.querySelector('#work-dots');
const previous = document.querySelector('#work-prev');
const next = document.querySelector('#work-next');
const countLabel = document.querySelector('#work-count');
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
let category = 'all';
let currentWork = 0;

function artwork(type) {
  const mountain = '<svg viewBox="0 0 600 440" aria-hidden="true"><g fill="none" stroke-width="1"><path stroke="#8052ff" d="m45 315 92-83 56 41 83-138 77 109 74-132 116 204-154-38-108 66-88-71-148 42 200 19 108-90 74-132M137 232l108 102 31-199 5 209 72-100 36 34 38-166M193 273l52 61 144-56 154 38M45 315l236 29 262-28"/><path stroke="#ffb829" d="m137 232 56 41 83-138M353 244l74-132 116 204"/><path stroke="#15846e" d="m45 315 200 19 144-56 154 38M193 273l88 71"/><path stroke="#cf7ac6" d="m94 170 5 9-10-1Zm360 50 5 8-11 1Z"/><path stroke="#8052ff" d="m337 100 4 8-9-1Zm-167 239 4 8-9-1Z"/><circle cx="391" cy="116" r="36" stroke="#ffb829" stroke-dasharray="1 5" opacity=".6"/></g><text x="46" y="76" font-family="Inter,sans-serif" font-size="9" fill="#9a9a9a" letter-spacing="2">FIELD STUDY / 001</text><text x="45" y="397" font-family="Inter,sans-serif" font-size="26" font-weight="200" letter-spacing="-1" fill="#fff">INTO THE WILD.</text></svg>';
  const focus = '<svg viewBox="0 0 600 440" aria-hidden="true"><g fill="none"><circle cx="300" cy="216" r="156" stroke="#8052ff" stroke-width="1" stroke-dasharray="1 9"/><path d="M300 60a156 156 0 0 1 150 199" stroke="#8052ff" stroke-width="2"/><circle cx="449" cy="260" r="3" fill="#ffb829"/><path d="m112 103 5 10-11-1Zm365 230 5 9-10-1Zm-73-275 4 8-9-1Z" stroke="#ffb829"/><path d="m153 337 5 9-10-1Zm316-190 4 8-9-1Z" stroke="#8052ff"/></g><text x="300" y="226" text-anchor="middle" font-family="Inter,sans-serif" font-size="86" font-weight="200" letter-spacing="-4" fill="#fff">25:00</text><text x="300" y="263" text-anchor="middle" font-family="Inter,sans-serif" font-size="9" letter-spacing="3" fill="#9a9a9a">A MOMENT OF FOCUS</text></svg>';
  const journal = '<svg viewBox="0 0 600 440" aria-hidden="true"><g fill="none" stroke-width="1"><path stroke="#8052ff" d="m117 98 7 13-14-1Zm332 56 5 10-11-1Zm-10 193 7 12-14-1Zm-301-35 5 9-10-1Zm47-246 4 8-9-1Z"/><path stroke="#ffb829" d="m185 150 4 9-9-1Zm309 110 5 9-10-1Zm-115 112 5 9-10-1Z"/><path stroke="#15846e" d="m96 210 5 9-11 1Zm325-115 4 8-9-1Z"/></g><text x="190" y="206" font-family="Inter,PingFang SC,sans-serif" font-size="80" font-weight="200" letter-spacing="-5" fill="#fff">日常</text><text x="247" y="297" font-family="Inter,PingFang SC,sans-serif" font-size="80" font-weight="200" letter-spacing="-5" fill="#fff">切片</text><text x="190" y="343" font-family="Inter,sans-serif" font-size="8" fill="#9a9a9a" letter-spacing="2">EVERYDAY / NEVER ORDINARY</text></svg>';
  return '<div class="work-art">' + ({ mountain, focus, journal }[type] || journal) + '</div>';
}

function visibleWorks() {
  return content.works.filter(work => category === 'all' || work.category === category);
}
function renderWork() {
  const works = visibleWorks();
  currentWork = Math.max(0, Math.min(currentWork, works.length - 1));
  const work = works[currentWork];
  if (!work) {
    stage.innerHTML = '<p class="body-copy">作品正在整理中。</p>';
    dots.innerHTML = '';
    countLabel.textContent = '00 / 00';
    previous.disabled = next.disabled = true;
    return;
  }
  stage.innerHTML = '<article class="work-slide">' + artwork(work.type) + '<div class="work-description"><p class="work-category">' + escapeHTML(work.label) + ' / 示例项目</p><h3>' + escapeHTML(work.title.split(' · ')[0]) + '</h3><p class="body-copy">' + escapeHTML(work.description) + '</p><button class="ghost-link accent-link" type="button" data-work="' + escapeHTML(work.id) + '" aria-label="查看' + escapeHTML(work.title) + '详情">了解这个项目 <span aria-hidden="true">↗</span></button></div></article>';
  dots.innerHTML = works.map((item, i) => '<button type="button" class="' + (i === currentWork ? 'active' : '') + '" data-select-work="' + i + '" aria-label="展示作品：' + escapeHTML(item.title) + '" aria-pressed="' + (i === currentWork) + '"></button>').join('');
  countLabel.textContent = String(currentWork + 1).padStart(2, '0') + ' / ' + String(works.length).padStart(2, '0');
  previous.disabled = currentWork === 0;
  next.disabled = currentWork === works.length - 1;
}
previous.addEventListener('click', () => { currentWork--; renderWork(); });
next.addEventListener('click', () => { currentWork++; renderWork(); });
dots.addEventListener('click', event => {
  const button = event.target.closest('[data-select-work]');
  if (!button) return;
  currentWork = Number(button.dataset.selectWork);
  renderWork();
  dots.querySelector('[data-select-work="' + currentWork + '"]').focus({ preventScroll: true });
});
document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
  category = button.dataset.filter;
  currentWork = 0;
  document.querySelectorAll('.filter').forEach(item => {
    const active = item === button;
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  renderWork();
}));
renderWork();

document.querySelectorAll('[data-site-name]').forEach(el => { el.textContent = content.name; });
document.querySelector('[data-footer-name]').textContent = content.name;
document.querySelector('#about-greeting').textContent = content.greeting;
document.querySelector('#about-bio').textContent = content.bio;
document.querySelector('#year').textContent = new Date().getFullYear();
document.title = content.name + ' — 好奇，未完待续';
noteList.innerHTML = content.notes.map((note, i) => '<article class="note-item"><p class="note-meta"><span>0' + (i + 1) + '</span><span>' + escapeHTML(note.tag) + ' / 示例随笔</span></p><h3>' + escapeHTML(note.title) + '</h3><p class="note-excerpt">' + escapeHTML(note.paragraphs[0].slice(0, 64)) + (note.paragraphs[0].length > 64 ? '…' : '') + '</p><button type="button" class="ghost-link note-read" data-note="' + escapeHTML(note.id) + '" aria-label="阅读随笔：' + escapeHTML(note.title) + '">阅读全文 <span aria-hidden="true">↗</span><small>' + escapeHTML(note.duration) + '阅读</small></button></article>').join('');

function openDetail(markup) {
  dialogContent.innerHTML = markup;
  dialog.showModal();
  document.body.classList.add('modal-open');
  dialog.scrollTop = 0;
}
dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
stage.addEventListener('click', event => {
  const button = event.target.closest('[data-work]');
  if (!button) return;
  const work = content.works.find(item => item.id === button.dataset.work);
  openDetail('<p class="dialog-kicker">' + escapeHTML(work.label) + ' / 示例项目</p><h2 id="dialog-title">' + escapeHTML(work.title) + '</h2>' + artwork(work.type) + '<p>' + escapeHTML(work.description) + '</p>' + work.sections.map(section => '<h3>' + escapeHTML(section.title) + '</h3><p>' + escapeHTML(section.text) + '</p>').join(''));
});
noteList.addEventListener('click', event => {
  const button = event.target.closest('[data-note]');
  if (!button) return;
  const note = content.notes.find(item => item.id === button.dataset.note);
  openDetail('<p class="dialog-kicker">' + escapeHTML(note.tag) + ' / 示例随笔</p><h2 id="dialog-title">' + escapeHTML(note.title) + '</h2>' + note.paragraphs.map(paragraph => '<p>' + escapeHTML(paragraph) + '</p>').join('') + '<p class="placeholder">这是一篇展示阅读效果的示例随笔，可以替换为自己的文字。</p>');
});
document.querySelector('#contact-button').addEventListener('click', () => {
  const email = content.email.trim();
  if (email && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) {
    openDetail('<p class="dialog-kicker">SAY HELLO</p><h2 id="dialog-title">很高兴认识你。</h2><p>可以通过邮件联系我，期待与你交流。</p><a class="button primary" href="mailto:' + encodeURIComponent(email) + '">给我写信 ↗</a><p>' + escapeHTML(email) + '</p>');
  } else {
    openDetail('<p class="dialog-kicker">SAY HELLO</p><h2 id="dialog-title">期待与你连接。</h2><p>这个小站的联系方式还没有填写。</p><p class="placeholder">联系方式即将补充，感谢你的来访。</p><a class="ghost-link accent-link" href="https://github.com/xma28016-gif" target="_blank" rel="noopener noreferrer">前往 GitHub ↗</a>');
  }
});
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    document.querySelectorAll('.nav-link').forEach(link => {
      const active = link.hash === '#' + entry.target.id;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  });
}, { rootMargin: '-10% 0px -55% 0px', threshold: 0 });
document.querySelectorAll('#home, #works, #notes, #about').forEach(section => sectionObserver.observe(section));
