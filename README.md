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
