import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Config } from "../types";
import React from "react";

interface ConfigPanelProps {
  config: Config;
  setConfig: (config: Config) => void;
  isConnected: boolean;
  voices: string[];
  children?: React.ReactNode;
}

export function ConfigPanel({ config, setConfig, isConnected, voices, children }: ConfigPanelProps) {
  return (
    <React.Fragment>
      <div className="space-y-2">
        <Label htmlFor="system-prompt">System Prompt</Label>
        <Textarea
          id="system-prompt"
          value={config.systemPrompt}
          onChange={(e) => setConfig({ ...config, systemPrompt: e.target.value })}
          disabled={isConnected}
          className="min-h-[100px] resize-none text-xs"
          readOnly
          title="System prompt is automatically generated based on the active flight plan context."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="voice-select">Voice</Label>
        <Select
          value={config.voice}
          onValueChange={(value) => setConfig({ ...config, voice: value })}
          disabled={isConnected}
        >
          <SelectTrigger id="voice-select" className="h-9 text-xs">
            <SelectValue placeholder="Select a voice" />
          </SelectTrigger>
          <SelectContent>
            {voices.map((voice) => (
              <SelectItem key={voice} value={voice} className="text-xs">
                {voice}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {children}
    </React.Fragment>
  );
} 