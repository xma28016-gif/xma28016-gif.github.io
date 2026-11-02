'use strict';
(() => {
  const panels = [...document.querySelectorAll('.panel')];
  const labels = { about: '关于我', works: '个人项目', skills: '技能标签', notes: '文章归档', contact: '联系我' };
  let current = '';
  function showPanel(id, updateHistory = true) {
    if (!labels[id]) id = 'about';
    if (updateHistory && location.hash !== '#' + id) history.pushState(null, '', '#' + id);
    panels.forEach(panel => { panel.hidden = panel.id !== id; });
    document.querySelectorAll('.nav-link').forEach(link => {
      const selected = link.hash === '#' + id;
      link.classList.toggle('active', selected);
      if (selected) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    document.querySelector('#current-panel-label').textContent = labels[id];
    document.title = labels[id] + ' · 马骁 | MX OS';
    if (current !== id) document.querySelector('#content').scrollTop = 0;
    current = id;
  }
  window.showWorkspacePanel = showPanel;
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || !labels[link.hash.slice(1)] || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    showPanel(link.hash.slice(1));
    if (!link.classList.contains('nav-link')) document.querySelector('#' + current + ' h1')?.focus({ preventScroll: true });
  });
  function syncFromLocation() {
    const id = location.hash.slice(1);
    if (labels[id] || !id) showPanel(id || 'about', false);
  }
  window.addEventListener('popstate', syncFromLocation);
  window.addEventListener('hashchange', syncFromLocation);
  showPanel(location.hash.slice(1), false);
  const data = window.siteContent;
  const skills = new Set(data.skills.flatMap(group => group.items.map(item => item.name))).size;
  document.querySelector('#workspace-counts').textContent = data.works.length + ' PROJECTS · ' + skills + ' SKILLS · ' + data.notes.length + ' ARTICLES';
})();
