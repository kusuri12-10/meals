# meals

meals는 학교 급식 정보를 날짜별로 조회할 수 있는 Web App입니다.

## 기능

- 날짜 네비게이션으로 날짜별 조식·중식·석식 메뉴 확인
- 캘린더 팝업으로 날짜 직접 선택
- 라이트 / 다크 모드 전환

## 기술 스택

- Vanilla JS (ES Modules)
- Vite
- Netlify (배포)

## 로컬 실행

```bash
npm install
npm run dev
```

## 급식 데이터 수집

`main.py`는 매월 [나이스 교육정보 개방 포털 API](https://open.neis.go.kr)에서 급식 데이터를 받아 `meal/YYYY-MM.json` 형식의 json 파일로 저장합니다.

`.env` 파일에 아래 환경 변수를 설정한 뒤 실행합니다.

```
BASE_URL=https://open.neis.go.kr/hub/mealServiceDietInfo
API_KEY=
```

```bash
python main.py
```

실행 시 `last.txt`에 기록된 마지막 월을 기준으로 다음 달 데이터를 가져옵니다. `last.txt`가 없으면 현재 월을 기준으로 자동 복구합니다.

## discord 봇 초대 링크

[meals bot](https://discord.com/oauth2/authorize?client_id=1497072615712493589&permissions=19456&integration_type=0&scope=bot)

디스코드 서버에 해당 봇을 초대한 뒤, 급식 / meal / 밥 키워드가 포함된 이름으로 채널을 생성해주세요. 특정 시간마다 해당 채널로 알림이 발송됩니다.

알림 발송 시간은 다음과 같습니다:
- 오전 6시 11분
- 오전 11시 11분
- 오후 4시 11분
- 오후 11시 11분

알림 발송은 github actions의 작업 스케줄러인 cron을 이용하기 때문에 시간 오차가 발생할 수 있습니다.

## 서비스 피드백 남기기

[google form](https://forms.gle/1KSBfJhxXfpVJZa96)
