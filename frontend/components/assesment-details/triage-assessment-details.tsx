import { TriageData } from "@/app/api/triage/route";
import { AlertTriangle, CheckCircle, ShieldAlert, Info, ListChecks, UserCheck, Microscope, HelpCircle, FileText as FileTextIcon, Activity, MessageSquareText, Brain } from 'lucide-react';
import { PossibleDiagnosisItem } from "@/components/assesment-details/possible-diagnosis-item";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { InfoCard } from "@/components/ui/info-card";

interface TriageAssessmentDetailsProps {
  triageData: TriageData;
}

const recommendationStatusConfig = {
  mild: {
    icon: <UserCheck className="h-6 w-6 text-green-500 dark:text-green-400" />,
    cardClassName: "bg-green-500/5 border-green-500/30 dark:bg-green-700/10 dark:border-green-600/40",
    titleClassName: "text-green-700 dark:text-green-400",
    badgeTextColor: "text-green-700 dark:text-green-400",
    badgeBorderColor: "border-green-500/50 dark:border-green-600/50",
    title: "Recommendation: Mild Concern"
  },
  moderate: {
    icon: <Info className="h-6 w-6 text-blue-500 dark:text-blue-400" />,
    cardClassName: "bg-blue-500/5 border-blue-500/30 dark:bg-blue-700/10 dark:border-blue-600/40",
    titleClassName: "text-blue-700 dark:text-blue-400",
    badgeTextColor: "text-blue-700 dark:text-blue-400",
    badgeBorderColor: "border-blue-500/50 dark:border-blue-600/50",
    title: "Recommendation: Follow Up Advised"
  },
  severe: {
    icon: <AlertTriangle className="h-6 w-6 text-amber-500 dark:text-amber-400" />,
    cardClassName: "bg-amber-500/5 border-amber-500/30 dark:bg-amber-700/10 dark:border-amber-600/40",
    titleClassName: "text-amber-700 dark:text-amber-400",
    badgeTextColor: "text-amber-700 dark:text-amber-400",
    badgeBorderColor: "border-amber-500/50 dark:border-amber-600/50",
    title: "Recommendation: Medical Attention Advised"
  },
  critical: {
    icon: <ShieldAlert className="h-6 w-6 text-red-500 dark:text-red-400" />,
    cardClassName: "bg-red-500/5 border-red-500/30 dark:bg-red-700/10 dark:border-red-600/40",
    titleClassName: "text-red-700 dark:text-red-400",
    badgeTextColor: "text-red-700 dark:text-red-400",
    badgeBorderColor: "border-red-500/50 dark:border-red-600/50",
    title: "Recommendation: Urgent Care Required"
  },
};

export function TriageAssessmentDetails({ triageData }: TriageAssessmentDetailsProps) {
  const outcome = triageData.triageOutcome;
  const statusCfg = recommendationStatusConfig[outcome.recommendationStatus] || recommendationStatusConfig.moderate;

  return (
    <ScrollArea className="h-[calc(100vh-15rem)]">
      <div className="space-y-4 ">
        
        <InfoCard 
          title="Identified Concern" 
          icon={<Microscope size={18} />}
        >
          <h4 className="font-semibold text-md mb-1 text-foreground dark:text-slate-100">{outcome.injuryType}</h4>
          <p className="text-sm text-muted-foreground dark:text-slate-300 leading-relaxed">{outcome.description}</p>
        </InfoCard>

        <InfoCard 
          title={statusCfg.title}
          icon={statusCfg.icon} 
          titleClassName={statusCfg.titleClassName}
          className={statusCfg.cardClassName}
        >
          <p className={`text-sm ${statusCfg.titleClassName} font-medium mb-1.5`}>
            Severity Score: {outcome.severityScore}/5 
            <Badge 
              variant="outline" 
              className={`ml-2 ${statusCfg.badgeTextColor} ${statusCfg.badgeBorderColor} bg-transparent px-2 py-0.5 text-xs`}
            >
              {outcome.recommendationStatus.toUpperCase()}
            </Badge>
          </p>
          <p className="text-sm text-muted-foreground dark:text-slate-300 mb-1"><strong>Reason:</strong> {outcome.severityReason}</p>
          <p className="text-sm text-foreground dark:text-slate-200 font-medium leading-relaxed"><strong>Next Steps:</strong></p>
          <p className="text-sm text-muted-foreground dark:text-slate-300 leading-relaxed">{outcome.triageRecommendation}</p>
        </InfoCard>

        {triageData.symptomsText && (
          <InfoCard 
            title="Symptoms Provided by Patient" 
            icon={<MessageSquareText size={18} />}
          >
            <p className="text-sm text-muted-foreground dark:text-slate-300 italic leading-relaxed">
              &ldquo;{triageData.symptomsText}&rdquo;
            </p>
          </InfoCard>
        )}

        {outcome.topPossibleDiagnoses && outcome.topPossibleDiagnoses.length > 0 && (
          <InfoCard 
            title="Possible Conditions" 
            icon={<Brain size={18} />}
            noContentPadding
            contentClassName="divide-y divide-border/70 dark:divide-border/50"
          >
            {outcome.topPossibleDiagnoses.map((diag, index) => (
              <PossibleDiagnosisItem key={index} diagnosis={diag} index={index} />
            ))}
          </InfoCard>
        )}
      </div>
    </ScrollArea>
  );
} 