import { PossibleDiagnosis } from "@/app/api/triage/route";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, HelpCircle, Percent } from 'lucide-react';
import { cn } from "@/lib/utils";

interface PossibleDiagnosisItemProps {
  diagnosis: PossibleDiagnosis;
  index: number;
}

export function PossibleDiagnosisItem({ diagnosis, index }: PossibleDiagnosisItemProps) {
  let statusColor = "text-slate-500 dark:text-slate-400"; 
  let IconComponent = Percent; 

  if (diagnosis.confidence !== undefined) {
    if (diagnosis.confidence >= 0.75) {
      statusColor = "text-green-500 dark:text-green-300"; 
    } else if (diagnosis.confidence >= 0.4) {
      statusColor = "text-amber-500 dark:text-amber-300"; 
    } else {
      statusColor = "text-red-500 dark:text-red-400";    
    }
  }

  return (
    <div className={cn("p-3 md:p-4")}> 
      <div className="flex items-start justify-between gap-3">
        <div className="flex-grow min-w-0"> 
          <div className="flex items-baseline mb-1">
            <span className="mr-2 text-sm font-medium text-slate-500 dark:text-slate-500 select-none">{index + 1}.</span>
            <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-100">
              {diagnosis.name}
            </h4>
          </div>
          {diagnosis.description && (
            <p className="pl-[calc(0.5rem_+_1ch)] text-xs text-slate-600 dark:text-slate-400 leading-normal">
              {diagnosis.description}
            </p>
          )}
        </div>
        
        {diagnosis.confidence !== undefined && (
          <div className="flex-shrink-0 whitespace-nowrap pt-0.5"> 
            <Badge 
              variant="outline"
              className={cn(
                "text-xs px-1.5 py-0.5 font-medium border-transparent", 
                "bg-slate-100 dark:bg-slate-700", 
                statusColor 
              )}
            >
              <IconComponent size={13} className="mr-1" /> 
              {(diagnosis.confidence * 100).toFixed(0)}%
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
} 