# Observer - Daily Writing Habit App

## Tech Stack
- React Native + Expo (managed workflow, **SDK 54**)
- Expo Router v6 (file-based routing, three tabs: Write, Log, Settings)
- expo-sqlite for local storage (entries)
- @react-native-async-storage/async-storage for user settings
- expo-notifications for local scheduled reminders (not available in Expo Go)
- @react-native-community/datetimepicker for time picker in Settings
- TypeScript 5.9, React 19.1, React Native 0.81

## Key Versions
- Do NOT use react-native-reanimated v4 — it requires react-native-worklets which crashes in Expo Go. Use v3 or the built-in `Animated` API.
- Do NOT use expo-symbols — use plain Text for tab icons.
- Notification code must be wrapped in try/catch since it's unsupported in Expo Go.

## Project Structure
- `app/` — Expo Router screens
  - `app/(tabs)/index.tsx` — Write screen (default tab, named `index` not `write`)
  - `app/(tabs)/log/` — Log tab with nested stack (index, [date])
  - `app/(tabs)/settings.tsx` — Settings screen (appearance, reminders, timing)
  - `app/entry/[id].tsx` — View/edit single entry
- `src/` — Non-route code
  - `src/components/` — UI components (Prompt, EntryInput, EntryCard, DayGroup, CategoryBadge, SaveConfirmation)
  - `src/db/` — SQLite schema, CRUD operations, provider
  - `src/notifications/` — Scheduler, permissions, handler (all guarded for Expo Go)
  - `src/settings/` — AppSettings interface, AsyncStorage persistence, SettingsContext/useSettings()
  - `src/hooks/` — useEntries, useDailyGoal, useNotificationSetup
  - `src/theme/` — colors (light + dark palettes), typography, spacing, ThemeContext/useTheme()
  - `src/constants/` — prompts, config
  - `src/types/` — Entry interface, categorize() helper

## Data Model
- Single `entries` table with soft deletes (`deleted_at`), client-generated UUIDs, UTC timestamps
- Entries auto-categorized: < 250 chars = "observation", >= 250 = "reflection"

## Running
- `npx expo start` then scan QR with Expo Go on iPhone (SDK 54 from App Store)
- Do NOT run on web — expo-sqlite doesn't support it
- Use `--clear` flag after dependency changes to flush Metro cache

## Settings & Theme
- Settings persist via AsyncStorage (`src/settings/settingsStorage.ts`)
- `SettingsProvider` > `ThemeProvider` > `DatabaseProvider` nesting in root layout
- All components use `useTheme()` hook for colors — no static `colors` imports in components
- Styles use `useMemo(() => StyleSheet.create(...), [colors])` inside components
- Dark mode: manual light/dark or auto (6am–7pm = light, 60s poll)
- Notifications accept `NotificationOptions` object (enabled, times, jitter, suppressToday)
- Use `npx expo install` (not `npm install`) for packages that need native modules (e.g. AsyncStorage, datetimepicker)
- Tab icons use plain Unicode text glyphs — avoid emoji characters that render with color/3D texture

## Conventions
- Use `npm install --legacy-peer-deps` for dependency installs (peer dep conflicts with reanimated)
- Animations use React Native's built-in `Animated` API, not reanimated
- Log screen refreshes on focus via `useFocusEffect`
- Save action dismisses keyboard and shows animated confirmation
