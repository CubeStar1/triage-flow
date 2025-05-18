'use client';

import * as React from 'react';
import { 
  User2, 
  Activity, 
  Clock, 
  Thermometer, 
  Pill, 
  AlertCircle, 
  Plane, 
  MessageSquareText,
  Heart
} from 'lucide-react';
import { TriageData } from '@/lib/fetchers/assessment';
import { cn } from '@/lib/utils';

interface PatientInfoCardProps {
  triageData: TriageData;
}

interface InfoSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  accentColor?: string;
}

const InfoSection: React.FC<InfoSectionProps> = ({ 
  title, 
  icon, 
  children, 
  className, 
  accentColor = 'bg-blue-500/10' 
}) => (
  <div className={cn(
    'rounded-lg border bg-card p-4',
    'relative overflow-hidden',
    className
  )}>
    <div className={cn(
      'absolute top-0 left-0 w-full h-1',
      accentColor
    )} />
    
    <div className='flex items-center gap-2 mb-3'>
      <div className={cn(
        'p-1.5 rounded-md',
        accentColor
      )}>
        {icon}
      </div>
      <h3 className='font-semibold text-card-foreground'>{title}</h3>
    </div>
    {children}
  </div>
);

export const PatientInfoCard: React.FC<PatientInfoCardProps> = ({ triageData }) => {
  return (
    <div className='space-y-6'>
      {/* Top row: Patient Details, Vital Signs, Duration & Location */}
      <div className='grid gap-4 md:grid-cols-3'>
        <InfoSection 
          title='Patient Details' 
          icon={<User2 className='h-4 w-4' />}
          accentColor='bg-purple-500/10'
        >
          <dl className='space-y-1'>
            {triageData.patientName && (
              <div className='flex justify-between'>
                <dt className='text-sm text-muted-foreground'>Name:</dt>
                <dd className='text-sm font-medium'>{triageData.patientName}</dd>
              </div>
            )}
            {triageData.patientAge && (
              <div className='flex justify-between'>
                <dt className='text-sm text-muted-foreground'>Age:</dt>
                <dd className='text-sm font-medium'>{triageData.patientAge} years</dd>
              </div>
            )}
            {triageData.patientSex && (
              <div className='flex justify-between'>
                <dt className='text-sm text-muted-foreground'>Sex:</dt>
                <dd className='text-sm font-medium'>{triageData.patientSex}</dd>
              </div>
            )}
          </dl>
        </InfoSection>

        <InfoSection 
          title='Vital Signs' 
          icon={<Activity className='h-4 w-4' />}
          accentColor='bg-rose-500/10'
        >
          <dl className='space-y-1'>
            {triageData.hasFever && (
              <div className='flex items-start justify-between'>
                <dt className='flex items-center gap-1 text-sm text-muted-foreground'>
                  <Thermometer className='h-3 w-3' />
                  Fever:
                </dt>
                <dd className='text-sm font-medium'>
                  {triageData.temperatureCelsius ? 
                    `${triageData.temperatureCelsius}°C` : 
                    'Yes'
                  }
                </dd>
              </div>
            )}
            {triageData.painLevel && (
              <div className='flex items-start justify-between'>
                <dt className='flex items-center gap-1 text-sm text-muted-foreground'>
                  <Heart className='h-3 w-3' />
                  Pain Level:
                </dt>
                <dd className='text-sm font-medium'>{triageData.painLevel}</dd>
              </div>
            )}
          </dl>
        </InfoSection>

        <InfoSection 
          title='Duration & Location' 
          icon={<Clock className='h-4 w-4' />}
          accentColor='bg-amber-500/10'
        >
          <dl className='space-y-1'>
            {triageData.symptomDuration && (
              <div className='flex justify-between'>
                <dt className='text-sm text-muted-foreground'>Duration:</dt>
                <dd className='text-sm font-medium'>{triageData.symptomDuration}</dd>
              </div>
            )}
            {triageData.affectedBodyParts && (
              <div className='flex justify-between'>
                <dt className='text-sm text-muted-foreground'>Affected Areas:</dt>
                <dd className='text-sm font-medium'>{triageData.affectedBodyParts}</dd>
              </div>
            )}
          </dl>
        </InfoSection>
      </div>

      {/* Symptoms Description */}
      {triageData.symptomDescription && (
        <InfoSection 
          title='Symptoms Description' 
          icon={<MessageSquareText className='h-4 w-4' />}
          accentColor='bg-blue-500/10'
          className='relative'
        >
          <blockquote className='text-sm italic text-muted-foreground pl-4 border-l-2 border-blue-500/30'>
            '{triageData.symptomDescription}'
          </blockquote>
        </InfoSection>
      )}

      {/* Bottom row: Medical Status and History */}
      <div className='grid gap-4 md:grid-cols-2'>
        {(triageData.knownAllergies || triageData.currentMedications) && (
          <InfoSection 
            title='Current Medical Status' 
            icon={<Pill className='h-4 w-4' />}
            accentColor='bg-emerald-500/10'
          >
            <dl className='space-y-2'>
              {triageData.knownAllergies && (
                <div className='space-y-1'>
                  <dt className='text-sm font-medium text-muted-foreground'>Allergies:</dt>
                  <dd className='text-sm bg-emerald-500/5 p-2 rounded-md'>{triageData.knownAllergies}</dd>
                </div>
              )}
              {triageData.currentMedications && (
                <div className='space-y-1'>
                  <dt className='text-sm font-medium text-muted-foreground'>Current Medications:</dt>
                  <dd className='text-sm bg-emerald-500/5 p-2 rounded-md'>{triageData.currentMedications}</dd>
                </div>
              )}
            </dl>
          </InfoSection>
        )}

        {(triageData.preExistingConditions || triageData.recentTravel) && (
          <InfoSection 
            title='Medical History' 
            icon={<AlertCircle className='h-4 w-4' />}
            accentColor='bg-indigo-500/10'
          >
            <dl className='space-y-2'>
              {triageData.preExistingConditions && (
                <div className='space-y-1'>
                  <dt className='text-sm font-medium text-muted-foreground'>Pre-existing Conditions:</dt>
                  <dd className='text-sm bg-indigo-500/5 p-2 rounded-md'>{triageData.preExistingConditions}</dd>
                </div>
              )}
              {triageData.recentTravel && (
                <div className='flex items-center gap-2 text-sm'>
                  <Plane className='h-4 w-4 text-muted-foreground' />
                  <span>Recent Travel: {triageData.recentTravel === 'yes' ? 'Yes' : 'No'}</span>
                </div>
              )}
            </dl>
          </InfoSection>
        )}
      </div>
    </div>
  );
};
