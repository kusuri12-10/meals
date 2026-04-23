export const TODAY = new Date()
export let currentDate = new Date(TODAY)
export let isLightMode = true
export let isCalendarOpen = false
export let calendarMonth = new Date(TODAY.getFullYear(), TODAY.getMonth(), 1)

export function setCurrentDate(d) { currentDate = d }
export function setIsLightMode(v) { isLightMode = v }
export function setIsCalendarOpen(v) { isCalendarOpen = v }
export function setCalendarMonth(d) { calendarMonth = d }
