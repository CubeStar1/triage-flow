"use client";

import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";

interface ViewToggleProps {
  currentView: 'card' | 'table';
  onViewChange: (view: 'card' | 'table') => void;
}

export function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <Button 
        variant={currentView === 'card' ? "secondary" : "ghost"}
        size="sm"
        onClick={() => onViewChange('card')}
        aria-pressed={currentView === 'card'}
        className="px-3 py-2 h-auto data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
      >
        <LayoutGrid className="h-4 w-4 mr-2" />
        Card View
      </Button>
      <Button 
        variant={currentView === 'table' ? "secondary" : "ghost"}
        size="sm"
        onClick={() => onViewChange('table')}
        aria-pressed={currentView === 'table'}
        className="px-3 py-2 h-auto data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
      >
        <List className="h-4 w-4 mr-2" />
        Table View
      </Button>
    </div>
  );
} 