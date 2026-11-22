# SpeakMate AI — Your Personal English Coach

A mobile-first English practice app built with Next.js App Router, TypeScript, Tailwind CSS and shadcn/ui-style components. It combines typing practice, Roman Telugu translation, grammar and vocabulary lessons, professional communication, conversation coaching and progress analytics in one offline-friendly PWA.

> **Important:** without an AI key, the app runs a clearly labelled local rule engine (`Offline practice — not AI`). It never presents local rules as genuine AI. Online AI is optional and happens only after your consent in Settings.

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. (Optional) enable online AI
copy .env.example .env.local
# edit .env.local and add your AI_API_KEY

# 3. Start the dev server
npm run dev
```

Open <http://localhost:3000>. The landing page is `/`; the app home is `/dashboard`.

```bash
# Quality checks
npm run typecheck
npm run lint
npm run build

# Production server
npm run start
```

## Features

- **Landing page** with the positioning “Think in Your Language. Communicate with Confidence.”, feature tour and direct entry points.
- **AI conversation coach** with session context, gentle corrections, Telugu meanings, follow-up questions and correction-mode controls.
- **Roman Telugu → English** translator that handles Roman Telugu, incorrect English, normal English and mixed Telugu-English input; returns natural, professional and Telugu forms with confidence and clarification prompts.
- **Typing trainer** with real WPM/accuracy measurement, timed and passage modes, sound toggle, results and history.
- **Grammar coach** with 12 lessons, examples, quizzes and completion tracking.
- **Vocabulary builder** with 60+ words, daily learning goals, quizzes and streak tracking.
- **Professional English** modules for workplace, college, interviews, meetings, presentations and feedback.
- **Emotion coach** with cautious cue analysis, empathy suggestions and respectful clarifying questions.
- **GirlTalk and Flirting coaches** with confidence, boundaries, consent and respectful-language guidance.
- **Roleplay simulator** with realistic scenarios, difficulty levels and AI/offline scoring.
- **Progress dashboard** with charts driven by actual saved practice data.
- **Settings** for theme, explanation language, correction style, difficulty, online/offline mode, privacy, data export and reset.
- **PWA** with installable manifest, service worker, offline app shell and mobile bottom navigation.
- **Local-first storage** using localStorage as the source of truth, mirrored to IndexedDB for conversations and progress.

## AI configuration

Copy `.env.example` to `.env.local` and set:

```dotenv
AI_API_KEY=your-key-here
AI_BASE_URL=https://api.openai.com/v1
AI_MODEL=gpt-4o-mini
AI_TIMEOUT_MS=20000
```

Any OpenAI-compatible `/chat/completions` endpoint works. Keep keys **only** in server-side environment variables; they are never exposed to the browser. The API route (`/api/ai`) validates requests with Zod and returns `503 AI_NOT_CONFIGURED` when no key is present.

Online AI is used only when all of the following are true:

1. the browser is online,
2. “Force offline mode” is off in Settings,
3. “Allow online processing” is on in Settings,
4. the server has a valid `AI_API_KEY`.

Otherwise the app uses the labelled offline engine. Responses include `source: "ai"` or `source: "offline"` so the UI can be honest about their origin.

## Offline and mobile install

1. Run `npm run build && npm run start` (or deploy the app over HTTPS).
2. Open the app in Chrome/Edge on Android or Safari on iOS.
3. Let the page load once so the service worker can cache the app shell.
4. **Android:** browser menu → **Install app** / **Add to Home screen**.
5. **iOS:** Share button → **Add to Home Screen**.
6. Launch the installed app; navigation and saved practice data work without a network connection.

Offline mode never calls `/api/ai`. API calls are intentionally excluded from the service worker cache. You can also force offline behaviour at any time in Settings.

## Project structure

```text
src/
  app/
    api/ai/route.ts          Secure server-side AI provider route
    chat/                    Conversation coach
    dashboard/               Learning home
    emotion/                 Empathy and tone coach
    girltalk/                Social confidence coach
    girltalk/flirting/       Respectful flirting coach
    grammar/                 Grammar lessons and quizzes
    practice/                Roleplay simulator
    professional/            Professional English modules
    progress/                Analytics and charts
    settings/                Preferences, privacy and data controls
    telugu-english/          Roman Telugu translation
    typing/                  Typing trainer
    vocabulary/              Daily vocabulary
  components/
    layout/                  Responsive shell, sidebar, topbar, bottom nav
    learning/                Grammar and vocabulary components
    practice/                AI practice, scoring and roleplay components
    typing/                  Typing engine UI
    ui/                      Reusable shadcn/ui-style primitives
  data/                      Lessons, words, scenarios, professional modules
  lib/
    ai/                      Prompts, secure client dispatch, offline engine
    correction/              Seven-part gentle correction logic
    emotion/                 Emotion cue analysis
    storage/                 Store, selectors, IndexedDB mirroring
    translation/             Roman Telugu translator
    typing/                  WPM and accuracy engine
    types.ts                 Shared domain types
public/
  icons/                     SVG app icons
  manifest.webmanifest       PWA manifest
  sw.js                      Offline service worker
```

## Data and privacy

- Learning data is stored on the device by default.
- Online processing is opt-in and can be disabled at any time.
- Conversations and progress can be cleared from Settings.
- API keys never enter client bundles.

## Testing notes

Recommended checks before release:

```bash
npm run typecheck
npm run lint
npm run build
npm run dev
```

Verify routes at **360 px, 390 px, 430 px**, tablet and desktop widths with no horizontal overflow. Check that every navigation item opens, the browser console is clean, typing stats update, quizzes persist, charts reflect saved activity, the correction toggle works, and airplane-mode messages are labelled as offline practice.

## Implementation notes

The implementation used current guidance for responsive navigation, dark mode, forms, accessibility and tab patterns from the `modern-web-guidance` skill. The pre-existing root `index.html` placeholder was left untouched; the SpeakMate app lives in the Next.js project alongside it.
