# Tech Stack Options for FeelsLike (Web-Developer-Friendly Android App)

> Context: the app should be buildable and maintainable by someone who knows
> HTML / CSS / JavaScript (and optionally a JS framework like React or Vue),
> **not** Kotlin / Java.

---

## Option A — React Native + Expo ✅ **CHOSEN**

### What it is
React Native lets you build truly native Android (and iOS) apps using
**JavaScript/TypeScript and React**. Expo is a toolchain on top of it that
dramatically simplifies setup — no Android Studio or Xcode required for
day-to-day development.

### Stack
- Language: **JavaScript / TypeScript**
- UI paradigm: React components (similar to web React, but uses `<View>`,
  `<Text>` instead of `<div>`, `<p>`)
- Styling: JavaScript style objects (very close to CSS)
- Local storage: `@react-native-async-storage/async-storage` or SQLite

### Pros
- Huge ecosystem; most web JS libraries work
- Hot reload — see changes instantly on your phone
- One codebase → Android + iOS
- Expo Go app lets you test without building an APK
- Great docs & community

### Cons
- Not 100% identical to web React (no DOM, slightly different APIs)
- Some native features need extra plugins

### Effort to bootstrap
~15 minutes with Expo CLI

---

## Option B — Ionic + Capacitor ⭐ Recommended if you prefer plain HTML/CSS

### What it is
Ionic is a component library for building mobile UIs with standard
**HTML, CSS, and any JS framework** (React, Vue, Angular, or vanilla JS).
Capacitor wraps the result in a native Android WebView, giving access to
device APIs (storage, camera, notifications, etc.).

### Stack
- Language: **JavaScript / TypeScript**
- UI: HTML + CSS + Ionic components (look and feel like native mobile)
- Framework: your choice — React, Vue, Angular, or none
- Local storage: Capacitor Preferences plugin or SQLite

### Pros
- Closest to a normal website — real DOM, real CSS
- Familiar browser DevTools for debugging
- Works with any JS framework you already know
- One codebase → Android + iOS + PWA

### Cons
- Runs in a WebView (slightly less "native" feel than React Native)
- Can feel slower on very animation-heavy UIs (not a concern for this app)

### Effort to bootstrap
~20 minutes with Ionic CLI + Capacitor

---

## Option C — Progressive Web App (PWA)

### What it is
A regular website that can be "installed" on Android via Chrome's
**Add to Home Screen** feature. No app store, no build tooling.

### Stack
- Language: **JavaScript / TypeScript**
- UI: HTML + CSS — whatever you already know
- Storage: LocalStorage / IndexedDB (built into the browser)

### Pros
- Zero mobile-specific learning curve — it's just a website
- Instant deploy (host it anywhere or even run it locally)
- Works on any device with a browser

### Cons
- Not distributed via Google Play Store
- Limited access to device features (notifications are limited on Android Chrome)
- No offline-first without extra ServiceWorker work
- Doesn't feel as "app-like" (no splash screen, no full native controls)

### Effort to bootstrap
5 minutes — just create an HTML file

---

## Option D — Flutter (Honorable Mention — NOT web tech)

Flutter uses **Dart** (not JS/HTML). Mentioned for completeness because it's
very popular for cross-platform apps, but it requires learning a new language.
**Not recommended** given the web-developer constraint.

---

## Comparison Table

| | React Native + Expo | Ionic + Capacitor | PWA |
|---|---|---|---|
| Language | JS / TS | JS / TS | JS / TS |
| HTML / CSS | No (JSX + style objects) | **Yes** | **Yes** |
| Familiar to web dev | Mostly | **Very** | **Fully** |
| Native feel | High | Medium-High | Medium |
| Google Play Store | ✅ Yes | ✅ Yes | ❌ No |
| iOS support | ✅ Yes | ✅ Yes | ⚠️ Limited |
| Local storage | Plugin | Plugin | Built-in |
| Setup complexity | Low (Expo) | Low | None |
| Community / docs | Excellent | Good | Excellent |

---

## Recommendation Summary

| Scenario | Best Choice |
|---|---|
| You know **React** | **Option A** — React Native + Expo |
| You prefer plain HTML/CSS or know Vue/Angular | **Option B** — Ionic + Capacitor |
| You just want the fastest possible start, no Play Store needed | **Option C** — PWA |

---

## Decision Needed

Please answer:
1. Do you know React, Vue, Angular, or are you comfortable with vanilla JS/HTML/CSS?
2. Do you want the app on Google Play Store (or just sideloaded / PWA)?

This will narrow it down to one option and we can start bootstrapping.

