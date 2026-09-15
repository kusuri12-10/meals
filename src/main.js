import '../index.css'
import {
  TODAY, currentDate, isLightMode, isCalendarOpen, currentMealTab,
  setCurrentDate, setIsLightMode, setIsCalendarOpen, setCalendarMonth, setCurrentMealTab,
} from './state.js'
import { renderAll, renderMeals, renderThemeBtn, renderCalendar, renderMealDots } from './render.js'

const colorScheme = matchMedia('(prefers-color-scheme: light)')

function applyTheme(isLight) {
  setIsLightMode(isLight)
  document.body.classList.toggle('light', isLight)
  renderThemeBtn()
}

colorScheme.addEventListener('change', (event) => applyTheme(event.matches))

const installDialog = document.getElementById('installDialog')
let installPrompt

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault()
  installPrompt = event
  installDialog.showModal()
})

document.getElementById('installBtn').addEventListener('click', async () => {
  installDialog.close()
  await installPrompt.prompt()
  installPrompt = null
})

document.getElementById('installCancelBtn').addEventListener('click', () => installDialog.close())

// Register PWA Service Worker (only in production to prevent Vite ESM hot-reload caching issues)
if ('serviceWorker' in navigator) {
  if (import.meta.env.DEV) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (let registration of registrations) {
        registration.unregister().then((success) => {
          if (success) {
            console.log('[Dev] Active Service Worker unregistered to prevent Vite caching issues.');
            window.location.reload();
          }
        });
      }
    });
  } else if (import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => console.log('Service Worker registered successfully with scope:', reg.scope))
        .catch((err) => console.error('Service Worker registration failed:', err))
    })
  }
}

// Function to handle switching cards on mobile with slide animations
function setActiveMealTab(mealIndex, direction = 'next') {
  if (currentMealTab === mealIndex) return
  setCurrentMealTab(mealIndex)
  renderMealDots()

  const grid = document.getElementById('mealGrid')
  if (grid) {
    grid.className = `meal-grid slide-${direction}`
  }

  // Toggle active class on cards for fluid animation
  const cards = document.querySelectorAll('.meal-card')
  cards.forEach((card, idx) => {
    if (idx === mealIndex) {
      card.classList.add('active')
    } else {
      card.classList.remove('active')
    }
  })
}

// Connect mobile page dots click event
const dotsContainer = document.getElementById('mealDots')
if (dotsContainer) {
  dotsContainer.addEventListener('click', (e) => {
    const dot = e.target.closest('.dot')
    if (!dot) return
    const mealIndex = parseInt(dot.dataset.meal, 10)
    const slideDirection = mealIndex > currentMealTab ? 'next' : 'prev'
    setActiveMealTab(mealIndex, slideDirection)
  })
}

// Swipe gestures detection for mobile
let touchStartX = 0
let touchEndX = 0

function handleSwipe() {
  const swipeThreshold = 50
  const diff = touchEndX - touchStartX
  if (Math.abs(diff) < swipeThreshold) return

  if (diff > swipeThreshold) {
    navigateMealTab(-1) // Swipe Right -> Previous meal
  } else if (diff < -swipeThreshold) {
    navigateMealTab(1) // Swipe Left -> Next meal
  }
}

function navigateMealTab(diff) {
  if (window.innerWidth >= 768) return // Only on mobile viewport
  const newTab = currentMealTab + diff
  if (newTab >= 0 && newTab <= 2) {
    const slideDirection = diff > 0 ? 'next' : 'prev'
    setActiveMealTab(newTab, slideDirection)
    return
  }

  // Move to the adjacent day when swiping past the first or last meal.
  if (diff > 0 && currentMealTab === 2) {
    const nextDate = new Date(currentDate)
    nextDate.setDate(nextDate.getDate() + 1)
    setCurrentDate(nextDate)
    setCurrentMealTab(0)
  } else if (diff < 0 && currentMealTab === 0) {
    const previousDate = new Date(currentDate)
    previousDate.setDate(previousDate.getDate() - 1)
    setCurrentDate(previousDate)
    setCurrentMealTab(2)
  } else {
    return
  }

  setIsCalendarOpen(false)
  renderAll()
  renderMeals()
}

const mealGrid = document.getElementById('mealGrid')
if (mealGrid) {
  mealGrid.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX
  }, { passive: true })

  mealGrid.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX
    handleSwipe()
  }, { passive: true })
}

// Global Event Listeners
document.getElementById('themeBtn').addEventListener('click', () => {
  applyTheme(!isLightMode)
})

document.getElementById('prevBtn').addEventListener('click', () => {
  const d = new Date(currentDate)
  d.setDate(d.getDate() - 1)
  setCurrentDate(d)
  setIsCalendarOpen(false)
  renderAll()
  renderMeals()
})

document.getElementById('nextBtn').addEventListener('click', () => {
  const d = new Date(currentDate)
  d.setDate(d.getDate() + 1)
  setCurrentDate(d)
  setIsCalendarOpen(false)
  renderAll()
  renderMeals()
})

document.getElementById('todayBtn').addEventListener('click', () => {
  setCurrentDate(new Date(TODAY))
  setIsCalendarOpen(false)
  renderAll()
  renderMeals()
})

document.getElementById('dateDisplayBtn').addEventListener('click', e => {
  e.stopPropagation()
  setIsCalendarOpen(!isCalendarOpen)
  if (isCalendarOpen) setCalendarMonth(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
  renderCalendar()
})

document.addEventListener('mousedown', e => {
  if (!isCalendarOpen) return
  const popup = document.getElementById('calendarPopup')
  const btn = document.getElementById('dateDisplayBtn')
  if (popup && !popup.contains(e.target) && !btn.contains(e.target)) {
    setIsCalendarOpen(false)
    renderCalendar()
  }
})

// Initialize Application
document.body.classList.toggle('light', isLightMode)
renderAll()
renderMeals()
