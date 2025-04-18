'use client';

import type React from 'react';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Upload,
  ImageIcon,
  FileText,
  Loader2,
  AlertCircle,
} from 'lucide-react';

export default function ImageAnalyzer() {
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
      setDescription(null);
      setError(null);
    }
  };

  const analyzeImage = async () => {
    if (!image) return;

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      const blob = await fetch(image).then((res) => res.blob());
      formData.append('image', blob);

      const response = await fetch('/api/ImageAi', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }

      const data = await response.json();
      setDescription(data.result);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to analyze image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-teal-50 to-white'>
      <div className='max-w-4xl mx-auto p-6 md:p-8'>
        <header className='mb-8 text-center'>
          <h1 className='text-3xl md:text-4xl font-bold text-teal-800 mb-2'>
            Health Image Analysis
          </h1>
          <p className='text-teal-600'>
            Upload medical images for AI-powered analysis and insights
          </p>
        </header>

        <div className='bg-white rounded-xl shadow-md overflow-hidden p-6 mb-8'>
          <div className='mb-6'>
            <div className='flex items-center mb-3'>
              <Upload className='w-5 h-5 text-teal-600 mr-2' />
              <label className='font-medium text-teal-800'>
                Upload an image for analysis
              </label>
            </div>

            <div className='relative border-2 border-dashed border-teal-200 rounded-lg p-4 hover:border-teal-400 transition-colors'>
              <input
                type='file'
                accept='image/*'
                onChange={handleImageChange}
                className='absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10'
              />
              <div className='text-center'>
                <ImageIcon className='w-10 h-10 text-teal-400 mx-auto mb-2' />
                <p className='text-sm text-teal-600 mb-1'>
                  Drag and drop an image here or click to browse
                </p>
                <p className='text-xs text-gray-500'>
                  Supports JPG, PNG, and other common formats
                </p>
              </div>
            </div>
          </div>

          {image && (
            <div className='mb-6'>
              <div className='flex items-center mb-3'>
                <ImageIcon className='w-5 h-5 text-teal-600 mr-2' />
                <h2 className='font-medium text-teal-800'>Image Preview</h2>
              </div>
              <div className='bg-gray-50 p-2 rounded-lg border border-gray-100'>
                <img
                  src={image || '/placeholder.svg'}
                  alt='Preview'
                  className='max-w-full h-auto rounded-lg mx-auto max-h-[400px] object-contain'
                />
              </div>
            </div>
          )}

          <div className='flex justify-center'>
            <button
              onClick={analyzeImage}
              disabled={!image || isLoading}
              className={`px-6 py-3 rounded-full font-medium flex items-center justify-center min-w-[180px] transition-all ${
                !image || isLoading
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-teal-600 text-white hover:bg-teal-700 shadow-md hover:shadow-lg'
              }`}>
              {isLoading ? (
                <>
                  <Loader2 className='w-5 h-5 mr-2 animate-spin' />
                  Analyzing...
                </>
              ) : (
                'Analyze Image'
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className='mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start'>
            <AlertCircle className='w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5' />
            <p className='text-red-700'>{error}</p>
          </div>
        )}

        {description && (
          <div className='bg-white rounded-xl shadow-md overflow-hidden p-6'>
            <div className='flex items-center mb-4'>
              <FileText className='w-5 h-5 text-teal-600 mr-2' />
              <h2 className='font-bold text-lg text-teal-800'>
                Analysis Results
              </h2>
            </div>
            <div className='p-5 bg-teal-50 rounded-lg border border-teal-100'>
              <ReactMarkdown>{description}</ReactMarkdown>
            </div>
          </div>
        )}

        <footer className='mt-12 text-center text-sm text-teal-600'>
          <p>
            This tool is designed to assist healthcare professionals. Results
            should be verified by qualified medical personnel.
          </p>
        </footer>
      </div>
    </div>
  );
}
