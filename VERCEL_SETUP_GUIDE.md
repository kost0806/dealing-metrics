# 🚀 Vercel 배포 가이드 (Private Key 안전하게 설정)

## ⚠️ 중요: Private Key 파일을 업로드하면 안 됩니다!

Private key 파일(serviceAccountKey.json)은 **절대로** Git에 커밋하거나 Vercel에 업로드하면 안 됩니다.
대신 **환경 변수**로 설정합니다.

## 📋 단계별 설정 방법

### Step 1: 서비스 계정 키 다운로드

1. [Firebase Console](https://console.firebase.google.com/) 접속
2. 프로젝트 선택
3. **Project Settings** (⚙️) → **Service Accounts** 탭
4. **Generate New Private Key** 클릭
5. `serviceAccountKey.json` 파일 다운로드 (로컬에만 저장)

### Step 2: JSON 파일 열어서 값 확인

다운로드한 `serviceAccountKey.json` 파일을 열면 이런 구조입니다:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  ...
}
```

### Step 3: Vercel 환경 변수 설정

#### 방법 A: Vercel Dashboard 사용 (추천)

1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. 프로젝트 선택
3. **Settings** → **Environment Variables** 클릭
4. 다음 3개 변수 추가:

| Name | Value | Environment |
|------|-------|-------------|
| `FIREBASE_ADMIN_PROJECT_ID` | `your-project-id` | Production, Preview, Development |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | `firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com` | Production, Preview, Development |
| `FIREBASE_ADMIN_PRIVATE_KEY` | `"-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"` | Production, Preview, Development |

**중요: Private Key 입력 시 주의사항**
- 반드시 큰따옴표(`"`)로 감싸기
- `\n` (줄바꿈)을 그대로 유지
- 앞뒤 공백 없이 정확히 복사

**예시:**
```
"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

#### 방법 B: Vercel CLI 사용

```bash
# Vercel CLI 설치
npm i -g vercel

# 로그인
vercel login

# 환경 변수 설정
vercel env add FIREBASE_ADMIN_PROJECT_ID production
# 값 입력: your-project-id

vercel env add FIREBASE_ADMIN_CLIENT_EMAIL production
# 값 입력: firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

vercel env add FIREBASE_ADMIN_PRIVATE_KEY production
# 값 입력: "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### Step 4: Firestore 보안 규칙 업데이트

이제 클라이언트는 Firebase에 직접 접근할 수 없으므로, 보안 규칙을 강화합니다:

1. [Firebase Console](https://console.firebase.google.com/) 접속
2. **Firestore Database** → **Rules** 탭
3. 다음 규칙으로 변경:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 모든 클라이언트 접근 차단
    // 오직 서버(Firebase Admin SDK)만 접근 가능
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

4. **Publish** 클릭

### Step 5: 배포

```bash
# Git에 커밋 (serviceAccountKey.json은 자동으로 무시됨)
git add .
git commit -m "feat: migrate to server-side Firebase with secure API"
git push

# Vercel이 자동으로 배포하거나, 수동 배포:
vercel --prod
```

### Step 6: 배포 확인

배포 후 테스트:

```bash
# API 엔드포인트 테스트
curl https://your-app.vercel.app/api/damage/totals

# 정상 응답:
{
  "success": true,
  "totals": [...]
}
```

## 🔐 로컬 개발 환경 설정

로컬에서는 파일 방식을 사용할 수 있습니다:

```bash
# .env.local 파일 생성
echo 'FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json' > .env.local

# serviceAccountKey.json을 프로젝트 루트에 저장
# (이미 .gitignore에 포함되어 있어 Git에 커밋되지 않음)

# 개발 서버 실행
npm run dev
```

## 🔍 문제 해결

### 1. "Firebase Admin credentials not configured" 에러

**원인:** 환경 변수가 설정되지 않음

**해결:**
- Vercel Dashboard에서 환경 변수 확인
- 값이 정확히 입력되었는지 확인 (특히 `\n` 유지)
- Redeploy 수행 (환경 변수 변경 후 필수)

### 2. "Invalid private key" 에러

**원인:** Private key 형식 오류

**해결:**
```bash
# Private key 값이 다음 형식인지 확인:
"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...(한 줄로)...\n-----END PRIVATE KEY-----\n"

# ❌ 잘못된 예:
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBg...
-----END PRIVATE KEY-----

# ✅ 올바른 예:
"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...\n-----END PRIVATE KEY-----\n"
```

### 3. "Permission denied" from Firestore

**원인:** Firestore 보안 규칙이 아직 클라이언트 접근 허용 중

**해결:**
- Firestore Rules를 업데이트하여 서버만 접근 가능하도록 설정
- Firebase 서비스 계정이 올바른 권한을 가지고 있는지 확인

### 4. 로컬에서는 작동하지만 Vercel에서 안 됨

**원인:** 환경 변수가 Vercel에 설정되지 않음

**해결:**
1. Vercel Dashboard → Settings → Environment Variables 확인
2. Production, Preview, Development 모두 체크했는지 확인
3. Redeploy 수행

## 📚 환경 변수 비교

| 환경 | 방법 | 파일 위치 |
|------|------|-----------|
| **로컬 개발** | 파일 방식 | `serviceAccountKey.json` (로컬에만) |
| **Vercel Production** | 환경 변수 | Vercel Dashboard 설정 |
| **다른 서버** | 환경 변수 또는 시크릿 관리 시스템 | 서버 환경에 따라 다름 |

## ✅ 보안 체크리스트

배포 전 확인사항:

- [ ] `serviceAccountKey.json`이 `.gitignore`에 포함됨
- [ ] `serviceAccountKey.json`이 Git 히스토리에 없음 (있으면 히스토리 정리 필요)
- [ ] Vercel 환경 변수 3개 모두 설정됨
- [ ] Private key에 `\n` 줄바꿈 포함됨
- [ ] Private key가 큰따옴표로 감싸져 있음
- [ ] Firestore Rules가 클라이언트 접근을 차단함
- [ ] 로컬 `.env.local` 파일이 `.gitignore`에 포함됨
- [ ] GitHub/GitLab에 환경 변수가 노출되지 않음

## 🚨 만약 실수로 Private Key를 커밋했다면?

**즉시 조치:**

1. **Firebase Console에서 해당 서비스 계정 키 삭제**
2. **새 서비스 계정 키 생성**
3. **Git 히스토리에서 키 제거:**
   ```bash
   # git-filter-repo 사용 (추천)
   pip install git-filter-repo
   git filter-repo --path serviceAccountKey.json --invert-paths

   # 또는 BFG Repo-Cleaner 사용
   bfg --delete-files serviceAccountKey.json
   ```
4. **Force push (주의!):**
   ```bash
   git push origin --force --all
   ```

## 📖 참고 자료

- [Firebase Admin SDK Setup](https://firebase.google.com/docs/admin/setup)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

---

## 요약

1. ❌ **하지 마세요:** Private key 파일을 Git/Vercel에 업로드
2. ✅ **하세요:** Vercel Dashboard에서 환경 변수로 설정
3. 🔐 **로컬:** `serviceAccountKey.json` 파일 사용 (Git 무시됨)
4. 🚀 **프로덕션:** 환경 변수 3개 설정 후 배포

**핵심:** 파일은 로컬에만, 프로덕션은 환경 변수! 🔒
