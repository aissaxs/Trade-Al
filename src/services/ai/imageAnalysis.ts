import { analyzeImage } from './geminiApi';

export async function analyzeChartImage(imageBase64: string): Promise<{
  patterns: string[];
  signals: string[];
  supportResistance: { support: number[]; resistance: number[] };
  recommendation: string;
  confidence: number;
}> {
  const prompt = `
    حلل هذا الشارت وأعطِ النتائج التالية بالتنسيق:
    
    الأنماط: [قائمة الأنماط المكتشفة]
    الإشارات: [BUY/SELL/HOLD مع السبب]
    الدعم: [مستويات الدعم]
    المقاومة: [مستويات المقاومة]
    التوصية: [توصية واضحة]
    الثقة: [نسبة من 0-100]
  `;

  try {
    const response = await analyzeImage(imageBase64, prompt);
    
    // Parse the response
    const lines = response.split('\n');
    const patterns: string[] = [];
    const signals: string[] = [];
    const support: number[] = [];
    const resistance: number[] = [];
    let recommendation = 'HOLD';
    let confidence = 50;

    lines.forEach(line => {
      if (line.includes('نمط') || line.includes('pattern')) {
        patterns.push(line.trim());
      }
      if (line.includes('إشارة') || line.includes('signal')) {
        signals.push(line.trim());
      }
      if (line.includes('دعم') || line.includes('support')) {
        const match = line.match(/\d+\.?\d*/);
        if (match) support.push(parseFloat(match[0]));
      }
      if (line.includes('مقاومة') || line.includes('resistance')) {
        const match = line.match(/\d+\.?\d*/);
        if (match) resistance.push(parseFloat(match[0]));
      }
      if (line.includes('توصية') || line.includes('recommendation')) {
        if (line.includes('BUY')) recommendation = 'BUY';
        else if (line.includes('SELL')) recommendation = 'SELL';
      }
      if (line.includes('ثقة') || line.includes('confidence')) {
        const match = line.match(/\d+/);
        if (match) confidence = parseInt(match[0]);
      }
    });

    return {
      patterns,
      signals,
      supportResistance: { support, resistance },
      recommendation,
      confidence,
    };
  } catch (error) {
    console.error('Image analysis error:', error);
    throw new Error('فشل في تحليل الشارت.');
  }
}
