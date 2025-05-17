import React from 'react';
import { Handle, Position } from 'reactflow';
import { Card } from '@/components/ui/card';

export interface BaseNodeProps {
  data: {
    title: string;
    details: string[];
  };
  isSource?: boolean;
  isTarget?: boolean;
}

export function BaseNode({ data, isSource = true, isTarget = true }: BaseNodeProps) {
  return (
    <Card className="p-4 min-w-[200px] bg-background border-2">
      {isTarget && (
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 bg-primary"
        />
      )}
      
      <div className="text-center mb-2">
        <h3 className="font-semibold text-primary">{data.title}</h3>
      </div>
      
      <ul className="text-sm space-y-1">
        {data.details.map((detail, index) => (
          <li key={index} className="text-muted-foreground">
            • {detail}
          </li>
        ))}
      </ul>

      {isSource && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 bg-primary"
        />
      )}
    </Card>
  );
} 