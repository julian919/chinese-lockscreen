import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HomeScreen } from './src/screens/HomeScreen';
import { StudyScreen } from './src/screens/StudyScreen';
import { QuizScreen } from './src/screens/QuizScreen';
import { useLearningStore } from './src/store/useLearningStore';
import { COLORS } from './src/theme/colors';

type Screen = 'home' | 'study' | 'quiz';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const { startStudySession } = useLearningStore();

  const handleStartStudy = (level: 1 | 2 | 3 | 'ALL') => {
    startStudySession(level, 10);
    setCurrentScreen('study');
  };

  const handleStartQuiz = (level: 1 | 2 | 3 | 'ALL') => {
    setCurrentScreen('quiz');
  };

  const handleExit = () => {
    setCurrentScreen('home');
  };

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <View style={styles.container}>
          {currentScreen === 'home' && (
            <HomeScreen
              onStartStudy={handleStartStudy}
              onStartQuiz={handleStartQuiz}
            />
          )}
          {currentScreen === 'study' && <StudyScreen onExit={handleExit} />}
          {currentScreen === 'quiz' && (
            <QuizScreen level="ALL" onExit={handleExit} />
          )}
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
