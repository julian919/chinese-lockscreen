import { Platform } from 'react-native';
import type { VocabularyWord } from '../data/hskVocabulary';

type Bridge = {
  setCurrentWord(hanzi: string, pinyin: string, english: string): void;
};

// The WidgetBridge native module is iOS-only. Requiring it on Android/web (or in
// Expo Go, where it isn't linked) would throw, so guard the import.
let bridge: Bridge | null = null;
if (Platform.OS === 'ios') {
  try {
    bridge = require('../../modules/widget-bridge').default as Bridge;
  } catch {
    bridge = null;
  }
}

/** Push the current vocabulary word to the iOS Lock Screen widget. No-op elsewhere. */
export function pushWordToWidget(word: VocabularyWord | undefined): void {
  if (!bridge || !word) return;
  try {
    bridge.setCurrentWord(word.hanzi, word.pinyin, word.english);
  } catch {
    // Native module unavailable at runtime — safe to ignore.
  }
}
