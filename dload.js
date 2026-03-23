// v3
const hasSavedData = localStorage.getItem('monkeytype_goals') !== null;

let overlay = null;

if (hasSavedData) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@500&display=swap';
  document.head.appendChild(link);

  overlay = document.createElement('div');
  Object.assign(overlay.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#313338',
    zIndex: '999999',
    opacity: '1',
    transition: 'opacity 0.8s ease-out',
  });
  document.body.appendChild(overlay);

  const text = document.createElement('span');
  text.textContent = 'Loading Data...';
  Object.assign(text.style, {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: '1.4rem',
    fontWeight: '500',
    color: '#e2b714',
  });
  overlay.appendChild(text);
}

const _originalGetItem = localStorage.getItem.bind(localStorage);
const WATCHED_KEYS = new Set(['monkeytype_goals', 'monkeytype_goals_theme']);
const seenKeys = new Set();

localStorage.getItem = function(key) {
  if (WATCHED_KEYS.has(key)) {
    seenKeys.add(key);
    if (seenKeys.size === WATCHED_KEYS.size && overlay) {
      overlay.style.opacity = '0';
      overlay.addEventListener('transitionend', () => overlay.remove());
    }
  }
  return _originalGetItem(key);
};
