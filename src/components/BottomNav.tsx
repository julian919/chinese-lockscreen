import React from 'react';
import { StyleSheet, View, TouchableOpacity, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Home, Settings } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../theme/colors';

type Screen = 'home' | 'study' | 'quiz' | 'settings' | 'settings-voice';

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export function BottomNav({ currentScreen, onNavigate }: BottomNavProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom || 20 }]}>
      {Platform.OS === 'ios' ? (
        <BlurView intensity={80} tint="dark" style={styles.blurContainer}>
          <NavButtons currentScreen={currentScreen} onNavigate={onNavigate} />
        </BlurView>
      ) : (
        <View style={[styles.blurContainer, styles.androidFallback]}>
          <NavButtons currentScreen={currentScreen} onNavigate={onNavigate} />
        </View>
      )}
    </View>
  );
}

function NavButtons({ currentScreen, onNavigate }: BottomNavProps) {
  return (
    <View style={styles.navContent}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => onNavigate('home')}
        activeOpacity={0.7}
      >
        <Home
          color={currentScreen === 'home' ? COLORS.primary : COLORS.textSecondary}
          size={24}
        />
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => onNavigate('settings')}
        activeOpacity={0.7}
      >
        <Settings
          color={
            currentScreen === 'settings' || currentScreen === 'settings-voice'
              ? COLORS.primary
              : COLORS.textSecondary
          }
          size={24}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  blurContainer: {
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  androidFallback: {
    backgroundColor: 'rgba(30,30,30,0.95)',
    elevation: 8,
  },
  navContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 15,
  },
  navItem: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
