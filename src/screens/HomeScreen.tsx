import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Flame, CheckCircle2, Zap, BookOpen, Brain, Sparkles, RefreshCw } from 'lucide-react-native';
import { useLearningStore } from '../store/useLearningStore';
import { COLORS, SIZES, FONTS } from '../theme/colors';

interface HomeScreenProps {
  onStartStudy: (level: 1 | 2 | 3 | 'ALL') => void;
  onStartQuiz: (level: 1 | 2 | 3 | 'ALL') => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onStartStudy, onStartQuiz }) => {
  const {
    currentStreak,
    masteredWords,
    sessionStats,
    selectedLevel,
    setSelectedLevel,
    cardProgress,
    resetProgress,
  } = useLearningStore();

  const totalWordsCount = 30; // 30 curated words across HSK 1-3 in sample dataset
  const totalMastered = masteredWords.length;

  const getDeckStats = (level: 1 | 2 | 3 | 'ALL') => {
    const allProgress = Object.values(cardProgress);
    if (level === 'ALL') {
      const reviewedCount = allProgress.length;
      return `${reviewedCount} active cards`;
    }
    const levelCount = allProgress.filter(
      (p) => p.wordId.startsWith(`hsk${level}-`)
    ).length;
    return `${levelCount} active / 10 words`;
  };

  const decks: { level: 1 | 2 | 3 | 'ALL'; title: string; subtitle: string; color: string }[] = [
    {
      level: 1,
      title: 'HSK 1: Beginner Core',
      subtitle: 'Essential greetings, numbers, and basic survival words',
      color: COLORS.primary,
    },
    {
      level: 2,
      title: 'HSK 2: Elementary',
      subtitle: 'Daily routines, travel, directions, and emotions',
      color: '#38BDF8',
    },
    {
      level: 3,
      title: 'HSK 3: Intermediate',
      subtitle: 'Work concepts, communication, and deeper expressions',
      color: COLORS.success,
    },
    {
      level: 'ALL',
      title: 'All Vocabulary Mix',
      subtitle: 'Comprehensive review across all HSK 1, 2, and 3 decks',
      color: COLORS.secondary,
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>欢迎来学习</Text>
            <Text style={styles.title}>Mandarin Mastery</Text>
          </View>
          <View style={styles.proBadge}>
            <Sparkles color={COLORS.primary} size={16} />
            <Text style={styles.proText}>SRS Active</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Flame color={COLORS.primary} size={28} />
            <Text style={styles.statNumber}>{currentStreak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>

          <View style={styles.statCard}>
            <CheckCircle2 color={COLORS.success} size={28} />
            <Text style={styles.statNumber}>{totalMastered}</Text>
            <Text style={styles.statLabel}>Mastered</Text>
          </View>

          <View style={styles.statCard}>
            <Zap color="#38BDF8" size={28} />
            <Text style={styles.statNumber}>{sessionStats.xpEarned}</Text>
            <Text style={styles.statLabel}>Total XP</Text>
          </View>
        </View>

        {/* Primary Action Buttons */}
        <View style={styles.quickActionRow}>
          <Pressable
            style={styles.primaryCta}
            onPress={() => onStartStudy(selectedLevel)}
          >
            <BookOpen color={COLORS.background} size={22} />
            <Text style={styles.primaryCtaText}>Start SRS Study</Text>
          </Pressable>

          <Pressable
            style={styles.secondaryCta}
            onPress={() => onStartQuiz(selectedLevel)}
          >
            <Brain color={COLORS.text} size={22} />
            <Text style={styles.secondaryCtaText}>Quick Quiz</Text>
          </Pressable>
        </View>

        {/* Deck Selection Section */}
        <Text style={styles.sectionTitle}>Select Curriculum Deck</Text>
        <View style={styles.deckList}>
          {decks.map((deck) => {
            const isSelected = selectedLevel === deck.level;
            return (
              <Pressable
                key={deck.level}
                style={[
                  styles.deckCard,
                  isSelected && {
                    borderColor: deck.color,
                    backgroundColor: 'rgba(30, 41, 59, 0.95)',
                  },
                ]}
                onPress={() => setSelectedLevel(deck.level)}
              >
                <View style={[styles.colorStrip, { backgroundColor: deck.color }]} />
                <View style={styles.deckContent}>
                  <View style={styles.deckTop}>
                    <Text style={[styles.deckTitle, isSelected && { color: deck.color }]}>
                      {deck.title}
                    </Text>
                    {isSelected && (
                      <View style={[styles.selectedBadge, { borderColor: deck.color }]}>
                        <Text style={[styles.selectedBadgeText, { color: deck.color }]}>
                          Selected
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.deckSubtitle}>{deck.subtitle}</Text>
                  <Text style={styles.deckMeta}>{getDeckStats(deck.level)}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Reset Progress Button (Helpful for testing) */}
        <Pressable
          style={styles.resetButton}
          onPress={() => {
            resetProgress();
          }}
        >
          <RefreshCw color={COLORS.textSecondary} size={16} />
          <Text style={styles.resetText}>Reset All SRS Progress</Text>
        </Pressable>
      </ScrollView>
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
  },
  content: {
    padding: SIZES.lg,
    paddingBottom: SIZES.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.lg,
  },
  greeting: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: '800',
    marginTop: 2,
  },
  proBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.radiusPill,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  proText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 6,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMd,
    padding: SIZES.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.surfaceLight,
    marginHorizontal: 4,
  },
  statNumber: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '800',
    marginTop: SIZES.xs,
  },
  statLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  quickActionRow: {
    flexDirection: 'row',
    marginBottom: SIZES.xl,
    gap: SIZES.md,
  },
  primaryCta: {
    flex: 3,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.md,
    borderRadius: SIZES.radiusMd,
    minHeight: SIZES.minTouchTarget,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryCtaText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: '700',
    marginLeft: SIZES.sm,
  },
  secondaryCta: {
    flex: 2,
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.md,
    borderRadius: SIZES.radiusMd,
    minHeight: SIZES.minTouchTarget,
    borderWidth: 1,
    borderColor: COLORS.surfaceLight,
  },
  secondaryCtaText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '600',
    marginLeft: SIZES.xs,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: SIZES.md,
  },
  deckList: {
    gap: SIZES.md,
  },
  deckCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
    minHeight: 80,
  },
  colorStrip: {
    width: 6,
    height: '100%',
  },
  deckContent: {
    flex: 1,
    padding: SIZES.md,
  },
  deckTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  deckTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
  },
  selectedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: SIZES.radiusSm,
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  selectedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  deckSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  deckMeta: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SIZES.xl,
    padding: SIZES.md,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  resetText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginLeft: SIZES.sm,
  },
});
