'use client'
import React, { useState } from 'react';
import { Folder, Plus } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface FolderItem {
  name: string;
  projectCount: number;
}

interface FoldersComponentProps {
  onProjectDropped: (folderName: string) => void;
}

const FoldersComponent: React.FC<FoldersComponentProps> = ({ onProjectDropped }) => {
  const [folders, setFolders] = useState<FolderItem[]>([
    { name: 'Web Projects', projectCount: 12 },
    { name: 'Mobile Apps', projectCount: 8 },
    { name: 'Design Systems', projectCount: 5 },
    { name: 'E-commerce', projectCount: 15 },
    { name: 'Marketing', projectCount: 7 },
    { name: 'Archive', projectCount: 23 },
  ]);

  const router = useRouter();

  const handlePlus = () => {
    router.push("/create-folder");
  };

  const handleDragOver = (e: React.DragEvent, folderName: string) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-blue-50', 'border-blue-300');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('bg-blue-50', 'border-blue-300');
  };

  const handleDrop = (e: React.DragEvent, folderName: string) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-blue-50', 'border-blue-300');
    
    const projectId = e.dataTransfer.getData('project/id');
    const projectTitle = e.dataTransfer.getData('project/title');
    
    if (projectId) {
      // Call the parent handler to remove project from recent list
      onProjectDropped(folderName);
      
      // Update the folder project count
      setFolders(prev => prev.map(folder => 
        folder.name === folderName 
          ? { ...folder, projectCount: folder.projectCount + 1 }
          : folder
      ));
      
      console.log(`Project ${projectTitle} (${projectId}) moved to ${folderName}`);
    }
  };

  return (
    <div className="w-full bg-white py-8 lg:py-[54px] dark:bg-black">
      <div className="px-4 sm:px-6 md:px-8 lg:px-[79px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 lg:mb-8">
          <h2 className="font-inter font-semibold text-xl leading-7 tracking-[-0.5px] dark:text-[#F9FAFB]">
            Folders
          </h2>
          <button onClick={handlePlus}
            className="w-10 h-10 rounded-full bg-[#0088FF] flex items-center justify-center hover:bg-[#0077DD] transition-colors"
            aria-label="Add new folder"
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Folders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-[37px]">
          {folders.map((folder, index) => (
            <div
              key={index}
              className="bg-[#F9FAFB] dark:bg-[#1A1A1A] border border-[#E5E7EB] rounded-lg p-4 lg:p-5 flex flex-col justify-start cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              onDragOver={(e) => handleDragOver(e, folder.name)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, folder.name)}
            >
              <Image src="/folder.svg" alt="folder" width={24} height={21}/>
              
              <h3 className="text-sm dark:text-[#FFFFFF] lg:text-base font-medium text-[#1F2937] mb-1 mt-[24px]">
                {folder.name}
              </h3>
              <p className="text-xs lg:text-sm text-gray-500">
                {folder.projectCount} projects
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FoldersComponent;