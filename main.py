import requests
import os
from dotenv import load_dotenv
from datetime import date, datetime
import json
import calendar

load_dotenv()

BASE_URL = os.environ.get("BASE_URL") 
API_KEY = os.environ.get("API_KEY")

LAST_DATE_FILE = "last.txt"

def save_file(filename, content):
    with open(filename, "w", encoding="utf-8") as f:
        f.write(content)

def save_json(filename, data):
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

def read_file(filename):
    if os.path.exists(filename):
        with open(filename, "r", encoding="utf-8") as f:
            return f.read().strip()
    return ""

def read_json(filename):
    if os.path.exists(filename):
        with open(filename, 'r', encoding='utf-8') as f:
            return json.load(f)
    return None

def get_month_range(yymm_str):
    dt = datetime.strptime(yymm_str, "%Y-%m")
    last_day = calendar.monthrange(dt.year, dt.month)[1]
    
    start = dt.strftime("%Y%m01")
    end = dt.strftime(f"%Y%m{last_day}")
    return start, end

def get_next_month(yymm_str):
    dt = datetime.strptime(yymm_str, "%Y-%m")
    year, month = dt.year, dt.month + 1
    if month > 12:
        month = 1
        year += 1
    return f"{year}-{month:02}"

def read_last_date():
    last_date = read_file(LAST_DATE_FILE)
    
    if not last_date:
        print("last.txt가 없어 복구를 시도합니다...")
        current_ym = date.today().strftime('%Y-%m')
        meal_json_path = f"meal/{current_ym}.json"
        
        data = read_json(meal_json_path)
        if data:
            try:
                last_row = data["mealServiceDietInfo"][1]["row"][-1]
                ymd = last_row["MLSV_YMD"]
                formatted_date = datetime.strptime(ymd, "%Y%m%d").strftime("%Y-%m")
                
                save_file(LAST_DATE_FILE, formatted_date)
                return formatted_date
            except (KeyError, IndexError, TypeError):
                print("JSON 파일은 있으나 급식 데이터가 없습니다.")
        
        print("복구 실패: 오늘 날짜를 기준으로 시작합니다.")
        return date.today().strftime('%Y-%m')
    
    return last_date

def getMealInfos():
    last_date = read_last_date()
    next_month = get_next_month(last_date)
    start, end = get_month_range(next_month)
    
    params = {
        "ATPT_OFCDC_SC_CODE": "G10",
        "SD_SCHUL_CODE": "7430310",
        "Type": "json",
        "KEY": API_KEY,
        "MLSV_FROM_YMD": start,
        "MLSV_TO_YMD": end
    }

    try:
        response = requests.get(BASE_URL, params=params)
        data = response.json()
        
        if "mealServiceDietInfo" in data:
            status_code = data["mealServiceDietInfo"][0]["head"][1]["RESULT"]["CODE"]

            if status_code == "INFO-000":
                meal_json_path = f"meal/{next_month}.json"
                save_json(meal_json_path, data)
                save_file(LAST_DATE_FILE, next_month)
                print(f"[{status_code}] {next_month} 저장 완료!")
            else:
                msg = data["mealServiceDietInfo"][0]["head"][1]["RESULT"]["MESSAGE"]
                print(f"저장 실패: {status_code} ({msg})")
        else:
            if "RESULT" in data:
                print(f"API 오류: {data['RESULT']['CODE']} - {data['RESULT']['MESSAGE']}")
            else:
                print("알 수 없는 데이터 형식입니다.")
    except Exception as e:
        print(f"API 요청 중 오류 발생: {e}")

if __name__ == "__main__":
    getMealInfos()