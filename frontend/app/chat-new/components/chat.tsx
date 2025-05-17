'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Message } from '@/app/chat-new/types';
import { Messages } from './messages';
import { MultimodalInput } from './multimodal-input';
import { useChatState } from '@/hooks/use-chat-state';
import { useMessages } from '@/hooks/use-messages';
import { ChatHeader } from './chat-header';
import { createSupabaseBrowser } from "@/lib/supabase/client";

interface ChatProps {
  id: string;
  initialMessages: Message[];
  selectedModelId: string;
  selectedVisibilityType: 'public' | 'private';
  isReadonly: boolean;
}

export function Chat({
  id,
  initialMessages,
  selectedModelId,
  selectedVisibilityType,
  isReadonly,
}: ChatProps) {
  const [isLoading, setIsLoading] = useState(false);
  const {
    isConnected,
    isConnecting,
    llmChoice,
    useRAG,
    setUseRAG,
    handleConnect,
  } = useChatState(id);

  const { messages: savedMessages, addMessage } = useMessages(id);
  const [currentMessages, setCurrentMessages] = useState<Message[]>(initialMessages);
  const supabase = createSupabaseBrowser();

  const handleSendMessage = async (content: string): Promise<void> => {
    if (!content.trim() || isLoading) return;

    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      // Add user message
      const userMessage: Message = {
        id: Math.random().toString(),
        role: 'user',
        content: content.trim(),
      };
      
      await addMessage(userMessage);
      setCurrentMessages(prev => [...prev, userMessage]);

      // Send to appropriate API endpoint based on RAG
      const endpoint = useRAG ? '/api/rag-query-v2' : '/api/chat-v2';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...currentMessages, userMessage],
          llm_choice: llmChoice,
          conversationId: id,
          query: content.trim(),
          match_count: 5,
          useRAG,
          ...(user?.id && { user_id: user.id })
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const aiResponse = await response.json();

      if (aiResponse.error) {
        throw new Error(aiResponse.error);
      }

      const assistantMessage: Message = {
        id: Math.random().toString(),
        role: 'assistant',
        content: aiResponse.content || aiResponse.response,
        tabular_data: aiResponse.tabular_data,
      };

      const savedMessage = await addMessage(assistantMessage);
      setCurrentMessages(prev => [...prev, savedMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (savedMessages?.length > 0) {
      setCurrentMessages(savedMessages);
    }
  }, [savedMessages]);

  return (
    <div className="relative flex-1 flex flex-col h-full bg-background">
      <ChatHeader
        chatId={id}
        selectedModelId={selectedModelId}
        isReadonly={isReadonly}
        isConnected={isConnected}
        isConnecting={isConnecting}
        onConnect={handleConnect}
      />
      <div className="flex-1 overflow-auto">
        <Messages
          chatId={id}
          isLoading={isLoading}
          messages={currentMessages}
          setMessages={setCurrentMessages}
          reload={async () => null}
          isReadonly={isReadonly}
        />
      </div>

      <div className="sticky bottom-0 bg-gradient-to-t from-background to-transparent">
        <div className="mx-auto max-w-3xl px-4 pb-4">
          {!isReadonly && (
            <MultimodalInput
              chatId={id}
              handleSubmit={(e, value) => {
                e.preventDefault();
                handleSendMessage(value);
              }}
              isLoading={isLoading}
              messages={currentMessages}
              setMessages={setCurrentMessages}
              useRAG={useRAG}
              setUseRAG={setUseRAG}
              isConnected={isConnected}
              isConnecting={isConnecting}
              onConnect={handleConnect}
              append={async (message) => {
                await addMessage(message);
                setCurrentMessages(prev => [...prev, message]);
                return message.id;
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
