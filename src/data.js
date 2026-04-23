function transformMealData(apiResponse) {
  const rows = apiResponse?.mealServiceDietInfo?.[1]?.row
  if (!rows) return []

  const groupedData = {}
  rows.forEach((item) => {
    const rawDate = item.MLSV_YMD
    const formattedDate = `${rawDate.substring(0, 4)}-${rawDate.substring(4, 6)}-${rawDate.substring(6, 8)}`

    const cleanMenu = item.DDISH_NM
      .split('<br/>')
      .map(menu => menu.replace(/\([0-9.]+\)/g, '').trim())
      .filter(menu => menu !== '')

    const calories = Math.round(parseFloat(item.CAL_INFO.replace(/[^0-9.]/g, '')))

    if (!groupedData[formattedDate]) {
      groupedData[formattedDate] = { date: formattedDate, meals: [] }
    }
    groupedData[formattedDate].meals.push({ type: item.MMEAL_SC_NM, menu: cleanMenu, calories })
  })

  return Object.values(groupedData)
}

async function loadMealData(dateStr) {
  try {
    const yearMonth = dateStr.match(/^\d{4}-\d{2}/)[0]
    const response = await fetch(`/meal/${yearMonth}.json`)
    if (!response.ok) throw new Error(`파일을 찾을 수 없습니다: meal/${yearMonth}.json`)
    const data = await response.json()
    return data?.mealServiceDietInfo ? transformMealData(data) : []
  } catch (error) {
    console.error('급식 로드 에러:', error)
    return []
  }
}

export async function getMealsForDate(dateStr) {
  const mealData = await loadMealData(dateStr)
  const found = mealData.find(d => d.date === dateStr)
  return found ? found.meals : []
}
