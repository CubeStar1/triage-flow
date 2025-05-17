'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mic, StopCircle, AlertCircle, Loader2, Bot, Brain, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAudioStream } from '@/app/(default)/voice-assistant/hooks/useAudioStream';
import { useAudioPlayback } from '@/app/(default)/voice-assistant/hooks/useAudioPlayback';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Config } from '@/app/(default)/voice-assistant/types';
import type { TriageData } from '@/lib/fetchers/assessment';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL;

interface CompactVoiceAssistantProps {
  triageData: TriageData;
}

export function CompactVoiceAssistant({ triageData }: CompactVoiceAssistantProps) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isReceiving, setIsReceiving] = useState(false);
  const [waveformPoints, setWaveformPoints] = useState<number[]>([]);

  const wsRef = useRef<WebSocket | null>(null);
  const clientId = useRef(crypto.randomUUID());
  const animationFrameRef = useRef<number | undefined>(undefined);
  
  const { error: streamError, startAudioStream, stopAudioStream } = useAudioStream();
  const { handleAudioMessage } = useAudioPlayback();

  const config: Config = {
    systemPrompt: `You are an advanced medical triage AI assistant powered by Gemini Pro. You have access to the following patient data:
- Patient Name: ${triageData.patientName}
- Injury Type: ${triageData.predictedInjuryLabel}
- Symptoms: ${triageData.symptomDescription}
- Severity: ${triageData.recommendationStatus || 'Unknown'}
- Severity Score: ${triageData.severityScore || 'N/A'}
- Severity Reason: ${triageData.severityReason || 'Not specified'}

Analyze this information and provide insights. You can:
1. Explain the injury assessment in detail
2. Suggest immediate care steps based on severity
3. Answer questions about the triage process
4. Provide emergency care guidelines if needed

Respond verbally with clear, professional medical insights.`,
    voice: "Puck",
    googleSearch: false,
    allowInterruptions: false
  };

  useEffect(() => {
    const generateWaveform = () => {
      const points = [];
      const numPoints = 20;
      for (let i = 0; i < numPoints; i++) {
        const height = isStreaming
          ? Math.random() * 40 + (isReceiving ? 40 : 20)
          : 30;
        points.push(height);
      }
      setWaveformPoints(points);
      animationFrameRef.current = requestAnimationFrame(generateWaveform);
    };

    if (isStreaming) {
      generateWaveform();
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      setWaveformPoints([]);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isStreaming, isReceiving]);

  const startStream = async () => {
    wsRef.current = new WebSocket(`${WS_URL}/${clientId.current}`);
    
    wsRef.current.onopen = async () => {
      if (!wsRef.current) return;
      
      wsRef.current.send(JSON.stringify({
        type: 'config',
        config: config
      }));
      
      await startAudioStream(wsRef);
      setIsStreaming(true);
      setIsConnected(true);
    };

    wsRef.current.onmessage = async (event: MessageEvent) => {
      const response = JSON.parse(event.data);
      if (response.type === 'audio') {
        await handleAudioMessage(response.data);
      } else if (response.type === 'text') {
        setIsReceiving(true);
        setTimeout(() => setIsReceiving(false), 1000);
      }
    };

    wsRef.current.onerror = (error: Event) => {
      console.error('WebSocket error:', (error as ErrorEvent).message || 'Unknown error');
      setIsStreaming(false);
    };

    wsRef.current.onclose = () => {
      setIsStreaming(false);
      setIsConnected(false);
    };
  };

  const stopStream = () => {
    stopAudioStream();
    if (wsRef.current) {
      if (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING) {
        wsRef.current.close();
      }
    }
    setIsStreaming(false);
  };

  return (
    <Card className="shadow-lg rounded-xl overflow-hidden border">
      <CardHeader className="pb-3 pt-4 px-4 md:px-5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
        <CardTitle className="text-base font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
          <Bot className="h-5 w-5 text-purple-500" />
          Voice Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
            <Bot className="h-6 w-6 text-purple-500 mb-2" />
            <span className="text-xs font-medium text-purple-700 dark:text-purple-300">Gemini Live API</span>
          </div>
          <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-pink-50 dark:bg-pink-900/20">
            <Brain className="h-6 w-6 text-pink-500 mb-2" />
            <span className="text-xs font-medium text-pink-700 dark:text-pink-300">Triage Flow</span>
          </div>
          <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-sky-50 dark:bg-sky-900/20">
            <Sparkles className="h-6 w-6 text-sky-500 mb-2" />
            <span className="text-xs font-medium text-sky-700 dark:text-sky-300">Voice Chat</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Patient: {triageData.patientName}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            {triageData.predictedInjuryLabel} • {triageData.recommendationStatus || 'Unknown'} Severity
          </div>
        </div>

        <div className="flex justify-center">
          {!isStreaming ? (
            <Button
              variant="default"
              size="lg"
              onClick={() => startStream()}
              disabled={isStreaming || isConnected}
              className={cn(
                "w-full py-6 text-white shadow-lg hover:shadow-xl transition-all",
                "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
                "dark:from-purple-600 dark:to-pink-600 dark:hover:from-purple-700 dark:hover:to-pink-700"
              )}
            >
              {isConnected ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Mic className="h-5 w-5 mr-2" />
              )}
              {isConnected ? 'Connecting...' : 'Start Voice Assistant'}
            </Button>
          ) : (
            <Button
              variant="destructive"
              size="lg"
              onClick={stopStream}
              className="w-full py-6 shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600"
            >
              <StopCircle className="h-5 w-5 mr-2" />
              Stop Recording
            </Button>
          )}
        </div>

        {streamError && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{streamError}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
