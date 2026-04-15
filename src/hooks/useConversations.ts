import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Conversation } from '../types';

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = useCallback(async () => {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .order('updated_at', { ascending: false });

    if (!error && data) {
      setConversations(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const createConversation = useCallback(async (title = 'New Conversation') => {
    const { data, error } = await supabase
      .from('conversations')
      .insert({ title })
      .select()
      .single();

    if (!error && data) {
      setConversations(prev => [data, ...prev]);
      return data as Conversation;
    }
    return null;
  }, []);

  const deleteConversation = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', id);

    if (!error) {
      setConversations(prev => prev.filter(c => c.id !== id));
    }
  }, []);

  const updateTitle = useCallback(async (id: string, title: string) => {
    const { error } = await supabase
      .from('conversations')
      .update({ title, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (!error) {
      setConversations(prev =>
        prev.map(c => (c.id === id ? { ...c, title } : c))
      );
    }
  }, []);

  return { conversations, loading, createConversation, deleteConversation, updateTitle, refetch: fetchConversations };
}
