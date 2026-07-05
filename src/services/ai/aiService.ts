import { askAI, analyzeImage } from './geminiApi';
import { askAIGroq, askAIGroqFast } from './groqApi';

export async function chatWithAI(question: string, useFast: boolean = false): Promise<string> {
  try {
    // Try Gemini first (primary)
    return await askAI(question);
  } catch (error) {
    console.warn('Gemini failed, trying Groq...');
    try {
      // Fallback to Groq
      if (useFast) {
        return await askAIGroqFast(question);
      }
      return await askAIGroq(question);
    } catch (groqError) {
      throw new Error('جميع خدمات AI غير متاحة حالياً. حاول لاحقاً.');
    }
  }
}

export async function analyzeChartImage(imageBase64: string, question: string): Promise<string> {
  try {
    return await analyzeImage(imageBase64, question);
  } catch (error) {
    throw new Error('فشل في تحليل الصورة. تأكد من صحة الصورة.');
  }
}

export async function generateMarketAnalysis(symbol: string, data: any): Promise<string> {
  const prompt = `
    قدم تحليلاً شاملاً للسوق للعملة ${symbol}:
    
    البيانات:
    - السعر: ${data.price}
    - التغير: ${data.change24h}%
    - الحجم: ${data.volume}
    - أعلى 24س: ${data.high24h}
    - أدنى 24س: ${data.low24h}
    
    التحليل المطلوب:
    1. الاتجاه العام (صاعد/هابط/عرضي)
    2. مستويات الدعم والمقاومة
    3. إشارة التداول (BUY/SELL/HOLD)
    4. نسبة الثقة
    5. الأهداف والوقف
    6. التحذيرات
    
    باللغة العربية.
  `;

  return await chatWithAI(prompt);
}

export async function explainConcept(concept: string): Promise<string> {
  const prompt = `
    اشرح مفهوم "${concept}" في التداول:
    - تعريف بسيط
    - كيفية الاستخدام
    - أمثلة عملية
    - نصائح للمبتدئين
    
    باللغة العربية.
  `;

  return await chatWithAI(prompt);
}
