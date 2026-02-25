'use client';

import React, { useEffect, useState } from 'react';
import { Folder } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useFolderStore } from '@/store/folderStore';
import { useAuthStore } from '@/store/authStore';
 // adjust path

const CreateFolderPage = () => {
  const t = useTranslations('createFolder');
  const [folderName, setFolderName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState('#34D399');
  const user= useAuthStore().user
  useEffect(() => {
    if (!user?.id) router.push("/auth/signin");})
  const colors = [
    '#34D399',
    '#60A5FA',
    '#C084FC',
    '#FBBF24',
    '#FB7185',
    '#9CA3AF'
  ];

  const router = useRouter();
  const { createFolder, loading, error } = useFolderStore();

  const handleCreateFolder = async () => {

    await createFolder({
      name: folderName,
      description,
      color: selectedColor
    });
   
    router.push('/');
  };



  return (
    <div className="min-h-screen bg-white dark:bg-black flex justify-center items-center px-4 py-4 sm:px-6">
      <div className="w-full max-w-[560px]">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-[#FFFFFF] mb-6">
          {t('title')}
        </h1>

        <div className="rounded-md border border-[#D1D5DB] p-4 sm:p-6">

          {/* Folder Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 dark:text-[#FFFFFF] mb-2">
              {t('folderName')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder={t('folderNamePlaceholder')}
              className="w-full bg-white dark:bg-[#28272A] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-gray-900 dark:text-[#FFFFFF]"
            />
          </div>

          {/* Description */}
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-900 dark:text-[#FFFFFF] mb-2">
              {t('description')} <span className="text-gray-400 font-normal">({t('optional')})</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('descriptionPlaceholder')}
              rows={4}
              className="w-full bg-white dark:bg-[#28272A] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-gray-900 dark:text-[#FFFFFF] resize-none"
            />
          </div>
          <p className="text-xs text-gray-500 mb-6">
            {t('descriptionHint')}
          </p>

          {/* Folder Appearance */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-3 dark:text-[#FFFFFF]">
              {t('folderAppearance')} <span className="text-gray-400 font-normal">({t('optional')})</span>
            </label>

            {/* Color Picker */}
            <div className="mb-4 flex flex-wrap gap-3">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 rounded-full transition-all ${
                    selectedColor === color
                      ? 'ring-2 ring-offset-2 ring-gray-400'
                      : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={t('selectColorAria', { color })}
                />
              ))}
            </div>

            {/* Preview */}
            <div className="border border-[#D1D5DB] rounded-lg p-[17px] bg-white dark:bg-[#28272A]">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor:
                      selectedColor === '#34D399' ? '#D1FAE5' :
                      selectedColor === '#60A5FA' ? '#DBEAFE' :
                      selectedColor === '#C084FC' ? '#F3E8FF' :
                      selectedColor === '#FBBF24' ? '#FEF3C7' :
                      selectedColor === '#FB7185' ? '#FFE4E6' :
                      '#F3F4F6'
                  }}
                >
                  <Folder
                    size={24}
                    fill={selectedColor}
                    stroke={selectedColor}
                    className="text-current"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-[#FFFFFF]">
                    {folderName || t('previewDefaultFolderName')}
                  </p>
                  <p className="text-xs text-gray-500">{t('previewItems')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              onClick={() => {
                router.back();
                setFolderName('');
                setDescription('');
                setSelectedColor('#34D399');
              }}
              className="w-full px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors sm:w-auto"
            >
              {t('cancel')}
            </button>
            <button
              onClick={handleCreateFolder}
              disabled={!folderName.trim() || loading}
              className="w-full px-6 py-2.5 text-sm font-medium text-white dark:text-[#FFFFFF] bg-[#34D399] dark:bg-[#0088FF] rounded-lg hover:bg-[#2dd48e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto"
            >
              {loading ? t('creating') : t('createFolder')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateFolderPage;
