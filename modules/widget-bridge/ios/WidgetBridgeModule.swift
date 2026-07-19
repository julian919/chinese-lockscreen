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

        // Force the widget to reload immediately on-demand.
        if #available(iOS 14.0, *) {
          WidgetCenter.shared.reloadAllTimelines()
        }
      }
    }
  }
}
