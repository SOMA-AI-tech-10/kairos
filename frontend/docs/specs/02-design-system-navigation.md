# 02. Design System and Navigation

## Goal

제공된 디자인의 warm cream/coral 스타일을 React Native 컴포넌트와 navigation 구조로 옮긴다.

## Design Tokens

`src/constants/theme.ts`에 고정한다.

```ts
export const colors = {
  cream: "#f7f5f0",
  cream2: "#efece5",
  paper: "#ffffff",
  mist: "#e8e4dc",
  line: "#e3ded3",
  line2: "#ece8df",
  ink: "#1a1a1a",
  ink2: "#2c2c2c",
  muted: "#6b6760",
  muted2: "#9a9690",
  faint: "#c4bfb5",
  coral: "#ff5a36",
  coralPressed: "#e54a2a",
  coral50: "#fff0eb",
  coral100: "#ffd6c9",
  sage: "#cdd6c4",
  sageTint: "#e6ebe0",
  sky: "#cfdce8",
  skyTint: "#e7eef4",
  success: "#4a9b6e",
  warn: "#d68a3c",
  danger: "#c04a2e",
};
```

Typography:

- 기본 폰트는 시스템 폰트를 사용한다.
- 한국어 시각 품질 개선을 위해 추후 Pretendard를 추가할 수 있으나 MVP 필수는 아니다.
- 숫자 시간 표시는 `fontVariant: ["tabular-nums"]`를 사용한다.

Spacing/radius:

- 화면 좌우 padding: 18 또는 20
- 카드 radius: 16-24
- 버튼 radius: pill 또는 16-22
- bottom tab height는 safe area를 포함해 플랫폼 기본 감각을 유지한다.

## Shared Components

`src/components`에 아래 컴포넌트를 만든다.

- `KLogo`
- `IconButton`
- `PrimaryButton`
- `Chip`
- `AgentBubble`
- `AgentTag`
- `ThinkingDots`
- `ScheduleSummaryCard`
- `ScheduleRow`
- `MiniMonthCalendar`
- `EmptyState`
- `ErrorNotice`

구현 기준:

- 컴포넌트는 데이터 표시와 touch event props만 받는다.
- API 호출이나 navigation을 컴포넌트 내부에 넣지 않는다.
- 버튼 disabled/loading 상태를 지원한다.
- 모든 touch target은 최소 44px 높이를 목표로 한다.

## Navigation

`src/navigation`에 구성한다.

```text
RootStack
  MainTabs
    HomeTab -> HomeScreen
    CalendarTab -> CalendarScreen
  ScheduleFlowScreen
  EventDetailScreen
```

라우트 파라미터:

```ts
type RootStackParamList = {
  MainTabs: undefined;
  ScheduleFlow: { initialText?: string } | undefined;
  EventDetail: { scheduleId: number };
};

type MainTabParamList = {
  Home: undefined;
  Calendar: { selectedDate?: string } | undefined;
};
```

Bottom Tabs:

- 홈
- 캘린더

디자인에는 일정 탭과 내 정보 탭이 있지만 MVP에서는 제외한다.

## Screen Layout Rules

Home:

- 상단에 날짜와 큰 헤드라인을 표시한다.
- 자연어 입력 카드를 첫 화면 핵심 액션으로 둔다.
- 추천 입력 chip 3개를 표시한다.
- 오늘 일정 섹션은 `GET /api/schedules` 결과 중 오늘 일정만 보여준다.

ScheduleFlow:

- 대화형 screen으로 구현한다.
- 분석 중, 추가 질문, 확인, 완료, 실패 상태는 같은 screen 내 state machine으로 전환한다.

Calendar:

- 월간 grid와 선택 날짜 일정 목록을 한 화면에 표시한다.
- 일정이 없는 날짜는 빈 상태를 표시한다.

EventDetail:

- `Kairos가 등록` badge, title, 날짜/시간, 장소, 알림, 원래 입력을 표시한다.
- 현재 백엔드 목록 응답에는 `original_text`가 없으므로, 상세 화면에서는 `original_text` 표시 영역을 optional로 둔다.

## Acceptance Criteria

- iOS와 Android에서 safe area가 깨지지 않는다.
- Home, Calendar, EventDetail, ScheduleFlow 간 navigation이 동작한다.
- 디자인 토큰이 한 파일에서 관리된다.
- 공통 컴포넌트가 screen에 중복 구현되지 않는다.

