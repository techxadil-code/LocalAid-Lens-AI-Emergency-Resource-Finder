"use client";

import { useCallback, useState, useRef } from "react";
import { useEmergencyUpload } from "@/hooks/use-emergency-upload";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, ImagePlus, FileText, X, Loader2, CheckCircle2, AlertCircle, Clipboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";

export function UploadZone() {
  const { user } = useAuth();
  const { uploadImage, uploadText, isUploading, progress, result, error, reset } = useEmergencyUpload();
  const [isDragging, setIsDragging] = useState(false);
  const [mode, setMode] = useState<"image" | "text">("image");
  const [textInput, setTextInput] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find((f) => f.type.startsWith("image/"));
    if (imageFile) handleFileSelect(imageFile);
  }, []);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = Array.from(e.clipboardData.items);
    const imageItem = items.find((item) => item.type.startsWith("image/"));
    if (imageItem) {
      const file = imageItem.getAsFile();
      if (file) { setMode("image"); handleFileSelect(file); }
    }
  }, []);

  const handleSubmit = () => {
    if (mode === "image" && selectedFile) uploadImage(selectedFile, user?.uid);
    else if (mode === "text" && textInput.trim()) uploadText(textInput, user?.uid);
  };

  const handleReset = () => { setPreview(null); setSelectedFile(null); setTextInput(""); reset(); };

  if (result?.success) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-green-500/30 bg-green-500/5 p-8 text-center">
        <div className="relative space-y-4">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle2 className="size-8 text-green-500" />
          </div>
          <h3 className="text-lg font-semibold text-green-500">Emergency Request Submitted!</h3>
          <p className="text-sm text-muted-foreground">AI has processed your submission and created an action card.</p>
          {result.verificationFlags?.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-amber-500">⚠️ Verification needed:</p>
              {result.verificationFlags.map((flag: string, i: number) => (
                <p key={i} className="text-xs text-muted-foreground">• {flag}</p>
              ))}
            </div>
          )}
          <Button onClick={handleReset} variant="outline">Submit Another</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4" onPaste={handlePaste}>
      <div className="flex gap-2">
        <Button size="sm" variant={mode === "image" ? "default" : "outline"} onClick={() => setMode("image")}
          className={cn("gap-2", mode === "image" && "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/20")}>
          <ImagePlus className="size-4" /> Screenshot
        </Button>
        <Button size="sm" variant={mode === "text" ? "default" : "outline"} onClick={() => setMode("text")}
          className={cn("gap-2", mode === "text" && "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/20")}>
          <FileText className="size-4" /> Paste Text
        </Button>
      </div>

      {mode === "image" ? (
        <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
          onClick={() => !preview && fileInputRef.current?.click()}
          className={cn("relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer",
            isDragging ? "border-violet-500 bg-violet-500/5 scale-[1.02]" : preview ? "border-border bg-card" : "border-muted-foreground/20 bg-muted/30 hover:border-violet-500/50 hover:bg-violet-500/5")}>
          {preview ? (
            <div className="relative p-4">
              <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); handleReset(); }}
                className="absolute top-2 right-2 z-10 size-8 p-0 bg-background/80 backdrop-blur-sm rounded-full"><X className="size-4" /></Button>
              <img src={preview} alt="Preview" className="max-h-64 w-full object-contain rounded-xl" />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-6 gap-4">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border border-violet-500/20">
                <Upload className="size-7 text-violet-500" />
              </div>
              <p className="text-sm font-semibold">Drop your screenshot here</p>
              <p className="text-xs text-muted-foreground">or click to browse • Supports PNG, JPG, WEBP</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clipboard className="size-3.5" /><span>Paste from clipboard (Ctrl+V)</span>
              </div>
            </div>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFileSelect(file); }} />
        </div>
      ) : (
        <Textarea placeholder="Paste the emergency message text here..." value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          className="min-h-[160px] resize-none rounded-2xl border-2 border-muted-foreground/20 bg-muted/30 focus:border-violet-500/50" />
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/5 p-3 text-sm text-red-500">
          <AlertCircle className="size-4 shrink-0" />{error.message}
        </div>
      )}

      <Button onClick={handleSubmit} disabled={isUploading || (mode === "image" && !selectedFile) || (mode === "text" && !textInput.trim())}
        className="w-full h-12 text-sm font-semibold gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:from-violet-700 hover:via-indigo-700 hover:to-blue-700 text-white shadow-lg shadow-violet-500/25">
        {isUploading ? (<><Loader2 className="size-4 animate-spin" />Processing with AI... {progress > 0 && `${progress}%`}</>) : (<><Upload className="size-4" />Extract & Submit Emergency</>)}
      </Button>

      {isUploading && progress > 0 && (
        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}
