# 🔧 문제 해결 가이드

## 로딩 스피너가 멈추지 않는 문제

### 증상
- 9회 딜량 입력 후 제출 버튼 클릭
- 로딩 스피너(circular progress bar)가 계속 돌아감
- 통계가 표시되지 않음

### 원인

#### 1. **Firebase 설정 오류** (가장 흔한 원인)
`.env` 파일의 환경 변수가 잘못되었거나 누락됨

#### 2. **개발 서버 재시작 필요**
환경 변수 변경 후 서버를 재시작하지 않음

#### 3. **Firebase 프로젝트 미설정**
Firebase Console에서 프로젝트를 생성하지 않았거나 Firestore를 활성화하지 않음

#### 4. **Firestore 보안 규칙**
보안 규칙이 너무 엄격하여 읽기/쓰기가 차단됨

---

## 해결 방법

### ✅ 단계 1: .env 파일 확인

`.env` 파일을 열고 다음을 확인하세요:

```bash
# ✅ 올바른 형식
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:...

# ❌ 흔한 오류들
VITE_FIREBASE_STORAGE_BUCKET=ydealing-metrics...  # 오타 (y가 앞에 있음)
FIREBASE_API_KEY=...  # VITE_ 접두사 누락
VITE_FIREBASE_API_KEY=  # 값이 비어있음
```

**체크리스트:**
- [ ] 모든 환경 변수가 `VITE_` 접두사로 시작하는가?
- [ ] 모든 값이 채워져 있는가? (비어있지 않은가?)
- [ ] 오타가 없는가? (특히 STORAGE_BUCKET)
- [ ] 따옴표가 없는가? (값에 따옴표 불필요)

### ✅ 단계 2: 개발 서버 재시작

환경 변수는 서버 시작 시에만 읽혀집니다!

```bash
# 1. 현재 서버 중지
Ctrl + C (또는 Cmd + C on Mac)

# 2. 서버 재시작
npm run dev
```

### ✅ 단계 3: 브라우저 콘솔 확인

브라우저를 열고 개발자 도구를 실행하세요:

```
Windows/Linux: F12 또는 Ctrl+Shift+I
Mac: Cmd+Option+I
```

**Console 탭에서 확인할 것:**

#### 성공적인 경우:
```
✅ Firebase initialized successfully
Project ID: your-project-id
```

#### 문제가 있는 경우:
```
❌ Missing Firebase environment variables: [...]
❌ Firebase configuration is incomplete
❌ FirebaseError: [...]
```

### ✅ 단계 4: Firebase Console 설정 확인

1. **Firebase Console 접속**
   - https://console.firebase.google.com/

2. **프로젝트 확인**
   - 프로젝트가 생성되어 있는가?
   - Firestore Database가 활성화되어 있는가?

3. **Firestore 보안 규칙 확인**
   ```
   Firebase Console → Firestore Database → 규칙 탭
   ```

   **테스트용 규칙 (개발 중):**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```

   **⚠️ 주의:** 이 규칙은 개발/테스트용입니다. 프로덕션에서는 적절한 인증과 권한 검사가 필요합니다.

4. **규칙 게시**
   - "게시" 버튼 클릭하여 규칙 저장

### ✅ 단계 5: 네트워크 확인

브라우저 개발자 도구 → Network 탭:

1. 제출 버튼 클릭
2. Network 탭에서 Firebase 요청 확인
3. 상태 코드 확인:
   - ✅ 200: 성공
   - ❌ 403: 권한 오류 (보안 규칙 확인)
   - ❌ 404: 엔드포인트 오류 (프로젝트 ID 확인)
   - ❌ (failed): 네트워크 오류 (인터넷 연결 확인)

---

## 자동 타임아웃 메커니즘

코드에 10초 타임아웃이 추가되었습니다. 10초 후에도 응답이 없으면:

```
Firebase 연결 시간이 초과되었습니다.
.env 파일을 확인하고 서버를 재시작해주세요.
```

이 메시지가 나타나면 위의 단계를 따라 확인하세요.

---

## 상세 오류 메시지

### "Missing Firebase environment variables"
```
원인: .env 파일의 환경 변수가 누락됨
해결: .env 파일 확인 및 모든 변수 추가
```

### "Firebase 연결 시간이 초과되었습니다"
```
원인: Firebase 서버에 연결할 수 없음
해결:
1. 인터넷 연결 확인
2. Firebase 프로젝트 ID가 올바른지 확인
3. Firebase 프로젝트가 활성화되어 있는지 확인
```

### "Firebase 권한이 없습니다"
```
원인: Firestore 보안 규칙이 요청을 차단
해결: Firestore 보안 규칙을 테스트 모드로 변경
```

### "FirebaseError: Missing or insufficient permissions"
```
원인: Firestore 보안 규칙 문제
해결:
1. Firebase Console → Firestore → 규칙
2. 테스트 모드 규칙으로 변경
3. "게시" 클릭
```

---

## 빠른 체크리스트

로딩 스피너가 멈추지 않을 때 순서대로 확인:

1. [ ] `.env` 파일 존재 여부 확인
2. [ ] `.env` 파일에 모든 환경 변수가 있는지 확인
3. [ ] 환경 변수에 `VITE_` 접두사가 있는지 확인
4. [ ] 개발 서버 재시작 (`Ctrl+C` → `npm run dev`)
5. [ ] 브라우저 콘솔에서 Firebase 초기화 메시지 확인
6. [ ] Firebase Console에서 프로젝트 존재 확인
7. [ ] Firestore Database 활성화 확인
8. [ ] Firestore 보안 규칙을 테스트 모드로 변경
9. [ ] 브라우저 캐시 클리어 (`Ctrl+Shift+Delete`)
10. [ ] 페이지 새로고침 (`Ctrl+R`)

---

## 추가 디버깅 팁

### 1. Firebase 초기화 로그 확인
브라우저 콘솔에 다음이 나타나야 합니다:
```
✅ Firebase initialized successfully
Project ID: your-project-id
```

### 2. 환경 변수 직접 확인
브라우저 콘솔에서 실행:
```javascript
console.log(import.meta.env.VITE_FIREBASE_API_KEY)
```

결과:
- ✅ 값이 출력됨: 환경 변수가 올바르게 로드됨
- ❌ `undefined`: 환경 변수가 로드되지 않음 (서버 재시작 필요)

### 3. 로컬 스토리지 확인
```javascript
// 브라우저 콘솔에서 실행
localStorage.clear()
sessionStorage.clear()
location.reload()
```

### 4. Firebase 프로젝트 상태 확인
Firebase Console에서:
- 프로젝트 설정 → 일반
- "이 프로젝트는 삭제되었습니다" 메시지가 없는지 확인

---

## 여전히 문제가 해결되지 않는 경우

### 1. 완전히 새로 시작
```bash
# 1. node_modules 삭제
rm -rf node_modules package-lock.json

# 2. 재설치
npm install

# 3. 개발 서버 시작
npm run dev
```

### 2. .env 파일 재생성
```bash
# 1. 기존 .env 삭제
rm .env

# 2. .env.example 복사
cp .env.example .env

# 3. .env 파일 편집하여 올바른 값 입력

# 4. 서버 재시작
npm run dev
```

### 3. Firebase 프로젝트 재설정
1. Firebase Console에서 새 웹 앱 추가
2. 새로운 SDK 구성 정보 복사
3. `.env` 파일 업데이트
4. 서버 재시작

---

## 문의 및 지원

위의 모든 단계를 따랐지만 여전히 문제가 있다면:

1. **GitHub Issues** 생성
2. 다음 정보 포함:
   - 브라우저 콘솔 전체 로그
   - Network 탭 스크린샷
   - `.env.example` 파일 내용 (실제 키 제외!)
   - 수행한 해결 단계

---

**대부분의 경우 .env 파일 확인과 서버 재시작으로 해결됩니다!** 🔧✨