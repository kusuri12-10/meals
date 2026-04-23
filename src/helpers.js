import { TODAY } from './state.js'

const DAYS = ['일', '월', '화', '수', '목', '금', '토']

export function formatDate(date) {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${DAYS[date.getDay()]}요일`
}

export function toDateStr(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function isToday(date) {
  return date.toDateString() === TODAY.toDateString()
}
