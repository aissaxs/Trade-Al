import { supabase } from '../../config/supabase.config';

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateUserProfile(userId: string, updates: any) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
  
  if (error) throw error;
  return data;
}

export async function saveChatHistory(userId: string, session: any) {
  const { data, error } = await supabase
    .from('chat_history')
    .upsert({
      user_id: userId,
      session_id: session.id,
      messages: session.messages,
      section: session.section,
      updated_at: new Date().toISOString(),
    });
  
  if (error) throw error;
  return data;
}

export async function getChatHistory(userId: string) {
  const { data, error } = await supabase
    .from('chat_history')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function saveFavorite(userId: string, symbol: string, type: string) {
  const { data, error } = await supabase
    .from('favorites')
    .upsert({
      user_id: userId,
      symbol,
      type,
      created_at: new Date().toISOString(),
    });
  
  if (error) throw error;
  return data;
}

export async function getFavorites(userId: string) {
  const { data, error } = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', userId);
  
  if (error) throw error;
  return data;
}

export async function removeFavorite(userId: string, symbol: string) {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('symbol', symbol);
  
  if (error) throw error;
}
