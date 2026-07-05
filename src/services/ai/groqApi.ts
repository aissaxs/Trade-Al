import { API_CONFIG } from '../../config/api.config';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const TRADING_AI_PROMPT = `
أنت TradeAI Pro، خبير تداول محترف متخصص فقط في:
• التحليل الفني والأساسي
• الشموع اليابانية
• إدارة رأس المال والمخاطرة
• استراتيجيات التداول
• سوق الكريبتو والفوركس والأسهم

قواعدك:
1. تجيب فقط على أسئلة التداول
2. تحذر دائماً من المخاطرة
3. لا تعد بالربح — تحليل فقط
4. تشرح ببساطة للمبتدئين وبتفصيل للمحترفين
5. تدعم اللغتين العربية والإنجليزية

أسلوبك: محترف، ودي، واضح، دقيق.
`;

export async function askAIGroq(question: string): Promise<string> {
  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_CONFIG.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: API_CONFIG.GROQ_MODEL,
        messages: [
          { role: 'system', content: TRADING_AI_PROMPT },
          { role: 'user', content: question },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error: any) {
    console.error('Groq API error:', error);
    throw new Error('فشل في الاتصال بـ AI الاحتياطي.');
  }
}

export async function askAIGroqFast(question: string): Promise<string> {
  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_CONFIG.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: API_CONFIG.GROQ_FAST_MODEL,
        messages: [
          { role: 'system', content: TRADING_AI_PROMPT },
          { role: 'user', content: question },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error: any) {
    console.error('Groq Fast API error:', error);
    throw new Error('فشل في الاتصال بـ AI السريع.');
  }
}
