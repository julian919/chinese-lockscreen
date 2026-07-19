import WidgetKit
import SwiftUI

private let appGroup = "group.com.julian.lieow.chineselockscreen"
private let wordKey = "currentWord"

// Native counterpart to the JSON pushed from JS via the WidgetBridge module.
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
        // JS-driven reloads are primary; keep a 60-min fallback refresh.
        let entry = SimpleEntry(date: Date(), word: currentWord())
        let nextUpdate = Calendar.current.date(byAdding: .minute, value: 60, to: Date())!
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
        content
            .containerBackground(for: .widget) { Color.clear }
    }

    @ViewBuilder
    private var content: some View {
        switch family {
        case .accessoryInline:
            // Single line only — combine character and pinyin.
            Text("\(entry.word.hanzi) · \(entry.word.pinyin)")
        case .accessoryCircular:
            // Very small — the character alone reads best.
            Text(entry.word.hanzi)
                .font(.title)
                .bold()
                .minimumScaleFactor(0.5)
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
            .frame(maxWidth: .infinity, alignment: .leading)
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
