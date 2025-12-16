# 🔧 에러 해결 가이드

## 현재 발생한 에러

```
Missing Firebase environment variables
Please check your .env.local file
Failed to load user totals: FirebaseError: Expected first argument to collection()
to be a CollectionReference, a DocumentReference or FirebaseFirestore
```

## 🎯 원인

**Firebase 서비스 계정 키가 설정되지 않았습니다.**

`.env.local` 파일은 있지만, `serviceAccountKey.json` 파일이 없거나 경로가 잘못되었습니다.

---

## ✅ 해결 방법

### Step 1: Firebase 서비스 계정 키 다운로드

1. [Firebase Console](https://console.firebase.google.com/) 접속
2. 프로젝트 선택: **dealing-metrics**
3. 왼쪽 메뉴: ⚙️ **Project Settings** (톱니바퀴 아이콘)
4. **Service Accounts** 탭 클릭
5. **Generate New Private Key** 버튼 클릭
6. 확인 팝업에서 **Generate Key** 클릭
7. `serviceAccountKey.json` 파일 다운로드됨

### Step 2: 프로젝트에 파일 저장

다운로드한 `serviceAccountKey.json` 파일을 **프로젝트 루트**에 복사:

```
dealing-metrics/
├── serviceAccountKey.json  ← 여기에 저장!
├── .env.local
├── package.json
├── app/
├── src/
└── ...
```

**중요:**
- 파일 이름은 정확히 `serviceAccountKey.json`이어야 합니다
- 프로젝트 **루트 폴더**에 저장 (src/ 안이 아님!)
- 자동으로 `.gitignore`에 포함되어 Git에 커밋되지 않습니다

### Step 3: .env.local 확인

`.env.local` 파일 내용 확인:

```bash
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
```

이미 올바르게 설정되어 있습니다. ✅

### Step 4: 캐시 삭제 및 서버 재시작

```bash
# 1. Next.js 캐시 삭제 (이미 완료됨)
rm -rf .next

# 2. 개발 서버 재시작
npm run dev
```

### Step 5: 브라우저 새로고침

- **Ctrl+Shift+R** (Windows/Linux)
- **Cmd+Shift+R** (Mac)

또는 브라우저 캐시 완전 삭제:
- Chrome: F12 → Network 탭 → "Disable cache" 체크

---

## 🔍 확인 방법

서버 재시작 후 터미널에 다음 메시지가 표시되어야 합니다:

```
✅ Firebase Admin initialized (server-side only)
```

**이 메시지가 안 보이면:**
- `serviceAccountKey.json` 파일이 프로젝트 루트에 있는지 확인
- 파일 이름이 정확한지 확인
- `.env.local` 경로가 올바른지 확인

---

## 🚨 여전히 에러가 발생하면

### 대체 방법: 환경 변수로 직접 설정

`serviceAccountKey.json` 파일을 열어서 내용을 `.env.local`에 직접 입력:

#### 1. serviceAccountKey.json 파일 열기

```json
{
  "type": "service_account",
  "project_id": "dealing-metrics",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQ...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@dealing-metrics.iam.gserviceaccount.com",
  ...
}
```

#### 2. .env.local 업데이트

`.env.local` 파일을 다음과 같이 수정:

```bash
# 파일 경로 방식 주석 처리
# FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json

# 환경 변수 방식으로 변경
FIREBASE_ADMIN_PROJECT_ID=dealing-metrics
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@dealing-metrics.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...(전체 키)...\n-----END PRIVATE KEY-----\n"
```

**주의:**
- `FIREBASE_ADMIN_PRIVATE_KEY`는 반드시 큰따옴표로 감싸기
- `\n` (줄바꿈)을 그대로 유지
- private_key의 전체 내용을 복사 (한 줄로)

#### 3. 서버 재시작

```bash
npm run dev
```

---

## 📋 체크리스트

해결되었는지 확인:

- [ ] `serviceAccountKey.json` 파일을 Firebase Console에서 다운로드
- [ ] 파일을 프로젝트 루트에 저장
- [ ] 파일 이름이 정확히 `serviceAccountKey.json`
- [ ] `.env.local` 파일에 경로 설정됨
- [ ] `.next` 폴더 삭제 (캐시 클리어)
- [ ] 개발 서버 재시작
- [ ] 브라우저 강력 새로고침 (Ctrl+Shift+R)
- [ ] 터미널에 "✅ Firebase Admin initialized" 메시지 확인
- [ ] 콘솔 에러 사라짐

---

## 🎯 예상되는 정상 동작

### 터미널 (서버)
```bash
✅ Firebase Admin initialized (server-side only)
  ▲ Next.js 16.0.10
  - Local:        http://localhost:3000
  - Environments: .env.local, .env
```

### 브라우저 콘솔
- 에러 없음
- API 호출 성공:
  ```
  GET /api/damage/totals 200 OK
  POST /api/damage 200 OK
  ```

---

## 💡 왜 이 에러가 발생했나?

1. **이전 코드 제거:** `.backup` 파일들이 빌드에 포함되어 있었음 (삭제 완료 ✅)
2. **캐시 문제:** Next.js 빌드 캐시가 이전 코드를 사용 (클리어 완료 ✅)
3. **환경 변수 미설정:** Firebase 서비스 계정 키가 없음 ← **지금 해결할 단계**

---

## 📞 추가 지원

문제가 계속되면 다음 정보를 확인해주세요:

```bash
# 1. 파일 존재 확인
ls serviceAccountKey.json

# 2. .env.local 내용 확인
cat .env.local

# 3. 서버 로그 전체 복사
npm run dev
```

---

## 📚 관련 문서

- **빠른 시작:** `QUICK_START.md`
- **보안 가이드:** `SECURITY_MIGRATION.md`
- **환경 변수 정리:** `ENVIRONMENT_CLEANUP.md`

---

**정리:** Firebase 서비스 계정 키만 다운로드해서 저장하면 모든 에러가 해결됩니다! 🎉
