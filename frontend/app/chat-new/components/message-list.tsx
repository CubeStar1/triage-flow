'use client';

import { Message } from '../types';
import { useRef, useEffect } from 'react';
import { MessageItem } from './message-item';

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="flex-grow overflow-y-auto scrollbar-hide">
      {messages.map((message, index) => (
        <MessageItem key={index} message={message} />
      ))}
      {isLoading && (
        <div className="flex justify-center py-2">
          <span className="loading loading-dots loading-md"></span>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
} 