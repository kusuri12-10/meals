export const TODAY = new Date()
export let currentDate = new Date(TODAY)
export let isLightMode = true
export let isCalendarOpen = false
export let calendarMonth = new Date(TODAY.getFullYear(), TODAY.getMonth(), 1)

export function getDefaultMealTab() {
  const hours = new Date().getHours()
  if (hours < 9) return 0 // 조식 (09:00 이전)
  if (hours < 14) return 1 // 중식 (14:00 이전)
  return 2 // 석식 (14:00 이후)
}

export let currentMealTab = getDefaultMealTab()

export function setCurrentDate(d) { currentDate = d }
export function setIsLightMode(v) { isLightMode = v }
export function setIsCalendarOpen(v) { isCalendarOpen = v }
export function setCalendarMonth(d) { calendarMonth = d }
export function setCurrentMealTab(v) { currentMealTab = v }

