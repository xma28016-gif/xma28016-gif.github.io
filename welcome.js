'use strict';
document.addEventListener('keydown', event => {
  if (event.key !== 'Enter' || event.repeat || event.isComposing || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  if (event.target.closest('a, button, input, textarea, select, [contenteditable="true"]')) return;
  event.preventDefault();
  window.location.assign(document.querySelector('#enter-site').href);
});
