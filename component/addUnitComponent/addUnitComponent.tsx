'use client';

import { useState, useRef } from 'react';
import { Plus, X, Upload, Home } from 'lucide-react';
import { useTranslations } from 'next-intl';
import ThemeToggle from '@/component/ThemeToggle/ThemeToggle';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCreatProjectStore } from '@/store/creatProjectStore';
import { useAuthStore } from '@/store/authStore';
import { useModelStore } from '@/store/useModelStore';
import AddModelModal from '../addModel/addModel';

interface Floor {
  id: string;
  name: string;
  units: string[];
}

interface Model {
  id: string;
  name: string;
  area: number;
  face: string;
}

function sanitizeUnitName(value: string) {
  return value.normalize('NFKC').trim().replace(/\s+/g, ' ');
}

export default function PropertyUnitForm() {
  const t = useTranslations('addUnitForm');
  const { createFullProject, loading } = useCreatProjectStore();
  const user = useAuthStore().user;
  const [propertyName, setPropertyName] = useState('');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [floors, setFloors] = useState<Floor[]>([]);
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [showModelModal, setShowModelModal] = useState(false);
  const [currentFloorId, setCurrentFloorId] = useState<string>('');
  const [newUnitName, setNewUnitName] = useState('');
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Get models from store
  const models = useModelStore((state) => state.models);
  const removeModel = useModelStore((state) => state.removeModel);
  const route = useRouter();

  const addFloor = () => {
    const newFloor: Floor = {
      id: Date.now().toString(),
      name: t('defaultFloorName', { number: floors.length + 1 }),
      units: []
    };
    setFloors([...floors, newFloor]);
  };

  const removeFloor = (floorId: string) => {
    setFloors(floors.filter(floor => floor.id !== floorId));
  };

  const openUnitModal = (floorId: string) => {
    setCurrentFloorId(floorId);
    setNewUnitName('');
    setShowUnitModal(true);
  };

  const closeUnitModal = () => {
    setShowUnitModal(false);
    setCurrentFloorId('');
    setNewUnitName('');
  };

  const openModelModal = () => {
    setShowModelModal(true);
  };

  const closeModelModal = () => {
    setShowModelModal(false);
  };

  const saveNewUnit = () => {
    const sanitizedNewUnitName = sanitizeUnitName(newUnitName);
    if (!sanitizedNewUnitName) {
      alert(t('alerts.enterUnitName'));
      return;
    }

    setFloors(floors.map(floor => {
      if (floor.id === currentFloorId) {
        return { ...floor, units: [...floor.units, sanitizedNewUnitName] };
      }
      return floor;
    }));

    closeUnitModal();
  };

  const updateUnit = (floorId: string, index: number, value: string) => {
    setFloors(floors.map(floor => {
      if (floor.id === floorId) {
        const newUnits = [...floor.units];

        newUnits[index] = value;
        return { ...floor, units: newUnits };
      }
      return floor;
    }));
  };

  const removeUnit = (floorId: string, index: number) => {
    setFloors(floors.map(floor => {
      if (floor.id === floorId) {
        const newUnits = floor.units.filter((_, idx) => idx !== index);
        return { ...floor, units: newUnits };
      }
      return floor;
    }));
  };

  const removeModelHandler = (modelId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent any parent click events
    if (window.confirm(t('alerts.confirmRemoveModel'))) {
      removeModel(modelId);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        alert(t('alerts.invalidImageFile'));
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        alert(t('alerts.maxFileSize'));
        return;
      }

      setCoverImageFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeCoverImage = () => {
    setCoverImage(null);
    setCoverImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSave = async () => {
    if (!propertyName || !location) {
      alert(t('alerts.fillPropertyNameAndLocation'));
      return;
    }

    await createFullProject(
      {
        userId: user?.id || "",
        name: propertyName,
        location: location,
        image: coverImageFile,
      },
      floors.map((floor) => ({
        name: floor.name,
        units: floor.units,
      })),
      models.map((model) => ({
        name: model.name,
        area: model.area,
        face: model.face,
      }))
    );

    route.push("/dashboards");
  };

  return (
    <div className="min-h-screen bg-white px-4 pb-10 pt-6 dark:bg-black sm:px-6 lg:px-10 xl:px-16">
      <div className="mx-auto w-full max-w-screen-xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col gap-3 px-1 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="font-inter font-semibold text-[24px] leading-[32px] tracking-[-0.5px] text-black dark:text-white">{t('title')}</h1>
            <div className="flex gap-2 sm:gap-3">
              <Link href="/dashboards">
                <button className="rounded-lg border border-[#D1D5DB] px-4 py-2.5 text-center font-inter text-[14px] font-medium leading-[14px] tracking-[-0.5px] text-[#374151] transition-colors hover:bg-gray-50 dark:text-gray-50 dark:hover:bg-gray-700 sm:px-8 sm:py-3">
                  {t('cancel')}
                </button>
              </Link>
              <button 
                onClick={handleSave} 
                className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
              >
                {t('saveProperty')}
              </button>
            </div>
          </div>

          {/* Property Information */}
          <div className="p-4 sm:p-6 border rounded-lg border-[#E5E7EB] bg-white dark:bg-[#1A1A1A]">
            <h2 className="font-inter font-medium text-[18px] leading-[28px] tracking-[-0.5px] text-gray-900 dark:text-[#FFFFFF] mb-4">{t('propertyInformation')}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-[#FFFFFF] mb-2">
                  {t('propertyName')}
                </label>
                <input
                  type="text"
                  placeholder={t('propertyNamePlaceholder')}
                  value={propertyName}
                  onChange={(e) => setPropertyName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#111827] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-[#E5E7EB] placeholder:text-gray-500 dark:placeholder:text-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-[#FFFFFF] mb-2">
                  {t('location')}
                </label>
                <input
                  type="text"
                  placeholder={t('locationPlaceholder')}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#111827] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-[#E5E7EB] placeholder:text-gray-500 dark:placeholder:text-gray-400"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-[#FFFFFF] text-gray-700 mb-2">
                {t('address')}
              </label>
              <textarea
                placeholder={t('addressPlaceholder')}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#111827] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 dark:text-[#E5E7EB] placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
            </div>

            <button 
              onClick={openModelModal}
              className="w-full gap-1 px-3 py-3 text-sm font-medium text-blue-600 bg-blue-100 rounded-md hover:bg-blue-100 transition-colors text-center mt-2"
            >
              {t('addModel')}
            </button>
          </div>
        </div>

        {/* Models Section - New section to display added models */}
        {models.length > 0 && (
          <div className="bg-white dark:bg-[#1A1A1A] rounded-lg border border-[#E5E7EB] mb-6">
            <div className="flex flex-col gap-2 border-b border-gray-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-gray-700">
              <h2 className="font-inter font-medium text-[18px] leading-[28px] tracking-[-0.5px] text-gray-900 dark:text-[#FFFFFF]">{t('models')}</h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">{t('modelsAddedCount', { count: models.length })}</span>
            </div>

            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {models.map((model) => (
                  <div key={model.id} className="relative group">
                    {/* Remove button - always visible on hover, with high z-index */}
                    <button
                      onClick={(e) => removeModelHandler(model.id, e)}
                      className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-20 opacity-0 group-hover:opacity-100 shadow-lg"
                      title={t('removeModel')}
                    >
                      <X className="w-3 h-3" />
                    </button>
                    
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-[#28272A] hover:shadow-md transition-shadow relative z-10">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Home className="w-5 h-5 text-blue-500" />
                          <h3 className="font-medium text-gray-900 dark:text-[#FFFFFF]">{model.name}</h3>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">{t('areaLabel')}</span>
                          <span className="text-gray-900 dark:text-[#FFFFFF] font-medium">{model.area} {t('squareMeters')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">{t('faceLabel')}</span>
                          <span className="text-gray-900 dark:text-[#FFFFFF] font-medium">{model.face}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Floors Section */}
        <div className="bg-white dark:bg-[#1A1A1A] rounded-lg border border-[#E5E7EB] mb-6">
          <div className="flex flex-col gap-3 border-b border-gray-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-gray-700">
            <h2 className="font-inter font-medium text-[18px] leading-[28px] tracking-[-0.5px] text-gray-900 dark:text-[#FFFFFF]">{t('floors')}</h2>
            <button
              onClick={addFloor}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
              {t('addFloor')}
            </button>
          </div>

          <div className="p-4 sm:p-6 space-y-4">
            {floors.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                {t('noFloors')}
              </div>
            ) : (
              floors.map((floor) => (
                <div key={floor.id} className="relative group">
                  <button
                    onClick={() => removeFloor(floor.id)}
                    className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-20 opacity-0 group-hover:opacity-100 shadow-lg"
                    title={t('removeFloor')}
                  >
                    <X className="w-3 h-3" />
                  </button>
                  
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 dark:bg-[#28272A] relative z-10">
                    <h3 className="text-sm font-medium text-gray-900 mb-3 dark:text-[#FFFFFF]">{floor.name}</h3>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-3">
                      {floor.units.map((unit, index) => (
                        <div key={index} className="relative group/unit">
                          <input
                            type="text"
                            value={unit}
                            placeholder={t('unitPlaceholder', { number: index + 1 })}
                            className="w-full px-3 py-2 pr-8 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#28272A] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-[#E5E7EB] placeholder:text-gray-500 dark:placeholder:text-gray-400"
                            onChange={(e) => updateUnit(floor.id, index, e.target.value)}
                          />
                          <button
                            onClick={() => removeUnit(floor.id, index)}
                            className="absolute right-1 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center bg-red-100 text-red-600 rounded-full opacity-0 group-hover/unit:opacity-100 transition-opacity hover:bg-red-200"
                            title={t('removeUnit')}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <button
                      onClick={() => openUnitModal(floor.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 bg-white border border-blue-200 rounded-md hover:bg-blue-50 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      {t('addUnit')}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Cover Image */}
        <div className="bg-white rounded-lg border border-[#E5E7EB] dark:bg-[#111827]">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-inter font-medium text-[18px] leading-[28px] tracking-[-0.5px] text-gray-900 dark:text-[#FFFFFF]">{t('coverImage')}</h2>
          </div>
          
          <div className="p-4 sm:p-6">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".jpg,.jpeg,.png"
              className="hidden"
            />
            
            {coverImage ? (
              <div className="relative border-2 border-gray-300 rounded-lg overflow-hidden group">
                <img 
                  src={coverImage} 
                  alt={t('coverPreviewAlt')} 
                  className="w-full h-64 object-cover"
                />
                <button
                  onClick={removeCoverImage}
                  className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 shadow-lg z-20"
                  title={t('removeImage')}
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <p className="text-white text-sm font-medium">{coverImageFile?.name}</p>
                  <p className="text-white/80 text-xs">
                    {coverImageFile && (coverImageFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            ) : (
              <div 
                onClick={triggerFileInput}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 sm:p-12 text-center hover:border-gray-400 transition-colors cursor-pointer"
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Upload className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 mb-1">{t('uploadPropertyImage')}</h3>
                  <p className="text-sm text-gray-500 mb-4">{t('uploadHint')}</p>
                  <button 
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerFileInput();
                    }}
                  >
                    {t('chooseFile')}
                  </button>
                  <p className="text-xs text-gray-400 mt-3">{t('fileTypeHint')}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Unit Modal */}
      {showUnitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1A1A1A] rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
                {t('unitModal.title')}
              </h2>
              
              <input
                type="text"
                value={newUnitName}
                onChange={(e) => setNewUnitName(e.target.value)}
                placeholder={t('unitModal.placeholder')}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#111827] text-center text-lg text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-6"
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    saveNewUnit();
                  }
                }}
              />

              <div className="flex gap-3">
                <button
                  onClick={closeUnitModal}
                  className="flex-1 px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={saveNewUnit}
                  className="flex-1 px-6 py-3 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {t('saveChanges')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Model Modal */}
      {showModelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-black rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <AddModelModal onClose={closeModelModal} />
          </div>
        </div>
      )}
    </div>
  );
}
