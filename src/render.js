import { ICONS, getMealIcon } from './icons.js'
import { formatDate, toDateStr, isToday } from './helpers.js'
import { getMealsForDate } from './data.js'
import {
  TODAY, currentDate, isLightMode, isCalendarOpen, calendarMonth,
  setCurrentDate, setIsCalendarOpen, setCalendarMonth,
} from './state.js'

export function renderThemeBtn() {
  const btn = document.getElementById('themeBtn')
  btn.innerHTML = isLightMode ? ICONS.moon : ICONS.sun
  btn.setAttribute('aria-label', isLightMode ? '다크 모드로 전환' : '라이트 모드로 전환')
}

export function renderDateNav() {
  document.getElementById('dateText').textContent = formatDate(currentDate)
  document.getElementById('todayBtn').style.display = isToday(currentDate) ? 'none' : 'inline-block'
}

function getZoom() {
  const z = parseFloat(getComputedStyle(document.documentElement).zoom || '1')
  return isNaN(z) ? 1 : z
}

export function renderCalendar() {
  const existing = document.getElementById('calendarPopup')
  if (existing) existing.remove()
  if (!isCalendarOpen) return

  const MONTH_NAMES = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']
  const year = calendarMonth.getFullYear()
  const month = calendarMonth.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const z = getZoom()
  const btnRect = document.getElementById('dateDisplayBtn').getBoundingClientRect()
  const popup = document.createElement('div')
  popup.className = 'calendar-popup'
  popup.id = 'calendarPopup'
  popup.setAttribute('role', 'dialog')
  popup.style.top = `${(btnRect.bottom * z) + 8}px`
  popup.style.left = `${(btnRect.left + btnRect.width / 2) * z}px`
  popup.style.marginLeft = '-8rem'

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
  `
  document.body.appendChild(popup)

  const grid = document.getElementById('calDays')
  for (let i = 0; i < firstDay; i++) grid.appendChild(document.createElement('div'))
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d)
    const btn = document.createElement('button')
    btn.className = 'cal-day'
    btn.textContent = d
    btn.setAttribute('aria-label', `${d}일`)
    if (date.toDateString() === currentDate.toDateString()) btn.classList.add('selected')
    if (date.toDateString() === TODAY.toDateString()) btn.classList.add('today')
    btn.addEventListener('click', () => {
      setCurrentDate(new Date(year, month, d))
      setIsCalendarOpen(false)
      renderAll()
      renderMeals()
    })
    grid.appendChild(btn)
  }

  document.getElementById('calPrevBtn').addEventListener('click', e => {
    e.stopPropagation()
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))
    renderCalendar()
  })
  document.getElementById('calNextBtn').addEventListener('click', e => {
    e.stopPropagation()
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))
    renderCalendar()
  })
}

export async function renderMeals() {
  const grid = document.getElementById('mealGrid')
  const mealTypes = ['조식', '중식', '석식']
  const meals = await getMealsForDate(toDateStr(currentDate))

  grid.classList.add('fade-out')
  grid.addEventListener('animationend', () => {
    grid.classList.remove('fade-out')
    grid.innerHTML = ''

    mealTypes.forEach((type, index) => {
      const meal = meals.find(m => m.type === type)
      const card = document.createElement('article')
      card.className = 'meal-card'
      card.style.animationDelay = `${index * 0.12}s`

      let bodyHtml
      if (meal) {
        const items = meal.menu.map(item => `
          <li class="menu-item">
            <span class="menu-bullet"></span>
            <span>${item}</span>
          </li>`).join('')
        bodyHtml = `
          <ul class="menu-list">${items}</ul>
          <div class="calories-row">
            <span class="calories-label">총 열량</span>
            <span class="calories-value">${meal.calories} kcal</span>
          </div>`
      } else {
        bodyHtml = `
          <div class="empty-state">
            <div class="empty-icon-wrap">${ICONS.utensils}</div>
            <p class="empty-text">급식 정보가 없습니다</p>
          </div>`
      }

      card.innerHTML = `
        <header class="card-header">
          <div class="icon-wrap">${getMealIcon(type)}</div>
          <h3 class="card-title">${type}</h3>
        </header>
        <div class="card-body">${bodyHtml}</div>`
      grid.appendChild(card)
    })

    grid.classList.add('fade-in')
    grid.addEventListener('animationend', () => grid.classList.remove('fade-in'), { once: true })
  }, { once: true })
}

export function renderAll() {
  renderThemeBtn()
  renderDateNav()
  renderCalendar()
  document.getElementById('footerGithub').innerHTML = ICONS.github
}
