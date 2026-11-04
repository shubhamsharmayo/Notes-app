# Notes Keeper — Flutter mobile app

This folder adds a Flutter mobile frontend while keeping the existing React client and Express backend unchanged.

## Requirements
- Flutter stable with Dart 3.3+
- Android Studio / Android SDK (or Xcode for iOS)

## Run
From this folder:
```bash
flutter pub get
flutter run
```

## Backend
The API base URL is the same production URL used by the React frontend:
`https://notes-app-inky-zeta.vercel.app`

The Flutter client calls the existing endpoints:
- POST / — login
- POST /signup — register
- POST /profile/profile/:username — create note
- GET /profile/:user — list notes
- GET /profile/starred/:user — list starred notes
- PUT /profile/update/:id — update
- DELETE /profile/delete/:id — delete
- PUT /profile/star/:id — star
- PUT /profile/unstar/:id — unstar

JWT and username are persisted with shared_preferences instead of browser localStorage.

## Android
Verify `android/app/src/main/AndroidManifest.xml` includes:
```xml
<uses-permission android:name="android.permission.INTERNET" />
```

## Existing backend security limitations
The mobile app intentionally follows the current backend contract. The backend currently stores plaintext passwords, leaves note creation without JWT middleware, and does not consistently enforce note ownership. These are existing server-side issues and should be fixed before production use.
