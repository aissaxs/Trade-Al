import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  FlatList,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation.types';
import { COLORS, ONBOARDING_SLIDES } from '../../utils/constants';
import { useTheme } from '../../context/ThemeContext';

const { width, height } = Dimensions.get('window');

type OnboardingNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Onboarding'>;

interface SlideData {
  id: number;
  icon: string;
  title: string;
  description: string;
  color: string;
}

const slides: SlideData[] = [
  {
    id: 1,
    icon: '🧠',
    title: 'ذكاء اصطناعي يحلل السوق',
    description: 'AI يقرأ البيانات ويعطيك توصيات ذكية',
    color: '#00B0FF',
  },
  {
    id: 2,
    icon: '📈',
    title: 'إشارات Buy/Sell فورية',
    description: 'إشعار فوري عند فرصة تداول ممتازة',
    color: '#00C853',
  },
  {
    id: 3,
    icon: '🛡️',
    title: 'إدارة مخاطرة ذكية',
    description: 'Stop Loss و Take Profit تلقائي',
    color: '#FFD600',
  },
  {
    id: 4,
    icon: '🎓',
    title: 'تعلم التداول من صفر نحو الاحتراف',
    description: 'دورات تعليمية + محاكاة + تقدم',
    color: '#E040FB',
  },
];

export default function OnboardingScreen() {
  const navigation = useNavigation<OnboardingNavigationProp>();
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.replace('Login');
    }
  };

  const handleSkip = () => {
    navigation.replace('Login');
  };

  const handleGetStarted = () => {
    navigation.replace('Login');
  };

  const renderSlide = ({ item, index }: { item: SlideData; index: number }) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
      extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.3, 1, 0.3],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={[
          styles.slide,
          {
            transform: [{ scale }],
            opacity,
          },
        ]}
      >
        <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
          <Text style={styles.iconEmoji}>{item.icon}</Text>
        </View>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {item.title}
        </Text>
        <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
          {item.description}
        </Text>
      </Animated.View>
    );
  };

  const renderPagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {slides.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 24, 8],
            extrapolate: 'clamp',
          });

          const dotColor = scrollX.interpolate({
            inputRange,
            outputRange: [
              theme.colors.textMuted,
              COLORS.primary,
              theme.colors.textMuted,
            ],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  backgroundColor: dotColor,
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  const isLastSlide = currentIndex === slides.length - 1;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={[styles.skipText, { color: theme.colors.textSecondary }]}>
          تخطي ⏭️
        </Text>
      </TouchableOpacity>

      {/* Slides */}
      <Animated.FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        scrollEventThrottle={16}
      />

      {/* Pagination */}
      {renderPagination()}

      {/* Next / Get Started Button */}
      <TouchableOpacity
        style={[styles.nextButton, { backgroundColor: COLORS.primary }]}
        onPress={isLastSlide ? handleGetStarted : handleNext}
        activeOpacity={0.8}
      >
        <Text style={styles.nextButtonText}>
          {isLastSlide ? 'ابدأ التداول 🚀' : 'التالي'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  slide: {
    width,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  iconEmoji: {
    fontSize: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 32,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  nextButton: {
    marginHorizontal: 40,
    marginBottom: 50,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 5,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
