const _hasSavedData = localStorage.getItem('monkeytype_goals') !== null;
let _overlay = null;

if (_hasSavedData) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@500&display=swap';
  document.head.appendChild(link);

  _overlay = document.createElement('div');
  Object.assign(_overlay.style, {
    position: 'fixed', top: '0', left: '0',
    width: '100vw', height: '100vh',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#313338',
    zIndex: '999999', opacity: '1',
    transition: 'opacity 0.8s ease-out',
  });

  const _text = document.createElement('span');
  _text.textContent = 'Loading Data...';
  Object.assign(_text.style, {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: '1.4rem', fontWeight: '500', color: '#e2b714',
  });

  _overlay.appendChild(_text);
  document.body.appendChild(_overlay);

  const _origGetItem = localStorage.getItem.bind(localStorage);
  localStorage.getItem = function(key) {
    const result = _origGetItem(key);
    if (key === STORAGE_KEY) {
      localStorage.getItem = _origGetItem;
      requestAnimationFrame(() => {
        _overlay.style.opacity = '0';
        _overlay.addEventListener('transitionend', () => _overlay.remove());
      });
    }
    return result;
  };
}


// v5
