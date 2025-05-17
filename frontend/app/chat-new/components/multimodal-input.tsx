'use client';

import { Message } from '@/app/chat-new/types';
import { useRef, useEffect, useState, memo } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, ArrowUp, Database, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { SuggestedActions } from './suggested-actions';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface MultimodalInputProps {
  chatId: string;
  handleSubmit: (e: React.FormEvent, value: string) => void;
  isLoading: boolean;
  messages: Message[];
  setMessages: (messages: Message[] | ((messages: Message[]) => Message[])) => void;
  isConnected: boolean;
  isConnecting: boolean;
  useRAG: boolean;
  setUseRAG: (value: boolean) => void;
  onConnect: () => void;
  append: (message: Message) => Promise<string | null | undefined>;
}

function PureMultimodalInput({
  chatId,
  handleSubmit,
  isLoading,
  messages,
  setMessages,
  isConnected,
  isConnecting,
  useRAG,
  setUseRAG,
  onConnect,
  append
}: MultimodalInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    
    handleSubmit(e, inputValue);
    setInputValue('');
  };

  return (
    <div className="relative w-full flex flex-col gap-4">
      {messages.length === 0 && (
        <SuggestedActions 
          append={append} 
          chatId={chatId} 
          handleSubmit={handleSubmit}
        />
      )}

      <form onSubmit={handleFormSubmit} className="flex flex-col">
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
            placeholder="Send a message..."
            className={cn(
              'min-h-[24px] max-h-[calc(75dvh)] overflow-hidden resize-none rounded-2xl !text-base',
              'bg-muted pb-10 dark:border-zinc-700'
            )}
            rows={2}
            disabled={!isConnected || isLoading}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleFormSubmit(e);
              }
            }}
          />

          <div className="absolute bottom-2 right-2 flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  size="icon"
                  variant={useRAG ? "default" : "ghost"}
                  className={cn(
                    "h-8 w-8 rounded-full",
                    useRAG && "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                  onClick={() => {
                    setUseRAG(!useRAG);
                    localStorage.setItem('useRAG', String(!useRAG));
                  }}
                >
                  <FileText className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {useRAG ? 'Using medical records' : 'Chat with medical records'}
              </TooltipContent>
            </Tooltip>

            {isLoading ? (
              <Button 
                type="button"
                className="rounded-full p-1.5 h-fit border dark:border-zinc-600"
                onClick={() => {
                  setMessages(messages => messages.filter(m => 
                    ['user', 'assistant', 'system'].includes(m.role)
                  ));
                }}
              >
                <Loader2 className="h-4 w-4 animate-spin" />
              </Button>
            ) : (
              <Button 
                type="submit" 
                disabled={!inputValue.trim()}
                className="rounded-full p-1.5 h-fit border dark:border-zinc-600"
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export const MultimodalInput = memo(PureMultimodalInput);
