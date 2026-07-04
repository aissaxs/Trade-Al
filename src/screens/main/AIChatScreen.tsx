import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainTabParamList } from '../../types/navigation.types';
import { COLORS, FREE_LIMITS, PLANS } from '../../utils/constants';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../hooks/useSubscription';
import { sendMessageToAI, analyzeImage } from '../../services/ai/aiService';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

type AIChatNavigationProp = NativeStackNavigationProp<MainTabParamList, 'AIChat'>;

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  imageUrl?: string;
}

export default function AIChatScreen() {
  const navigation = useNavigation<AIChatNavigationProp>();
  const { theme } = useTheme();
  const { user } = useAuth();
  const { subscription } = useSubscription();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [dailyImageCount, setDailyImageCount] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const isPlus = subscription?.plan === PLANS.PLUS_MONTHLY || subscription?.plan === PLANS.PLUS_YEARLY;
  const remainingImages = isPlus ? Infinity : Math.max(0, FREE_LIMITS.DAILY_IMAGES - dailyImageCount);

  useEffect(() => {
    // Add welcome message
    const welcomeMessage: Message = {
      id: 'welcome',
      role: 'assistant',
      content: `مرحباً ${user?.username || ''}! 👋\n\nأنا مساعد Trade AI المتخصص في التداول. يمكنني مساعدتك في:\n\n• تحليل الأسواق\n• شرح المفاهيم التداولية\n• تقييم استراتيجياتك\n• الإجابة على أسئلتك\n\n${!isPlus ? `📸 لديك ${remainingImages} صور متبقية اليوم للتحليل.` : '📸 صور غير محدودة!'}`,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, []);

  const handleSend = async () => {
    if (!inputText.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      const response = await sendMessageToAI(userMessage.content, messages);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      Alert.alert('خطأ', 'حدث خطأ في الاتصال بالذكاء الاصطناعي. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const handleImagePick = async () => {
    if (remainingImages <= 0 && !isPlus) {
      Alert.alert(
        'تم تجاوز الحد',
        'لقد استنفذت عدد الصور المجانية لهذا اليوم. ترقى إلى Plus لصور غير محدودة.',
        [
          { text: 'لاحقاً', style: 'cancel' },
          { text: 'ترقية', onPress: () => navigation.navigate('Home' as any) },
        ]
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: 'تحليل هذه الصورة',
        imageUrl: `data:image/jpeg;base64,${result.assets[0].base64}`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setLoading(true);

      try {
        const analysis = await analyzeImage(result.assets[0].base64);
        
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: analysis,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiMessage]);
        setDailyImageCount((prev) => prev + 1);
      } catch (error) {
        Alert.alert('خطأ', 'حدث خطأ في تحليل الصورة.');
      } finally {
        setLoading(false);
      }
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.role === 'user';

    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessage : styles.aiMessage,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            {
              backgroundColor: isUser ? COLORS.primary : theme.colors.surface,
              borderBottomRightRadius: isUser ? 4 : 16,
              borderBottomLeftRadius: isUser ? 16 : 4,
            },
          ]}
        >
          {item.imageUrl && (
            <Image source={{ uri: item.imageUrl }} style={styles.messageImage} />
          )}
          <Text
            style={[
              styles.messageText,
              { color: isUser ? '#FFFFFF' : theme.colors.text },
            ]}
          >
            {item.content}
          </Text>
          <Text
            style={[
              styles.messageTime,
              { color: isUser ? 'rgba(255,255,255,0.7)' : theme.colors.textMuted },
            ]}
          >
            {item.timestamp.toLocaleTimeString('ar-SA', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.headerContent}>
          <View style={[styles.aiAvatar, { backgroundColor: COLORS.primary + '20' }]}>
            <Ionicons name="sparkles" size={20} color={COLORS.primary} />
          </View>
          <View>
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
              AI مساعد التداول
            </Text>
            <View style={styles.statusContainer}>
              <View style={[styles.statusDot, { backgroundColor: COLORS.success }]} />
              <Text style={[styles.statusText, { color: theme.colors.textSecondary }]}>
                متصل
              </Text>
            </View>
          </View>
        </View>
        {!isPlus && (
          <View style={styles.imageCounter}>
            <Ionicons name="image" size={14} color={theme.colors.textMuted} />
            <Text style={[styles.imageCounterText, { color: theme.colors.textMuted }]}>
              {remainingImages}
            </Text>
          </View>
        )}
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        showsVerticalScrollIndicator={false}
      />

      {/* Loading Indicator */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={COLORS.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
            يفكر...
          </Text>
        </View>
      )}

      {/* Input */}
      <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface }]}>
        <TouchableOpacity
          style={[styles.attachButton, { backgroundColor: theme.colors.surfaceLight }]}
          onPress={handleImagePick}
        >
          <Ionicons
            name="image"
            size={22}
            color={remainingImages > 0 || isPlus ? COLORS.primary : theme.colors.textMuted}
          />
        </TouchableOpacity>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.background,
              color: theme.colors.text,
            },
          ]}
          placeholder="اكتب رسالتك هنا..."
          placeholderTextColor={theme.colors.textMuted}
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={1000}
          textAlign="right"
        />

        <TouchableOpacity
          style={[
            styles.sendButton,
            {
              backgroundColor: inputText.trim() ? COLORS.primary : theme.colors.surfaceLight,
            },
          ]}
          onPress={handleSend}
          disabled={!inputText.trim() || loading}
        >
          <Ionicons
            name="send"
            size={20}
            color={inputText.trim() ? '#FFFFFF' : theme.colors.textMuted}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aiAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
  },
  imageCounter: {
    position: 'absolute',
    right: 20,
    top: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  imageCounterText: {
    fontSize: 12,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    marginBottom: 12,
    maxWidth: '85%',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  aiMessage: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
  },
  messageImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 22,
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 8,
  },
  loadingText: {
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },
  attachButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 14,
    textAlign: 'right',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
