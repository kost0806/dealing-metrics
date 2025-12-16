# 빠른 시작 가이드

## 1단계: Firebase 프로젝트 설정

### Firebase Console에서 프로젝트 생성
1. https://console.firebase.google.com/ 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름 입력 (예: dealing-metrics)
4. Google Analytics 설정 (선택사항)
5. 프로젝트 생성 완료

### Firestore 데이터베이스 생성
1. 왼쪽 메뉴에서 "Firestore Database" 클릭
2. "데이터베이스 만들기" 클릭
3. **테스트 모드에서 시작** 선택 (개발용)
4. 위치 선택 (asia-northeast3 - 서울 권장)
5. "사용 설정" 클릭

### Firebase 웹 앱 추가
1. 프로젝트 개요 페이지에서 웹 아이콘 `</>` 클릭
2. 앱 닉네임 입력
3. Firebase Hosting 체크 해제 (선택사항)
4. "앱 등록" 클릭
5. **Firebase SDK 구성 정보 복사** (다음 단계에서 필요)

## 2단계: 로컬 환경 설정

### 환경 변수 파일 생성
프로젝트 루트에 `.env` 파일 생성:

```bash
# .env
VITE_FIREBASE_API_KEY=복사한_API_키
VITE_FIREBASE_AUTH_DOMAIN=프로젝트ID.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=프로젝트ID
VITE_FIREBASE_STORAGE_BUCKET=프로젝트ID.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=복사한_센더ID
VITE_FIREBASE_APP_ID=복사한_앱ID
```

**예시:**
```bash
VITE_FIREBASE_API_KEY=AIzaSyAbc123def456ghi789jkl012mno345pqr
VITE_FIREBASE_AUTH_DOMAIN=dealing-metrics-abc123.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=dealing-metrics-abc123
VITE_FIREBASE_STORAGE_BUCKET=dealing-metrics-abc123.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abc123def456ghi789
```

### 의존성 설치
```bash
npm install
```

## 3단계: 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:5173 접속

## 4단계: 테스트

1. 사용자 이름 입력
2. 9개의 딜량 값 입력 (예: 100000, 120000, 110000, ...)
3. "제출" 버튼 클릭
4. 통계 확인

## 문제 해결

### Firebase 연결 오류
- `.env` 파일이 프로젝트 루트에 있는지 확인
- 환경 변수 이름이 `VITE_` 접두사로 시작하는지 확인
- Firebase Console에서 복사한 값이 정확한지 확인
- 개발 서버를 재시작 (Ctrl+C 후 `npm run dev`)

### Firestore 권한 오류
Firebase Console > Firestore Database > 규칙에서 다음과 같이 설정:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;  // 테스트용
    }
  }
}
```

⚠️ **주의**: 프로덕션 환경에서는 적절한 보안 규칙 설정 필요

### 빌드 오류
```bash
# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install

# 빌드 재시도
npm run build
```

## 프로덕션 배포

### Firebase Hosting 사용
```bash
# Firebase CLI 설치 (전역)
npm install -g firebase-tools

# Firebase 로그인
firebase login

# Firebase 초기화
firebase init hosting

# 빌드
npm run build

# 배포
firebase deploy --only hosting
```

### Vercel 사용
1. Vercel 계정 생성: https://vercel.com
2. GitHub 저장소 연결
3. 환경 변수 설정 (프로젝트 설정 > Environment Variables)
4. 자동 배포 완료

### Netlify 사용
1. Netlify 계정 생성: https://netlify.com
2. GitHub 저장소 연결
3. Build command: `npm run build`
4. Publish directory: `dist`
5. 환경 변수 설정
6. Deploy

## 다음 단계

- [ ] Firebase Authentication 추가하여 사용자 관리
- [ ] 리더보드 페이지 추가
- [ ] 개인 이력 조회 기능
- [ ] 차트 시각화 추가
- [ ] 모바일 앱 변환 (PWA)

## 도움이 필요하신가요?

GitHub Issues에 질문을 남겨주세요!
