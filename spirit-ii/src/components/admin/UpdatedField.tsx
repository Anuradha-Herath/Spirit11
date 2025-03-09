"use client";

import { useEffect, useState } from 'react';

interface UpdatedFieldProps {
  isUpdated?: boolean;
  showAnimation?: boolean;
  className?: string;
  children: React.ReactNode;
}

export default function UpdatedField({ 
  isUpdated = false, 
  showAnimation = true,
  className = '',
  children 
}: UpdatedFieldProps) {
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    if (isUpdated && showAnimation) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isUpdated, showAnimation]);
  
  return (
    <div className={`transition-all ${animate ? 'animate-highlight' : ''} ${className}`}>
      {children}
    </div>
  );
}
