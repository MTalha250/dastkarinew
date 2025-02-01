import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import React from "react";

const CLOUDINARY_UPLOAD_PRESET = "dastkari";
const CLOUDINARY_CLOUD_NAME = "dewqsghdi";
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/raw/upload`;

export default function ModelUploader({
  modelUrl,
  onChange,
}: {
  modelUrl: string;
  onChange: (url: string) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);

  const uploadModel = async (file: File) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const res = await axios.post(CLOUDINARY_UPLOAD_URL, data, {
      withCredentials: false,
    });

    return res.data.secure_url;
  };

  const validateFile = (file: File) => {
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB max size
    const ALLOWED_TYPES = [
      "model/gltf-binary",
      "model/gltf+json",
      "application/octet-stream",
    ];

    if (file.size > MAX_FILE_SIZE) {
      throw new Error("File size should not exceed 50MB");
    }

    // Check file extension instead of mime type as 3D files might not have standard mime types
    const validExtensions = [".glb", ".gltf", ".obj", ".fbx"];
    const extension = file.name
      .toLowerCase()
      .substring(file.name.lastIndexOf("."));
    if (!validExtensions.includes(extension)) {
      throw new Error(
        "Invalid file type. Please upload a 3D model file (GLB, GLTF, OBJ, or FBX)",
      );
    }
  };

  const handleModelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      validateFile(file);
      const url = await uploadModel(file);
      toast.success("3D model uploaded successfully");
      onChange(url);
    } catch (error: any) {
      toast.error(error.message || "Error uploading 3D model");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeModel = () => {
    onChange("");
  };

  return (
    <div className="mt-2 w-full">
      {modelUrl ? (
        <div className="flex items-center gap-4">
          <div className="bg-gray-100 dark:bg-gray-800 flex items-center gap-2 rounded-md p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm">{modelUrl.split("/").pop()}</span>
          </div>
          <button
            type="button"
            onClick={removeModel}
            className="bg-red-500 hover:bg-red-600 rounded-full p-1 text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ) : (
        <label
          className={`border-gray-300 flex h-24 w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed bg-transparent p-2 text-lg ${isUploading ? "animate-pulse" : ""}`}
        >
          <input
            type="file"
            className="hidden"
            onChange={handleModelUpload}
            accept=".glb,.gltf,.obj,.fbx"
            disabled={isUploading}
          />
          <div className="flex flex-col items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <span className="text-sm">
              {isUploading ? "Uploading..." : "Upload 3D Model"}
            </span>
            <span className="text-gray-500 text-xs">
              (GLB, GLTF, OBJ, or FBX)
            </span>
          </div>
        </label>
      )}
    </div>
  );
}
