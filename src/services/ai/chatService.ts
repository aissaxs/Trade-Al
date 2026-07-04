import { AIMessage, AIChatSession } from '../../types/ai.types';
import { chatWithAI, analyzeChartImage } from './aiService';

export class ChatService {
  private sessions: Map<string, AIChatSession> = new Map();

  createSession(userId: string, section: 'home' | 'learn' | 'capital' | 'market'): AIChatSession {
    const session: AIChatSession = {
      id: `session-${Date.now()}`,
      userId,
      section,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isSaved: false,
    };
    
    this.sessions.set(session.id, session);
    return session;
  }

  getSession(sessionId: string): AIChatSession | undefined {
    return this.sessions.get(sessionId);
  }

  async sendMessage(
    sessionId: string,
    content: string,
    imageBase64?: string
  ): Promise<AIMessage> {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    // Add user message
    const userMessage: AIMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      timestamp: Date.now(),
      imageUrl: imageBase64,
    };
    
    session.messages.push(userMessage);

    // Get AI response
    let aiContent: string;
    
    if (imageBase64) {
      aiContent = await analyzeChartImage(imageBase64, content);
    } else {
      aiContent = await chatWithAI(content);
    }

    // Add AI message
    const aiMessage: AIMessage = {
      id: `msg-${Date.now() + 1}`,
      role: 'assistant',
      content: aiContent,
      timestamp: Date.now(),
    };
    
    session.messages.push(aiMessage);
    session.updatedAt = Date.now();

    return aiMessage;
  }

  saveSession(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.isSaved = true;
    }
  }

  deleteSession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }

  getSessionHistory(sessionId: string): AIMessage[] {
    const session = this.sessions.get(sessionId);
    return session?.messages || [];
  }
}

export const chatService = new ChatService();
