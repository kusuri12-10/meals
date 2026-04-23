function getMealsForDate(dateStr) {
  const found = mockMealData.find(d => d.date === dateStr);
  return found ? found.meals : [];
}

// ── STATE ─────────────────────────────────────
const TODAY = new Date(2026, 3, 21);
let currentDate = new Date(2026, 3, 21);
let isLightMode = false;
let isCalendarOpen = false;
let calendarMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

// ── SVG ICONS ─────────────────────────────────
const ICONS = {
  sun:      `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>`,
  moon:     `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
  sunrise:  `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v8"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m8 6 4-4 4 4"/><path d="M16 18a4 4 0 0 0-8 0"/></svg>`,
  sunMed:   `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>`,
  moonSm:   `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
  utensils: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 11 19-9-9 19-2-8-8-2z"/><path d="m11.5 12.5 5 5"/></svg>`,
  chevL:    `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>`,
  chevR:    `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`,
};

function getMealIcon(type) {
  if (type === '조식') return ICONS.sunrise;
  if (type === '중식') return ICONS.sunMed;
  return ICONS.moonSm;
}

// ── HELPERS ───────────────────────────────────
function formatDate(date) {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${days[date.getDay()]}요일`;
}
function toDateStr(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
function isToday(date) {
  return date.toDateString() === TODAY.toDateString();
}

// ── RENDER: THEME BTN ─────────────────────────
function renderThemeBtn() {
  const btn = document.getElementById('themeBtn');
  btn.innerHTML = isLightMode ? ICONS.moon : ICONS.sun;
  btn.setAttribute('aria-label', isLightMode ? '다크 모드로 전환' : '라이트 모드로 전환');
}

// ── RENDER: DATE NAV ──────────────────────────
function renderDateNav() {
  document.getElementById('dateText').textContent = formatDate(currentDate);
  document.getElementById('todayBtn').style.display = isToday(currentDate) ? 'none' : 'inline-block';
}

// ── RENDER: CALENDAR ──────────────────────────
function getZoom() {
  const z = parseFloat(getComputedStyle(document.documentElement).zoom || '1');
  return isNaN(z) ? 1 : z;
}

function renderCalendar() {
  const existing = document.getElementById('calendarPopup');
  if (existing) existing.remove();
  if (!isCalendarOpen) return;

  const MONTH_NAMES = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const z = getZoom();
  const btnRect = document.getElementById('dateDisplayBtn').getBoundingClientRect();
  const popupTop  = (btnRect.bottom * z) + 8;
  const popupLeft = (btnRect.left + btnRect.width / 2) * z;

  const popup = document.createElement('div');
  popup.className = 'calendar-popup';
  popup.id = 'calendarPopup';
  popup.setAttribute('role', 'dialog');
  popup.style.top  = `${popupTop}px`;
  popup.style.left = `${popupLeft}px`;
  popup.style.marginLeft = '-8rem';

  popup.innerHTML = `
    <div class="cal-header">
      <button class="cal-nav-btn" id="calPrevBtn" aria-label="이전 달">${ICONS.chevL}</button>
      <div class="cal-month-label">${year}년 ${MONTH_NAMES[month]}</div>
      <button class="cal-nav-btn" id="calNextBtn" aria-label="다음 달">${ICONS.chevR}</button>
    </div>
    <div class="cal-dow">
      <span>일</span><span>월</span><span>화</span>
      <span>수</span><span>목</span><span>금</span><span>토</span>
    </div>
    <div class="cal-days" id="calDays"></div>
  `;

  document.body.appendChild(popup);

  const grid = document.getElementById('calDays');
  for (let i = 0; i < firstDay; i++) grid.appendChild(document.createElement('div'));
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const btn = document.createElement('button');
    btn.className = 'cal-day';
    btn.textContent = d;
    btn.setAttribute('aria-label', `${d}일`);
    if (date.toDateString() === currentDate.toDateString()) btn.classList.add('selected');
    if (date.toDateString() === TODAY.toDateString()) btn.classList.add('today');
    btn.addEventListener('click', () => {
      currentDate = new Date(year, month, d);
      isCalendarOpen = false;
      renderAll();
      renderMeals();
    });
    grid.appendChild(btn);
  }

  document.getElementById('calPrevBtn').addEventListener('click', e => {
    e.stopPropagation();
    calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1);
    renderCalendar();
  });
  document.getElementById('calNextBtn').addEventListener('click', e => {
    e.stopPropagation();
    calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1);
    renderCalendar();
  });
}

// ── RENDER: MEALS ─────────────────────────────
function renderMeals() {
  const grid = document.getElementById('mealGrid');
  const mealTypes = ['조식', '중식', '석식'];
  const meals = getMealsForDate(toDateStr(currentDate));

  grid.classList.add('fade-out');
  grid.addEventListener('animationend', () => {
    grid.classList.remove('fade-out');
    grid.innerHTML = '';

    mealTypes.forEach((type, index) => {
      const meal = meals.find(m => m.type === type);
      const card = document.createElement('article');
      card.className = 'meal-card';
      card.style.animationDelay = `${index * 0.12}s`;

      let bodyHtml;
      if (meal) {
        const items = meal.menu.map(item => `
          <li class="menu-item">
            <span class="menu-bullet"></span>
            <span>${item}</span>
          </li>`).join('');
        bodyHtml = `
          <ul class="menu-list">${items}</ul>
          <div class="calories-row">
            <span class="calories-label">총 열량</span>
            <span class="calories-value">${meal.calories} kcal</span>
          </div>`;
      } else {
        bodyHtml = `
          <div class="empty-state">
            <div class="empty-icon-wrap">${ICONS.utensils}</div>
            <p class="empty-text">급식 정보가 없습니다</p>
          </div>`;
      }

      card.innerHTML = `
        <header class="card-header">
          <div class="icon-wrap">${getMealIcon(type)}</div>
          <h3 class="card-title">${type}</h3>
        </header>
        <div class="card-body">${bodyHtml}</div>`;
      grid.appendChild(card);
    });

    grid.classList.add('fade-in');
    grid.addEventListener('animationend', () => grid.classList.remove('fade-in'), { once: true });
  }, { once: true });
}

function renderAll() {
  renderThemeBtn();
  renderDateNav();
  renderCalendar();
}

// ── EVENTS ────────────────────────────────────
document.getElementById('themeBtn').addEventListener('click', () => {
  isLightMode = !isLightMode;
  document.body.classList.toggle('light', isLightMode);
  renderThemeBtn();
});
document.getElementById('prevBtn').addEventListener('click', () => {
  const d = new Date(currentDate);
  d.setDate(d.getDate() - 1);
  currentDate = d;
  isCalendarOpen = false;
  renderAll(); renderMeals();
});
document.getElementById('nextBtn').addEventListener('click', () => {
  const d = new Date(currentDate);
  d.setDate(d.getDate() + 1);
  currentDate = d;
  isCalendarOpen = false;
  renderAll(); renderMeals();
});
document.getElementById('todayBtn').addEventListener('click', () => {
  currentDate = new Date(TODAY);
  isCalendarOpen = false;
  renderAll(); renderMeals();
});
document.getElementById('dateDisplayBtn').addEventListener('click', e => {
  e.stopPropagation();
  isCalendarOpen = !isCalendarOpen;
  if (isCalendarOpen) calendarMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  renderCalendar();
});
document.addEventListener('mousedown', e => {
  if (!isCalendarOpen) return;
  const popup = document.getElementById('calendarPopup');
  const btn   = document.getElementById('dateDisplayBtn');
  if (popup && !popup.contains(e.target) && !btn.contains(e.target)) {
    isCalendarOpen = false;
    renderCalendar();
  }
});

// ── INIT ──────────────────────────────────────
renderAll();
renderMeals();