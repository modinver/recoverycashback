import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Image, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ImageUploaderProps {
  value?: string | null;
  onChange: (value: string) => void;
  label?: string;
  description?: string;
  className?: string;
}

export function ImageUploader({
  value,
  onChange,
  label = "Image",
  description,
  className,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to upload image');
      }

      const data = await response.json();
      onChange(data.url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error(error instanceof Error ? error.message : "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    onChange('');
    toast.success("Image removed");
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-2">
        {label && <Label>{label}</Label>}
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "relative flex h-40 w-40 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed",
              value ? "border-muted" : "border-muted-foreground/25"
            )}
          >
            {value ? (
              <img
                src={value}
                alt={label}
                className="h-full w-full rounded-lg object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Image className="h-8 w-8 text-muted-foreground/50" />
                <span className="text-sm text-muted-foreground">No image</span>
              </div>
            )}
            <Input
              type="file"
              accept="image/*"
              className="absolute inset-0 cursor-pointer opacity-0"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              className="gap-2"
              onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
              disabled={isUploading}
            >
              <Upload className="h-4 w-4" />
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
            {value && (
              <Button
                type="button"
                variant="ghost"
                className="gap-2 text-destructive"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
                Remove
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
