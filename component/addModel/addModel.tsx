'use client';

import React, { useState } from 'react';

interface AreaBreakdownItem {
  id: string;
  label: string;
  value: string;
}

export default function AddModel() {
  const [modelName, setModelName] = useState('');
  const [totalArea, setTotalArea] = useState('');
  const [areaBreakdown, setAreaBreakdown] = useState<AreaBreakdownItem[]>([
    { id: '1', label: '', value: '' },
    { id: '2', label: '', value: '' },
  ]);

  const handleSave = () => {
   
  };

  const handleCancel = () => {
   
  };

  const updateAreaBreakdown = (id: string, field: 'label' | 'value', newValue: string) => {
    setAreaBreakdown(prev =>
      prev.map(item => (item.id === id ? { ...item, [field]: newValue } : item))
    );
  };

  return (
    <div className="min-h-screen  px-[24px] md:px-[289px] py-[40px] dark:bg-black">
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="ont-inter font-semibold text-[24px] leading-[32px] tracking-[-0.5px] text-gray-900 dark:text-[#FFFFFF]">Add Model</h1>
          <div className="flex gap-3 sm:gap-4">
            <button
              onClick={handleCancel}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
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
        <div className="bg-white dark:bg-[#28272A] rounded-lg  border-1 border-gray-200 p-6 sm:p-8 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-[#FFFFFF] mb-6">Model Information</h2>

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
          <div>
            <label htmlFor="totalArea" className="block dark:text-[#FFFFFF]  text-sm font-medium text-gray-700 mb-2">
              Total Area <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
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
        </div>

        {/* Area Breakdown Section */}
        <div className="bg-white rounded-lg dark:bg-[#28272A]  border-1 border-gray-200  p-6 sm:p-8">
          <h2 className="text-lg dark:text-[#FFFFFF] font-semibold text-gray-900 mb-6">Area Breakdown</h2>

          <div className="space-y-4 bg-[#E5E7EB] dark:bg-[#28272A] p-[20px] rounded-lg">
            {areaBreakdown.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4"
              >
                <div className="flex-1">
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => updateAreaBreakdown(item.id, 'label', e.target.value)}
                    className="w-full dark:bg-[#28272A] dark:text-[#FFFFFF] px-4 py-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500  focus:border-transparent focus:bg-white dark:focus:bg-black transition-all"
                    placeholder="Area label"
                  />
                </div>
                <div className="relative w-full sm:w-32">
                  <input
                    type="text"
                    value={item.value}
                    onChange={(e) => updateAreaBreakdown(item.id, 'value', e.target.value)}
                    className="w-full dark:focus:bg-black dark:bg-[#28272A] dark:text-[#FFFFFF] px-4 py-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all pr-16"
                    placeholder="Value"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                    sq m
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}