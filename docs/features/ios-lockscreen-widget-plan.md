# iOS Lock Screen Widget Implementation Plan

## Goal
Migrate the project from Expo Go to an Expo Custom Dev Client and implement a native iOS Lock Screen Widget (WidgetKit). We will use modern Expo tools (e.g., `@bacon/expo-widgets` / `expo-apple-targets`) to avoid brittle Xcode `.pbxproj` modifications, ensure Android remains safely isolated, and implement on-demand widget reloading to prevent stale data.

## Tasks

### Phase 1: Dev Client & Deployment Target Setup
- [ ] **Task 1:** Install `expo-dev-client`. Update `app.json` to bump the minimum iOS deployment target to `16.0` (required for Lock Screen widgets).
- [ ] **Task 2:** Run `npx expo prebuild --clean` to transition from Expo Go to a custom dev client and generate native directories.
  - **Verify:** The `ios` and `android` directories exist and the Podfile shows `16.0` as the target.

### Phase 2: App Group & EAS Provisioning
- [ ] **Task 3:** Register the App Group (`group.com.julian.lieow.chineselockscreen`) in the Apple Developer Portal and assign it to the App ID.
- [ ] **Task 4:** Create a `plugins/withAppGroup.ts` Config Plugin (or use an existing community plugin) to add the App Group entitlements to `app.json`.
- [ ] **Task 5:** Update `eas.json` to configure multi-target signing for EAS Build, ensuring both the main app and widget extension are properly code-signed.

### Phase 3: Widget Extension Setup (iOS Only)
- [ ] **Task 6:** Install `@bacon/expo-widgets` (or `expo-apple-targets`). Configure it in `app.json` to safely generate the Widget Extension target during prebuild without manually mangling the Xcode project.
- [ ] **Task 7:** Write native Swift code in the appropriate targets folder (e.g., `targets/widgets/`). Include `.supportedFamilies([.accessoryRectangular, .accessoryCircular, .accessoryInline])` to restrict it to Lock Screen sizes.
- [ ] **Task 8:** In the SwiftUI Widget view, use `@AppStorage` bound to the App Group to ensure reactive UI updates when the data changes.

### Phase 4: JS-to-Native Bridge & Forced Reloads
- [ ] **Task 9:** Create a custom local Expo Module (or Native Module) to write shared state to the App Group from JS.
- [ ] **Task 10:** Within this Native Module, after updating `UserDefaults`, immediately call `WidgetCenter.shared.reloadAllTimelines()` to force the widget to update on-demand.
- [ ] **Task 11:** Wrap all JS widget imports and module invocations inside `if (Platform.OS === 'ios')` blocks to ensure Android safely ignores them.

### Phase 5: Local & Physical Testing
- [ ] **Task 12 (Android Safety Test):** Run `npx expo run:android` to deploy to the Android Emulator. Verify zero widget-related crashes.
- [ ] **Task 13 (iOS Physical Test):** Open `ios/temp-app.xcworkspace` in Xcode. Select the connected **iPhone 16 Pro Max**, choose the Widget extension scheme, and run. Verify the lock screen widget updates instantly when triggered from the main app.

---

## Required Code Snippets

### 1. `app.json` Setup (Deployment Target & Expo Widgets)
```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.julian.lieow.chineselockscreen",
      "infoPlist": {
        "MinimumOSVersion": "16.0"
      },
      "entitlements": {
        "com.apple.security.application-groups": [
          "group.com.julian.lieow.chineselockscreen"
        ]
      }
    },
    "plugins": [
      [
        "@bacon/expo-widgets",
        {
          "widgetTargetName": "LockScreenWidget"
        }
      ]
    ]
  }
}
```

### 2. `eas.json` Setup (Multi-Target Provisioning)
```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "buildConfiguration": "Debug",
        "autoProvisioning": "allow"
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "autoProvisioning": "allow"
      }
    },
    "production": {
      "ios": {
        "autoProvisioning": "allow"
      }
    }
  }
}
```
*(Note: `autoProvisioning: "allow"` tells EAS to manage profiles for both the main app and any extensions.)*

### 3. Native Module (Swift) for JS-to-Native Bridge & Forced Reload
Create a custom Expo Module (e.g., `modules/widget-bridge/ios/WidgetBridgeModule.swift`):
```swift
import ExpoModulesCore
import WidgetKit

public class WidgetBridgeModule: Module {
  public func definition() -> ModuleDefinition {
    Name("WidgetBridge")

    Function("setSharedString") { (key: String, value: String) in
      if let userDefaults = UserDefaults(suiteName: "group.com.julian.lieow.chineselockscreen") {
        userDefaults.set(value, forKey: key)
        
        // Force the widget to reload immediately on-demand
        if #available(iOS 14.0, *) {
          WidgetCenter.shared.reloadAllTimelines()
        }
      }
    }
  }
}
```

### 4. SwiftUI Widget Code (Lock Screen Constraints & Reactive State)
In your `targets/widgets/LockScreenWidget.swift`:
```swift
import WidgetKit
import SwiftUI

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date())
    }

    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> ()) {
        let entry = SimpleEntry(date: Date())
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
        // Relying mostly on JS-driven reloads, but keeping a fallback timeline
        let entry = SimpleEntry(date: Date())
        // Refresh 15 mins later as a fallback
        let nextUpdateDate = Calendar.current.date(byAdding: .minute, value: 15, to: Date())!
        let timeline = Timeline(entries: [entry], policy: .after(nextUpdateDate))
        completion(timeline)
    }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
}

struct LockScreenWidgetEntryView : View {
    var entry: Provider.Entry
    
    // Reactive state reading from the App Group
    @AppStorage("currentLetter", store: UserDefaults(suiteName: "group.com.julian.lieow.chineselockscreen"))
    var currentLetter: String = "汉"

    var body: some View {
        VStack {
            Text(currentLetter)
                .font(.largeTitle)
                .bold()
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
        .configurationDisplayName("Chinese Letter")
        .description("Learn a new letter.")
        // EXPLICITLY restrict to Lock Screen accessory families
        .supportedFamilies([.accessoryRectangular, .accessoryCircular, .accessoryInline])
    }
}
```

## Done When
- [ ] Custom Dev client builds successfully for both iOS and Android.
- [ ] Android works flawlessly with zero crashes.
- [ ] iOS Lock Screen Widget runs on a physical iPhone 16 Pro Max.
- [ ] Writing a new letter from React Native immediately updates the physical lock screen widget via `WidgetCenter.shared.reloadAllTimelines()`.
