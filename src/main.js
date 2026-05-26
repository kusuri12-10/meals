import '../index.css'
import {
  TODAY, currentDate, isLightMode, isCalendarOpen, currentMealTab,
  setCurrentDate, setIsLightMode, setIsCalendarOpen, setCalendarMonth, setCurrentMealTab,
} from './state.js'
import { renderAll, renderMeals, renderThemeBtn, renderCalendar, renderMealTabs } from './render.js'

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

// Function to handle switching tabs on mobile
function setActiveMealTab(mealIndex) {
  if (currentMealTab === mealIndex) return
  setCurrentMealTab(mealIndex)
  renderMealTabs()

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

// Connect mobile tabs click event
const tabsContainer = document.getElementById('mealTabs')
if (tabsContainer) {
  tabsContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.tab-btn')
    if (!btn) return
    const mealIndex = parseInt(btn.dataset.meal, 10)
    setActiveMealTab(mealIndex)
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

function navigateMealTab(direction) {
  if (window.innerWidth >= 768) return // Only on mobile viewport
  const newTab = currentMealTab + direction
  if (newTab >= 0 && newTab <= 2) {
    setActiveMealTab(newTab)
  }
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
  setIsLightMode(!isLightMode)
  document.body.classList.toggle('light', isLightMode)
  renderThemeBtn()
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
document.body.classList.add('light')
renderAll()
renderMeals()
