'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { Upload, X, Star } from 'lucide-react';
import { UploadDropzone } from '@/lib/uploadthing';

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export function ImageUpload({ images, onChange }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImageUrls: string[] = [];
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      newImageUrls.push(url);
    });

    onChange([...images, ...newImageUrls]);
  };

  const handleRemove = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleSetMain = (index: number) => {
    if (index === 0) return;
    const updated = [...images];
    const [selected] = updated.splice(index, 1);
    updated.unshift(selected);
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-gray-300 font-bold text-xs">
          Product Photos (Main Photo + Secondary Gallery)
        </label>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#E6007E] to-[#FF4FA0] text-white font-extrabold text-xs shadow-lg hover:opacity-90 transition-all cursor-pointer"
        >
          <Upload className="w-4 h-4" /> Pick Photos
        </button>
      </div>

      {/* Styled Upload Box */}
      <div className="rounded-2xl border-2 border-dashed border-[#2B0A1F] bg-[#0A0A0A] p-4 text-center">
        <UploadDropzone
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            if (res) {
              const uploadedUrls = res.map((f: any) => f.ufsUrl || f.url);
              onChange([...images, ...uploadedUrls]);
            }
          }}
          onUploadError={() => {
            fileInputRef.current?.click();
          }}
          appearance={{
            button: 'bg-gradient-to-r from-[#E6007E] to-[#FF4FA0] text-white font-black px-6 py-3 rounded-xl shadow-xl border-none hover:opacity-90 transition-all cursor-pointer',
            container: 'border-none bg-transparent p-2',
            label: 'text-white font-bold text-xs',
            allowedContent: 'text-gray-400 text-[10px]',
          }}
          content={{
            button({ isUploading }) {
              return isUploading ? 'Uploading Photos...' : '✨ Upload Selected Photos';
            },
          }}
        />
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Thumbnail Previews List */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-3 pt-2">
          {images.map((url, idx) => (
            <div
              key={idx}
              className={`relative aspect-square rounded-xl overflow-hidden border-2 bg-[#2B0A1F] group ${
                idx === 0 ? 'border-[#E6007E]' : 'border-[#2B0A1F]'
              }`}
            >
              <Image src={url} alt={`Preview ${idx + 1}`} fill className="object-cover" />

              {idx === 0 ? (
                <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-[#E6007E] text-white text-[9px] font-black uppercase">
                  Main
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSetMain(idx)}
                  className="absolute top-1 left-1 p-1 rounded bg-black/60 text-gray-300 hover:text-amber-400 text-[9px] flex items-center gap-0.5"
                >
                  <Star className="w-3 h-3" />
                </button>
              )}

              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="absolute top-1 right-1 p-1 rounded bg-black/70 text-gray-300 hover:text-red-400 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
