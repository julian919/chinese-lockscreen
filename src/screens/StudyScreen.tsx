import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
} from 'react-native';
import { ArrowLeft, Trophy, Sparkles, Check, X, RotateCcw } from 'lucide-react-native';
import { useLearningStore } from '../store/useLearningStore';
import { useMandarinAudio } from '../hooks/useMandarinAudio';
import { Flashcard } from '../components/Flashcard';
import { COLORS, SIZES, FONTS } from '../theme/colors';

interface StudyScreenProps {
  onExit: () => void;
}

export const StudyScreen: React.FC<StudyScreenProps> = ({ onExit }) => {
  const {
    activeQueue,
    currentCardIndex,
    selectedLevel,
    reviewCard,
    nextCard,
    startStudySession,
    sessionStats,
  } = useLearningStore();

  const { speakMandarin, triggerSuccessHaptic, triggerMediumHaptic } = useMandarinAudio();

  const currentWord = activeQueue[currentCardIndex];
  const isSessionComplete = activeQueue.length > 0 && currentCardIndex >= activeQueue.length;

  useEffect(() => {
    // If no active session queued, initialize one automatically
    if (activeQueue.length === 0) {
      startStudySession(selectedLevel, 10);
    }
  }, [selectedLevel]);

  // Trigger celebration haptics when session completes
  useEffect(() => {
    if (isSessionComplete) {
      triggerSuccessHaptic();
    }
  }, [isSessionComplete]);

  const handleCardSwipe = (isEasy: boolean) => {
    if (!currentWord) return;
    triggerMediumHaptic();
    reviewCard(currentWord.id, isEasy);
    nextCard();
  };

  // If loading or empty
  if (activeQueue.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <Text style={FONTS.title}>Preparing your SRS deck...</Text>
          <Pressable style={styles.exitBtnTop} onPress={onExit}>
            <ArrowLeft color={COLORS.text} size={24} />
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // Session Complete Screen
  if (isSessionComplete) {
    const accuracy =
      sessionStats.reviewed > 0
        ? Math.round((sessionStats.correct / sessionStats.reviewed) * 100)
        : 100;

    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.completeContainer}>
          <View style={styles.trophyCircle}>
            <Trophy color={COLORS.primary} size={56} />
          </View>
          <Text style={styles.completeTitle}>Session Complete!</Text>
          <Text style={styles.completeSubtitle}>
            Great job! You reviewed your scheduled HSK vocabulary today.
          </Text>

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{sessionStats.reviewed}</Text>
              <Text style={styles.statLbl}>Cards Reviewed</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statNum, { color: COLORS.success }]}>{accuracy}%</Text>
              <Text style={styles.statLbl}>Easy / Mastered</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statNum, { color: '#38BDF8' }]}>+{sessionStats.xpEarned}</Text>
              <Text style={styles.statLbl}>XP Earned</Text>
            </View>
          </View>

          <View style={styles.completeActionRow}>
            <Pressable style={styles.finishBtn} onPress={onExit}>
              <Text style={styles.finishBtnText}>Return to Dashboard</Text>
            </Pressable>

            <Pressable
              style={styles.moreBtn}
              onPress={() => startStudySession(selectedLevel, 10)}
            >
              <RotateCcw color={COLORS.text} size={20} />
              <Text style={styles.moreBtnText}>Study Another Deck</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const progressPercent = ((currentCardIndex + 1) / activeQueue.length) * 100;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Navigation Bar */}
        <View style={styles.topBar}>
          <Pressable style={styles.backBtn} onPress={onExit} hitSlop={16}>
            <ArrowLeft color={COLORS.text} size={24} />
          </Pressable>

          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {currentCardIndex + 1} / {activeQueue.length}
            </Text>
          </View>

          <View style={styles.xpBadge}>
            <Sparkles color={COLORS.primary} size={14} />
            <Text style={styles.xpText}>+{sessionStats.xpEarned} XP</Text>
          </View>
        </View>

        {/* Flashcard Area */}
        <View style={styles.cardArea}>
          <Flashcard
            word={currentWord}
            onSwipe={handleCardSwipe}
            onSpeak={(text) => speakMandarin(text)}
          />
        </View>

        {/* Bottom Helper / Action Buttons */}
        <View style={styles.bottomControls}>
          <Pressable
            style={[styles.swipeBtn, styles.hardBtn]}
            onPress={() => handleCardSwipe(false)}
            hitSlop={12}
          >
            <X color={COLORS.warning} size={24} />
            <Text style={[styles.swipeBtnText, { color: COLORS.warning }]}>
              Hard (Review Soon)
            </Text>
          </Pressable>

          <Pressable
            style={[styles.swipeBtn, styles.easyBtn]}
            onPress={() => handleCardSwipe(true)}
            hitSlop={12}
          >
            <Check color={COLORS.success} size={24} />
            <Text style={[styles.swipeBtnText, { color: COLORS.success }]}>
              Easy (Got it!)
            </Text>
          </Pressable>
        </View>

        <Text style={styles.hintText}>
          Tip: Swipe right for Easy, swipe left for Hard, or use the buttons below.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    padding: SIZES.lg,
    justifyContent: 'space-between',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exitBtnTop: {
    position: 'absolute',
    top: SIZES.lg,
    left: SIZES.lg,
    padding: SIZES.sm,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SIZES.md,
  },
  backBtn: {
    width: SIZES.minTouchTarget,
    height: SIZES.minTouchTarget,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  progressContainer: {
    flex: 1,
    marginHorizontal: SIZES.md,
    alignItems: 'center',
  },
  progressTrack: {
    width: '100%',
    height: 8,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: SIZES.radiusPill,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radiusPill,
  },
  progressText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: SIZES.radiusPill,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  xpText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
  },
  cardArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SIZES.md,
    marginTop: SIZES.md,
  },
  swipeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.md,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1.5,
    minHeight: SIZES.minTouchTarget,
    backgroundColor: COLORS.surface,
  },
  hardBtn: {
    borderColor: 'rgba(244, 63, 94, 0.4)',
    backgroundColor: 'rgba(244, 63, 94, 0.08)',
  },
  easyBtn: {
    borderColor: 'rgba(16, 185, 129, 0.4)',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
  },
  swipeBtnText: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 6,
  },
  hintText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    marginTop: SIZES.sm,
  },

  // Completion Screen Styles
  completeContainer: {
    flex: 1,
    padding: SIZES.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trophyCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(245, 158, 11, 0.4)',
    marginBottom: SIZES.lg,
  },
  completeTitle: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: SIZES.sm,
  },
  completeSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: '85%',
    marginBottom: SIZES.xl,
  },
  statsGrid: {
    flexDirection: 'row',
    width: '100%',
    gap: SIZES.sm,
    marginBottom: SIZES.xxl,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMd,
    paddingVertical: SIZES.lg,
    paddingHorizontal: SIZES.xs,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.surfaceLight,
  },
  statNum: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLbl: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  completeActionRow: {
    width: '100%',
    gap: SIZES.md,
  },
  finishBtn: {
    width: '100%',
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.md,
    borderRadius: SIZES.radiusMd,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: SIZES.minTouchTarget,
  },
  finishBtnText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: '700',
  },
  moreBtn: {
    width: '100%',
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.md,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    borderColor: COLORS.surfaceLight,
    minHeight: SIZES.minTouchTarget,
  },
  moreBtnText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
});
