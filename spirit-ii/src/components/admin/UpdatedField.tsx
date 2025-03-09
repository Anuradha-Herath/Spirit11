"use client";

import { useState, useEffect } from 'react';

interface UpdatedFieldProps {
  value: any;
  isUpdated?: boolean;
  className?: string;
  children?: React.ReactNode;
  showAnimation?: boolean;
}

/**
 * A component that visually highlights when a value is updated
 * Can either wrap content (using children) or display a value directly
 */
export default function UpdatedField({ 
  value, 
  isUpdated = false, 
  className = '',
  children, 
  showAnimation = true
}: UpdatedFieldProps) {
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    if (isUpdated && showAnimation) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isUpdated, value, showAnimation]);
  
  return (
    <div className={`transition-all ${animate ? 'animate-highlight' : ''} ${className}`}>
      {children ? children : value}
    </div>
  );
}
