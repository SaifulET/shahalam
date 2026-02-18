'use client';

import { useModelStore } from '@/store/useModelStore';
import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AddModelModalProps {
  onClose: () => void;
}

export default function AddModelModal({ onClose }: AddModelModalProps) {
  const [modelName, setModelName] = useState('');
  const [totalArea, setTotalArea] = useState('');
  const [face, setFace] = useState('');
  
  const addModel = useModelStore((state) => state.addModel);

  const handleSave = () => {
    if (!modelName || !totalArea || !face) {
      alert("All fields are required");
      return;
    }

    // Generate a unique ID for the model
    const newModel = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: modelName,
      area: Number(totalArea),
      face,
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
      >
        <X className="w-4 h-4 text-gray-600 dark:text-gray-300" />
      </button>

      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="font-inter font-semibold text-[24px] leading-[32px] tracking-[-0.5px] text-gray-900 dark:text-[#FFFFFF]">
            Add Model
          </h1>
          <div className="flex gap-3 sm:gap-4">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Save Model
            </button>
          </div>
        </div>

        {/* Model Information Section */}
        <div className="bg-white dark:bg-[#28272A] rounded-lg border border-gray-200 p-6 sm:p-8 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-[#FFFFFF] mb-6">
            Model Information
          </h2>

          {/* Model Name */}
          <div className="mb-6">
            <label htmlFor="modelName" className="block text-sm font-medium text-gray-700 mb-2 dark:text-[#E5E7EB]">
              Model Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="modelName"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              className="w-full px-4 py-2.5 dark:bg-[#28272A] dark:text-[#FFFFFF] text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter model name"
            />
          </div>

          {/* Total Area */}
          <div className="mb-6">
            <label htmlFor="totalArea" className="block dark:text-[#FFFFFF] text-sm font-medium text-gray-700 mb-2">
              Total Area <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                id="totalArea"
                value={totalArea}
                onChange={(e) => setTotalArea(e.target.value)}
                className="w-full px-4 py-2.5 dark:text-[#FFFFFF] dark:bg-[#28272A] text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-16"
                placeholder="Enter total area"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                sq m
              </span>
            </div>
          </div>

          {/* Face */}
          <div>
            <label htmlFor="face" className="block dark:text-[#FFFFFF] text-sm font-medium text-gray-700 mb-2">
              Face <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="face"
                value={face}
                onChange={(e) => setFace(e.target.value)}
                className="w-full px-4 py-2.5 dark:text-[#FFFFFF] dark:bg-[#28272A] text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter face direction"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}