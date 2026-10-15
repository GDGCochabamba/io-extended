# Google I/O Extended Cochabamba 2025

Landing of Google I/O Extended Cochabamba 2025, published at **io.gdg.com.bo**.

- **Design:** follows the GDG Cochabamba posts for the event (Figma "GDG Events" → Google IO Extended 2025), using the official I/O 25 artwork.
- **Data:** the event, its sessions and speakers are read from the shared Firestore (`gdg-platform-cochabamba`, slug `io-extended-2025`) at build time. Speaker photos are downloaded and optimized during the build, so visitors don't load anything from Firebase.

It lives in this folder, independent from the 2023 gamification PWA at the repository root: its own `package.json`, `firebase.json` and `.firebaserc`. Run every command from `landing-2025/`.

## Develop

```bash
cp .env.example .env   # fill in the public Firebase config
npm install
npm run dev
```

## Deploy

Hosting site `io-extended-cbba` in the Firebase project `io-extended-cocha`. The project's default site, `io-extended-cocha.web.app`, where the retired 2023 PWA lived, now redirects here.

```bash
npm run build && firebase deploy --only hosting
```
