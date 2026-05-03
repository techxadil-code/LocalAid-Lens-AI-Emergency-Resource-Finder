"use client";

import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UploadResult {
  success: boolean;
  request: Record<string, unknown>;
  verificationFlags: string[];
  urgencyScore: number;
}

export function useEmergencyUpload() {
  const queryClient = useQueryClient();
  const [progress, setProgress] = useState(0);

  const mutation = useMutation<UploadResult, Error, FormData>({
    mutationFn: async (formData: FormData) => {
      setProgress(20);

      const res = await fetch("/api/extract", {
        method: "POST",
        body: formData,
      });

      setProgress(80);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await res.json();
      setProgress(100);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emergency-requests"] });
      setTimeout(() => setProgress(0), 1000);
    },
    onError: () => {
      setProgress(0);
    },
  });

  const uploadImage = useCallback(
    (file: File, userId?: string) => {
      const formData = new FormData();
      formData.append("file", file);
      if (userId) formData.append("userId", userId);
      mutation.mutate(formData);
    },
    [mutation]
  );

  const uploadText = useCallback(
    (text: string, userId?: string) => {
      const formData = new FormData();
      formData.append("text", text);
      if (userId) formData.append("userId", userId);
      mutation.mutate(formData);
    },
    [mutation]
  );

  return {
    uploadImage,
    uploadText,
    isUploading: mutation.isPending,
    progress,
    result: mutation.data,
    error: mutation.error,
    reset: mutation.reset,
  };
}
