"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function AssessmentTableSkeleton() {
  return (
    <div className="space-y-6">
       {/* Mimic header structure from AssessmentHistoryPage for the toggle space */}
      <div className="flex items-center justify-between pb-4 border-b">
        <Skeleton className="h-8 w-1/3" /> 
        <div className="flex gap-2">
            <Skeleton className="h-10 w-24" /> 
            <Skeleton className="h-10 w-24" />
        </div>
      </div>
        
      <Table className="bg-card shadow-md rounded-lg">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]"><Skeleton className="h-5 w-full" /></TableHead>
            <TableHead><Skeleton className="h-5 w-full" /></TableHead>
            <TableHead className="hidden md:table-cell"><Skeleton className="h-5 w-full" /></TableHead>
            <TableHead className="text-center w-[150px]"><Skeleton className="h-5 w-full" /></TableHead>
            <TableHead className="text-center hidden lg:table-cell w-[100px]"><Skeleton className="h-5 w-full" /></TableHead>
            <TableHead className="hidden sm:table-cell w-[120px]"><Skeleton className="h-5 w-full" /></TableHead>
            <TableHead className="hidden lg:table-cell w-[120px]"><Skeleton className="h-5 w-full" /></TableHead>
            <TableHead className="text-right w-[100px]"><Skeleton className="h-5 w-full" /></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-5 w-full" /></TableCell>
              <TableCell><Skeleton className="h-5 w-full" /></TableCell>
              <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-full" /></TableCell>
              <TableCell><Skeleton className="h-5 w-full" /></TableCell>
              <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-full" /></TableCell>
              <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-full" /></TableCell>
              <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-full" /></TableCell>
              <TableCell><Skeleton className="h-8 w-[70px] ml-auto" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 