'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Plus } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useFolderStore, Folder } from '@/store/folderStore';
import { HugeiconsIcon } from '@hugeicons/react';
import { Folder01Icon } from '@hugeicons/core-free-icons';

interface FoldersComponentProps {
  onProjectDropped: (folderName: string) => void;
}

const FoldersComponent: React.FC<FoldersComponentProps> = ({ onProjectDropped }) => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { folders, fetchFolders, loading, error, addProjectToFolder ,deleteRecent} = useFolderStore();

  // Fetch folders on mount
  useEffect(() => {
    if (user?.id) {
      fetchFolders(user.id);
    }
  }, [user?.id, fetchFolders]);

  const handlePlus = () => {
    router.push('/create-folder');
  };

  const handleDragOver = (e: React.DragEvent, folderName: string) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-blue-50', 'border-blue-300');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('bg-blue-50', 'border-blue-300');
  };

  const handleDrop = (e: React.DragEvent, folderid: string) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-blue-50', 'border-blue-300');

    const projectId = e.dataTransfer.getData('project/id');
    const recentid = e.dataTransfer.getData('project/recentid');
    
  

    if (projectId) {
      onProjectDropped(folderid);

      // Update folder project count locally
     

      // Call the function to update the backend
      addProjectToFolder(folderid, projectId);
      
      deleteRecent(recentid);
      window.location.reload();

    }
  };

  return (
    <div className="w-full bg-white py-8 lg:py-[54px] dark:bg-black">
      <div className="px-4 sm:px-6 md:px-8 lg:px-[79px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 lg:mb-8">
          <h2 className="font-inter font-semibold text-xl leading-7 tracking-[-0.5px] dark:text-[#F9FAFB] text-[#1F2937]">
            Folders
          </h2>
          <button
            onClick={handlePlus}
            className="w-10 h-10 rounded-full bg-[#0088FF] flex items-center justify-center hover:bg-[#0077DD] transition-colors"
            aria-label="Add new folder"
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Error / Loading */}
        {loading && <p className="text-gray-500 mb-3">Loading folders...</p>}
        {error && <p className="text-red-500 mb-3">{error}</p>}

        {/* Folders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-[37px]">
          {folders.map((folder: Folder) => (
            <div
              key={folder._id}
              className="bg-[#F9FAFB] dark:bg-[#1A1A1A] border border-[#E5E7EB] rounded-lg p-4 lg:p-5 flex flex-col justify-start cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              onDragOver={(e) => handleDragOver(e, folder.name)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, folder._id)}
            >
              {/* <Image src="/folder.svg" alt="folder" width={24} height={21} /> */}
<HugeiconsIcon
  icon={Folder01Icon}
  width={28}
  height={24}
  style={{ fill: folder.color, color: folder.color }}
 
/>




              {/* {console.log(folder.color)} */}
              <h3 className="text-sm text-[#1F2937] dark:text-[#FFFFFF] lg:text-base font-medium mb-1 mt-[24px]">
                {folder.name}
              </h3>
              <p className="text-xs lg:text-sm text-gray-500">
                {folder.projects.length} projects
              </p>
            </div>
          ))}

          {
            folders.length === 0 && !loading && (
              <p className="text-gray-500 col-span-full text-center mt-8">
                No folders found. 
              </p>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default FoldersComponent;
