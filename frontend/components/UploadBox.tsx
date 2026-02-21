"use client";

import { motion } from "framer-motion";
import { Upload, FileText } from "lucide-react";
import { useRef, useState } from "react";

interface UploadBoxProps {
  onFileUpload: (file: File) => void;
  loading?: boolean;
}

export default function UploadBox({ onFileUpload, loading = false }: UploadBoxProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isDrag, setIsDrag] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDrag(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDrag(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === "application/pdf" || file.type.includes("word")) {
        setFileName(file.name);
        onFileUpload(file);
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFileName(file.name);
      onFileUpload(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <div
        className={`relative glassmorphism border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
          isDrag
            ? "border-blue-400 bg-blue-500/10"
            : "border-white/30 hover:border-blue-400/50"
        } ${loading ? "opacity-50 pointer-events-none" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !loading && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileInput}
          className="hidden"
          disabled={loading}
          aria-label="Upload resume file"
          title="Upload resume file"
        />

        <motion.div
          animate={loading ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
          className="mb-4 flex justify-center"
        >
          {fileName ? (
            <FileText className="w-16 h-16 text-blue-400" />
          ) : (
            <Upload className="w-16 h-16 text-gray-400" />
          )}
        </motion.div>

        <p className="text-lg font-semibold text-white mb-2">
          {fileName || "Drop your resume here"}
        </p>
        <p className="text-gray-400 text-sm mb-4">
          {fileName ? "Click to change file" : "or click to browse"}
        </p>
        <p className="text-gray-500 text-xs">
          Supported formats: PDF, DOC, DOCX (Max 10MB)
        </p>

        {loading && (
          <div className="mt-4 flex justify-center">
            <div className="w-8 h-8 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
          </div>
        )}
      </div>
    </motion.div>
  );
}
