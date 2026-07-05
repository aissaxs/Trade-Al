import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation.types';
import { COLORS, SPLASH_DURATION } from '../../utils/constants';
import { useTheme } from '../../context/ThemeContext';

const { width, height } = Dimensions.get('window');

type SplashNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Splash'>;

export default function SplashScreen() {
  const navigation = useNavigation<SplashNavigationProp>();
  const { theme } = useTheme();

  // Animation values
  const cityOpacity = useRef(new Animated.Value(0)).current;
  const bullScale = useRef(new Animated.Value(0)).current;
  const bullOpacity = useRef(new Animated.Value(0)).current;
  const candlesOpacity = useRef(new Animated.Value(0)).current;
  const candlesTranslateY = useRef(new Animated.Value(50)).current;
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleText = 'ذكاء اصطناعي يحلل السوق';
  const [displayedSubtitle, setDisplayedSubtitle] = useState('');
  const iconsOpacity = useRef(new Animated.Value(0)).current;
  const iconsTranslateY = useRef(new Animated.Value(30)).current;
  const startButtonOpacity = useRef(new Animated.Value(0)).current;
  const startButtonScale = useRef(new Animated.Value(0.8)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  // Icons data
  const icons = [
    { icon: '🧠', label: 'ذكاء اصطناعي' },
    { icon: '📈', label: 'إشارات فورية' },
    { icon: '🛡️', label: 'إدارة مخاطرة' },
    { icon: '🎓', label: 'تعلم التداول' },
  ];

  useEffect(() => {
    // Sequence animation
    const sequence = Animated.sequence([
      // 0-1s: City background appears
      Animated.timing(cityOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      // 1-3s: Bull appears and scales up
      Animated.parallel([
        Animated.timing(bullOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(bullScale, {
          toValue: 1,
          duration: 2000,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
      ]),
      // 3-5s: Candles appear and move up
      Animated.parallel([
        Animated.timing(candlesOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(candlesTranslateY, {
          toValue: 0,
          duration: 1500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
      // 5-7s: Logo appears
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 1000,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
      ]),
    ]);

    sequence.start(() => {
      // 7-9s: Typewriter subtitle
      let charIndex = 0;
      const typewriterInterval = setInterval(() => {
        if (charIndex <= subtitleText.length) {
          setDisplayedSubtitle(subtitleText.slice(0, charIndex));
          charIndex++;
        } else {
          clearInterval(typewriterInterval);
          // 9-10s: Icons appear
          Animated.parallel([
            Animated.timing(iconsOpacity, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(iconsTranslateY, {
              toValue: 0,
              duration: 800,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
          ]).start(() => {
            // Start button appears with glow
            Animated.parallel([
              Animated.timing(startButtonOpacity, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
              }),
              Animated.timing(startButtonScale, {
                toValue: 1,
                duration: 600,
                easing: Easing.out(Easing.back(1.3)),
                useNativeDriver: true,
              }),
            ]).start(() => {
              // Glow animation
              Animated.loop(
                Animated.sequence([
                  Animated.timing(glowAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                  }),
                  Animated.timing(glowAnim, {
                    toValue: 0,
                    duration: 1500,
                    useNativeDriver: true,
                  }),
                ])
              ).start();
            });
          });
        }
      }, 100);
    });

    // Auto navigate after 10 seconds if user doesn't press start
    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, SPLASH_DURATION + 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleStart = () => {
    navigation.replace('Onboarding');
  };

  const glowInterpolation = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(0, 200, 83, 0.3)', 'rgba(0, 200, 83, 0.8)'],
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* City Background */}
      <Animated.View style={[styles.cityBackground, { opacity: cityOpacity }]}>
        <View style={styles.cityContainer}>
          {/* Simple city skyline */}
          {[...Array(8)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.building,
                {
                  height: 60 + Math.random() * 100,
                  width: 30 + Math.random() * 20,
                  backgroundColor: theme.colors.surfaceLight,
                  opacity: 0.3 + Math.random() * 0.3,
                },
              ]}
            />
          ))}
        </View>
      </Animated.View>

      {/* Bull Animation */}
      <Animated.View
        style={[
          styles.bullContainer,
          {
            opacity: bullOpacity,
            transform: [{ scale: bullScale }],
          },
        ]}
      >
        <Text style={styles.bullEmoji}>🐂</Text>
      </Animated.View>

      {/* Candles Animation */}
      <Animated.View
        style={[
          styles.candlesContainer,
          {
            opacity: candlesOpacity,
            transform: [{ translateY: candlesTranslateY }],
          },
        ]}
      >
        <View style={styles.candleGroup}>
          <View style={[styles.candle, styles.candleUp]} />
          <View style={[styles.candle, styles.candleDown]} />
          <View style={[styles.candle, styles.candleUp, { height: 40 }]} />
          <View style={[styles.candle, styles.candleUp, { height: 55 }]} />
          <View style={[styles.candle, styles.candleDown, { height: 35 }]} />
        </View>
      </Animated.View>

      {/* Logo */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <Text style={styles.logoText}>Trade AI</Text>
        <Text style={styles.logoSubtext}>{displayedSubtitle}</Text>
      </Animated.View>

      {/* Icons Grid */}
      <Animated.View
        style={[
          styles.iconsContainer,
          {
            opacity: iconsOpacity,
            transform: [{ translateY: iconsTranslateY }],
          },
        ]}
      >
        {icons.map((item, index) => (
          <Animated.View key={index} style={styles.iconItem}>
            <Text style={styles.iconEmoji}>{item.icon}</Text>
            <Text style={[styles.iconLabel, { color: theme.colors.textSecondary }]}>
              {item.label}
            </Text>
          </Animated.View>
        ))}
      </Animated.View>

      {/* Start Button */}
      <Animated.View
        style={[
          styles.startButtonContainer,
          {
            opacity: startButtonOpacity,
            transform: [{ scale: startButtonScale }],
          },
        ]}
      >
        <TouchableOpacity
          onPress={handleStart}
          activeOpacity={0.8}
        >
          <Animated.View
            style={[
              styles.startButton,
              {
                shadowColor: COLORS.primary,
                shadowOpacity: glowInterpolation,
                shadowRadius: 20,
                shadowOffset: { width: 0, height: 0 },
              },
            ]}
          >
            <Text style={styles.startButtonText}>Start</Text>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cityBackground: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  cityContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: width,
    height: height * 0.4,
    paddingBottom: 20,
  },
  building: {
    marginHorizontal: 2,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  bullContainer: {
    position: 'absolute',
    top: height * 0.15,
    alignItems: 'center',
  },
  bullEmoji: {
    fontSize: 120,
  },
  candlesContainer: {
    position: 'absolute',
    top: height * 0.35,
    alignItems: 'center',
  },
  candleGroup: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  candle: {
    width: 12,
    borderRadius: 2,
  },
  candleUp: {
    height: 50,
    backgroundColor: COLORS.chartUp,
  },
  candleDown: {
    height: 35,
    backgroundColor: COLORS.chartDown,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: height * 0.05,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.primary,
    letterSpacing: 2,
  },
  logoSubtext: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 8,
    minHeight: 24,
  },
  iconsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 30,
    gap: 20,
  },
  iconItem: {
    alignItems: 'center',
    width: 80,
  },
  iconEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  iconLabel: {
    fontSize: 11,
    textAlign: 'center',
  },
  startButtonContainer: {
    position: 'absolute',
    bottom: 60,
  },
  startButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 60,
    paddingVertical: 16,
    borderRadius: 30,
    elevation: 10,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
