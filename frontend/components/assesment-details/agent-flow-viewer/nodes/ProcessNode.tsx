import React from 'react';
import { Handle, Position } from 'reactflow';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { 
  Upload,
  Image as ImageIcon,
  Brain,
  Network,
  Search,
  FileText,
  BarChart,
  Stethoscope,
  FileCheck,
  Loader2
} from 'lucide-react';

interface ProcessNodeProps {
  data: {
    label: string;
    status: 'waiting' | 'processing' | 'completed';
    type: 'upload' | 'preprocessing' | 'classification' | 'embedding' | 
          'agent1-query' | 'agent1-summarize' | 'agent2-analyze' | 
          'agent2-diagnose' | 'final';
  };
  isConnectable?: boolean;
}

const iconMap = {
  'upload': Upload,
  'preprocessing': ImageIcon,
  'classification': Brain,
  'embedding': Network,
  'agent1-query': Search,
  'agent1-summarize': FileText,
  'agent2-analyze': BarChart,
  'agent2-diagnose': Stethoscope,
  'final': FileCheck,
};

// Vibrant color scheme for different node types
const colorMap = {
  'upload': {
    base: 'bg-blue-100 dark:bg-blue-900/20',
    processing: 'bg-blue-200 border-blue-400 shadow-blue-400/20',
    completed: 'bg-blue-200 border-blue-400 shadow-blue-400/10',
    icon: 'text-blue-600 dark:text-blue-400',
  },
  'preprocessing': {
    base: 'bg-purple-100 dark:bg-purple-900/20',
    processing: 'bg-purple-200 border-purple-400 shadow-purple-400/20',
    completed: 'bg-purple-200 border-purple-400 shadow-purple-400/10',
    icon: 'text-purple-600 dark:text-purple-400',
  },
  'classification': {
    base: 'bg-green-100 dark:bg-green-900/20',
    processing: 'bg-green-200 border-green-400 shadow-green-400/20',
    completed: 'bg-green-200 border-green-400 shadow-green-400/10',
    icon: 'text-green-600 dark:text-green-400',
  },
  'embedding': {
    base: 'bg-yellow-100 dark:bg-yellow-900/20',
    processing: 'bg-yellow-200 border-yellow-400 shadow-yellow-400/20',
    completed: 'bg-yellow-200 border-yellow-400 shadow-yellow-400/10',
    icon: 'text-yellow-600 dark:text-yellow-400',
  },
  'agent1-query': {
    base: 'bg-pink-100 dark:bg-pink-900/20',
    processing: 'bg-pink-200 border-pink-400 shadow-pink-400/20',
    completed: 'bg-pink-200 border-pink-400 shadow-pink-400/10',
    icon: 'text-pink-600 dark:text-pink-400',
  },
  'agent1-summarize': {
    base: 'bg-orange-100 dark:bg-orange-900/20',
    processing: 'bg-orange-200 border-orange-400 shadow-orange-400/20',
    completed: 'bg-orange-200 border-orange-400 shadow-orange-400/10',
    icon: 'text-orange-600 dark:text-orange-400',
  },
  'agent2-analyze': {
    base: 'bg-teal-100 dark:bg-teal-900/20',
    processing: 'bg-teal-200 border-teal-400 shadow-teal-400/20',
    completed: 'bg-teal-200 border-teal-400 shadow-teal-400/10',
    icon: 'text-teal-600 dark:text-teal-400',
  },
  'agent2-diagnose': {
    base: 'bg-indigo-100 dark:bg-indigo-900/20',
    processing: 'bg-indigo-200 border-indigo-400 shadow-indigo-400/20',
    completed: 'bg-indigo-200 border-indigo-400 shadow-indigo-400/10',
    icon: 'text-indigo-600 dark:text-indigo-400',
  },
  'final': {
    base: 'bg-rose-100 dark:bg-rose-900/20',
    processing: 'bg-rose-200 border-rose-400 shadow-rose-400/20',
    completed: 'bg-rose-200 border-rose-400 shadow-rose-400/10',
    icon: 'text-rose-600 dark:text-rose-400',
  },
};

export function ProcessNode({ data, isConnectable }: ProcessNodeProps) {
  const Icon = iconMap[data.type];
  const colors = colorMap[data.type];

  return (
    <Card 
      className={cn(
        "px-4 py-3 min-w-[280px] transition-all duration-300 shadow-lg border-2",
        data.status === 'waiting' && colors.base,
        data.status === 'processing' && colors.processing,
        data.status === 'completed' && colors.completed
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className={cn(
          "w-3 h-3 -top-1.5 !bg-current transition-colors duration-300",
          data.status === 'processing' && "animate-pulse"
        )}
        isConnectable={isConnectable}
      />

      <div className="flex items-center gap-3">
        <div className={cn(
          "p-2 rounded-full",
          data.status === 'waiting' && "bg-white/50 dark:bg-white/10",
          data.status === 'processing' && "bg-white/80 dark:bg-white/20",
          data.status === 'completed' && "bg-white/90"
        )}>
          <Icon className={cn(
            "h-5 w-5",
            colors.icon
          )} />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium">{data.label}</span>
          {data.status === 'processing' && (
            <span className="text-xs opacity-75">Processing...</span>
          )}
        </div>
        {data.status === 'processing' && (
          <Loader2 className="h-4 w-4 animate-spin ml-auto" />
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className={cn(
          "w-3 h-3 -bottom-1.5 !bg-current transition-colors duration-300",
          data.status === 'processing' && "animate-pulse"
        )}
        isConnectable={isConnectable}
      />
    </Card>
  );
} 