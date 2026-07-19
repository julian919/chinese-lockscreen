import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HSK_VOCABULARY, VocabularyWord, getWordsByLevel } from '../data/hskVocabulary';
import { pushWordToWidget } from '../lib/widget';

export interface CardProgress {
  wordId: string;
  box: number; // 1 to 5 (Leitner boxes)
  nextReviewDate: string; // ISO string
  timesReviewed: number;
  timesCorrect: number;
}

interface LearningState {
  // Progress & Streaks
  cardProgress: Record<string, CardProgress>;
  currentStreak: number;
  lastStudyDate: string | null;
  masteredWords: string[]; // IDs of words in Box 4 or 5

  // Active Session
  selectedLevel: 1 | 2 | 3 | 'ALL';
  activeQueue: VocabularyWord[];
  currentCardIndex: number;
  sessionStats: {
    reviewed: number;
    correct: number;
    xpEarned: number;
  };

  // Actions
  setSelectedLevel: (level: 1 | 2 | 3 | 'ALL') => void;
  startStudySession: (level: 1 | 2 | 3 | 'ALL', count?: number) => void;
  reviewCard: (wordId: string, isEasy: boolean) => void;
  nextCard: () => void;
  recordDailyStudy: () => void;
  resetProgress: () => void;
}

// Leitner intervals in days for Boxes 1 through 5
const LEITNER_INTERVALS: Record<number, number> = {
  1: 1,   // Review next day
  2: 3,   // Review in 3 days
  3: 7,   // Review in 1 week
  4: 14,  // Review in 2 weeks
  5: 30,  // Review in 1 month (Mastered)
};

export const useLearningStore = create<LearningState>()(
  persist(
    (set, get) => ({
      cardProgress: {},
      currentStreak: 0,
      lastStudyDate: null,
      masteredWords: [],
      selectedLevel: 1,
      activeQueue: [],
      currentCardIndex: 0,
      sessionStats: { reviewed: 0, correct: 0, xpEarned: 0 },

      setSelectedLevel: (level) => set({ selectedLevel: level }),

      startStudySession: (level, count = 12) => {
        const words = getWordsByLevel(level);
        const now = new Date().toISOString().split('T')[0];
        const progress = get().cardProgress;

        // Sort words by due date first, then unstudied words
        const sorted = [...words].sort((a, b) => {
          const progA = progress[a.id];
          const progB = progress[b.id];

          if (!progA && !progB) return Math.random() - 0.5;
          if (!progA) return -1; // Prioritize new words if no due date
          if (!progB) return 1;

          const dueA = progA.nextReviewDate <= now ? 0 : 1;
          const dueB = progB.nextReviewDate <= now ? 0 : 1;
          if (dueA !== dueB) return dueA - dueB;

          return progA.box - progB.box;
        });

        const activeQueue = sorted.slice(0, count);

        set({
          selectedLevel: level,
          activeQueue,
          currentCardIndex: 0,
          sessionStats: { reviewed: 0, correct: 0, xpEarned: 0 },
        });

        // Surface the first word on the iOS Lock Screen widget (no-op elsewhere).
        pushWordToWidget(activeQueue[0]);
      },

      reviewCard: (wordId, isEasy) => {
        const state = get();
        const existing = state.cardProgress[wordId] || {
          wordId,
          box: 1,
          nextReviewDate: new Date().toISOString().split('T')[0],
          timesReviewed: 0,
          timesCorrect: 0,
        };

        const newBox = isEasy ? Math.min(5, existing.box + 1) : 1;
        const daysToAdd = LEITNER_INTERVALS[newBox] || 1;
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + daysToAdd);
        const nextReviewDateString = nextDate.toISOString().split('T')[0];

        const updatedProgress: CardProgress = {
          wordId,
          box: newBox,
          nextReviewDate: nextReviewDateString,
          timesReviewed: existing.timesReviewed + 1,
          timesCorrect: existing.timesCorrect + (isEasy ? 1 : 0),
        };

        const newCardProgress = {
          ...state.cardProgress,
          [wordId]: updatedProgress,
        };

        // Update mastered list (Box >= 4 considered mastered)
        const mastered = Object.values(newCardProgress)
          .filter((p) => p.box >= 4)
          .map((p) => p.wordId);

        // Update session stats
        const reviewed = state.sessionStats.reviewed + 1;
        const correct = state.sessionStats.correct + (isEasy ? 1 : 0);
        const xpEarned = state.sessionStats.xpEarned + (isEasy ? 15 : 5);

        set({
          cardProgress: newCardProgress,
          masteredWords: mastered,
          sessionStats: { reviewed, correct, xpEarned },
        });

        get().recordDailyStudy();
      },

      nextCard: () => {
        const { currentCardIndex, activeQueue } = get();
        if (currentCardIndex < activeQueue.length) {
          const newIndex = currentCardIndex + 1;
          set({ currentCardIndex: newIndex });
          // Keep the Lock Screen widget in sync with the visible card.
          pushWordToWidget(activeQueue[newIndex]);
        }
      },

      recordDailyStudy: () => {
        const today = new Date().toISOString().split('T')[0];
        const { lastStudyDate, currentStreak } = get();

        if (lastStudyDate === today) return; // Already recorded today

        if (!lastStudyDate) {
          set({ currentStreak: 1, lastStudyDate: today });
          return;
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toISOString().split('T')[0];

        if (lastStudyDate === yesterdayString) {
          set({ currentStreak: currentStreak + 1, lastStudyDate: today });
        } else {
          // Streak broken, start fresh at 1
          set({ currentStreak: 1, lastStudyDate: today });
        }
      },

      resetProgress: () => {
        set({
          cardProgress: {},
          currentStreak: 0,
          lastStudyDate: null,
          masteredWords: [],
        });
      },
    }),
    {
      name: 'mandarin-learning-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
