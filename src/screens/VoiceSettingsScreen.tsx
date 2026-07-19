import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Check, Volume2 } from 'lucide-react-native';
import * as Speech from 'expo-speech';
import { COLORS } from '../theme/colors';
import { useSettingsStore } from '../store/useSettingsStore';
import { useMandarinAudio } from '../hooks/useMandarinAudio';

interface VoiceSettingsScreenProps {
  onBack: () => void;
}

export function VoiceSettingsScreen({ onBack }: VoiceSettingsScreenProps) {
  const insets = useSafeAreaInsets();
  const [voices, setVoices] = useState<Speech.Voice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { voiceIdentifier, setVoiceIdentifier } = useSettingsStore();
  const { speakMandarin, stopSpeaking, isSpeaking } = useMandarinAudio();

  useEffect(() => {
    async function loadVoices() {
      try {
        const availableVoices = await Speech.getAvailableVoicesAsync();
        // Only show Mandarin (zh-CN) voices — exclude zh-HK (Cantonese) and zh-TW (Taiwanese)
        // so the user changes the voice, not the dialect.
        const mandarinVoices = availableVoices.filter(v =>
          v.language === 'zh-CN' ||
          v.language === 'zh_CN' ||
          v.language.startsWith('zh-CN') ||
          v.language.startsWith('zh_CN') ||
          v.language === 'cmn-CN' ||
          v.language === 'cmn_CN'
        );

        setVoices(mandarinVoices);
      } catch (error) {
        console.warn('Error loading voices:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadVoices();

    return () => {
      stopSpeaking();
    };
  }, []);

  const handleSelectVoice = (identifier: string) => {
    setVoiceIdentifier(identifier);
    // Preview the voice
    Speech.speak('你好', { voice: identifier, language: 'zh-CN', useApplicationAudioSession: false });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft color={COLORS.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Voices</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Want more voices?</Text>
          <Text style={styles.infoText}>
            You can add more high-quality voices from your phone's settings:
          </Text>
          <Text style={styles.infoSubText}>
            iOS: Settings &gt; Accessibility &gt; Spoken Content &gt; Voices &gt; Chinese
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Available Voices</Text>

        {isLoading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
        ) : voices.length === 0 ? (
          <Text style={styles.emptyText}>No voices found.</Text>
        ) : (
          voices.map((voice) => (
            <TouchableOpacity
              key={voice.identifier}
              style={[
                styles.voiceItem,
                voiceIdentifier === voice.identifier && styles.voiceItemSelected
              ]}
              onPress={() => handleSelectVoice(voice.identifier)}
              activeOpacity={0.7}
            >
              <View style={styles.voiceItemLeft}>
                <View style={styles.iconContainer}>
                  <Volume2
                    color={voiceIdentifier === voice.identifier ? COLORS.primary : COLORS.textSecondary}
                    size={20}
                  />
                </View>
                <View>
                  <Text style={styles.voiceName}>{voice.name}</Text>
                  <Text style={styles.voiceLang}>{voice.language} {voice.quality === Speech.VoiceQuality.Enhanced ? '• Enhanced' : ''}</Text>
                </View>
              </View>

              {voiceIdentifier === voice.identifier && (
                <Check color={COLORS.primary} size={20} />
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 120, // Extra padding for bottom nav
  },
  infoBox: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  infoSubText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  loader: {
    marginTop: 40,
  },
  emptyText: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 20,
  },
  voiceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  voiceItemSelected: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
  },
  voiceItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  voiceName: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
    marginBottom: 4,
  },
  voiceLang: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});
