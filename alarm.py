import discord
import json
import os
from datetime import datetime, timezone, timedelta

def get_kst_now():
    return datetime.now(timezone(timedelta(hours=9)))

def get_meal_data():
    now = get_kst_now()
    today = now.strftime("%Y%m%d")
    year_month = now.strftime("%Y-%m")
    
    hour = now.hour
    if 8 <= hour < 13: meal_type = "중식"
    elif 13 <= hour < 18: meal_type = "석식"
    else: meal_type = "조식"

    try:
        file_path = f'meal/{year_month}.json'
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        rows = data["mealServiceDietInfo"][1]["row"]
        meal = next((r for r in rows if r['MLSV_YMD'] == today and r['MMEAL_SC_NM'] == meal_type), None)
        return meal, meal_type
    except Exception as e:
        print(f"데이터 로드 에러: {e}")
        return None, meal_type

client = discord.Client(intents=discord.Intents.default())

@client.event
async def on_ready():
    print(f'✅ {client.user.name} 봇으로 로그인되었습니다.')
    
    meal, meal_type = get_meal_data()
    
    if meal:
        dish_name = meal['DDISH_NM'].replace('<br/>', '\n').strip()
        embed = discord.Embed(
            title=f"🍴 오늘의 {meal['MMEAL_SC_NM']} ({meal['MLSV_YMD']})",
            description=f"**[식단 메뉴]**\n{dish_name}",
            color=0x0bc2f5
        )
        embed.add_field(name="🔥 칼로리", value=meal['CAL_INFO'], inline=True)
        embed.set_footer(text="대덕소프트웨어마이스터고 급식 알리미")

        # 검색할 키워드 리스트
        keywords = ['급식', 'meal', '밥']
        
        # 봇이 참여 중인 모든 서버 순회
        for guild in client.guilds:
            sent_in_guild = False
            for channel in guild.text_channels:
                # 채널 이름에 키워드가 포함되어 있는지 확인 (소문자 변환 후 비교)
                if any(kw in channel.name.lower() for kw in keywords):
                    try:
                        await channel.send(embed=embed)
                        print(f"✅ [{guild.name}] #{channel.name} 전송 성공")
                        sent_in_guild = True
                        # 한 서버에서 여러 채널에 중복 전송되는 것을 막으려면 break (원치 않으면 삭제)
                        break 
                    except Exception as e:
                        print(f"❌ [{guild.name}] #{channel.name} 권한 부족: {e}")
            
            if not sent_in_guild:
                print(f"ℹ️ [{guild.name}] 조건에 맞는 채널을 찾지 못함")
    else:
        print(f"ℹ️ 현재 시간({meal_type})에 해당하는 급식 데이터가 없습니다.")
    
    # 전송 완료 후 세션 종료 (GitHub Actions 종료를 위해 필수)
    await client.close()

# 환경 변수 실행
token = os.environ.get("DISCORD_BOT_TOKEN")
if token:
    client.run(token)
else:
    print("❌ DISCORD_BOT_TOKEN 환경 변수가 설정되지 않았습니다.")