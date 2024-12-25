import React from "react";
import { Input } from "@/components/ui/input";

interface UploadFileProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function UploadFile({ onFileUpload }: UploadFileProps) {
  return (
    <div className="mb-6">
      <label
        htmlFor="file-upload"
        className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm cursor-pointer bg-white hover:bg-gray-50 transition-colors duration-300"
      >
        <svg
          className="w-6 h-6 mr-2 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <span className="text-sm font-medium text-gray-600">
          Choose XLSX file
        </span>
        <Input
          id="file-upload"
          type="file"
          accept=".xlsx, .xls"
          onChange={onFileUpload}
          className="hidden"
        />
      </label>
    </div>
  );
} 