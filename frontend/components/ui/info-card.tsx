import React from 'react';
import { cn } from '@/lib/utils';

interface InfoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  icon?: React.ReactNode;
  titleClassName?: string;
  contentClassName?: string;
  headerClassName?: string;
  children: React.ReactNode;
  noHeaderPadding?: boolean;
  noContentPadding?: boolean;
}

export function InfoCard({
  title,
  icon,
  titleClassName,
  children,
  className,
  contentClassName,
  headerClassName,
  noHeaderPadding = false,
  noContentPadding = false,
  ...props
}: InfoCardProps) {
  return (
    <div 
      className={cn(
        "bg-card rounded-lg border border-border/70 shadow-md dark:shadow-lg dark:border-border/50",
        className
      )} 
      {...props}
    >
      {title && (
        <div className={cn(
          "flex items-center border-b border-border/70 dark:border-border/50",
          !noHeaderPadding && "p-3 md:p-4",
          headerClassName
        )}>
          {icon && <div className="mr-3 flex-shrink-0">{icon}</div>}
          <h3 className={cn("text-base font-semibold text-foreground dark:text-foreground-dark", titleClassName)}>{title}</h3>
        </div>
      )}
      <div className={cn(!noContentPadding && "p-3 md:p-4", contentClassName)}>
        {children}
      </div>
    </div>
  );
} 