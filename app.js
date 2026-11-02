'use strict';
const content = window.siteContent;
const projectList = document.querySelector('#project-list');
const noteList = document.querySelector('#note-list');
const dialog = document.querySelector('#detail-dialog');
const dialogContent = document.querySelector('#dialog-content');
const projectSearch = document.querySelector('#project-search');
const articleSearch = document.querySelector('#article-search');
const articleCategory = document.querySelector('#article-category');
const activeSkillLabel = document.querySelector('#active-skill');
const skillItems = content.skills.flatMap(group => group.items);
const normalize = value => String(value).normalize('NFKC').toLocaleLowerCase().trim();
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
let projectCategory = 'all';
let activeSkill = null;

function safeURL(value) {
  try {
    const url = new URL(value, window.location.href);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : '';
  } catch { return ''; }
}
function externalLink(url, label, className = 'ghost-link') {
  const href = safeURL(url);
  return href ? '<a class="' + className + '" href="' + escapeHTML(href) + '" target="_blank" rel="noopener noreferrer">' + escapeHTML(label) + ' <span aria-hidden="true">↗</span></a>' : '';
}
function tagsHTML(tags) {
  return '<ul class="content-tags" aria-label="内容标签">' + tags.map(tag => '<li>' + escapeHTML(tag) + '</li>').join('') + '</ul>';
}
function projectMatches(work) {
  const query = normalize(projectSearch.value);
  const haystack = normalize([work.title, work.description, work.label, ...work.tags, ...work.sections.map(section => section.text)].join(' '));
  return (projectCategory === 'all' || work.category === projectCategory)
    && (!activeSkill || activeSkill.projects.includes(work.id))
    && (!query || haystack.includes(query));
}
function renderProjects() {
  const works = content.works.filter(projectMatches);
  projectList.innerHTML = works.map(work => {
    const index = content.works.indexOf(work) + 1;
    const liveLink = work.currentSite ? '<span class="current-site">当前网站</span>' : externalLink(work.url, work.category === 'research' ? '阅读报告' : '在线体验');
    return '<article class="project-item" data-project-id="' + escapeHTML(work.id) + '"><p class="project-meta"><span>' + String(index).padStart(2, '0') + ' / ' + escapeHTML(work.label) + '</span><span>' + escapeHTML(work.status) + '</span></p><h3>' + escapeHTML(work.title) + '</h3><p class="project-description">' + escapeHTML(work.description) + '</p>' + tagsHTML(work.tags) + '<div class="project-links"><button type="button" class="ghost-link accent-link" data-project="' + escapeHTML(work.id) + '" aria-label="查看' + escapeHTML(work.title) + '项目详情">项目详情 <span aria-hidden="true">↗</span></button>' + liveLink + externalLink(work.repo, 'GitHub') + '</div></article>';
  }).join('');
  document.querySelector('#project-count').textContent = '显示 ' + works.length + ' / ' + content.works.length + ' 个公开项目';
  document.querySelector('#project-empty').hidden = works.length !== 0;
  activeSkillLabel.hidden = !activeSkill;
  if (activeSkill) activeSkillLabel.textContent = '技能：' + activeSkill.name + ' × 清除';
}
document.querySelectorAll('[data-project-filter]').forEach(button => button.addEventListener('click', () => {
  projectCategory = button.dataset.projectFilter;
  document.querySelectorAll('[data-project-filter]').forEach(item => {
    const selected = item === button;
    item.classList.toggle('active', selected);
    item.setAttribute('aria-pressed', String(selected));
  });
  renderProjects();
}));
projectSearch.addEventListener('input', renderProjects);
activeSkillLabel.addEventListener('click', () => {
  activeSkill = null;
  document.querySelectorAll('[data-skill]').forEach(button => button.setAttribute('aria-pressed', 'false'));
  renderProjects();
});

document.querySelector('#skill-groups').innerHTML = content.skills.map((group, i) => '<section class="skill-group" aria-labelledby="skill-group-' + i + '"><h3 id="skill-group-' + i + '">' + escapeHTML(group.title) + '</h3><p>' + escapeHTML(group.description) + '</p><div class="skill-tags">' + group.items.map(skill => '<button type="button" class="skill-tag" data-skill="' + escapeHTML(skill.name) + '" aria-pressed="false" aria-label="查看' + escapeHTML(skill.name) + '对应项目">' + escapeHTML(skill.name) + '<span aria-hidden="true">↗</span></button>').join('') + '</div></section>').join('');
document.querySelector('#skill-groups').addEventListener('click', event => {
  const button = event.target.closest('[data-skill]');
  if (!button) return;
  activeSkill = skillItems.find(skill => skill.name === button.dataset.skill);
  projectCategory = 'all';
  projectSearch.value = '';
  document.querySelectorAll('[data-project-filter]').forEach(item => {
    const selected = item.dataset.projectFilter === 'all';
    item.classList.toggle('active', selected);
    item.setAttribute('aria-pressed', String(selected));
  });
  document.querySelectorAll('[data-skill]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  renderProjects();
  const heading = document.querySelector('#projects-heading');
  window.showWorkspacePanel('works');
  heading.focus({ preventScroll: true });
});

const categories = [...new Set(content.notes.map(note => note.category))];
articleCategory.innerHTML = '<option value="all">全部分类</option>' + categories.map(category => '<option value="' + escapeHTML(category) + '">' + escapeHTML(category) + '</option>').join('');
function renderArticles() {
  const query = normalize(articleSearch.value);
  const notes = content.notes.filter(note => {
    const text = normalize([note.title, note.description, note.category, ...note.tags].join(' '));
    return (articleCategory.value === 'all' || note.category === articleCategory.value) && (!query || text.includes(query));
  });
  noteList.innerHTML = notes.map(note => {
    const date = note.date ? '<time datetime="' + escapeHTML(note.date) + '">' + escapeHTML(note.date.replaceAll('-', '.')) + '</time>' : '<span>微信公众号</span>';
    return '<article class="note-item" data-article-id="' + escapeHTML(note.id) + '"><p class="note-meta"><span>' + escapeHTML(note.category) + '</span>' + date + '</p><h3>' + externalLink(note.url, note.title, 'article-title') + '</h3><p class="note-excerpt">' + escapeHTML(note.description) + '</p>' + tagsHTML(note.tags) + externalLink(note.url, note.source, 'ghost-link note-read') + '</article>';
  }).join('');
  document.querySelector('#article-count').textContent = '已收录 ' + content.notes.length + ' 篇 · 当前显示 ' + notes.length + ' 篇';
  document.querySelector('#article-empty').hidden = notes.length !== 0;
}
articleSearch.addEventListener('input', renderArticles);
articleCategory.addEventListener('change', renderArticles);

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
projectList.addEventListener('click', event => {
  const button = event.target.closest('[data-project]');
  if (!button) return;
  const work = content.works.find(item => item.id === button.dataset.project);
  if (!work) return;
  const live = work.currentSite ? '' : externalLink(work.url, work.category === 'research' ? '阅读完整报告' : '体验完整项目', 'button primary');
  openDetail('<p class="dialog-kicker">' + escapeHTML(work.label) + ' / ' + escapeHTML(work.status) + '</p><h2 id="dialog-title">' + escapeHTML(work.title) + '</h2>' + tagsHTML(work.tags) + '<p>' + escapeHTML(work.description) + '</p>' + work.sections.map(section => '<h3>' + escapeHTML(section.title) + '</h3><p>' + escapeHTML(section.text) + '</p>').join('') + '<div class="dialog-links">' + live + externalLink(work.repo, '查看源码') + externalLink(work.repo + '/blob/main/README.md', '项目说明') + '</div>');
});
document.querySelector('#contact-button').addEventListener('click', () => {
  const email = content.email.trim();
  const emailLink = email && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email) ? '<a class="button primary" href="mailto:' + encodeURIComponent(email) + '">给我写信 ↗</a>' : '';
  openDetail('<p class="dialog-kicker">SAY HELLO</p><h2 id="dialog-title">一起交流。</h2><p>欢迎通过 GitHub 交流项目，或前往公众号阅读我的文字。</p><div class="dialog-links">' + emailLink + externalLink(content.github, 'GitHub 主页', emailLink ? 'ghost-link' : 'button primary') + (content.publication ? externalLink(content.publication.url, content.publication.name) : '') + '</div>');
});

if (content.publication) {
  const publication = document.querySelector('#publication');
  publication.hidden = false;
  publication.innerHTML = '<p class="publication-label">微信公众号</p><h3>' + escapeHTML(content.publication.name) + '</h3><p>' + escapeHTML(content.publication.description) + '</p>' + externalLink(content.publication.url, '阅读公众号文章', 'ghost-link accent-link');
}
document.querySelectorAll('[data-site-name]').forEach(el => { el.textContent = content.name; });
document.querySelector('[data-footer-name]').textContent = content.name;
document.querySelector('#about-greeting').textContent = content.greeting;
document.querySelector('#about-bio').textContent = content.bio;
document.querySelector('#year').textContent = new Date().getFullYear();
document.querySelector('#profile-tags').innerHTML = content.profileTags.map(tag => '<span>' + escapeHTML(tag) + '</span>').join('');
document.querySelectorAll('[data-count="projects"]').forEach(el => { el.textContent = content.works.length; });
document.querySelectorAll('[data-count="skills"]').forEach(el => { el.textContent = new Set(skillItems.map(skill => skill.name)).size; });
document.querySelectorAll('[data-count="articles"]').forEach(el => { el.textContent = content.notes.length; });
document.title = content.name + ' — 项目、技能与写作';
renderProjects();
renderArticles();
