import { ScrollArea } from "@/components/ui/scroll-area";
import { InfoCard } from "@/components/ui/info-card";
import { UserCircle, Cake, Thermometer, Activity } from 'lucide-react';
import type { TriageData } from '@/lib/fetchers/assessment';
import * as React from 'react';

interface PatientDetailsProps {
  triageData: TriageData;
}

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number | undefined;
}

const DetailItem = ({ icon, label, value }: DetailItemProps) => {
  if (!value) return null;
  return (
    <div className="flex items-center py-3 border-b border-border/30 last:border-b-0">
      <div className="mr-4 text-primary flex-shrink-0 w-5 h-5 flex items-center justify-center">{icon}</div>
      <span className="text-sm font-medium text-muted-foreground w-20 md:w-24 flex-shrink-0">{label}:</span>
      <span className="text-sm text-foreground dark:text-slate-200 truncate">{value}</span>
    </div>
  );
};

export function PatientDetails({ triageData }: PatientDetailsProps) {
  return (
    <ScrollArea className="h-[calc(100vh-19rem)]">
      <InfoCard 
        title="Patient Information" 
        icon={<UserCircle size={20} className="text-primary"/>}
        className="border-t-4 border-t-primary/80 dark:border-t-primary/70"
      >
        <div className="space-y-0">
          <DetailItem 
            icon={<UserCircle size={16} />} 
            label="Name" 
            value={triageData.patientName} 
          />
          <DetailItem 
            icon={<Cake size={16} />} 
            label="Age" 
            value={triageData.patientAge ? `${triageData.patientAge} years` : undefined} 
          />
          <DetailItem 
            icon={<Activity size={16} />} 
            label="Sex" 
            value={triageData.patientSex} 
          />
          <DetailItem 
            icon={<Thermometer size={16} />} 
            label="Temperature" 
            value={triageData.temperatureCelsius ? `${triageData.temperatureCelsius}°C` : undefined} 
          />
          <DetailItem 
            icon={<Activity size={16} />} 
            label="Pain" 
            value={triageData.painLevel} 
          />
        </div>
      </InfoCard>
    </ScrollArea>
);
}