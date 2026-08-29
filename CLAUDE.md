# Observer - Daily Writing Habit App

## Tech Stack
- React Native + Expo (managed workflow, **SDK 54**)
- Expo Router v6 (file-based routing, two tabs)
- expo-sqlite for local storage
- expo-notifications for local scheduled reminders (not available in Expo Go)
- TypeScript 5.9, React 19.1, React Native 0.81

## Key Versions
- Do NOT use react-native-reanimated v4 — it requires react-native-worklets which crashes in Expo Go. Use v3 or the built-in `Animated` API.
- Do NOT use expo-symbols — use plain Text for tab icons.
- Notification code must be wrapped in try/catch since it's unsupported in Expo Go.

## Project Structure
- `app/` — Expo Router screens
  - `app/(tabs)/index.tsx` — Write screen (default tab, named `index` not `write`)
  - `app/(tabs)/log/` — Log tab with nested stack (index, [date])
  - `app/entry/[id].tsx` — View/edit single entry
- `src/` — Non-route code
  - `src/components/` — UI components (Prompt, EntryInput, EntryCard, DayGroup, CategoryBadge, SaveConfirmation)
  - `src/db/` — SQLite schema, CRUD operations, provider
  - `src/notifications/` — Scheduler, permissions, handler (all guarded for Expo Go)
  - `src/hooks/` — useEntries, useDailyGoal, useNotificationSetup
  - `src/theme/` — colors, typography, spacing
  - `src/constants/` — prompts, config
  - `src/types/` — Entry interface, categorize() helper

## Data Model
- Single `entries` table with soft deletes (`deleted_at`), client-generated UUIDs, UTC timestamps
- Entries auto-categorized: < 250 chars = "observation", >= 250 = "reflection"

## Running
- `npx expo start` then scan QR with Expo Go on iPhone (SDK 54 from App Store)
- Do NOT run on web — expo-sqlite doesn't support it
- Use `--clear` flag after dependency changes to flush Metro cache

## Conventions
- Use `npm install --legacy-peer-deps` for dependency installs (peer dep conflicts with reanimated)
- Animations use React Native's built-in `Animated` API, not reanimated
- Log screen refreshes on focus via `useFocusEffect`
- Save action dismisses keyboard and shows animated confirmation
