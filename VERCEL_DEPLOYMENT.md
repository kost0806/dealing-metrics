# 🚀 Vercel 배포 가이드

Next.js로 마이그레이션 완료! 이제 Vercel에 배포할 수 있습니다.

## ✅ 완료된 작업

### 1. Next.js 14 마이그레이션
- ✅ Vite + React → Next.js 14 App Router
- ✅ 모든 컴포넌트를 클라이언트 컴포넌트로 변환
- ✅ Firebase 환경 변수를 Next.js 형식으로 변경
- ✅ 빌드 성공 확인

### 2. 프로젝트 구조
```
dealing-metrics/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 루트 레이아웃
│   └── page.tsx           # 메인 페이지
├── src/
│   ├── components/        # React 컴포넌트 ('use client')
│   ├── config/           # Firebase 설정 (Next.js 환경 변수)
│   ├── types/            # TypeScript 타입
│   ├── utils/            # 유틸리티 함수
│   └── styles/           # 전역 스타일
├── .env.local            # Next.js 환경 변수
├── next.config.mjs       # Next.js 설정
├── tsconfig.json         # TypeScript 설정
└── vercel.json           # Vercel 배포 설정
```

## 🌐 Vercel 배포 방법

### 방법 1: GitHub 연동 (추천)

#### 1단계: GitHub 저장소 생성
```bash
# Git 초기화 (아직 안했다면)
git init

# .env.local은 커밋하지 않기 (이미 .gitignore에 포함됨)
git add .
git commit -m "feat: Migrate to Next.js for Vercel deployment"

# GitHub 저장소 생성 후
git remote add origin https://github.com/your-username/dealing-metrics.git
git branch -M main
git push -u origin main
```

#### 2단계: Vercel에 배포
1. **Vercel 접속**: https://vercel.com
2. **로그인/회원가입**: GitHub 계정으로 로그인
3. **New Project** 클릭
4. **Import Git Repository**: 저장소 선택
5. **Configure Project**:
   - Framework Preset: **Next.js** (자동 감지됨)
   - Root Directory: `./` (기본값)
   - Build Command: `next build` (자동)
   - Output Directory: `.next` (자동)

#### 3단계: 환경 변수 설정
**Environment Variables** 섹션에서 다음 추가:

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

⚠️ **주의**: 실제 값은 `.env.local` 파일에서 복사하세요!

#### 4단계: Deploy 클릭
- 자동 빌드 시작
- 1-2분 후 배포 완료
- 배포 URL 확인 (예: `https://dealing-metrics.vercel.app`)

### 방법 2: Vercel CLI

#### 1단계: Vercel CLI 설치
```bash
npm install -g vercel
```

#### 2단계: 로그인
```bash
vercel login
```

#### 3단계: 배포
```bash
# 프로젝트 루트에서
vercel

# 프로덕션 배포
vercel --prod
```

#### 4단계: 환경 변수 추가 (CLI)
```bash
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID
vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID
```

## 🔧 로컬 개발 서버

### 개발 모드 실행
```bash
npm run dev
```

브라우저에서 http://localhost:3000 접속

### 프로덕션 빌드 테스트
```bash
# 빌드
npm run build

# 로컬에서 프로덕션 버전 실행
npm run start
```

## 📝 환경 변수 관리

### 로컬 개발: `.env.local`
```bash
# Next.js는 NEXT_PUBLIC_ 접두사가 필요합니다
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
...
```

### Vercel 프로덕션: Dashboard
1. Vercel Dashboard → 프로젝트 선택
2. **Settings** → **Environment Variables**
3. 환경 변수 추가
4. **Redeploy** (환경 변수 변경 후)

## 🎯 Vercel 배포 후 확인사항

### ✅ 체크리스트
- [ ] 사이트 접속 확인
- [ ] 사용자 이름 입력 기능 확인
- [ ] 딜량 9개 입력 및 제출
- [ ] Firebase 데이터 저장 확인
- [ ] 통계 표시 확인
- [ ] 모바일 반응형 확인
- [ ] 브라우저 콘솔에 에러 없음

### 🐛 문제 해결

#### "Firebase configuration is incomplete" 에러
```
원인: 환경 변수가 설정되지 않음
해결:
1. Vercel Dashboard → Settings → Environment Variables
2. 모든 NEXT_PUBLIC_FIREBASE_* 변수 추가
3. Deployments → Redeploy
```

#### 빌드 실패
```
원인: 타입 에러 또는 빌드 설정 문제
해결:
1. 로컬에서 npm run build 실행
2. 에러 확인 및 수정
3. GitHub에 푸시
4. Vercel 자동 재배포
```

#### 404 에러 (페이지를 찾을 수 없음)
```
원인: 라우팅 설정 문제
해결: app/page.tsx 파일 확인
```

## 🚀 자동 배포 설정

### GitHub 연동 시 (기본값)
- `main` 브랜치에 푸시 → 자동 프로덕션 배포
- Pull Request 생성 → 미리보기 배포
- 각 커밋마다 고유 URL 생성

### 배포 알림
- Vercel Dashboard에서 Slack, Discord 연동 가능
- 이메일 알림 자동 발송

## 📊 성능 모니터링

### Vercel Analytics (무료)
```bash
# package.json에 추가
npm install @vercel/analytics
```

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Core Web Vitals
- Vercel Dashboard에서 자동 추적
- LCP, FID, CLS 메트릭 확인

## 🌍 커스텀 도메인

### 도메인 연결
1. **Vercel Dashboard** → 프로젝트 선택
2. **Settings** → **Domains**
3. 도메인 입력 (예: dealing-metrics.com)
4. DNS 레코드 설정:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

## 🔐 보안 설정

### Firebase 보안 규칙 업데이트
프로덕션 배포 후 Firestore 보안 규칙을 강화하세요:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /damageEntries/{entry} {
      allow read: if true;
      // 프로덕션: 인증 필요
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.userId;
    }
  }
}
```

### CORS 설정
Firebase Console → Storage → CORS 설정 (필요시)

## 📈 다음 단계

### 기능 추가
1. Firebase Authentication 통합
2. 리더보드 페이지
3. 개인 이력 조회
4. 데이터 시각화

### 성능 최적화
1. 이미지 최적화 (Next.js Image)
2. 코드 스플리팅
3. ISR (Incremental Static Regeneration)
4. Edge Functions

## 💡 유용한 Vercel 명령어

```bash
# 로컬 개발
npm run dev

# 빌드
npm run build

# 프로덕션 모드 실행
npm run start

# Vercel 프로젝트 정보
vercel ls

# 환경 변수 확인
vercel env ls

# 로그 확인
vercel logs
```

## 🆘 도움말

### Vercel 문서
- https://vercel.com/docs
- https://nextjs.org/docs

### Firebase 문서
- https://firebase.google.com/docs/web/setup

### GitHub Issues
문제가 있으면 GitHub Issues에 올려주세요!

---

**Vercel 배포를 축하합니다!** 🎉🚀

배포 URL: `https://your-project.vercel.app`
