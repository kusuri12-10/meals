import json
import requests
from datetime import datetime, timezone, timedelta
import os

def get_kst_now():
    """시스템 시간과 상관없이 한국 표준시(KST) 반환"""
    kst_timezone = timezone(timedelta(hours=9))
    return datetime.now(kst_timezone)

TODAY = get_kst_now().strftime("%Y%m%d")
YEAR_MONTH = get_kst_now().strftime("%Y-%m")
FILE_NALE = f'meal/{YEAR_MONTH}.json'

def get_meal_type_by_time():
    """한국 시간 기준으로 급식 유형 판별"""
    now = get_kst_now()
    hour = now.hour
    
    print(f"현재 시간: {now.strftime('%Y-%m-%d %H:%M:%S')}")
    
    if 8 <= hour < 13: 
        return "중식"
    elif 13 <= hour < 18: 
        return "석식"
    else: 
        return "조식"

def send_discord_message(webhook_url, meal):
    if not meal:
        print("급식 정보가 없습니다.")
        return

    dish_name = meal['DDISH_NM'].replace('<br/>', '\n').strip()
    
    payload = {
        "username": "급식 알리미",
        "embeds": [{
            "title": f"🍴 {meal['MMEAL_SC_NM']} ({meal['MLSV_YMD']})",
            "description": f"**[식단 메뉴]**\n{dish_name}",
            "color": 0x0bc2f5,
            "fields": [
                {"name": "🔥 칼로리", "value": meal['CAL_INFO'], "inline": True}
            ],
            "footer": {"text": "meals alarm"}
        }]
    }
    
    response = requests.post(webhook_url, json=payload)
    if response.status_code == 204:
        print("디스코드 메시지 전송 성공!")
    else:
        print(f"전송 실패: {response.status_code}, {response.text}")

def main():
    meal_type = get_meal_type_by_time() # 현재 시간에 따른 타입 결정
    
    print(f"현재 시간 기준 급식 유형: {meal_type}")

    with open(FILE_NALE, 'r', encoding='utf-8') as f:
        data = json.load(f)

    meal_info_list = data.get("mealServiceDietInfo", [])
    if len(meal_info_list) < 2:
        print("데이터 형식이 올바르지 않습니다.")
        return

    rows = meal_info_list[1].get("row", [])
    
    # 오늘 날짜와 결정된 식사 타입이 모두 일치하는 데이터 찾기
    target_meal = next((
        row for row in rows 
        if row.get("MLSV_YMD") == TODAY and row.get("MMEAL_SC_NM") == meal_type
    ), None)

    webhook_url = os.environ.get("ALARM_WEBHOOK")
    if webhook_url and target_meal:
        send_discord_message(webhook_url, target_meal)
    elif not target_meal:
        print(f"오늘 {meal_type} 정보가 없습니다.")
    else:
        print("설정된 ALARM_WEBHOOK을 찾을 수 없습니다.")

if __name__ == "__main__":
    main()