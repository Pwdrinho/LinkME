/* ============================
   LINKFÓLIO — app.js
   ============================ */

// ── UTILS (deve vir PRIMEIRO) ─────────────────────────────────
function uid() { return Math.random().toString(36).slice(2, 10); }
function isValidUrl(url) {
  try { return ['http:', 'https:'].includes(new URL(url.trim()).protocol); }
  catch { return false; }
}
function escapeHtml(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

// ── DEFAULT DATA ──────────────────────────────────────────────
const DEFAULT_PROFILE = {
  name: 'Pwdrinho',
  desc: 'Desenvolvedor de Software • UI/UX',
  avatar: 'Bakugo1.jpeg',
  theme: 'dark',
};

const DEFAULT_LINKS = [
  { id: uid(), icon: 'fa-brands fa-github',   name: 'GitHub',   url: 'https://github.com/pwdrinho' },
  { id: uid(), icon: 'fa-brands fa-linkedin', name: 'LinkedIn', url: 'https://www.linkedin.com/in/pwdrinho/' },
];

const ICONS = [
  { cls: 'fa-brands fa-github', label: 'GitHub' },
  { cls: 'fa-brands fa-linkedin', label: 'LinkedIn' },
  { cls: 'fa-brands fa-instagram', label: 'Instagram' },
  { cls: 'fa-brands fa-twitter', label: 'Twitter / X' },
  { cls: 'fa-brands fa-x-twitter', label: 'X' },
  { cls: 'fa-brands fa-youtube', label: 'YouTube' },
  { cls: 'fa-brands fa-tiktok', label: 'TikTok' },
  { cls: 'fa-brands fa-twitch', label: 'Twitch' },
  { cls: 'fa-brands fa-discord', label: 'Discord' },
  { cls: 'fa-brands fa-whatsapp', label: 'WhatsApp' },
  { cls: 'fa-brands fa-telegram', label: 'Telegram' },
  { cls: 'fa-brands fa-pinterest', label: 'Pinterest' },
  { cls: 'fa-brands fa-behance', label: 'Behance' },
  { cls: 'fa-brands fa-dribbble', label: 'Dribbble' },
  { cls: 'fa-brands fa-figma', label: 'Figma' },
  { cls: 'fa-brands fa-medium', label: 'Medium' },
  { cls: 'fa-brands fa-dev', label: 'Dev.to' },
  { cls: 'fa-brands fa-spotify', label: 'Spotify' },
  { cls: 'fa-brands fa-soundcloud', label: 'SoundCloud' },
  { cls: 'fa-brands fa-facebook', label: 'Facebook' },
  { cls: 'fa-brands fa-paypal', label: 'PayPal' },
  { cls: 'fa-brands fa-patreon', label: 'Patreon' },
  { cls: 'fa-brands fa-npm', label: 'npm' },
  { cls: 'fa-brands fa-docker', label: 'Docker' },
  { cls: 'fa-solid fa-link', label: 'Link' },
  { cls: 'fa-solid fa-globe', label: 'Website' },
  { cls: 'fa-solid fa-briefcase', label: 'Portfolio' },
  { cls: 'fa-solid fa-envelope', label: 'Email' },
  { cls: 'fa-solid fa-star', label: 'Destaque' },
  { cls: 'fa-solid fa-code', label: 'Código' },
  { cls: 'fa-solid fa-gamepad', label: 'Game' },
  { cls: 'fa-solid fa-music', label: 'Música' },
  { cls: 'fa-solid fa-camera', label: 'Foto' },
  { cls: 'fa-solid fa-pen-nib', label: 'Blog' },
  { cls: 'fa-solid fa-graduation-cap', label: 'Educação' },
  { cls: 'fa-solid fa-rocket', label: 'Projeto' },
  { cls: 'fa-solid fa-heart', label: 'Favorito' },
  { cls: 'fa-solid fa-store', label: 'Loja' },
  { cls: 'fa-solid fa-newspaper', label: 'Notícias' },
  { cls: 'fa-solid fa-podcast', label: 'Podcast' },
];

// ── STATE ─────────────────────────────────────────────────────
let state = {
  profile: { ...DEFAULT_PROFILE },
  links: DEFAULT_LINKS.map(l => ({ ...l })),
};

let editingLinkId = null;
let activeIconTarget = null;
let dragSrcIndex = null;

// ── STORAGE ───────────────────────────────────────────────────
function save() {
  try { localStorage.setItem('linkfolio', JSON.stringify(state)); } catch {}
}

// ── RENDER: PUBLIC VIEW ───────────────────────────────────────
function renderPublic() {
  const { profile, links } = state;

  const avatar = document.getElementById('pub-avatar');
  avatar.src = profile.avatar || generateAvatarSvg(profile.name);
  // fallback: se a imagem não carregar, exibe o avatar gerado
  avatar.onerror = () => {
    avatar.onerror = null;
    avatar.src = generateAvatarSvg(profile.name);
  };
  avatar.alt = `Foto de perfil de ${profile.name}`;

  document.getElementById('pub-name').textContent = profile.name || 'Seu Nome';
  document.getElementById('pub-desc').textContent = profile.desc || '';

  const list = document.getElementById('pub-links');
  list.innerHTML = links.map((lk, i) => `
    <li class="link-item" style="animation-delay:${i * 0.05}s">
      <a class="link-anchor" href="${escapeHtml(lk.url)}" target="_blank" rel="noopener noreferrer"
         aria-label="${escapeHtml(lk.name)} — abre em nova aba">
        <span class="link-icon" aria-hidden="true"><i class="${escapeHtml(lk.icon)}"></i></span>
        <span class="link-text">${escapeHtml(lk.name)}</span>
        <i class="fa-solid fa-arrow-right link-chevron" aria-hidden="true"></i>
      </a>
    </li>
  `).join('');

  document.title = profile.name ? `${profile.name} — LinkFólio` : 'LinkFólio';
}

function generateAvatarSvg(name) {
  const initials = (name || 'LF').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='110' height='110'><rect width='110' height='110' rx='55' fill='%23333'/><text x='55' y='71' text-anchor='middle' font-family='Syne,sans-serif' font-size='36' font-weight='800' fill='%23b9ff66'>${initials}</text></svg>`;
  return `data:image/svg+xml,${svg}`;
}

// ── RENDER: EDIT LINKS LIST ───────────────────────────────────
function renderEditLinks() {
  const list = document.getElementById('edit-links-list');
  const empty = document.getElementById('empty-links-msg');
  const badge = document.getElementById('link-count-badge');
  badge.textContent = state.links.length;

  if (!state.links.length) {
    list.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  list.innerHTML = state.links.map((lk, i) => `
    <li class="edit-link-item" draggable="true" data-index="${i}" data-id="${lk.id}">
      <span class="drag-handle" aria-hidden="true"><i class="fa-solid fa-grip-lines"></i></span>
      <span class="edit-link-icon"><i class="${escapeHtml(lk.icon)}"></i></span>
      <span class="edit-link-info">
        <span class="edit-link-name">${escapeHtml(lk.name)}</span>
        <span class="edit-link-url">${escapeHtml(lk.url)}</span>
      </span>
      <span class="edit-link-actions">
        <button class="icon-btn" onclick="openEditLink('${lk.id}')" aria-label="Editar ${escapeHtml(lk.name)}">
          <i class="fa-solid fa-pen"></i>
        </button>
        <button class="icon-btn danger" onclick="deleteLink('${lk.id}')" aria-label="Remover ${escapeHtml(lk.name)}">
          <i class="fa-solid fa-trash"></i>
        </button>
      </span>
    </li>
  `).join('');

  list.querySelectorAll('.edit-link-item').forEach(item => {
    item.addEventListener('dragstart', onDragStart);
    item.addEventListener('dragover', onDragOver);
    item.addEventListener('drop', onDrop);
    item.addEventListener('dragend', onDragEnd);
    item.addEventListener('dragleave', onDragLeave);
  });
}

// ── DRAG & DROP ───────────────────────────────────────────────
function onDragStart(e) {
  dragSrcIndex = +this.dataset.index;
  this.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
}
function onDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  document.querySelectorAll('.edit-link-item').forEach(el => el.classList.remove('drag-over'));
  this.classList.add('drag-over');
}
function onDragLeave() { this.classList.remove('drag-over'); }
function onDrop(e) {
  e.preventDefault();
  const destIndex = +this.dataset.index;
  if (dragSrcIndex === null || dragSrcIndex === destIndex) return;
  const moved = state.links.splice(dragSrcIndex, 1)[0];
  state.links.splice(destIndex, 0, moved);
  save(); renderEditLinks(); renderPublic();
}
function onDragEnd() {
  document.querySelectorAll('.edit-link-item').forEach(el => {
    el.classList.remove('dragging', 'drag-over');
  });
  dragSrcIndex = null;
}

// ── EDITOR PROFILE FORM ───────────────────────────────────────
function syncProfileFormToState() {
  const { profile } = state;
  document.getElementById('edit-name').value = profile.name || '';
  document.getElementById('edit-desc').value = profile.desc || '';
  const av = document.getElementById('edit-avatar-preview');
  av.src = profile.avatar || generateAvatarSvg(profile.name);
  updateDescCount();
}

function updateDescCount() {
  const val = document.getElementById('edit-desc').value;
  document.getElementById('desc-count').textContent = `${val.length}/200`;
}

// ── AVATAR UPLOAD ─────────────────────────────────────────────
document.getElementById('avatar-upload-btn').addEventListener('click', () => {
  document.getElementById('avatar-file-input').click();
});
document.getElementById('avatar-file-input').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    state.profile.avatar = ev.target.result;
    document.getElementById('edit-avatar-preview').src = ev.target.result;
    save(); renderPublic();
  };
  reader.readAsDataURL(file);
  e.target.value = '';
});

// ── SAVE PROFILE ──────────────────────────────────────────────
document.getElementById('save-profile-btn').addEventListener('click', () => {
  const name = document.getElementById('edit-name').value.trim();
  const desc = document.getElementById('edit-desc').value.trim();
  state.profile.name = name || 'Seu Nome';
  state.profile.desc = desc;
  save(); renderPublic();
  showToast('Perfil salvo! ✦');
});

// ── URL VALIDATION LIVE ───────────────────────────────────────
document.getElementById('new-link-url').addEventListener('input', function () {
  const status = document.getElementById('url-status');
  if (!this.value) { status.textContent = ''; status.className = 'url-status'; return; }
  if (isValidUrl(this.value)) {
    status.textContent = '✓ válida';
    status.className = 'url-status valid';
  } else {
    status.textContent = '✗ inválida';
    status.className = 'url-status invalid';
  }
});

// ── ADD LINK ──────────────────────────────────────────────────
document.getElementById('add-link-btn').addEventListener('click', () => {
  const name = document.getElementById('new-link-name').value.trim();
  const icon = document.getElementById('new-link-icon').value;
  const url  = document.getElementById('new-link-url').value.trim();

  if (!name) return alert('Por favor, informe um nome para o link.');
  if (!url)  return alert('Por favor, informe a URL do link.');
  if (!isValidUrl(url)) return alert('URL inválida. Use o formato https://...');

  state.links.push({ id: uid(), icon, name, url });
  save(); renderEditLinks(); renderPublic();

  document.getElementById('new-link-name').value = '';
  document.getElementById('new-link-url').value = '';
  document.getElementById('new-link-icon').value = 'fa-solid fa-link';
  document.getElementById('icon-preview').className = 'fa-solid fa-link';
  document.getElementById('url-status').textContent = '';
  document.getElementById('url-status').className = 'url-status';
});

// ── DELETE LINK ───────────────────────────────────────────────
function deleteLink(id) {
  if (!confirm('Remover este link?')) return;
  state.links = state.links.filter(l => l.id !== id);
  save(); renderEditLinks(); renderPublic();
}
window.deleteLink = deleteLink;

// ── EDIT LINK MODAL ───────────────────────────────────────────
function openEditLink(id) {
  const lk = state.links.find(l => l.id === id);
  if (!lk) return;
  editingLinkId = id;
  document.getElementById('edit-link-name').value = lk.name;
  document.getElementById('edit-link-url').value = lk.url;
  document.getElementById('edit-link-icon').value = lk.icon;
  document.getElementById('edit-icon-preview').className = lk.icon;
  document.getElementById('edit-link-modal').hidden = false;
}
window.openEditLink = openEditLink;

document.getElementById('close-edit-link').addEventListener('click', () => {
  document.getElementById('edit-link-modal').hidden = true;
});
document.getElementById('cancel-edit-link').addEventListener('click', () => {
  document.getElementById('edit-link-modal').hidden = true;
});
document.getElementById('save-edit-link').addEventListener('click', () => {
  const name = document.getElementById('edit-link-name').value.trim();
  const url  = document.getElementById('edit-link-url').value.trim();
  const icon = document.getElementById('edit-link-icon').value;
  if (!name) return alert('Informe um nome.');
  if (!isValidUrl(url)) return alert('URL inválida.');
  const lk = state.links.find(l => l.id === editingLinkId);
  if (lk) { lk.name = name; lk.url = url; lk.icon = icon; }
  save(); renderEditLinks(); renderPublic();
  document.getElementById('edit-link-modal').hidden = true;
});

// ── ICON PICKER ───────────────────────────────────────────────
function buildIconGrid(selectedIcon) {
  const grid = document.getElementById('icon-grid');
  grid.innerHTML = ICONS.map(ic => `
    <button class="icon-option ${ic.cls === selectedIcon ? 'selected' : ''}"
      data-icon="${escapeHtml(ic.cls)}"
      aria-label="${escapeHtml(ic.label)}"
      title="${escapeHtml(ic.label)}"
      role="option"
      aria-selected="${ic.cls === selectedIcon}">
      <i class="${escapeHtml(ic.cls)}"></i>
    </button>
  `).join('');

  grid.querySelectorAll('.icon-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const cls = btn.dataset.icon;
      if (activeIconTarget === 'new') {
        document.getElementById('new-link-icon').value = cls;
        document.getElementById('icon-preview').className = cls;
      } else if (activeIconTarget === 'edit') {
        document.getElementById('edit-link-icon').value = cls;
        document.getElementById('edit-icon-preview').className = cls;
      }
      document.getElementById('icon-picker-modal').hidden = true;
    });
  });
}

document.getElementById('open-icon-picker').addEventListener('click', () => {
  activeIconTarget = 'new';
  buildIconGrid(document.getElementById('new-link-icon').value);
  document.getElementById('icon-picker-modal').hidden = false;
  document.getElementById('open-icon-picker').setAttribute('aria-expanded', 'true');
});
document.getElementById('open-edit-icon-picker').addEventListener('click', () => {
  activeIconTarget = 'edit';
  buildIconGrid(document.getElementById('edit-link-icon').value);
  document.getElementById('icon-picker-modal').hidden = false;
});
document.getElementById('close-icon-picker').addEventListener('click', () => {
  document.getElementById('icon-picker-modal').hidden = true;
  document.getElementById('open-icon-picker').setAttribute('aria-expanded', 'false');
});

document.getElementById('icon-picker-modal').addEventListener('click', function(e) {
  if (e.target === this) this.hidden = true;
});
document.getElementById('edit-link-modal').addEventListener('click', function(e) {
  if (e.target === this) this.hidden = true;
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.getElementById('icon-picker-modal').hidden = true;
    document.getElementById('edit-link-modal').hidden = true;
  }
});

// ── THEME SWITCHER ────────────────────────────────────────────
document.querySelectorAll('.theme-card').forEach(btn => {
  btn.addEventListener('click', () => {
    const theme = btn.dataset.theme;
    state.profile.theme = theme;
    applyTheme(theme);
    document.querySelectorAll('.theme-card').forEach(b => {
      b.classList.toggle('active', b.dataset.theme === theme);
      b.setAttribute('aria-pressed', b.dataset.theme === theme);
    });
    save();
  });
});

function applyTheme(theme) {
  if (theme === 'dark') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.setAttribute('data-theme', theme);
}

// ── VIEW SWITCHING ────────────────────────────────────────────
const openEditorBtn = document.getElementById('open-editor-btn');
if (openEditorBtn) {
  openEditorBtn.addEventListener('click', () => {
    document.getElementById('public-view').classList.remove('active');
    document.getElementById('editor-view').classList.add('active');
    syncProfileFormToState();
    renderEditLinks();
  });
}
document.getElementById('close-editor-btn').addEventListener('click', () => {
  document.getElementById('editor-view').classList.remove('active');
  document.getElementById('public-view').classList.add('active');
});

// ── PANEL NAVIGATION ──────────────────────────────────────────
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const panel = btn.dataset.panel;
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`panel-${panel}`).classList.add('active');
    if (panel === 'links') renderEditLinks();
  });
});

// ── SHARE ─────────────────────────────────────────────────────
document.getElementById('share-btn').addEventListener('click', async () => {
  const url = location.href.split('?')[0].split('#')[0];
  try {
    if (navigator.share) {
      await navigator.share({ title: state.profile.name || 'LinkFólio', url });
    } else {
      await navigator.clipboard.writeText(url);
      showToast('Link copiado! ✦');
    }
  } catch {
    showToast('Link: ' + url);
  }
});

function showToast(msg) {
  const toast = document.getElementById('share-toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

// ── DESCRIPTION COUNTER ───────────────────────────────────────
document.getElementById('edit-desc').addEventListener('input', updateDescCount);

// ── INIT ──────────────────────────────────────────────────────
function init() {
  // Carrega estado salvo (se houver) antes de renderizar
  try {
    const raw = localStorage.getItem('linkfolio');
    if (raw) {
      const saved = JSON.parse(raw);
      if (saved && typeof saved === 'object') {
        if (saved.profile) state.profile = { ...state.profile, ...saved.profile };
        if (Array.isArray(saved.links)) state.links = saved.links.map(l => ({ ...l }));
      }
    }
  } catch (e) {}

  applyTheme(state.profile.theme || 'dark');
  document.querySelectorAll('.theme-card').forEach(b => {
    const active = b.dataset.theme === (state.profile.theme || 'dark');
    b.classList.toggle('active', active);
    b.setAttribute('aria-pressed', active);
  });
  renderPublic();
}

init();