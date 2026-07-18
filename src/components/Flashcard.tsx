import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolateColor,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { Volume2, RotateCcw, Check, X } from 'lucide-react-native';
import { VocabularyWord } from '../data/hskVocabulary';
import { COLORS, SIZES, FONTS } from '../theme/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = Math.min(SCREEN_WIDTH - SIZES.lg * 2, 380);
const SWIPE_THRESHOLD = CARD_WIDTH * 0.32;

interface FlashcardProps {
  word: VocabularyWord;
  onSwipe: (isEasy: boolean) => void;
  onSpeak: (text: string) => void;
  onFlip?: (isFlipped: boolean) => void;
}

export const Flashcard: React.FC<FlashcardProps> = ({
  word,
  onSwipe,
  onSpeak,
  onFlip,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotateY = useSharedValue(0);

  // Reset state when new word is passed
  useEffect(() => {
    setIsFlipped(false);
    translateX.value = 0;
    translateY.value = 0;
    rotateY.value = 0;
  }, [word.id]);

  const handleFlip = () => {
    const nextFlipped = !isFlipped;
    setIsFlipped(nextFlipped);
    if (onFlip) onFlip(nextFlipped);
    rotateY.value = withTiming(nextFlipped ? 180 : 0, { duration: 320 });
  };

  const triggerSwipeCallback = (isEasy: boolean) => {
    onSwipe(isEasy);
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY * 0.3; // Slight vertical tilt
    })
    .onEnd((event) => {
      if (event.translationX > SWIPE_THRESHOLD) {
        // Swipe Right (Easy / Mastered)
        translateX.value = withTiming(SCREEN_WIDTH * 1.3, { duration: 250 }, () => {
          runOnJS(triggerSwipeCallback)(true);
        });
      } else if (event.translationX < -SWIPE_THRESHOLD) {
        // Swipe Left (Hard / Review Soon)
        translateX.value = withTiming(-SCREEN_WIDTH * 1.3, { duration: 250 }, () => {
          runOnJS(triggerSwipeCallback)(false);
        });
      } else {
        // Return to center
        translateX.value = withSpring(0, { damping: 15, stiffness: 150 });
        translateY.value = withSpring(0, { damping: 15, stiffness: 150 });
      }
    });

  const cardAnimatedStyle = useAnimatedStyle(() => {
    const rotateZ = `${(translateX.value / SCREEN_WIDTH) * 15}deg`;
    const borderColor = interpolateColor(
      translateX.value,
      [-SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD],
      [COLORS.warning, COLORS.surfaceLight, COLORS.success]
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotateZ },
      ],
      borderColor,
      borderWidth: Math.abs(translateX.value) > 20 ? 3 : 1,
    };
  });

  const frontAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateY: `${rotateY.value}deg` }],
      opacity: rotateY.value < 90 ? 1 : 0,
      zIndex: rotateY.value < 90 ? 2 : 1,
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateY: `${rotateY.value - 180}deg` }],
      opacity: rotateY.value >= 90 ? 1 : 0,
      zIndex: rotateY.value >= 90 ? 2 : 1,
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.cardContainer, cardAnimatedStyle]}>
        {/* Front Side: Hanzi Focus */}
        <Animated.View style={[styles.cardSide, frontAnimatedStyle]}>
          <View style={styles.topBar}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>HSK {word.hskLevel}</Text>
            </View>
            <View style={styles.badgeCategory}>
              <Text style={styles.badgeTextCategory}>{word.category}</Text>
            </View>
          </View>

          <View style={styles.hanziWrapper}>
            <Text style={FONTS.hanziLg}>{word.hanzi}</Text>
          </View>

          <View style={styles.bottomBar}>
            <Pressable
              style={styles.actionButton}
              onPress={() => onSpeak(word.hanzi)}
              hitSlop={12}
            >
              <Volume2 color={COLORS.primary} size={26} />
              <Text style={styles.actionButtonText}>Speak</Text>
            </Pressable>

            <Pressable
              style={[styles.actionButton, styles.flipButton]}
              onPress={handleFlip}
              hitSlop={12}
            >
              <RotateCcw color={COLORS.text} size={22} />
              <Text style={styles.actionButtonText}>Flip Card</Text>
            </Pressable>
          </View>
        </Animated.View>

        {/* Back Side: Pinyin, English, and Example */}
        <Animated.View style={[styles.cardSide, styles.cardBack, backAnimatedStyle]}>
          <View style={styles.topBar}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>HSK {word.hskLevel}</Text>
            </View>
            <Pressable
              style={styles.audioIconSmall}
              onPress={() => onSpeak(word.hanzi)}
              hitSlop={12}
            >
              <Volume2 color={COLORS.primary} size={24} />
            </Pressable>
          </View>

          <View style={styles.backContent}>
            <Text style={FONTS.hanziMd}>{word.hanzi}</Text>
            <Text style={[FONTS.pinyinLg, { marginTop: SIZES.xs }]}>{word.pinyin}</Text>
            
            <View style={styles.divider} />
            
            <Text style={[FONTS.title, { textAlign: 'center', color: COLORS.primary }]}>
              {word.english}
            </Text>

            {word.example && (
              <View style={styles.exampleBox}>
                <Text style={styles.exampleTitle}>Example Sentence</Text>
                <Text style={styles.exampleHanzi}>{word.example.hanzi}</Text>
                <Text style={styles.examplePinyin}>{word.example.pinyin}</Text>
                <Text style={styles.exampleEnglish}>{word.example.english}</Text>
                <Pressable
                  style={styles.speakExampleBtn}
                  onPress={() => onSpeak(word.example.hanzi)}
                >
                  <Volume2 color={COLORS.pinyin} size={16} />
                  <Text style={styles.speakExampleText}>Listen to example</Text>
                </Pressable>
              </View>
            )}
          </View>

          <Pressable style={styles.flipBackBtn} onPress={handleFlip}>
            <RotateCcw color={COLORS.textSecondary} size={18} />
            <Text style={styles.flipBackText}>Tap to view Hanzi front</Text>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: CARD_WIDTH,
    height: Math.min(Dimensions.get('window').height * 0.58, 480),
    borderRadius: SIZES.radiusLg,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.surfaceLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    position: 'relative',
  },
  cardSide: {
    ...StyleSheet.absoluteFill,
    padding: SIZES.lg,
    justifyContent: 'space-between',
    backfaceVisibility: 'hidden',
  },
  cardBack: {
    backgroundColor: '#1E293B',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: COLORS.primaryBg || 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
    borderRadius: SIZES.radiusPill,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  badgeText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  badgeCategory: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
    borderRadius: SIZES.radiusPill,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  badgeTextCategory: {
    color: COLORS.pinyin,
    fontSize: 13,
    fontWeight: '600',
  },
  hanziWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingTop: SIZES.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.sm,
    paddingHorizontal: SIZES.md,
    borderRadius: SIZES.radiusMd,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    minHeight: SIZES.minTouchTarget,
    justifyContent: 'center',
  },
  flipButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  actionButtonText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '600',
    marginLeft: SIZES.xs,
  },
  audioIconSmall: {
    padding: SIZES.sm,
    minHeight: SIZES.minTouchTarget,
    minWidth: SIZES.minTouchTarget,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SIZES.sm,
  },
  divider: {
    width: '60%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: SIZES.md,
  },
  exampleBox: {
    width: '100%',
    backgroundColor: 'rgba(11, 15, 25, 0.5)',
    borderRadius: SIZES.radiusMd,
    padding: SIZES.md,
    marginTop: SIZES.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  exampleTitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: SIZES.xs,
  },
  exampleHanzi: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  examplePinyin: {
    color: COLORS.pinyin,
    fontSize: 14,
    marginBottom: 4,
  },
  exampleEnglish: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontStyle: 'italic',
  },
  speakExampleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.sm,
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: SIZES.radiusSm,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
  },
  speakExampleText: {
    color: COLORS.pinyin,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  flipBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: SIZES.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    minHeight: 44,
  },
  flipBackText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginLeft: 6,
  },
});
