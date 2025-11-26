import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackComponent?: React.ReactNode;
}

export function ImageWithFallback({ 
  src, 
  alt, 
  fallbackComponent, 
  className = '', 
  style,
  ...props 
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  if (hasError || !src) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 border border-gray-200 rounded-md ${className}`}
        style={{ minHeight: '100px', ...style }}
      >
        {fallbackComponent || (
          <div className="flex flex-col items-center text-gray-400">
            <ImageOff size={24} />
            <span className="text-xs mt-1">Image not found</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-gray-100 border border-gray-200 rounded-md"
          style={{ minHeight: '100px' }}
        >
          <div className="animate-pulse text-gray-400">Loading...</div>
        </div>
      )}
      <img
        src={src}
        alt={alt || 'Image'}
        onError={handleError}
        onLoad={handleLoad}
        className={`${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
        style={style}
        {...props}
      />
    </div>
  );
}