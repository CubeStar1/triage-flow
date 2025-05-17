import { useState, useCallback } from 'react';
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { toast } from 'sonner';
import { Conversation } from '@/app/chat-new/types';

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const supabase = createSupabaseBrowser();

  const fetchConversations = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      toast.error('Failed to fetch conversations');
      console.error(error);
    }
  }, [supabase]);

  const createConversation = useCallback(async (userId: string, title: string) => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert({ title, user_id: userId })
        .select()
        .single();

      if (error) throw error;
      await fetchConversations(userId);
      return data;
    } catch (error) {
      toast.error('Failed to create conversation');
      console.error(error);
      return null;
    }
  }, [supabase, fetchConversations]);

  const renameConversation = useCallback(async (conversationId: string, title: string) => {
    try {
      const { error } = await supabase
        .from('conversations')
        .update({ 
          title, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', conversationId);

      if (error) throw error;
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await fetchConversations(user.id);
      }
    } catch (error) {
      toast.error('Failed to rename conversation');
      console.error(error);
    }
  }, [supabase, fetchConversations]);

  const deleteConversation = useCallback(async (conversationId: string) => {
    try {
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', conversationId);

      if (error) throw error;
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await fetchConversations(user.id);
      }
    } catch (error) {
      toast.error('Failed to delete conversation');
      console.error(error);
    }
  }, [supabase, fetchConversations]);

  return {
    conversations,
    fetchConversations,
    createConversation,
    renameConversation,
    deleteConversation
  };
} 