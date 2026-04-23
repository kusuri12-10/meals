import '../index.css'
import {
  TODAY, currentDate, isLightMode, isCalendarOpen,
  setCurrentDate, setIsLightMode, setIsCalendarOpen, setCalendarMonth,
} from './state.js'
import { renderAll, renderMeals, renderThemeBtn, renderCalendar } from './render.js'

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

renderAll()
renderMeals()
