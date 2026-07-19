# iOS Lock Screen Widget Implementation Plan

## Goal
Migrate the project from Expo Go to an Expo Custom Dev Client and implement a native iOS Lock Screen Widget (WidgetKit). We use `@bacons/apple-targets` (Evan Bacon's community plugin, latest **v5.0.0**) to generate the Widget Extension during prebuild — avoiding brittle Xcode `.pbxproj` edits. Android stays fully isolated (the plugin is iOS-only), and we push on-demand widget reloads from JS to prevent stale data.

> **Note on tooling:** `@bacons/apple-targets` is a community package, not first-party Expo. Before committing, skim its README/changelog for compatibility notes against **Expo 57 / React Native 0.86**. Verify SDK-specific details against the docs at https://docs.expo.dev/versions/v57.0.0/ before writing native code.

## Data model context
The app tracks vocabulary **words** (not single "letters") in [useLearningStore.ts](../../src/store/useLearningStore.ts): an `activeQueue` of `VocabularyWord` with `currentCardIndex`. The widget should surface the current word — decide whether to show just the character, or character + pinyin + translation (the `.accessoryRectangular` family has room for more than one glyph). Nothing currently writes shared widget state, so Phase 4 must wire the bridge into the store (e.g. from `nextCard` / `reviewCard`).

## Tasks

### Phase 1: Dev Client & Deployment Target Setup
- [ ] **Task 1:** Confirm `expo-dev-client` is installed (it already is). Set the iOS deployment target to `16.0` (required for Lock Screen widgets) via the **built-in** `ios.deploymentTarget` property in `app.json` (SDK 56+). Do **not** use `infoPlist.MinimumOSVersion` — that does not set the deployment target.
- [ ] **Task 2:** Run `npx expo prebuild --clean` to transition off Expo Go and generate native directories.
  - **Verify:** The `ios` and `android` directories exist and the generated Podfile / project shows `16.0` as the iOS deployment target.
  - **Note:** Prebuild bakes the app name (`temp-app`) into the native projects. Consider renaming the app first if `temp-app` is a placeholder.

### Phase 2: App Group & EAS Provisioning
- [ ] **Task 3:** Register the App Group (`group.com.julian.lieow.chineselockscreen`) on the App ID. With EAS-managed credentials this can often be auto-created during `eas credentials` / build, so manual Apple Developer Portal registration may be optional.
- [ ] **Task 4:** Add the App Group entitlement to the **main app** in `app.json` under `ios.entitlements`. (The widget target gets its own reference in Phase 3 — the entitlement must be declared in *both* the app and the target.)
- [ ] **Task 5:** Create a minimal `eas.json`. EAS auto-manages credentials for the main app **and** app-extension targets — there is no manual "multi-target signing" field to set. (`autoProvisioning` is **not** a real EAS option.) Run `eas build` / `eas credentials` to provision interactively.

### Phase 3: Widget Extension Setup (iOS Only)
- [ ] **Task 6:** Scaffold the widget target with `npx create-target` (from `@bacons/apple-targets`). This creates `targets/<name>/` and adds the plugin to `app.json`. Do not hand-write a `widgetTargetName` config — that key belongs to a package that does not exist.
- [ ] **Task 7:** In `targets/<name>/expo-target.config.js`, set `type: "widget"` and reference the main app's App Group so the plugin wires the entitlement into the target (see snippet below).
- [ ] **Task 8:** Write the SwiftUI widget in `targets/<name>/`. Include `.supportedFamilies([.accessoryRectangular, .accessoryCircular, .accessoryInline])` to restrict it to Lock Screen sizes. Read shared data from `UserDefaults(suiteName:)`.
  - **Reality check:** Lock Screen widgets are **not** live views — they render a static snapshot and only refresh when the timeline reloads. `@AppStorage` does **not** update the widget while it's on screen; the JS-driven `reloadAllTimelines()` call (Phase 4) is what triggers updates. Reading `UserDefaults` in the `Provider` and passing the value through the `Entry` is the more idiomatic pattern; `@AppStorage` also works as long as a reload follows.

### Phase 4: JS-to-Native Bridge & Forced Reloads
- [ ] **Task 9:** Create a custom local Expo Module to write shared state to the App Group from JS. Expose `setCurrentWord(hanzi, pinyin, english)` — it serializes the three fields into a **single JSON string** under one key so the widget can render character + pinyin + translation on `.accessoryRectangular`. (A single atomic write also means one reload, not three.)
- [ ] **Task 10:** In the module, after writing to `UserDefaults`, call `WidgetCenter.shared.reloadAllTimelines()` to force an on-demand update.
- [ ] **Task 11:** Wire the bridge into the learning store (e.g. call `WidgetBridge.setCurrentWord(word.hanzi, word.pinyin, word.english)` from `nextCard`/`reviewCard` in [useLearningStore.ts](../../src/store/useLearningStore.ts)) so the current word is pushed to the widget. Wrap all widget imports/invocations in `if (Platform.OS === 'ios')` so Android ignores them.

### Phase 5: Local & Physical Testing
- [ ] **Task 12 (Android Safety Test):** Run `npx expo run:android`. Verify zero widget-related crashes.
- [ ] **Task 13 (iOS Physical Test):** Open `ios/temp-app.xcworkspace` in Xcode (or `npx expo run:ios --device`). Select the connected **iPhone 16 Pro Max**, choose the Widget extension scheme, and run. Add the widget to the Lock Screen and verify it updates instantly when a new word is shown in the app.

---

## Required Code Snippets

### 1. `app.json` Setup (Deployment Target, App Group, Plugin)
```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.julian.lieow.chineselockscreen",
      "appleTeamId": "PN2YW82FV8",
      "deploymentTarget": "16.0",
      "entitlements": {
        "com.apple.security.application-groups": [
          "group.com.julian.lieow.chineselockscreen"
        ]
      }
    },
    "plugins": ["@bacons/apple-targets"]
  }
}
```

### 2. `eas.json` Setup (Minimal — EAS auto-manages credentials)
```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  }
}
```
*(EAS provisions the main app and any extension targets automatically. Run `eas build` / `eas credentials` to set up signing interactively — there is no `autoProvisioning` field.)*

### 3. Widget Target Config — `targets/<name>/expo-target.config.js`
```javascript
module.exports = (config) => ({
  type: "widget",
  entitlements: {
    "com.apple.security.application-groups":
      config.ios.entitlements["com.apple.security.application-groups"],
  },
});
```
*(This references the main app's App Group so `@bacons/apple-targets` links the entitlement into the widget target. Both the app and the target must declare it.)*

### 4. Native Module (Swift) for JS-to-Native Bridge & Forced Reload
Create a custom Expo Module (e.g. `modules/widget-bridge/ios/WidgetBridgeModule.swift`). It serializes the word into a single JSON string under one key (`currentWord`) so the widget can decode all three fields:
```swift
import ExpoModulesCore
import WidgetKit

private let appGroup = "group.com.julian.lieow.chineselockscreen"
private let wordKey = "currentWord"

public class WidgetBridgeModule: Module {
  public func definition() -> ModuleDefinition {
    Name("WidgetBridge")

    // Push the current word (character + pinyin + English) to the widget.
    Function("setCurrentWord") { (hanzi: String, pinyin: String, english: String) in
      guard let userDefaults = UserDefaults(suiteName: appGroup) else { return }

      let payload: [String: String] = [
        "hanzi": hanzi,
        "pinyin": pinyin,
        "english": english,
      ]

      if let data = try? JSONSerialization.data(withJSONObject: payload),
         let json = String(data: data, encoding: .utf8) {
        userDefaults.set(json, forKey: wordKey)

        // Force the widget to reload immediately on-demand
        if #available(iOS 14.0, *) {
          WidgetCenter.shared.reloadAllTimelines()
        }
      }
    }
  }
}
```

TypeScript surface for the module (e.g. `modules/widget-bridge/index.ts`):
```typescript
import { requireNativeModule } from 'expo-modules-core';

interface WidgetBridgeModule {
  setCurrentWord(hanzi: string, pinyin: string, english: string): void;
}

export default requireNativeModule<WidgetBridgeModule>('WidgetBridge');
```

### 5. SwiftUI Widget Code (Lock Screen Constraints & Shared State)
In `targets/<name>/index.swift` (or `<Name>.swift`):
```swift
import WidgetKit
import SwiftUI

private let appGroup = "group.com.julian.lieow.chineselockscreen"
private let wordKey = "currentWord"

// Native counterpart to the JSON pushed from JS.
struct Word: Decodable {
    let hanzi: String
    let pinyin: String
    let english: String

    static let placeholder = Word(hanzi: "汉", pinyin: "hàn", english: "Chinese")
}

struct Provider: TimelineProvider {
    // Decode the JSON string written from JS; fall back to a placeholder.
    private func currentWord() -> Word {
        guard
            let json = UserDefaults(suiteName: appGroup)?.string(forKey: wordKey),
            let data = json.data(using: .utf8),
            let word = try? JSONDecoder().decode(Word.self, from: data)
        else { return .placeholder }
        return word
    }

    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date(), word: .placeholder)
    }

    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> ()) {
        completion(SimpleEntry(date: Date(), word: currentWord()))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<SimpleEntry>) -> ()) {
        // JS-driven reloads are primary; keep a 15-min fallback refresh.
        let entry = SimpleEntry(date: Date(), word: currentWord())
        let nextUpdate = Calendar.current.date(byAdding: .minute, value: 15, to: Date())!
        completion(Timeline(entries: [entry], policy: .after(nextUpdate)))
    }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let word: Word
}

struct LockScreenWidgetEntryView: View {
    @Environment(\.widgetFamily) var family
    var entry: Provider.Entry

    var body: some View {
        switch family {
        case .accessoryInline:
            // Single line only — combine character and pinyin.
            Text("\(entry.word.hanzi) · \(entry.word.pinyin)")
        case .accessoryCircular:
            // Very small — the character alone reads best.
            Text(entry.word.hanzi)
                .font(.title)
                .bold()
        default: // .accessoryRectangular — room for all three
            VStack(alignment: .leading, spacing: 2) {
                Text(entry.word.hanzi)
                    .font(.headline)
                    .bold()
                Text(entry.word.pinyin)
                    .font(.caption)
                Text(entry.word.english)
                    .font(.caption2)
                    .foregroundStyle(.secondary)
                    .lineLimit(1)
            }
        }
    }
}

@main
struct LockScreenWidget: Widget {
    let kind: String = "LockScreenWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            LockScreenWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Chinese Word")
        .description("Learn a new word.")
        // Restrict to Lock Screen accessory families (iOS 16+)
        .supportedFamilies([.accessoryRectangular, .accessoryCircular, .accessoryInline])
    }
}
```
*(Note: the module writes a JSON string under the `currentWord` key; the widget decodes it into the `Word` struct. Keep the key, the App Group, and the field names — `hanzi`/`pinyin`/`english` — consistent between the Swift module, the widget, and the JS call site.)*

## Done When
- [ ] Custom Dev client builds successfully for both iOS and Android.
- [ ] Android works with zero widget-related crashes.
- [ ] iOS Lock Screen Widget runs on a physical iPhone 16 Pro Max.
- [ ] Advancing to a new word in React Native immediately updates the physical Lock Screen widget via `WidgetCenter.shared.reloadAllTimelines()`.
