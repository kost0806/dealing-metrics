# ⚡ 빠른 시작 가이드

## 🔐 보안 개선 완료!

Firebase가 이제 **서버 사이드에서만** 실행됩니다. 사용자에게 민감한 정보가 노출되지 않습니다! 🎉

---

## 🚀 로컬 개발 (5분 설정)

### 1. Firebase 서비스 계정 키 받기

1. [Firebase Console](https://console.firebase.google.com/) 접속
2. 프로젝트 선택
3. **⚙️ Project Settings** → **Service Accounts** 탭
4. **Generate New Private Key** 버튼 클릭
5. `serviceAccountKey.json` 다운로드

### 2. 프로젝트에 저장

```bash
# 다운로드한 파일을 프로젝트 루트에 복사
프로젝트/
├── serviceAccountKey.json  ← 여기에 저장
├── .env.local              ← 이 파일 생성
└── ...
```

### 3. 환경 변수 설정

`.env.local` 파일 생성:

```bash
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
```

### 4. 실행!

```bash
npm install
npm run dev
```

✅ 완료! `http://localhost:3000` 접속

---

## 🌐 Vercel 배포 (10분 설정)

### ⚠️ 중요: 파일을 업로드하면 안 됩니다!

환경 변수로 설정합니다.

### 1. 서비스 계정 키 파일 열기

다운로드한 `serviceAccountKey.json` 파일을 텍스트 에디터로 열기:

```json
{
  "project_id": "your-project-123",
  "client_email": "firebase-adminsdk-xxxxx@your-project-123.iam.gserviceaccount.com",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQI...(중략)...\n-----END PRIVATE KEY-----\n"
}
```

### 2. Vercel 환경 변수 설정

[Vercel Dashboard](https://vercel.com/dashboard) → 프로젝트 선택 → **Settings** → **Environment Variables**

**3개 변수 추가:**

| Variable Name | Value (위에서 복사) |
|--------------|---------------------|
| `FIREBASE_ADMIN_PROJECT_ID` | `your-project-123` |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | `firebase-adminsdk-xxxxx@your-project-123.iam.gserviceaccount.com` |
| `FIREBASE_ADMIN_PRIVATE_KEY` | `"-----BEGIN PRIVATE KEY-----\nMIIEvQI...\n-----END PRIVATE KEY-----\n"` |

**주의:**
- `FIREBASE_ADMIN_PRIVATE_KEY`는 반드시 **큰따옴표**로 감싸기
- `\n` (줄바꿈 문자)를 **그대로** 유지
- 앞뒤 공백 없이 정확히 복사

**예시:**
```
"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASC...\n-----END PRIVATE KEY-----\n"
```

### 3. Firestore 보안 규칙 변경

[Firebase Console](https://console.firebase.google.com/) → **Firestore Database** → **Rules**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 클라이언트 접근 차단, 서버만 접근
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

**Publish** 클릭

### 4. 배포

```bash
git add .
git commit -m "feat: secure Firebase migration"
git push
```

Vercel이 자동으로 배포합니다!

### 5. 테스트

```bash
curl https://your-app.vercel.app/api/damage/totals
```

정상 응답:
```json
{
  "success": true,
  "totals": [12000, 15000, ...]
}
```

---

## 📁 프로젝트 구조

```
dealing-metrics/
├── app/
│   └── api/
│       └── damage/
│           ├── route.ts         # 서버 API (POST/GET)
│           └── totals/
│               └── route.ts     # 집계 데이터 API
├── lib/
│   └── firebaseAdmin.ts         # 🔒 서버 전용 (클라이언트 접근 불가)
├── src/
│   ├── components/
│   │   └── Dashboard.tsx        # ✅ 안전한 API 호출
│   └── utils/
│       └── apiService.ts        # ✅ 클라이언트 API 서비스
├── .env.local                   # 로컬 환경 변수
├── serviceAccountKey.json       # 🚨 Git 무시됨 (로컬에만)
└── .gitignore                   # serviceAccountKey.json 포함
```

---

## 🔐 보안 차이점

### ❌ 이전 (위험)

```typescript
// 클라이언트에서 직접 Firebase 접근
import { getFirestore } from 'firebase/firestore';

// ⚠️ Firebase 설정이 클라이언트 코드에 노출됨
const firebaseConfig = {
  apiKey: "AIzaSy...",  // 브라우저에서 보임!
  projectId: "my-project"
};
```

### ✅ 현재 (안전)

```typescript
// 클라이언트는 API만 호출
export async function saveDamageEntry(userId, userName, damages) {
  const response = await fetch('/api/damage', {
    method: 'POST',
    body: JSON.stringify({ userId, userName, damages })
  });
  return response.json();
}

// 🔒 Firebase는 서버에서만 실행 (lib/firebaseAdmin.ts)
// 사용자는 API 결과만 받음
```

---

## 🛠️ 문제 해결

### 로컬 개발 시

**"Firebase Admin credentials not configured"**
```bash
# .env.local 파일 확인
cat .env.local

# 다음이 있어야 함:
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json

# 파일 존재 확인
ls serviceAccountKey.json

# 서버 재시작
npm run dev
```

### Vercel 배포 시

**"Firebase Admin credentials not configured"**
1. Vercel Dashboard → Settings → Environment Variables 확인
2. 3개 변수 모두 있는지 확인
3. `FIREBASE_ADMIN_PRIVATE_KEY`에 `\n` 포함되어 있는지 확인
4. **Redeploy** 수행 (환경 변수 변경 시 필수!)

---

## ✅ 보안 체크리스트

- [ ] `serviceAccountKey.json`이 `.gitignore`에 포함됨 ✅ (이미 설정됨)
- [ ] 로컬: `.env.local` 파일 생성하고 경로 설정
- [ ] Vercel: 환경 변수 3개 설정 (파일 업로드 X)
- [ ] Firestore Rules: 클라이언트 접근 차단
- [ ] Git에 `serviceAccountKey.json` 커밋 안 함
- [ ] Git에 `.env.local` 커밋 안 함

---

## 📚 자세한 가이드

- **전체 보안 가이드:** `SECURITY_MIGRATION.md`
- **Vercel 배포 상세:** `VERCEL_SETUP_GUIDE.md`
- **보안 요약:** `SECURITY_SUMMARY.md`

---

## 💡 핵심 요약

| 환경 | 방법 | 파일 업로드 |
|------|------|------------|
| 로컬 | `serviceAccountKey.json` 파일 | ❌ (로컬에만 저장) |
| Vercel | 환경 변수 3개 설정 | ❌ (값만 복사) |
| Git | - | ❌ (절대 커밋 금지) |

**기억하세요:**
- 🔒 Private key는 절대 업로드하지 않습니다
- 📁 로컬 파일은 로컬에만
- 🌐 Vercel은 환경 변수로
- 🚫 Git에는 절대 커밋 금지

---

✅ **모든 준비 완료!** 안전하게 Firebase를 사용하세요! 🎉
