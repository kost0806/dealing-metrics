# 🧹 환경변수 정리 완료

## 변경 내역

### ❌ 삭제된 환경변수 (더 이상 사용 안 함)

#### .env.local (이전)
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...           # ❌ 삭제됨
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...             # ❌ 삭제됨
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...              # ❌ 삭제됨
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...          # ❌ 삭제됨
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...     # ❌ 삭제됨
NEXT_PUBLIC_FIREBASE_APP_ID=...                  # ❌ 삭제됨
```

#### .env (이전)
```bash
VITE_FIREBASE_API_KEY=...                        # ❌ 삭제됨
VITE_FIREBASE_AUTH_DOMAIN=...                    # ❌ 삭제됨
VITE_FIREBASE_PROJECT_ID=...                     # ❌ 삭제됨
VITE_FIREBASE_STORAGE_BUCKET=...                 # ❌ 삭제됨
VITE_FIREBASE_MESSAGING_SENDER_ID=...            # ❌ 삭제됨
VITE_FIREBASE_APP_ID=...                         # ❌ 삭제됨
```

**삭제 이유:**
- `NEXT_PUBLIC_*`: 클라이언트 번들에 노출되어 보안 위험
- `VITE_*`: Next.js에서 사용하지 않음 (Vite 전용)
- 이제 Firebase Admin SDK(서버 사이드)만 사용

---

## ✅ 새로운 환경변수 (서버 사이드 전용)

### .env.local (현재)
```bash
# 방법 1: 서비스 계정 파일 경로 (추천)
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json

# 방법 2: 직접 값 입력 (선택사항)
# FIREBASE_ADMIN_PROJECT_ID=dealing-metrics
# FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@dealing-metrics.iam.gserviceaccount.com
# FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

---

## 📦 백업 파일

혹시 필요할 경우를 대비해 백업 파일이 생성되었습니다:

- `.env.backup` - 이전 .env 파일
- `.env.local.backup` - 이전 .env.local 파일

**백업 파일은 Git에 커밋되지 않습니다.**

---

## 🚀 다음 단계

### 1. Firebase 서비스 계정 키 다운로드

1. [Firebase Console](https://console.firebase.google.com/) 접속
2. **Project Settings** → **Service Accounts**
3. **Generate New Private Key** 클릭
4. `serviceAccountKey.json` 다운로드

### 2. 프로젝트에 저장

```bash
# 다운로드한 파일을 프로젝트 루트에 저장
dealing-metrics/
├── serviceAccountKey.json  ← 여기에 저장
├── .env.local              ← 이미 설정됨
└── ...
```

### 3. 서버 실행

```bash
npm run dev
```

**주의:** `serviceAccountKey.json` 파일이 없으면 다음 에러가 발생합니다:
```
Firebase Admin credentials not configured
```

---

## 🌐 Vercel 배포 시

Vercel Dashboard에서 환경 변수 3개를 설정하세요:

| Variable Name | Value |
|--------------|-------|
| `FIREBASE_ADMIN_PROJECT_ID` | `dealing-metrics` |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | `firebase-adminsdk-xxxxx@dealing-metrics.iam.gserviceaccount.com` |
| `FIREBASE_ADMIN_PRIVATE_KEY` | `"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"` |

자세한 방법: `VERCEL_SETUP_GUIDE.md` 참조

---

## 🔐 보안 개선 효과

### 이전 (위험)
```
❌ API 키가 클라이언트 JavaScript 번들에 포함됨
❌ 브라우저 개발자 도구에서 Firebase 설정 확인 가능
❌ 누구나 Firestore에 직접 접근 시도 가능
```

### 현재 (안전)
```
✅ Firebase 설정이 서버에만 존재
✅ 클라이언트는 API 엔드포인트만 호출
✅ 모든 데이터베이스 작업이 서버에서 검증됨
✅ Firestore 규칙을 엄격하게 설정 가능
```

---

## ✅ 확인 사항

- [ ] `.env.local` 파일이 새로운 형식으로 업데이트됨
- [ ] `.env` 파일이 정리됨
- [ ] 백업 파일 생성됨 (`.env.backup`, `.env.local.backup`)
- [ ] `serviceAccountKey.json` 다운로드 완료
- [ ] `serviceAccountKey.json`이 프로젝트 루트에 저장됨
- [ ] 서버 실행 (`npm run dev`) 성공
- [ ] API 엔드포인트 정상 작동 확인

---

## 📚 관련 문서

- **빠른 시작:** `QUICK_START.md`
- **보안 가이드:** `SECURITY_MIGRATION.md`
- **Vercel 배포:** `VERCEL_SETUP_GUIDE.md`
- **보안 요약:** `SECURITY_SUMMARY.md`

---

## 🚨 중요 알림

### 절대 하지 말 것
- ❌ `serviceAccountKey.json`을 Git에 커밋
- ❌ `.env.local`을 Git에 커밋
- ❌ Private key를 공개 저장소에 업로드
- ❌ `NEXT_PUBLIC_` 접두사로 Firebase 설정

### 반드시 할 것
- ✅ `.gitignore`에 민감한 파일 포함 확인
- ✅ 서버 사이드 환경 변수만 사용
- ✅ Firestore 보안 규칙 엄격하게 설정
- ✅ 주기적으로 서비스 계정 키 로테이션

---

**정리 완료!** 🎉

이제 모든 Firebase 통신이 안전하게 서버에서만 실행됩니다.
