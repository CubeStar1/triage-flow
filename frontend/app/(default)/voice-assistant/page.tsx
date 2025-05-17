'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mic, StopCircle, MessageSquare, AlertCircle, Info, Loader2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useAudioStream } from './hooks/useAudioStream';
import { useAudioPlayback } from './hooks/useAudioPlayback';
import { useVideoStream } from './hooks/useVideoStream';
import type { Config } from './types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { VoiceSettings } from './components/VoiceSettings';
import { ControlDock } from './components/ControlDock';
import { ChatColumn } from './components/ChatColumn';
import { PageHeader } from '@/components/global/page-header';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL;

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

const voices = ["Puck", "Charon", "Kore", "Fenrir", "Aoede"];

const BASE_SYSTEM_PROMPT = "You are a helpful AI voice assistant. Respond verbally with concise, accurate information based on user requests.";

export default function VoiceAssistantPage() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [text, setText] = useState('');
  const [chatMode, setChatMode] = useState<'audio' | 'video' | null>(null);
  const [config, setConfig] = useState<Config>({
    systemPrompt: BASE_SYSTEM_PROMPT,
    voice: "Puck",
    googleSearch: false,
    allowInterruptions: false
  });
  const [isConnected, setIsConnected] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const clientId = useRef(crypto.randomUUID());
  
  const { error: streamError, startAudioStream, stopAudioStream } = useAudioStream();
  const { videoRef, canvasRef, startVideoStream, stopVideoStream } = useVideoStream();
  const { handleAudioMessage } = useAudioPlayback();
  

  const displayError = streamError;

  const startStream = async (mode: 'audio' | 'video') => {
    setChatMode(mode);
    wsRef.current = new WebSocket(`${WS_URL}/${clientId.current}`);

    
    wsRef.current.onopen = async () => {
      if (!wsRef.current) return;
      
      wsRef.current.send(JSON.stringify({
        type: 'config',
        config: config
      }));
      
      await startAudioStream(wsRef);
      if (mode === 'video') {
        await startVideoStream(wsRef);
      }
      setIsStreaming(true);
      setIsConnected(true);
    };

    wsRef.current.onmessage = async (event: MessageEvent) => {
      const response = JSON.parse(event.data);
      if (response.type === 'audio') {
        await handleAudioMessage(response.data);
      } else if (response.type === 'text') {
        setText(prev => prev + response.text + '\n');
      }
    };

    wsRef.current.onerror = (error: Event) => {
      const err = error as ErrorEvent;
      console.error('WebSocket error:', err.message || 'Unknown error');
      setIsStreaming(false);
    };

    wsRef.current.onclose = () => {
      setIsStreaming(false);
      setIsConnected(false);
    };
  };

  const stopStream = () => {
    stopAudioStream();
    if (chatMode === 'video') {
      stopVideoStream();
    }
    if (wsRef.current) {
       if (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING) {
           console.log("Closing WebSocket connection from stopStream.");
           wsRef.current.close(1000, "Client requested stop"); 
       }
       wsRef.current = null;
    }
    setIsStreaming(false);
    setIsConnected(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container mx-auto px-4 py-6 space-y-6 flex-grow">
        <div className="flex items-center justify-between">
           <PageHeader title="Voice Assistant" />
           <Popover>
                <PopoverTrigger asChild>
                    <Button variant="secondary" size="sm" aria-label="Voice Settings">
                        <Settings className="h-4 w-4 mr-1.5" /> Voice Settings
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 mr-4" side="bottom" align="end">
                    <div className="space-y-4 p-4">
                        <h4 className="font-medium leading-none">Voice Settings</h4>
                        <VoiceSettings
                            config={config}
                            setConfig={setConfig}
                            isConnected={isConnected}
                            voices={voices}
                        />
                    </div>
                </PopoverContent>
            </Popover>
        </div>

        {displayError && (
          <Alert variant="destructive" className="w-full">
             <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{displayError}</AlertDescription>
          </Alert>
        )}

        <Card className="shadow-sm border-blue-500/20 bg-gradient-to-br from-blue-500/5 via-background to-background rounded-xl overflow-hidden flex flex-col h-full">
          <CardHeader className="px-5 py-3 border-b border-blue-500/10 flex-shrink-0">
            <CardTitle className="text-base font-medium text-blue-800 dark:text-blue-300 flex items-center">
              <MessageSquare className="h-4 w-4 mr-2"/> Voice Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 flex-grow flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="text-muted-foreground">
                {isStreaming ? (
                  <p>Listening... Speak now</p>
                ) : (
                  <p>Press the microphone button to start speaking</p>
                )}
              </div>
              {isConnected && !isStreaming && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></div>
                  Connected
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <ChatColumn
                chatMode={chatMode}
                videoRef={videoRef as React.RefObject<HTMLVideoElement>}
                canvasRef={canvasRef as React.RefObject<HTMLCanvasElement>}
                wsRef={wsRef as React.RefObject<WebSocket>}
                isStreaming={isStreaming}
                text={text}
              />
      <div className="sticky bottom-0 bg-background/80 backdrop-blur-sm border-t py-3 z-10">
        <div className="container mx-auto px-4 flex items-center justify-center relative">
        <ControlDock
              isStreaming={isStreaming}
              onStartAudio={() => startStream('audio')}
              onStartVideo={() => startStream('video')}
              onStop={stopStream}
            />
        </div>
      </div>
    </div>
  );
}