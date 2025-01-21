'use client';

import { useState } from 'react';

export default function TestUpload() {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError('');

      const response = await fetch(`/api/upload?filename=${file.name}`, {
        method: 'POST',
        body: file,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }

      const data = await response.json();
      setImageUrl(data.url);
      console.log('Upload successful:', data);
    } catch (err) {
      console.error('Error uploading:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Test Image Upload</h1>
      
      <div className="space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
          className="block w-full text-sm text-slate-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-violet-50 file:text-violet-700
            hover:file:bg-violet-100"
        />

        {isUploading && (
          <div className="text-blue-600">Uploading...</div>
        )}

        {error && (
          <div className="text-red-600">{error}</div>
        )}

        {imageUrl && (
          <div className="space-y-2">
            <div className="text-green-600">Upload successful!</div>
            <img 
              src={imageUrl} 
              alt="Uploaded" 
              className="max-w-md rounded shadow-lg"
            />
            <div className="text-sm text-gray-600 break-all">
              URL: {imageUrl}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
