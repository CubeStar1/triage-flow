import Image from 'next/image';
import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger, DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { XIcon, ZoomInIcon, ZoomOutIcon, ExpandIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PatientImageViewerProps {
  imageUrl: string;
  altText?: string;
  caption?: string;
}

export function PatientImageViewer({ imageUrl, altText = "Patient image", caption }: PatientImageViewerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div
      className={cn(
        "rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300",
        "bg-muted/30 dark:bg-slate-800/20 border border-border/50 dark:border-slate-700/50"
      )}
    >
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <div
            className={cn(
              "relative w-full h-auto aspect-[4/3] group cursor-pointer",
              "p-1.5"
            )}
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={altText}
                layout="fill"
                objectFit="contain"
                className="rounded-sm"
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-slate-500 dark:text-slate-400">Loading patient image...</p>
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all duration-300 opacity-0 group-hover:opacity-100">
              <ExpandIcon className="h-12 w-12 text-white/80" />
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className='w-full p-4'>
          {imageUrl ? (
            <div className="relative w-full aspect-[4/3]">
              <Image
                src={imageUrl}
                alt={altText}
                layout="fill"
                objectFit="contain"
                className="border rounded-xl"
              />
            </div>
          ) : (
            <p className="text-center p-10 text-muted-foreground">Image not available.</p>
          )}
          <DialogFooter className="mt-2 sm:mt-4">
              <DialogClose asChild>
                  <Button variant="outline" size="sm"> <XIcon className="mr-2 h-4 w-4"/> Close</Button>
              </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {caption && (
        <div className="px-4 py-3 border-t border-border/50 dark:border-slate-700/50">
          <p className="text-xs text-muted-foreground text-center">
            {caption}
          </p>
        </div>
      )}
    </div>
  );
} 