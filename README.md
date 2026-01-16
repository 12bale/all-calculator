# Finance Lab

다양한 금융 및 생활 계산기를 제공하는 웹 애플리케이션입니다.

## 주요 기능

### 1. 자산 성장 시뮬레이터
- 매월 적립금과 배당 재투자를 고려한 자산 가치 계산
- 물가상승률 반영
- SCHD 등 ETF 투자 시뮬레이션

### 2. 연봉/실수령 계산기
- 연봉에서 4대보험 공제 계산
- 세금 공제 후 실수령액 산출
- 월급 기준 역산 기능

### 3. 실질 금리 계산기
- 명목금리와 물가상승률 비교
- 피셔 방정식 기반 실질금리 계산
- 구매력 변화 시각화

### 4. 급여 계산기
- 총매출 기반 급여 정산
- 수수료 자동 계산 (85%)
- 인센티브, 재료비, 인턴비, 세금 계산

### 5. 전역일 계산기
- 입대일 기준 전역일 계산
- 계급별 진급일 표시
- D-Day 카운트다운

### 6. 나이 계산기
- 만 나이 / 세는 나이 계산
- 살아온 일수, 주, 개월 표시
- 띠, 별자리 계산
- 다음 생일까지 D-Day

## 기술 스택

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Zustand (상태 관리)

## 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 열기

## 프로젝트 구조

```
pay-main/
├── app/
│   ├── page.tsx                    # 메인 대시보드
│   ├── pay/
│   │   └── page.tsx                # 급여 계산기
│   ├── pay-chart/
│   │   └── page.tsx                # 자산 성장 시뮬레이터
│   ├── pay-interest-rate/
│   │   └── page.tsx                # 실질 금리 계산기
│   ├── pay-salary/
│   │   └── page.tsx                # 연봉/실수령 계산기
│   ├── armyCalculator/
│   │   └── page.tsx                # 전역일 계산기
│   └── age-calculator/
│       └── page.tsx                # 나이 계산기
├── store/
│   └── useCalculatorStore.ts       # Zustand 상태 관리
└── README.md
```

## 주요 기능

- 대시보드에서 모든 계산기 접근
- 검색 기능으로 빠른 계산기 찾기
- 반응형 디자인 (모바일/태블릿/데스크톱)
