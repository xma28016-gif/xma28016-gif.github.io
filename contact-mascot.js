'use strict';
(() => {
  const mascot = document.querySelector('#contact-mascot');
  const button = document.querySelector('#mascot-button');
  const greeting = document.querySelector('#mascot-greeting');
  const image = button.querySelector('img');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let dismissTimer;
  let animation;

  button.addEventListener('click', () => {
    window.clearTimeout(dismissTimer);
    greeting.textContent = 'hi 👋';
    mascot.classList.add('is-greeting');
    if (!reducedMotion.matches && typeof image.animate === 'function') {
      if (animation) animation.cancel();
      animation = image.animate([
        { transform: 'translateY(0) rotate(0deg)' },
        { transform: 'translateY(-12px) rotate(-7deg)', offset: 0.28 },
        { transform: 'translateY(-5px) rotate(5deg)', offset: 0.55 },
        { transform: 'translateY(-8px) rotate(-3deg)', offset: 0.78 },
        { transform: 'translateY(0) rotate(0deg)' }
      ], { duration: 650, easing: 'ease-in-out' });
    }
    dismissTimer = window.setTimeout(() => {
      mascot.classList.remove('is-greeting');
      greeting.textContent = '';
    }, 3000);
  });
})();
