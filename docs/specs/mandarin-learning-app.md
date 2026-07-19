# Mandarin SRS Learning App (`mandarin-learning-app`)

## Goal
Build a basic, high-performance, local-first Mandarin Chinese learning mobile app using React Native (Expo), featuring swipeable SRS flashcards, native Text-to-Speech (`expo-speech`), haptic feedback (`expo-haptics`), a modern dark glassmorphism aesthetic, and pre-loaded HSK 1–3 vocabulary (~600 categorized words).

## Core Architecture & Technical Stack
- **Framework:** React Native + Expo SDK (SDK 52+ / latest stable `create-expo-app`) with TypeScript.
- **Audio / Pronunciation:** `expo-speech` (native device text-to-speech for accurate Mandarin tones without bundle size bloat).
- **Haptic & Touch UX:** `expo-haptics` + `react-native-gesture-handler` / `react-native-reanimated` for 60fps card swipe physics (Swipe Right = "Mastered/Easy", Swipe Left = "Review Soon").
- **State & Storage:** `Zustand` for global state + `AsyncStorage` / `expo-sqlite` for local SRS review scheduling and streak persistence.
- **Aesthetics & UI:** Vanilla React Native / StyleSheet with a curated Dark Mode palette (`#0B0F19` background, `#1E293B` glass cards, `#10B981` emerald accent for success, `#F43F5E` rose for review). Touch targets strictly $\ge$ 48px.
- **Curriculum:** HSK 1 (~150 words), HSK 2 (~150 words), and HSK 3 (~300 words) curated with Hanzi (汉字), Pinyin (拼音), English definition, and example sentence.

## Tasks
- [x] Task 1: Scaffolding & Dependencies → Run `npx create-expo-app -t expo-template-blank-typescript .` (`--force` if needed) and install `expo-speech`, `expo-haptics`, `lucide-react-native`, `zustand`, `@react-native-async-storage/async-storage`, `react-native-reanimated`, `react-native-gesture-handler`, `react-native-safe-area-context`. Verify: `npx expo start` runs cleanly.
- [x] Task 2: HSK 1–3 Curriculum Dataset (`src/data/hskVocabulary.ts`) → Create structured JSON/TS dataset containing 600 words categorized by HSK Level (1, 2, 3) and topic (Greetings, Food, Time, Travel, Work). Verify: TypeScript type checks pass (`npx tsc`).
- [x] Task 3: Local SRS & State Store (`src/store/useLearningStore.ts`) → Implement `Zustand` store with Leitner SRS algorithm (box 1 to 5), daily streak calculation, word mastery tracking, and persistence. Verify: State updates when simulated card reviews occur.
- [x] Task 4: Design System & Tokens (`src/theme/colors.ts`) → Define dark mode glassmorphism styles, typography (large clean Hanzi fonts, distinct Pinyin styling), and layout metrics ($\ge$ 48px touch targets). Verify: Importable across components.
- [x] Task 5: Audio & Haptic Hooks (`src/hooks/useMandarinAudio.ts`) → Create reusable hook wrapping `Speech.speak(text, { language: 'zh-CN', rate: 0.8 })` with haptic triggers (`Haptics.impactAsync`). Verify: Audio plays on button tap in simulator/device.
- [x] Task 6: Swipeable SRS Flashcard Component (`src/components/Flashcard.tsx`) → Build animated card with flip gesture (reveal Pinyin/English) and horizontal swipe gesture (Left = Hard/Again, Right = Easy/Know). Verify: Smooth 60fps swipe animations.
- [x] Task 7: Level & Topic Selector Dashboard (`src/screens/HomeScreen.tsx`) → Build home screen displaying daily streak, total mastered words count, and selectable HSK 1, 2, and 3 decks. Verify: Tapping a deck launches study session.
- [x] Task 8: Interactive Study Session Screen (`src/screens/StudyScreen.tsx`) → Integrate `Flashcard` with top progress bar, audio pronunciation button, and session summary screen upon deck completion. Verify: End-to-end study session works from home screen to completion.
- [x] Task 9: Mini-Quiz & Tone Practice (`src/screens/QuizScreen.tsx`) → Build quick multiple-choice quiz mode (match Hanzi to Pinyin/English) for varied reinforcement. Verify: Correct/incorrect selection triggers haptics and updates score.
- [x] Task 10: Final Verification & Mobile Build Check → Run `python .agents/scripts/checklist.py .` (or manual audit) and verify Android/iOS builds run without errors. Verify: `npx expo run:android` / `npx expo run:ios` compiles successfully.

## Done When
- [x] App launches instantly ($\le 100\text{ms}$) offline with full HSK 1–3 vocabulary accessible.
- [x] Leitner SRS store successfully persists spacing intervals across daily reloads.
- [x] Haptic feedback (light, success, error) and Mandarin TTS pronunciation reliably trigger.
- [x] Swipe gestures on flashcards hit steady 60fps framerates without memory leaks. clear `zh-CN` Mandarin pronunciation via `expo-speech`.
- [x] Daily streaks and SRS box progressions persist across app restarts without network access.
