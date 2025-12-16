# 🚀 배포 체크리스트

## 배포 전 필수 확인사항

### ✅ Firebase 설정
- [ ] Firebase 프로젝트 생성 완료
- [ ] Firestore Database 활성화 (위치: asia-northeast3)
- [ ] 웹 앱 등록 완료
- [ ] `.env` 파일에 모든 환경 변수 설정
  - [ ] `VITE_FIREBASE_API_KEY`
  - [ ] `VITE_FIREBASE_AUTH_DOMAIN`
  - [ ] `VITE_FIREBASE_PROJECT_ID`
  - [ ] `VITE_FIREBASE_STORAGE_BUCKET`
  - [ ] `VITE_FIREBASE_MESSAGING_SENDER_ID`
  - [ ] `VITE_FIREBASE_APP_ID`

### ✅ 로컬 테스트
- [ ] `npm install` 실행 완료
- [ ] `npm run dev` 정상 작동
- [ ] 사용자 이름 입력 테스트
- [ ] 딜량 9개 입력 및 제출 테스트
- [ ] 통계 계산 확인
- [ ] Firebase에 데이터 저장 확인
- [ ] 모바일 반응형 확인 (개발자 도구)
- [ ] 브라우저 콘솔 에러 없음 확인

### ✅ 빌드 테스트
- [ ] `npm run build` 성공
- [ ] `npm run preview` 정상 작동
- [ ] 빌드된 파일 확인 (dist 폴더)
- [ ] 번들 크기 확인 (<500KB 권장)

### ✅ 보안 설정
- [ ] `.env` 파일이 `.gitignore`에 포함됨
- [ ] Firebase API 키 노출 방지
- [ ] Firestore 보안 규칙 검토

## 배포 플랫폼별 가이드

### 🔥 Firebase Hosting (추천)

#### 사전 준비
```bash
npm install -g firebase-tools
firebase login
```

#### 배포 단계
```bash
# 1. Firebase 초기화
firebase init hosting

# 선택 옵션:
# - Public directory: dist
# - Single-page app: Yes
# - GitHub Actions: No (선택)

# 2. 빌드
npm run build

# 3. 배포
firebase deploy --only hosting

# 4. 배포 URL 확인
# https://your-project.web.app
```

#### 체크리스트
- [ ] Firebase CLI 설치 완료
- [ ] `firebase init` 실행 완료
- [ ] `firebase.json` 파일 생성 확인
- [ ] 빌드 완료
- [ ] 배포 성공
- [ ] 배포 URL 접속 확인
- [ ] 실제 동작 테스트

### ⚡ Vercel

#### 배포 단계
1. **GitHub 연동**
   - [ ] GitHub에 코드 푸시
   - [ ] Vercel 계정 생성 (https://vercel.com)
   - [ ] "New Project" → GitHub 저장소 선택

2. **환경 변수 설정**
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

3. **빌드 설정**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **배포**
   - [ ] "Deploy" 클릭
   - [ ] 배포 완료 대기 (1-2분)
   - [ ] 배포 URL 확인

### 🌐 Netlify

#### 배포 단계
1. **사이트 생성**
   - [ ] Netlify 계정 생성 (https://netlify.com)
   - [ ] "New site from Git" 선택
   - [ ] GitHub 저장소 연결

2. **빌드 설정**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

3. **환경 변수**
   - [ ] Site settings → Environment variables
   - [ ] 모든 `VITE_FIREBASE_*` 변수 추가

4. **배포**
   - [ ] "Deploy site" 클릭
   - [ ] 빌드 로그 확인
   - [ ] 배포 URL 테스트

## 배포 후 확인사항

### ✅ 기능 테스트
- [ ] 사이트 접속 가능
- [ ] 사용자 이름 입력
- [ ] 딜량 입력 및 제출
- [ ] 통계 표시 확인
- [ ] Firebase 데이터 저장 확인
- [ ] 모바일 기기 테스트
- [ ] 다양한 브라우저 테스트
  - [ ] Chrome
  - [ ] Firefox
  - [ ] Safari
  - [ ] Edge

### ✅ 성능 확인
- [ ] Lighthouse 점수 확인 (목표: 90+)
  - [ ] Performance
  - [ ] Accessibility
  - [ ] Best Practices
  - [ ] SEO
- [ ] 페이지 로드 속도 (<3초)
- [ ] Core Web Vitals 확인

### ✅ Firebase 설정
- [ ] Firestore 보안 규칙 업데이트 (프로덕션용)
  ```javascript
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /damageEntries/{entry} {
        allow read: if true;
        allow create: if request.auth != null;  // 인증 필요
        allow update, delete: if request.auth.uid == resource.data.userId;
      }
    }
  }
  ```
- [ ] Firebase Quota 확인
- [ ] Billing 설정 (필요시)

## 프로덕션 최적화

### 🎯 성능 최적화
- [ ] 이미지 최적화 (WebP)
- [ ] Code splitting 적용
- [ ] Lazy loading 구현
- [ ] CDN 사용
- [ ] Gzip 압축 활성화

### 🔒 보안 강화
- [ ] HTTPS 강제 적용
- [ ] CSP (Content Security Policy) 설정
- [ ] Firebase Auth 추가 (권장)
- [ ] Rate limiting 구현
- [ ] 입력 검증 강화

### 📊 모니터링
- [ ] Firebase Analytics 설치
- [ ] Error tracking (Sentry)
- [ ] 성능 모니터링
- [ ] 사용자 피드백 수집

## 도메인 연결 (선택사항)

### Firebase Hosting
```bash
# 커스텀 도메인 추가
firebase hosting:channel:deploy production --domain your-domain.com
```

### Vercel
1. Settings → Domains
2. 도메인 입력
3. DNS 설정 업데이트

### Netlify
1. Domain settings → Add custom domain
2. DNS 레코드 업데이트

## 문제 해결

### 배포 실패
- [ ] 빌드 로그 확인
- [ ] 환경 변수 재확인
- [ ] Node.js 버전 확인
- [ ] 의존성 재설치

### 데이터 로드 안됨
- [ ] Firebase 콘솔에서 Firestore 데이터 확인
- [ ] 브라우저 콘솔 에러 확인
- [ ] 네트워크 탭에서 Firebase 요청 확인
- [ ] CORS 설정 확인

### 성능 문제
- [ ] 번들 크기 확인
- [ ] Lighthouse 분석
- [ ] 불필요한 리렌더링 제거
- [ ] 이미지 최적화

## 유지보수 체크리스트

### 주간
- [ ] Firebase 사용량 확인
- [ ] 에러 로그 검토
- [ ] 사용자 피드백 확인

### 월간
- [ ] 의존성 업데이트 검토
- [ ] 성능 메트릭 분석
- [ ] 보안 취약점 스캔
- [ ] 백업 확인

### 분기별
- [ ] Firebase 요금제 검토
- [ ] 기능 추가 계획
- [ ] 사용자 데이터 정리
- [ ] 문서 업데이트

## 롤백 계획

### Firebase Hosting
```bash
# 이전 버전으로 롤백
firebase hosting:rollback
```

### Vercel
1. Deployments 페이지
2. 이전 버전 선택
3. "Promote to Production" 클릭

### Netlify
1. Deploys 페이지
2. 이전 배포 선택
3. "Publish deploy" 클릭

## 지원 및 문서

- 📖 README.md - 프로젝트 개요
- 🚀 SETUP_GUIDE.md - 상세 설정
- 📋 IMPLEMENTATION_SUMMARY.md - 기술 구현
- ⚡ 빠른시작.md - 빠른 시작 가이드

---

**배포 성공을 기원합니다!** 🎉🚀
