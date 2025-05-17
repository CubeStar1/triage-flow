import { useState, useCallback } from 'react';
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { toast } from 'sonner';
import { Message } from '@/app/chat-new/types';

export function useChatState(conversationId: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [llmChoice, setLlmChoice] = useState('openai');
  const [useRAG, setUseRAG] = useState(false);
  const supabase = createSupabaseBrowser();

  const handleConnect = useCallback(async () => {
    setIsConnecting(true);
    try {
      const response = await fetch('/api/db-structure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ db_credentials: {} }),
      });
      
      if (response.ok) {
        setIsConnected(true);
        toast.success("Successfully connected to the database");
      } else {
        throw new Error('Failed to connect to database');
      }
    } catch (error) {
      console.error('Error connecting to database:', error);
      toast.error("Failed to connect to the database");
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const insertMessage = useCallback(async (message: Message) => {
    try {
      await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          role: message.role,
          content: message.content
        });
    } catch (error) {
      console.error('Error inserting message:', error);
      toast.error("Failed to save message");
    }
  }, [conversationId, supabase]);

  const updateConversation = useCallback(async () => {
    try {
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);
    } catch (error) {
      console.error('Error updating conversation:', error);
    }
  }, [conversationId, supabase]);

  return {
    isConnected,
    isConnecting,
    llmChoice,
    setLlmChoice,
    useRAG,
    setUseRAG,
    handleConnect,
    insertMessage,
    updateConversation
  };
} 