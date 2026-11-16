// ================= УТИЛИТЫ =================
async function loadText(path) {
  try {
    const res = await fetch(path, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } catch (e) {
    console.warn(`Не удалось загрузить ${path}:`, e);
    return null;
  }
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ================= УВЕДОМЛЕНИЕ =================
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2000);
}

// ================= API И ОНЛАЙН =================
async function initApi() {
  const out = document.getElementById('api-output');
  const raw = await loadText('Data/api.txt');
  
  if (!raw || !raw.trim()) { 
    out.textContent = 'Ожидание IP'; 
    return; 
  }

  const ip = raw.trim().split('\n')[0].trim();
  out.textContent = ip;
  
  // Делаем IP кликабельным
  out.classList.add('clickable');
  out.addEventListener('click', () => {
    navigator.clipboard.writeText(ip).then(() => {
      showToast('IP скопирован!');
    }).catch(err => {
      console.error('Ошибка копирования:', err);
      showToast('Ошибка копирования');
    });
  });

  // Запрос онлайна (mcsrvstat.us)
  try {
    const res = await fetch(`https://api.mcsrvstat.us/2/${ip}`);
    const data = await res.json();
    
    let statusHtml = '';
    if (data.online) {
      statusHtml = ` <span class="online-status valid">[${data.players.online}/${data.players.max}]</span>`;
    } else {
      statusHtml = ` <span class="online-status invalid">[Оффлайн]</span>`;
    }
    
    // Добавляем статус после IP
    out.insertAdjacentHTML('afterend', statusHtml);
  } catch (e) {
    console.error('Ошибка при запросе онлайна:', e);
  }
}

// ================= ОПИСАНИЕ =================
async function initDescription() {
  const out = document.getElementById('description-output');
  const raw = await loadText('Data/description.txt');
  if (raw === null) { out.textContent = 'ошибка загрузки'; return; }
  out.textContent = raw.trim();
}

// ================= ИВЕНТЫ =================
async function initEvents() {
  const out = document.getElementById('events-output');
  const raw = await loadText('Data/events.txt');
  if (raw === null) { out.textContent = 'ошибка загрузки'; return; }
  out.textContent = raw.trim();
}

// ================= СОЦСЕТИ =================
async function initSideLinks() {
  const socialsRaw = await loadText('Data/socials.txt');
  const container = document.getElementById('socials-container');
  
  if (socialsRaw && socialsRaw.trim()) {
    const lines = socialsRaw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    
    lines.forEach(line => {
      const parts = line.split('|');
      if (parts.length >= 2) {
        const name = parts[0].trim();
        const url = parts[1].trim();
        
        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener';
        a.className = 'social-btn';
        a.textContent = name.substring(0, 2).toUpperCase(); // Берем первые 2 буквы
        a.title = name;
        container.appendChild(a);
      }
    });
  }
}

// ================= ТОГГЛЕР ИВЕНТОВ =================
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

// ================= ЗАПУСК =================
document.addEventListener('DOMContentLoaded', () => {
  initApi();
  initDescription();
  initEvents();
  initSideLinks();
  initEventsToggle();
});
