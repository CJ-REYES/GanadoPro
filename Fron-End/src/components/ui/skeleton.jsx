// src/components/ui/skeleton.jsx
import React from 'react';
import { cn } from '@/lib/utils'; // ✅ Aquí está la corrección

export const Skeleton = ({ className, ...props }) => (
  <div 
    className={cn(
      "bg-gray-200 animate-pulse rounded-md", 
      className
    )} 
    {...props} 
  />
);
