import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
} from 'react-native';
import { ArrowLeft, Volume2, Trophy, Brain, Sparkles, Check, X, RotateCcw } from 'lucide-react-native';
import { HSK_VOCABULARY, VocabularyWord, getWordsByLevel } from '../data/hskVocabulary';
import { useMandarinAudio } from '../hooks/useMandarinAudio';
import { useLearningStore } from '../store/useLearningStore';
import { COLORS, SIZES, FONTS } from '../theme/colors';

interface QuizScreenProps {
  level: 1 | 2 | 3 | 'ALL';
  onExit: () => void;
}

const QUIZ_LENGTH = 10;

export const QuizScreen: React.FC<QuizScreenProps> = ({ level, onExit }) => {
  const [questions, setQuestions] = useState<VocabularyWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<VocabularyWord[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);

  const { speakMandarin, triggerSuccessHaptic, triggerErrorHaptic } = useMandarinAudio();
  const { sessionStats } = useLearningStore();

  // Initialize quiz pool
  const generateQuiz = () => {
    const pool = getWordsByLevel(level);
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selectedQuestions = shuffled.slice(0, QUIZ_LENGTH);
    setQuestions(selectedQuestions);
    setCurrentIndex(0);
    setScore(0);
    setSelectedOptionId(null);
    setIsAnswered(false);
  };

  useEffect(() => {
    generateQuiz();
  }, [level]);

  // Generate 4 options for current question
  useEffect(() => {
    if (questions.length === 0 || currentIndex >= questions.length) return;

    const currentWord = questions[currentIndex];
    const pool = HSK_VOCABULARY.filter((w) => w.id !== currentWord.id);
    const shuffledDistractors = [...pool].sort(() => Math.random() - 0.5).slice(0, 3);
    const combined = [currentWord, ...shuffledDistractors].sort(() => Math.random() - 0.5);

    setOptions(combined);
    setSelectedOptionId(null);
    setIsAnswered(false);
  }, [currentIndex, questions]);

  const handleSelectOption = (option: VocabularyWord) => {
    if (isAnswered) return; // Prevent double taps
    const currentWord = questions[currentIndex];
    const isCorrect = option.id === currentWord.id;

    setSelectedOptionId(option.id);
    setIsAnswered(true);

    if (isCorrect) {
      setScore((prev) => prev + 1);
      triggerSuccessHaptic();
    } else {
      triggerErrorHaptic();
    }

    // Auto advance after short delay for feedback
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
    }, isCorrect ? 1100 : 1600);
  };

  const isQuizComplete = questions.length > 0 && currentIndex >= questions.length;

  // Loading state
  if (questions.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <Text style={FONTS.title}>Generating Quiz Questions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Quiz Completion Screen
  if (isQuizComplete) {
    const accuracy = Math.round((score / questions.length) * 100);
    const earnedXp = score * 12;

    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.completeContainer}>
          <View style={styles.trophyCircle}>
            <Trophy color={COLORS.primary} size={56} />
          </View>
          <Text style={styles.completeTitle}>Quiz Completed!</Text>
          <Text style={styles.completeSubtitle}>
            {accuracy >= 80
              ? 'Outstanding performance! Your Hanzi comprehension is sharp.'
              : 'Keep practicing! Consistent daily review will lock in these characters.'}
          </Text>

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>
                {score} / {questions.length}
              </Text>
              <Text style={styles.statLbl}>Final Score</Text>
            </View>
            <View style={styles.statBox}>
              <Text
                style={[
                  styles.statNum,
                  { color: accuracy >= 70 ? COLORS.success : COLORS.warning },
                ]}
              >
                {accuracy}%
              </Text>
              <Text style={styles.statLbl}>Accuracy</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statNum, { color: '#38BDF8' }]}>+{earnedXp}</Text>
              <Text style={styles.statLbl}>Bonus XP</Text>
            </View>
          </View>

          <View style={styles.completeActionRow}>
            <Pressable style={styles.finishBtn} onPress={onExit}>
              <Text style={styles.finishBtnText}>Return to Dashboard</Text>
            </Pressable>

            <Pressable style={styles.moreBtn} onPress={generateQuiz}>
              <RotateCcw color={COLORS.text} size={20} />
              <Text style={styles.moreBtnText}>Try Quiz Again</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const currentWord = questions[currentIndex];
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <Pressable style={styles.backBtn} onPress={onExit} hitSlop={16}>
            <ArrowLeft color={COLORS.text} size={24} />
          </Pressable>

          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
            </View>
            <Text style={styles.progressText}>
              Question {currentIndex + 1} of {questions.length}
            </Text>
          </View>

          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>Score: {score}</Text>
          </View>
        </View>

        {/* Question Area */}
        <View style={styles.questionCard}>
          <View style={styles.qTop}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>HSK {currentWord.hskLevel}</Text>
            </View>
            <Pressable
              style={styles.audioBtn}
              onPress={() => speakMandarin(currentWord.hanzi)}
              hitSlop={12}
            >
              <Volume2 color={COLORS.primary} size={26} />
              <Text style={styles.audioText}>Listen</Text>
            </Pressable>
          </View>

          <Text style={[FONTS.hanziLg, { marginVertical: SIZES.lg }]}>
            {currentWord.hanzi}
          </Text>

          <Text style={styles.promptText}>Select the correct Pinyin & English meaning:</Text>
        </View>

        {/* Options List */}
        <View style={styles.optionsContainer}>
          {options.map((option) => {
            const isSelected = selectedOptionId === option.id;
            const isCorrectOption = option.id === currentWord.id;

            let buttonStyle: any = styles.optionCard;
            let textStyle: any = styles.optionText;

            if (isAnswered) {
              if (isCorrectOption) {
                buttonStyle = [styles.optionCard, styles.optionCorrect];
                textStyle = [styles.optionText, { color: COLORS.success }];
              } else if (isSelected) {
                buttonStyle = [styles.optionCard, styles.optionWrong];
                textStyle = [styles.optionText, { color: COLORS.warning }];
              } else {
                buttonStyle = [styles.optionCard, { opacity: 0.4 }];
              }
            }

            return (
              <Pressable
                key={option.id}
                style={buttonStyle}
                onPress={() => handleSelectOption(option)}
                disabled={isAnswered}
              >
                <View style={styles.optionContent}>
                  <Text style={styles.optionPinyin}>{option.pinyin}</Text>
                  <Text style={textStyle}>{option.english}</Text>
                </View>

                {isAnswered && isCorrectOption && (
                  <Check color={COLORS.success} size={24} />
                )}
                {isAnswered && isSelected && !isCorrectOption && (
                  <X color={COLORS.warning} size={24} />
                )}
              </Pressable>
            );
          })}
        </View>
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
  scoreBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: SIZES.radiusPill,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  scoreText: {
    color: COLORS.pinyin,
    fontSize: 13,
    fontWeight: '700',
  },
  questionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.surfaceLight,
    marginBottom: SIZES.md,
  },
  qTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: SIZES.radiusPill,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  badgeText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  audioBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: SIZES.radiusMd,
    minHeight: 38,
  },
  audioText: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  promptText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  optionsContainer: {
    gap: SIZES.md,
    marginBottom: SIZES.md,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMd,
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    borderWidth: 1.5,
    borderColor: COLORS.surfaceLight,
    minHeight: SIZES.minTouchTarget + 12,
  },
  optionCorrect: {
    borderColor: COLORS.success,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
  },
  optionWrong: {
    borderColor: COLORS.warning,
    backgroundColor: 'rgba(244, 63, 94, 0.12)',
  },
  optionContent: {
    flex: 1,
  },
  optionPinyin: {
    color: COLORS.pinyin,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  optionText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
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
