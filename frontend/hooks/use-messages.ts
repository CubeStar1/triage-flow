import { useState, useCallback, useEffect } from 'react';
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { toast } from 'sonner';
import { Message } from '@/app/chat-new/types';

export function useMessages(conversationId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const supabase = createSupabaseBrowser();

  const fetchMessages = useCallback(async () => {
    try {
      console.log('Fetching messages for conversation:', conversationId);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      console.log('Fetched messages:', data);
      setMessages(data || []);
      return data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }, [conversationId, supabase]);

  const addMessage = useCallback(async (message: Message) => {
    try {
      const messageToAdd = {
        conversation_id: conversationId,
        role: message.role,
        content: message.content,
        tabular_data: message.tabular_data,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('messages')
        .insert(messageToAdd)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setMessages(prev => [...prev, data]);
      return data;
    } catch (error) {
      console.error('Error adding message:', error);
      throw error;
    }
  }, [conversationId, supabase]);

  // Initial fetch
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return {
    messages,
    setMessages,
    fetchMessages,
    addMessage
  };
} 