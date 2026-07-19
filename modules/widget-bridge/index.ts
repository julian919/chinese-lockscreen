import { requireNativeModule } from 'expo';

export interface WidgetBridgeModule {
  /** Writes the current word to the shared App Group and reloads the widget. */
  setCurrentWord(hanzi: string, pinyin: string, english: string): void;
}

// iOS-only native module. Import guarded by callers (see src/lib/widget.ts).
export default requireNativeModule<WidgetBridgeModule>('WidgetBridge');
