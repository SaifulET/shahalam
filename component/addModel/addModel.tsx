'use client';

import { useModelStore } from '@/store/useModelStore';
import type { ModelPayload } from '@/store/useModelStore';
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface AddModelModalProps {
  onClose: () => void;
  modelToEdit?: ModelPayload | null;
}

export default function AddModelModal({ onClose, modelToEdit = null }: AddModelModalProps) {
  const t = useTranslations('addModelModal');
  const [modelName, setModelName] = useState('');
  const [totalArea, setTotalArea] = useState('');
  const [face, setFace] = useState('');
  const isEditing = Boolean(modelToEdit);
  const addModel = useModelStore((state) => state.addModel);
  const updateModel = useModelStore((state) => state.updateModel);

  useEffect(() => {
    setModelName(modelToEdit?.name ?? '');
    setTotalArea(modelToEdit?.area?.toString() ?? '');
    setFace(modelToEdit?.face ?? '');
  }, [modelToEdit]);

  const handleSave = () => {
    const sanitizedModelName = modelName.trim();
    const sanitizedFace = face.trim();
    const sanitizedArea = totalArea.trim();

    if (!sanitizedModelName || !sanitizedArea || !sanitizedFace) {
      alert(t('allFieldsRequired'));
      return;
    }

    if (isEditing && modelToEdit) {
      updateModel(modelToEdit.id, {
        name: sanitizedModelName,
        area: Number(sanitizedArea),
        face: sanitizedFace,
      });
      onClose();
      return;
    }

    const newModel = {
      id: Date.now().toString() + Math.random().toString(36).slice(2, 11),
      name: sanitizedModelName,
      area: Number(sanitizedArea),
      face: sanitizedFace,
    };

    addModel(newModel);
    onClose();
  };

  return (
    <div className="relative">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors z-10"
        type="button"
      >
        <X className="w-4 h-4 text-gray-600 dark:text-gray-300" />
      </button>

      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h1 className="font-inter font-semibold text-[24px] leading-[32px] tracking-[-0.5px] text-gray-900 dark:text-[#FFFFFF]">
            {isEditing ? t('editTitle') : t('title')}
          </h1>
          <div className="flex gap-3 sm:gap-4">
            <button
              onClick={onClose}
              type="button"
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              {t('cancel')}
            </button>
            <button
              onClick={handleSave}
              type="button"
              className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              {isEditing ? t('updateModel') : t('saveModel')}
            </button>
          </div>
        </div>

        {/* Model Information Section */}
        <div className="bg-white dark:bg-[#28272A] rounded-lg border border-gray-200 p-6 sm:p-8 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-[#FFFFFF] mb-6">
            {t('modelInformation')}
          </h2>

          {/* Model Name */}
          <div className="mb-6">
            <label htmlFor="modelName" className="block text-sm font-medium text-gray-700 mb-2 dark:text-[#E5E7EB]">
              {t('modelName')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="modelName"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              className="w-full px-4 py-2.5 dark:bg-[#28272A] dark:text-[#FFFFFF] text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder={t('modelNamePlaceholder')}
            />
          </div>

          {/* Total Area */}
          <div className="mb-6">
            <label htmlFor="totalArea" className="block dark:text-[#FFFFFF] text-sm font-medium text-gray-700 mb-2">
              {t('totalArea')} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                id="totalArea"
                value={totalArea}
                onChange={(e) => setTotalArea(e.target.value)}
                className="w-full px-4 py-2.5 dark:text-[#FFFFFF] dark:bg-[#28272A] text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-16"
                placeholder={t('totalAreaPlaceholder')}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                {t('squareMeters')}
              </span>
            </div>
          </div>

          {/* Face */}
          <div>
            <label htmlFor="face" className="block dark:text-[#FFFFFF] text-sm font-medium text-gray-700 mb-2">
              {t('face')} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="face"
                value={face}
                onChange={(e) => setFace(e.target.value)}
                className="w-full px-4 py-2.5 dark:text-[#FFFFFF] dark:bg-[#28272A] text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder={t('facePlaceholder')}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
