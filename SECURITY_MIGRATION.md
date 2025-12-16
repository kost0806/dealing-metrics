# 🔒 Firebase Security Migration Guide

## Overview
This project has been migrated from **client-side Firebase** to **server-side Firebase Admin SDK** for improved security.

## 🚨 Security Improvements

### Before (Insecure)
```typescript
// ❌ Client-side - Firebase config exposed
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,  // Exposed to client!
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  // ... other config exposed in client bundle
};

// ❌ Direct Firestore access from client
import { getFirestore } from 'firebase/firestore';
const db = getFirestore(app);
await addDoc(collection(db, 'damageEntries'), data);
```

**Security Risks:**
- Firebase credentials exposed in client bundle
- Database structure visible to all users
- Firestore security rules must be open for client access
- No server-side validation
- Potential for data tampering

### After (Secure)
```typescript
// ✅ Server-side only - Credentials never exposed
// lib/firebaseAdmin.ts
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Credentials only on server, never in client bundle
const adminApp = initializeApp({
  credential: cert(serviceAccount),  // Server-side only!
});

// ✅ Client calls secure API routes
// src/utils/apiService.ts
export async function saveDamageEntry(userId, userName, damages) {
  const response = await fetch('/api/damage', {
    method: 'POST',
    body: JSON.stringify({ userId, userName, damages }),
  });
  return response.json();
}
```

**Security Benefits:**
- ✅ Firebase credentials **never** exposed to client
- ✅ Server-side validation of all data
- ✅ Firestore rules can be more restrictive
- ✅ API layer provides additional security controls
- ✅ Data structure hidden from clients

## 📋 Setup Instructions

### Step 1: Get Firebase Service Account

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings** → **Service Accounts**
4. Click **Generate New Private Key**
5. Save the JSON file as `serviceAccountKey.json` in project root

### Step 2: Configure Environment Variables

Choose **ONE** method:

#### Method A: Service Account File (Development)
```bash
# .env.local
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
```

#### Method B: Environment Variables (Production/Vercel)
```bash
# .env.local or Vercel Environment Variables
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key\n-----END PRIVATE KEY-----\n"
```

**Important:** Preserve `\n` line breaks in private key!

### Step 3: Update Firestore Security Rules

Since all access now goes through server API, you can use restrictive rules:

```javascript
// Firestore Rules - Allow only server-side access
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Deny all client access - only allow server
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

Or for authenticated server access:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /damageEntries/{entryId} {
      // Only allow Firebase Admin SDK (server-side)
      allow read, write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

### Step 4: Deploy

```bash
# Install dependencies
npm install

# Build application
npm run build

# Start server
npm start
```

## 🏗️ Architecture

```
┌─────────────┐
│   Client    │
│  (Browser)  │
└──────┬──────┘
       │ HTTPS
       │ /api/damage
       ▼
┌─────────────────────┐
│   Next.js Server    │
│                     │
│  ┌───────────────┐  │
│  │  API Routes   │  │
│  │  - Validation │  │
│  │  - Auth Check │  │
│  └───────┬───────┘  │
│          │          │
│          ▼          │
│  ┌───────────────┐  │
│  │ Firebase Admin│  │
│  │     SDK       │  │
│  └───────┬───────┘  │
└──────────┼──────────┘
           │ Server SDK
           │ (Secure)
           ▼
    ┌─────────────┐
    │  Firestore  │
    │  Database   │
    └─────────────┘
```

## 📁 File Structure

```
dealing-metrics/
├── app/
│   └── api/
│       └── damage/
│           ├── route.ts           # POST/GET /api/damage
│           └── totals/
│               └── route.ts       # GET /api/damage/totals
├── lib/
│   └── firebaseAdmin.ts           # Server-side Firebase Admin SDK
├── src/
│   ├── components/
│   │   └── Dashboard.tsx          # Client component (uses apiService)
│   └── utils/
│       ├── apiService.ts          # Client API calls (NEW)
│       ├── firebaseService.ts.backup  # Old client Firebase (backup)
│       └── firebase.ts.backup     # Old Firebase config (backup)
├── .env.example                   # Environment variable template
├── .gitignore                     # Includes serviceAccountKey.json
└── SECURITY_MIGRATION.md          # This file
```

## 🔐 Security Checklist

- [ ] Firebase service account key downloaded
- [ ] Environment variables configured (`.env.local`)
- [ ] `serviceAccountKey.json` in `.gitignore`
- [ ] **NEVER** commit service account key to Git
- [ ] Firestore rules updated to deny client access
- [ ] API routes implement proper validation
- [ ] Client code only calls API routes (not Firebase directly)
- [ ] Old `NEXT_PUBLIC_FIREBASE_*` env vars removed
- [ ] Production deployment uses Method B (environment variables)

## 🚀 Vercel Deployment

1. Add environment variables in Vercel dashboard:
   - `FIREBASE_ADMIN_PROJECT_ID`
   - `FIREBASE_ADMIN_CLIENT_EMAIL`
   - `FIREBASE_ADMIN_PRIVATE_KEY` (in quotes, with `\n`)

2. Deploy:
   ```bash
   vercel --prod
   ```

## 📊 API Endpoints

### POST /api/damage
Save damage entry (server-side validation)
```json
// Request
{
  "userId": "user_123",
  "userName": "Player1",
  "damages": [1000, 2000, ..., 9000]
}

// Response
{
  "success": true,
  "entryId": "abc123"
}
```

### GET /api/damage
Get all damage entries
```json
// Response
{
  "success": true,
  "entries": [...]
}
```

### GET /api/damage/totals
Get aggregated totals (no sensitive data)
```json
// Response
{
  "success": true,
  "totals": [12000, 15000, 18000, ...]
}
```

## 🛠️ Troubleshooting

### Error: "Firebase Admin credentials not configured"
- Check `.env.local` exists with correct variables
- Restart Next.js dev server after changing env vars
- Verify service account JSON file path is correct

### Error: "Permission denied" from Firestore
- Update Firestore security rules to allow server access
- Check Firebase service account has correct permissions
- Verify project ID matches in service account

### Client can't fetch data
- Check API routes are deployed (`/api/damage`)
- Check browser console for fetch errors
- Verify server is running (`npm run dev` or `npm start`)

## 📚 References

- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)

## ⚠️ Important Notes

1. **Never use `NEXT_PUBLIC_` prefix for Firebase credentials** - this exposes them to client!
2. **Always add service account files to `.gitignore`** - never commit credentials!
3. **Use environment variables for production** - don't deploy service account files
4. **Keep private keys secure** - treat them like passwords
5. **Client code should never import `lib/firebaseAdmin.ts`** - server-side only!

---

✅ **Migration Complete!** Your Firebase operations are now secure and server-side only.
