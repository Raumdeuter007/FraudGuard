import { useState, useCallback } from "react";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const ACCEPTED_MIME = ["application/pdf", "image/jpeg", "image/png"];

interface UseUploadReturn {
  file: File | null;
  isDragging: boolean;
  error: string | null;
  handleFileSelect: (file: File) => void;
  handleDragEnter: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleSubmit: () => void;
}

export default function useUpload(): UseUploadReturn {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (f: File): string | null => {
    if (!ACCEPTED_MIME.includes(f.type))
      return "Unsupported file type. Use PDF, JPG, or PNG.";
    if (f.size > MAX_FILE_SIZE_BYTES) return "File exceeds 10MB limit.";
    return null;
  };

  const handleFileSelect = useCallback((f: File) => {
    const err = validateFile(f);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setFile(f);
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const dropped = e.dataTransfer.files?.[0];
      if (dropped) handleFileSelect(dropped);
    },
    [handleFileSelect],
  );

  const handleSubmit = useCallback(() => {
    if (!file) return;
    console.log("Submitting:", { file, mode: "tampering" });
  }, [file]);

  return {
    file,
    isDragging,
    error,
    handleFileSelect,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleSubmit,
  };
}
