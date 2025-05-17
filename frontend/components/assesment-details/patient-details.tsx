import { ScrollArea } from "@/components/ui/scroll-area";
import { InfoCard } from "@/components/ui/info-card";
import { UserCircle, Cake, Weight, Ruler, Mail, Phone } from 'lucide-react';

// Placeholder data - in a real app, this would come from props or state
const mockPatient = {
  name: "Lily Bennett",
  dob: "October 23, 1988",
  age: 36,
  gender: "Female",
  weight: "68 kg",
  height: "165 cm",
  contact: {
    email: "lily.bennett@example.com",
    phone: "(555) 123-4567",
  },
  primaryConcern: "Deep cut on forearm",
  visitDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
};

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

const DetailItem = ({ icon, label, value }: DetailItemProps) => (
  <div className="flex items-center py-3 border-b border-border/30 last:border-b-0">
    <div className="mr-4 text-primary flex-shrink-0 w-5 h-5 flex items-center justify-center">{icon}</div>
    <span className="text-sm font-medium text-muted-foreground w-20 md:w-24 flex-shrink-0">{label}:</span>
    <span className="text-sm text-foreground dark:text-slate-200 truncate">{value}</span>
  </div>
);

export function PatientDetails() {
  // In a real app, you'd fetch or receive patient data
  const patient = mockPatient;

  return (
    <ScrollArea className="h-[calc(100vh-19rem)]">
        <InfoCard 
          title="Patient Information" 
          icon={<UserCircle size={20} className="text-primary"/>}
          className="border-t-4 border-t-primary/80 dark:border-t-primary/70"
        >
          <div className="space-y-0">
            <DetailItem icon={<UserCircle size={16} />} label="Name" value={patient.name} />
            <DetailItem icon={<Cake size={16} />} label="Born" value={`${patient.dob} (Age ${patient.age})`} />
            <DetailItem icon={<Weight size={16} />} label="Weight" value={patient.weight} />
            <DetailItem icon={<Ruler size={16} />} label="Height" value={patient.height} />
            <DetailItem icon={<Mail size={16} />} label="Email" value={patient.contact.email} />
            <DetailItem icon={<Phone size={16} />} label="Phone" value={patient.contact.phone} />
          </div>
          <div className="mt-4 pt-4 border-t border-border/50">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Primary concern for today's visit ({patient.visitDate}):
            </p>
            <p className="text-md font-semibold text-primary dark:text-primary-light mt-0.5">
              {patient.primaryConcern}
            </p>
          </div>
        </InfoCard>
    </ScrollArea>
  );
}