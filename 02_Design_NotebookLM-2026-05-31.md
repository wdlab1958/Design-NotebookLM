# 02_Design_NotebookLM 엔지니어링 감사 보고서

작성: Claude Code (Brian 의뢰)
일자: 2026-05-31
대상 경로: `/home/ubuntu-02/ai_project/02_Design_NotebookLM`

## 개요 (범위 + 한계)

- 본 보고서는 `02_Design_NotebookLM` 단일 프로젝트에 대한 증거 기반(read-only + 신속 빌드/검사) 감사이다.
- 스택(확인): Vite 8 + React 19 + TypeScript 5.9 단일 페이지 앱. 클라이언트 전용, 백엔드/서버 없음. 라우팅은 `react-router-dom` v7 (`/`, `/customize` 두 경로).
  - 엔트리: `app/index.html` → `app/src/main.tsx` → `app/src/App.tsx`.
  - 빌드 스크립트(확인): `app/package.json` — `build: "tsc -b && vite build"`, `lint: "eslint ."`, `dev: "vite"`. `preview` 존재. **테스트 스크립트 없음(확인)**.
  - 데이터: `app/src/data/categories.ts`(3091줄), `app/src/data/designStyles.ts`.
- 한계:
  - CI 설정 없음(확인) — `.github` 부재, YAML 워크플로 부재.
  - 테스트 프레임워크/테스트 코드 없음 — 따라서 "테스트 결과"는 존재하지 않으며 빌드·타입체크·린트·dev 부팅으로 대체 검증함.
  - `data/`, `.git/`는 지시에 따라 미열람/미변경.
  - 브랜드 스크럽(`WDLAB@2023-2026`) 상태는 `src/data/categories.ts`에 'WDLAB' 잔존 확인, `WDLAB@2023-2026`/`WDLAB@2023-2026` 미검출(확인). 되돌리지 않음.
  - dev 서버는 약 8초만 부팅하여 HTTP 응답 코드만 확인했고, 브라우저 렌더링/상호작용은 미검증(추정 영역).

## 실행·테스트 결과

도구 버전(확인): Node v22.22.2, npm 10.9.7. `app/node_modules` 존재(확인).

| 항목 | 명령 | 결과 | 비고 |
|---|---|---|---|
| 타입체크 (수정 전) | `npx tsc -b` | **실패, EXIT=2** | 오류 1건 (아래) |
| 타입체크 (수정 후) | `npx tsc -b` | **성공, EXIT=0** (확인) | |
| 빌드 | `npm run build` | **성공, EXIT=0** (확인) | 462ms, 1737 모듈, JS 476.76 kB(gzip 139.46 kB) |
| 린트 | `npm run lint` | **실패, EXIT=1** (확인) | 오류 3건 |
| dev 부팅 | `vite --port 5199` | **HTTP 200** (확인) | "ready in 140 ms", curl 200 응답 |

데이터/요구사항 대조(확인):
- 카테고리: `prompts: [` 블록 133개 검출 → 100개 카테고리 요구 대비 초과 충족.
- 디자인 스타일: `id:` 30개 검출 → 30종 요구 충족.
- 페이지 분기 최대 20장: `CustomizePage.tsx`에 `Math.min(remaining, 20)` 배치 분할 로직 확인. 최신 커밋(`fbd3053`)이 "80페이지가 동일 20페이지 4번 반복" 버그 수정을 명시하며, 배치를 개별 NotebookLM 생성으로 실행하라는 프롬프트 지시가 코드에 반영됨.

## 발견된 문제점 (확인 vs 추정, 심각도)

1. **[확인] [심각도: 높음 → 조치완료] 타입 오류로 빌드 차단**
   - 파일: `app/src/components/DesignStylePreviewModal.tsx:70`
   - 증거: `TS2322 ... Property 'children' does not exist`. 인라인 컴포넌트 `T`(line 56)가 `children` prop을 받지 않는데 line 70에서 자식 `<span>`을 전달. `build`가 `tsc -b`를 선행하므로 **빌드 전체 차단**.

2. **[확인] [심각도: 낮음] ESLint `react-hooks/set-state-in-effect` 2건**
   - `app/src/components/SettingsModal.tsx:19`, `app/src/pages/CustomizePage.tsx:130`
   - 증거: `useEffect` 본문에서 localStorage 복원값을 `setState`로 동기 설정. React 권고 위반(연쇄 렌더 가능). 런타임 동작은 정상 추정이나 lint 게이트를 실패시킴.

3. **[확인] [심각도: 낮음(개발 전용)] `react-refresh/only-export-components` 1건**
   - `app/src/i18n/LanguageContext.tsx:38` — 컴포넌트와 훅(`useLang`)을 동일 파일에서 export. dev HMR fast-refresh에만 영향, 빌드/런타임 무영향.

4. **[확인] [심각도: 정보] 테스트 부재** — 회귀 방지 자동화 없음. 80페이지 반복 버그 같은 회귀를 코드로 막을 수단 없음.

5. **[추정] [심각도: 낮음] 번들 크기** — 단일 JS 476.76 kB. 코드 스플리팅 미적용 추정. 클라이언트 전용 SPA로 기능상 문제는 아님.

## 조치한 내용

- **문제 1 수정(확인·검증 완료, 저위험):**
  - `DesignStylePreviewModal.tsx`의 `T` 컴포넌트에 `children?: React.ReactNode`를 추가하고 `<div>...{children}</div>`로 렌더하도록 변경.
  - 해당 `<T>` 자식 사용처는 코드 전체에서 1곳뿐임을 확인 후 적용(부수효과 최소).
  - **재검증: `npx tsc -b` → EXIT=0, `npm run build` → EXIT=0(462ms)로 통과 확인.**
- 그 외 변경 없음. 데이터/브랜드/git 미변경.

## 미해결·위험 항목

- **린트 오류 3건 미수정(권고만):**
  - `set-state-in-effect` 2건: lazy initializer(`useState(() => ...)`) 또는 의존성 정리로 해소 가능하나, 초기 마운트 타이밍/저장값 복원 동작이 바뀔 수 있어 브라우저 검증 없이는 저위험으로 단정 불가. **권고: lazy initializer로 전환 후 수동 테스트.**
  - `only-export-components` 1건: `useLang`를 별도 파일로 분리하면 해소. dev 전용 영향이라 우선순위 낮음.
- **테스트 부재:** Vitest + React Testing Library 도입을 권고(특히 배치 분할/페이지 수 경계값). 본 감사 범위 밖이라 미적용.
- **dev 미세 검증 한계:** 브라우저 실제 렌더·NotebookLM 연동·API Key 저장 흐름은 미실행 검증(추정). API Key는 localStorage 평문 저장으로 보이며(코드상), 클라이언트 전용 앱 특성상 일반적이나 공유 PC 환경 위험은 별도 고려 권고.

## 종합 판단

- **현재 상태(수정 후, 확인): 빌드 성공 / dev 부팅 성공(HTTP 200) / 타입체크 통과.** 빌드를 막던 치명적 타입 오류 1건은 저위험 수정으로 해소·재검증 완료.
- 잔여 결함은 린트 경고성 3건(런타임 비차단)과 테스트 부재로, 모두 비차단 항목이다.
- 요구사항(카테고리 수, 30 스타일, 최대 20장 분기)은 코드 수준에서 충족 확인.
- 결론: **빌드 가능·실행 가능한 상태이며, 남은 항목은 품질 개선(린트·테스트)으로 위험도 낮음.**
