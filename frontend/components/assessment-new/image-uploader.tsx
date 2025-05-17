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
    <div className="p-6 bg-card border border-border/70 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center mb-4">
        <ImageIcon className="h-7 w-7 mr-3 text-purple-500" />
        <h2 className="text-xl font-semibold text-card-foreground">Upload an Image (Optional)</h2>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">
        If you have a visual symptom (e.g., rash, wound, swelling), please upload an image.
      </p>

      {preview && imageFile ? (
        <div className="mb-4 group relative">
          <Image
            src={preview}
            alt="Image preview"
            width={400}
            height={300}
            onLoad={() => URL.revokeObjectURL(preview)} // Clean up object URL after image loads
            className="rounded-lg object-contain max-h-[300px] w-auto mx-auto border border-border shadow-md"
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
            <CheckCircle className="h-4 w-4 inline-block ml-1 text-green-500" />
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            "flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200 ease-in-out",
            "border-border/80 hover:border-purple-400",
            isDragActive && "border-purple-500 bg-purple-500/10",
            isDragAccept && "border-green-500 bg-green-500/10",
            isDragReject && "border-red-500 bg-red-500/10"
          )}
        >
          <input {...getInputProps()} />
          <UploadCloud className={`h-12 w-12 mb-3 ${isDragActive ? 'text-purple-600' : 'text-muted-foreground/70'}`} />
          {isDragActive ? (
            <p className="text-purple-600 font-semibold">Drop the image here ...</p>
          ) : (
            <p className="text-muted-foreground text-center">
              Drag & drop an image here, or <span className="font-semibold text-purple-500">click to select</span>
            </p>
          )}
          <p className="mt-2 text-xs text-muted-foreground">PNG, JPG, GIF up to 5MB</p>
        </div>
      )}
    </div>
  );
}
