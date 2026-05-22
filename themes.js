const THEMES = {
  default: {
    name: 'Default',
    '--mt-accent':          '#e2b714',
    '--mt-accent-hover':    '#f0c71e',
    '--mt-accent-muted':    'rgba(226,183,20,0.12)',
    '--mt-bg-primary':      '#313338',
    '--mt-bg-card':         '#2b2d31',
    '--mt-bg-card-hover':   '#35373d',
  },
  discord: {
    name: 'Discord',
    '--mt-accent':          '#5a65ea',
    '--mt-accent-hover':    '#6e78f0',
    '--mt-accent-muted':    'rgba(90,101,234,0.12)',
    '--mt-bg-primary':      '#313338',
    '--mt-bg-card':         '#2b2d31',
    '--mt-bg-card-hover':   '#35373d',
  },
  ayu: {
    name: 'Ayu',
    '--mt-accent':          '#e6b450',
    '--mt-accent-hover':    '#f0c76a',
    '--mt-accent-muted':    'rgba(230,180,80,0.12)',
    '--mt-bg-primary':      '#0d1017',
    '--mt-bg-card':         '#13191f',
    '--mt-bg-card-hover':   '#1a2128',
  },
  catppuccin: {
    name: 'Catppuccin',
    '--mt-accent':          '#cba6f7',
    '--mt-accent-hover':    '#d5b8fa',
    '--mt-accent-muted':    'rgba(203,166,247,0.12)',
    '--mt-bg-primary':      '#1e1e2e',
    '--mt-bg-card':         '#181825',
    '--mt-bg-card-hover':   '#1e1e2e',
  },
};

const STORAGE_KEY = 'monkeytype_goals_theme_v2';

function applyTheme(themeKey) {
  const theme = THEMES[themeKey] || THEMES.default;
  const root = document.documentElement;
  for (const [prop, val] of Object.entries(theme)) {
    if (prop.startsWith('--')) root.style.setProperty(prop, val);
  }
}

function getActiveTheme() {
  return localStorage.getItem(STORAGE_KEY) || 'default';
}

function setTheme(themeKey) {
  localStorage.setItem(STORAGE_KEY, themeKey);
  applyTheme(themeKey);
}

function cycleTheme() {
  const keys = Object.keys(THEMES);
  const current = getActiveTheme();
  const next = keys[(keys.indexOf(current) + 1) % keys.length];
  setTheme(next);
  return THEMES[next].name;
}

function getThemeNames() {
  return Object.fromEntries(Object.entries(THEMES).map(([k, v]) => [k, v.name]));
}

applyTheme(getActiveTheme());

window.MTThemes = { applyTheme, setTheme, cycleTheme, getActiveTheme, getThemeNames, THEMES };
