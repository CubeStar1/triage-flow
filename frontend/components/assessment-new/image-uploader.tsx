"use client";

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, Image as ImageIcon, XCircle, CheckCircle } from 'lucide-react'; // Colorful icons
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  imageFile: File | null;
  onImageChange: (file: File | null) => void;
}

export function ImageUploader({ imageFile, onImageChange }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.type.startsWith("image/")) {
        onImageChange(file);
        setPreview(URL.createObjectURL(file));
      } else {
        // Handle non-image file type error (e.g., with a toast notification)
        console.error("Invalid file type. Please upload an image.");
        onImageChange(null); // Clear any previously selected valid image
        setPreview(null);
      }
    }
  }, [onImageChange]);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: { 'image/*': [] }, // Accept all image types
    multiple: false,
  });

  const handleRemoveImage = () => {
    onImageChange(null);
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
  };

  return (
    <div className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-slate-50 via-white to-purple-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-purple-900/10 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="flex items-center mb-2">
          <ImageIcon className="h-6 w-6 mr-3 text-purple-500" />
          <h2 className="text-xl font-bold bg-gradient-to-r from-slate-700 to-purple-700 bg-clip-text text-transparent dark:from-slate-200 dark:to-purple-300">Upload an Image </h2>
        </div>
        <p className="text-slate-600 dark:text-slate-300 text-sm">Add relevant photos of visible symptoms or medical documents.</p>
      </div>
      <div className="p-6">
        {preview && imageFile ? (
          <div className="mb-4 group relative">
            <Image
              src={preview}
              alt="Image preview"
              width={400}
              height={300}
              onLoad={() => URL.revokeObjectURL(preview)} // Clean up object URL after image loads
              className="rounded-lg object-contain max-h-[300px] w-auto mx-auto border border-slate-200/50 dark:border-slate-700/50 shadow-md"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500/80 hover:bg-red-600/90 backdrop-blur-sm rounded-full h-8 w-8"
              onClick={handleRemoveImage}
              title="Remove image"
            >
              <XCircle size={20} />
            </Button>
            <div className="mt-2 text-center text-xs text-muted-foreground">
              {imageFile.name} ({(imageFile.size / 1024).toFixed(1)} KB)
              <CheckCircle className="h-4 w-4 inline-block ml-1 text-emerald-500" />
            </div>
          </div>
        ) : (
          <div
            {...getRootProps()}
            className={cn(
              "flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200 ease-in-out",
              "border-slate-200/70 dark:border-slate-700/70 hover:border-purple-400",
              isDragActive && "border-purple-500 bg-purple-500/5",
              isDragAccept && "border-emerald-500 bg-emerald-500/5",
              isDragReject && "border-rose-500 bg-rose-500/5"
            )}
          >
            <input {...getInputProps()} />
            <UploadCloud className={`h-12 w-12 mb-3 ${isDragActive ? 'text-purple-500' : 'text-slate-400'}`} />
            {isDragActive ? (
              <p className="text-purple-600 font-semibold">Drop the image here ...</p>
            ) : (
              <p className="text-slate-600 dark:text-slate-300 text-center">
                Drag & drop an image here, or <span className="font-semibold text-purple-500">click to select</span>
              </p>
            )}
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">PNG, JPG, GIF up to 5MB</p>
          </div>
        )}
      </div>
    </div>
  );
}
