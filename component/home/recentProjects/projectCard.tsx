'use client'
import Image from 'next/image';
import { useState } from 'react';

interface ProjectCardProps {
  id: string;
  image: string;
  title: string;
  location: string;
  status: 'Active' | 'Inactive';
  onProjectMoved: (projectId: string) => void;
}

export default function ProjectCard({ 
  id, 
  image, 
  title, 
  location, 
  status, 
  onProjectMoved 
}: ProjectCardProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    
    // Set data that can be read during drop
    e.dataTransfer.setData('project/id', id);
    e.dataTransfer.setData('project/title', title);
    e.dataTransfer.setData('project/location', location);
    
    // Visual feedback
    e.dataTransfer.effectAllowed = 'move';
    
    // Add a custom drag image (optional)
    if (e.dataTransfer.setDragImage && e.currentTarget instanceof HTMLElement) {
      e.dataTransfer.setDragImage(e.currentTarget, 20, 20);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    
    // Remove project from list after successful drop
    // This will be triggered after the drop event in the folder
    setTimeout(() => {
      const wasDropped = document.querySelector('[data-dropped="true"]');
      if (wasDropped) {
        onProjectMoved(id);
      }
    }, 100);
  };

  return (
    <div
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`
        border border-[#E5E7EB] rounded-lg overflow-hidden bg-white dark:bg-[#1A1A1A] 
        cursor-move transition-all duration-200
        ${isDragging 
          ? 'opacity-50 scale-95 shadow-lg border-blue-300' 
          : 'hover:shadow-md hover:border-gray-300'
        }
      `}
    >
      <div className="w-full h-[96px] relative">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
        {isDragging && (
          <div className="absolute inset-0 bg-blue-100 bg-opacity-30 flex items-center justify-center">
            <div className="bg-blue-500 text-white  px-3 py-1 rounded-full text-sm font-medium">
              Dragging...
            </div>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-[#FFFFFF] mb-1">
          {title}
        </h3>
        <p className="text-sm text-gray-500 mb-3 dark:text-[#6B7280] ">
          {location}
        </p>
        <span className="inline-block text-sm font-medium text-green-600">
          {status}
        </span>
      </div>
    </div>
  );
}