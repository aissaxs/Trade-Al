import { GoogleGenerativeAI } from '@google/generative-ai';
import { API_CONFIG } from '../../config/api.config';

const genAI = new GoogleGenerativeAI(API_CONFIG.GEMINI_API_KEY || '');

const TRADING_AI_PROMPT = `
أنت TradeAI Pro، خبير تداول محترف متخصص فقط في:
• التحليل الفني والأساسي
• الشموع اليابانية
• إدارة رأس المال والمخاطرة
• استراتيجيات التداول
• سوق الكريبتو والفوركس والأسهم

قواعدك:
1. تجيب فقط على أسئلة التداول
2. إذا سأل عن موضوع آخر، ترفض بأدب
3. تحذر دائماً من المخاطرة
4. لا تعد بالربح — تحليل فقط
5. تشرح ببساطة للمبتدئين وبتفصيل للمحترفين
6. تستخدم أمثلة من السوق الحقيقي
7. تدعم اللغتين العربية والإنجليزية

أسلوبك: محترف، ودي، واضح، دقيق.
`;

const model = genAI.getGenerativeModel({
  model: API_CONFIG.GEMINI_MODEL,
  systemInstruction: TRADING_AI_PROMPT,
});

export async function askAI(question: string): Promise<string> {
  try {
    const result = await model.generateContent(question);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error('Gemini API error:', error);
    throw new Error('فشل في الاتصال بـ AI. حاول مرة أخرى.');
  }
}

export async function analyzeImage(imageBase64: string, question: string): Promise<string> {
  try {
    const result = await model.generateContent([
      {
        inlineData: {
          data: imageBase64,
          mimeType: 'image/jpeg',
        },
      },
      { text: question },
    ]);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error('Gemini image analysis error:', error);
    throw new Error('فشل في تحليل الصورة. حاول مرة أخرى.');
  }
}

export async function generateSignal(symbol: string, marketData: any): Promise<string> {
  const prompt = `
    حلل السوق للعملة ${symbol}:
    السعر الحالي: ${marketData.price}
    التغير 24س: ${marketData.change24h}%
    الحجم: ${marketData.volume}
    
    أعطِ إشارة BUY أو SELL أو HOLD مع:
    - نسبة الثقة (0-100%)
    - سبب الإشارة
    - هدف الربح
    - وقف الخسارة
    - نسبة المخاطرة/الربح
    
    باللغة العربية.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error('Signal generation error:', error);
    throw new Error('فشل في توليد الإشارة.');
  }
}
