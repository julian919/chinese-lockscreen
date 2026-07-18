import { useCallback, useState } from 'react';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export function useMandarinAudio() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speakMandarin = useCallback(async (text: string, rate = 0.82) => {
    try {
      if (Platform.OS !== 'web') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      const speaking = await Speech.isSpeakingAsync();
      if (speaking) {
        await Speech.stop();
      }

      setIsSpeaking(true);
      Speech.speak(text, {
        language: 'zh-CN',
        rate: rate,
        pitch: 1.0,
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    } catch (error) {
      console.warn('Error speaking Mandarin:', error);
      setIsSpeaking(false);
    }
  }, []);

  const triggerLightHaptic = useCallback(async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, []);

  const triggerMediumHaptic = useCallback(async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, []);

  const triggerSuccessHaptic = useCallback(async () => {
    if (Platform.OS !== 'web') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, []);

  const triggerErrorHaptic = useCallback(async () => {
    if (Platform.OS !== 'web') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, []);

  const stopSpeaking = useCallback(async () => {
    const speaking = await Speech.isSpeakingAsync();
    if (speaking) {
      await Speech.stop();
    }
    setIsSpeaking(false);
  }, []);

  return {
    isSpeaking,
    speakMandarin,
    stopSpeaking,
    triggerLightHaptic,
    triggerMediumHaptic,
    triggerSuccessHaptic,
    triggerErrorHaptic,
  };
}
