// ==== Утилита загрузки txt ====
async function loadText(path) {
  try {
    const res = await fetch(path, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } catch (e) {
    console.error(`Не удалось загрузить ${path}:`, e);
    return null;
  }
}

// ==== API (одна строка, несколько пунктов через ·) ====
async function initApi() {
  const out = document.getElementById('api-output');
  const raw = await loadText('Data/api.txt');
  if (raw === null) { out.textContent = 'ошибка загрузки'; return; }

  const items = raw.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  if (!items.length) { out.textContent = 'нет данных'; return; }

  out.innerHTML = items
    .map(line => `<span class="api-item">${escapeHtml(line)}</span>`)
    .join('');
}

// ==== ОПИСАНИЕ ====
async function initDescription() {
  const out = document.getElementById('description-output');
  const raw = await loadText('Data/description.txt');
  if (raw === null) { out.textContent = 'ошибка загрузки'; return; }
  out.textContent = raw.trim();
}

// ==== ИВЕНТЫ ====
async function initEvents() {
  const out = document.getElementById('events-output');
  const raw = await loadText('Data/events.txt');
  if (raw === null) { out.textContent = 'ошибка загрузки'; return; }
  out.textContent = raw.trim();
}

// ==== Тогглер ивентов (раскрывает рамку вместе с контентом) ====
function initEventsToggle() {
  const btn = document.getElementById('events-toggle');
  const content = document.getElementById('events-content');
  const frame = document.getElementById('events-frame');
  btn.addEventListener('click', () => {
    const open = content.classList.toggle('open');
    frame.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

// ==== Безопасный HTML ====
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ==== Запуск ====
document.addEventListener('DOMContentLoaded', () => {
  initApi();
  initDescription();
  initEvents();
  initEventsToggle();
});