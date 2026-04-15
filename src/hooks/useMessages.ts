import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Message } from '../types';

export function useMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    setLoading(true);

    supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setMessages(data);
        setLoading(false);
      });
  }, [conversationId]);

  const addMessage = useCallback(async (
    conversationId: string,
    role: 'user' | 'assistant',
    content: string
  ) => {
    const { data, error } = await supabase
      .from('messages')
      .insert({ conversation_id: conversationId, role, content })
      .select()
      .single();

    if (!error && data) {
      setMessages(prev => [...prev, data as Message]);
      return data as Message;
    }
    return null;
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return { messages, loading, addMessage, clearMessages };
}
