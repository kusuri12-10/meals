심플한 급식 정보를 조회할 수 있는 페이지를 만들어줘. 서비스 명은 'meals' 이며, 급식 정보를 빠르게 조회할 수 있는 플랫폼이야.

페이지에는 Meal Card 3개가 조식-중식-석식 순으로 나열되어 있어. 그리고 상단에 Date Navigator를 통해서 다른 날짜의 급식을 조회할 수 있어

## Domain Context

Key patterns: Meal Cards
Opportunity: Combine simplicity + Professionalism + Freshness

## User Journey

1. 메인 페이지: 당일의 급식 카드(3개ㅡ조식, 중식, 석식)을 바로 확인하고 급식 정보를 얻을 수 있음
2. 다른 날 급식 확인: Date Navigator를 활용하여 다른 날의 급식 정보를 확인해볼 수 있음

## Emotional Direction

- 편의성 (50%): 넓은 여백, 간결한 폼, 직관적인 CTA, 명확한 정보 계층
- 전문성 (30%): 데이터 강조, 정보 부각, 절제된 레이아웃
- 신선함 (20%): 선명한 블루-에메랄드 대비, 모던한 타이포, 다크 배경 활용

## Design System

색상: 메인 #0bc2f5, 서브 #10B981, 배경 #000515
폰트: Pretendard (헤딩 700, 본문 400)
간격: 기본 8px, 모서리 반경 12~16px, 부드러운 그림자

## Key Components

- Meal Card: 급식 타입(조식 / 중식 / 석식), 급식 메뉴, 칼로리, 급식 정보 없는 날 Empty State 처리 (공휴일, 방학 등)
- Date Navigator: 좌우 화살표(←/→)로 전날/다음날 이동, 클릭 시 캘린더 팝업으로 날짜 직접 선택 가능, 오늘 날짜로 돌아오는 'Today' 버튼 포함

## Interactions

- 카드: 호버 시 4px 상승, 200ms ease-out
- 페이지 로드: 페이지 로드 시 카드 순차 페이드인

## Requirements

- 데스크탑 우선 반응형
- 한국어 기본
- 접근성: 포커스 상태, 명도 대비 준수