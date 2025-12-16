# 딜량 측정 시스템 (Damage Metrics Tracker)

게임 보스 딜량을 기록하고 통계를 확인하는 웹 애플리케이션입니다.

**🚀 Vercel 배포 가능!** - Next.js 14 App Router 기반

## 기능

### ✨ 주요 기능
- **딜량 입력**: 사용자별로 9회의 딜량 입력
- **자동 메트릭 계산**:
  - 총 딜량
  - 회당 평균 딜량
  - 딜량 중앙값
  - 표준편차
- **사용자 비교**: 전체 사용자와 비교하여 상위 몇 % 표시
- **실시간 저장**: Firebase Firestore에 데이터 자동 저장

### 🎨 UI/UX
- Glass Morphism 디자인
- Bento Grid 레이아웃
- 다크 모드
- 반응형 디자인 (모바일/태블릿/데스크톱)

## 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Frontend**: React 19
- **Backend**: Firebase (Firestore)
- **Styling**: Custom CSS with Glass Morphism
- **Deployment**: Vercel

## 빠른 시작

### 1. 의존성 설치
```bash
npm install
```

### 2. Firebase 설정

#### 2.1 Firebase 프로젝트 생성
1. [Firebase Console](https://console.firebase.google.com/)에 접속
2. 새 프로젝트 생성
3. Firestore Database 활성화 (테스트 모드로 시작)

#### 2.2 환경 변수 설정
`.env.local` 파일 생성:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

### 4. 프로덕션 빌드
```bash
npm run build
npm run start
```

## 📦 Vercel 배포

### GitHub 연동 방법 (추천)

1. **GitHub에 코드 푸시**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/your-username/dealing-metrics.git
   git push -u origin main
   ```

2. **Vercel 배포**
   - https://vercel.com 접속
   - "New Project" → GitHub 저장소 선택
   - Framework: Next.js (자동 감지)
   - **Environment Variables** 추가:
     ```
     NEXT_PUBLIC_FIREBASE_API_KEY
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
     NEXT_PUBLIC_FIREBASE_PROJECT_ID
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
     NEXT_PUBLIC_FIREBASE_APP_ID
     ```
   - "Deploy" 클릭

3. **배포 완료!**
   - 배포 URL: `https://your-project.vercel.app`

자세한 배포 가이드: [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

## 프로젝트 구조

```
dealing-metrics/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 루트 레이아웃
│   └── page.tsx           # 메인 페이지
├── src/
│   ├── components/        # React 컴포넌트
│   │   ├── Dashboard.tsx  # 메인 대시보드
│   │   ├── DamageInput.tsx # 딜량 입력 폼
│   │   └── MetricsCard.tsx # 통계 카드
│   ├── config/           # Firebase 설정
│   ├── types/            # TypeScript 타입 정의
│   ├── utils/            # 유틸리티 함수
│   │   ├── metricsCalculator.ts
│   │   └── firebaseService.ts
│   └── styles/           # 전역 스타일
├── .env.local            # Next.js 환경 변수 (git에 포함 안됨)
├── next.config.mjs       # Next.js 설정
├── tsconfig.json         # TypeScript 설정
└── vercel.json           # Vercel 배포 설정
```

## 사용 방법

1. **사용자 이름 입력**: 첫 화면에서 사용자 이름 입력
2. **딜량 입력**: 9회의 보스 딜량을 각 입력 필드에 입력
3. **제출**: 모든 필드를 채운 후 '제출' 버튼 클릭
4. **통계 확인**: 자동으로 계산된 통계 확인
   - 총 딜량
   - 평균 딜량
   - 중앙값
   - 표준편차
   - 상위 몇 % (다른 사용자와 비교)

## 메트릭 계산 방식

### 총 딜량
모든 9회 딜량의 합계

### 회당 평균
총 딜량 ÷ 9

### 중앙값
9개 딜량을 정렬했을 때 중간값 (5번째 값)

### 표준편차
딜량의 분산 정도를 나타내는 통계값
- 낮을수록 안정적인 딜량
- 높을수록 편차가 큰 딜량

### 상위 %
전체 사용자의 총 딜량과 비교하여 상위 몇 %인지 계산
- 상위 10% 이내: 초록색 (우수)
- 상위 30% 이내: 노란색 (양호)
- 그 외: 보라색 (보통)

## 스크립트

```bash
# 개발 서버 시작
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 시작
npm run start

# Lint 검사
npm run lint
```

## 문제 해결

### 로딩 스피너가 멈추지 않는 경우
[TROUBLESHOOTING.md](./TROUBLESHOOTING.md) 참조

### Firebase 연결 오류
1. `.env.local` 파일 확인
2. 환경 변수 이름이 `NEXT_PUBLIC_` 접두사로 시작하는지 확인
3. 개발 서버 재시작 (`Ctrl+C` → `npm run dev`)
4. 브라우저 콘솔(F12)에서 오류 확인

## 향후 개선 사항

- [ ] Firebase Authentication 통합
- [ ] 사용자별 이력 조회 기능
- [ ] 리더보드 (랭킹) 시스템
- [ ] 데이터 시각화 차트 추가
- [ ] 데이터 내보내기 (CSV, Excel)
- [ ] 다국어 지원 (i18n)
- [ ] PWA 지원 (오프라인 모드)

## 관련 문서

- [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) - Vercel 배포 가이드
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - 문제 해결 가이드
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - 상세 설정 가이드
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - 기술 구현 상세

## 라이센스

ISC

## 기여

Pull Request와 Issue를 환영합니다!

---

**Made with Next.js 14 + Firebase + Vercel** 🚀
