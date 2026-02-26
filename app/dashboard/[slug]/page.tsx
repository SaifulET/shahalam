'use client';

import Navbar from '@/component/home/navbar';
import ThemeToggle from '@/component/ThemeToggle/ThemeToggle';
import { Add01FreeIcons } from '@hugeicons/core-free-icons';
import { ArrowDownToDot, Edit, Trash2, Pencil, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useState, useEffect, useMemo } from 'react';
import { useApiStore, Project, Model, Floor, Unit, UnitStatus } from '@/store/editProjectStore';
import { useAuthStore } from '@/store/authStore';
 // Assuming you have this

const ARABIC_DIGITS = ['\u0660', '\u0661', '\u0662', '\u0663', '\u0664', '\u0665', '\u0666', '\u0667', '\u0668', '\u0669'];

function fallbackArabicText(value: string) {
  return value
    .replace(/\d/g, (digit) => ARABIC_DIGITS[Number(digit)])
    .replace(/,/g, '\u060C')
    .replace(/;/g, '\u061B')
    .replace(/\?/g, '\u061F');
}

export default function Home() {
  const t = useTranslations('dashboardEditor');
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const router = useRouter();
  const params = useParams();
  const projectId = params?.slug as string; // Get project ID from URL slug
  
  // Get user from auth store
  const { user } = useAuthStore();
  
  // Get store state and actions
  const {
    // Projects
    projects,
    projectsLoading,
    getProjects,
    
    // Models
    models,
    modelsLoading,
    addModel,
    getModels,
    updateModel,
    deleteModel,
    
    // Floors
    floors,
    floorsLoading,
    getFloors,
    addFloor,
    updateFloor,
    deleteFloor,
    
    // Units
    addUnit,
    updateUnit,
    deleteUnit
  } = useApiStore();

  // Local UI state
  const [selectedFloorId, setSelectedFloorId] = useState<string>('');
  const [showAddUnitModal, setShowAddUnitModal] = useState(false);
  const [activeFloorForAdd, setActiveFloorForAdd] = useState<string>('');
  const [newUnitName, setNewUnitName] = useState('');
  const [showAddFloorModal, setShowAddFloorModal] = useState(false);
  const [newFloorName, setNewFloorName] = useState('');
  const [showEditFloorModal, setShowEditFloorModal] = useState(false);
  const [editingFloorData, setEditingFloorData] = useState<Floor | null>(null);
  const [tempFloorName, setTempFloorName] = useState('');
  const [tempUnits, setTempUnits] = useState<Unit[]>([]);
  const [newUnitInEdit, setNewUnitInEdit] = useState('');
  const [showAddModelModal, setShowAddModelModal] = useState(false);
  const [newModelName, setNewModelName] = useState('');
  const [newModelArea, setNewModelArea] = useState('');
  const [newModelFace, setNewModelFace] = useState('');
  const [showEditModelModal, setShowEditModelModal] = useState(false);
  const [editingModelData, setEditingModelData] = useState<Model | null>(null);
  const [tempModelName, setTempModelName] = useState('');
  const [tempModelArea, setTempModelArea] = useState('');
  const [tempModelFace, setTempModelFace] = useState('');
  const [saving, setSaving] = useState(false);
  const [translatedDynamicText, setTranslatedDynamicText] = useState<Record<string, string>>({});

  const textsToTranslate = useMemo(() => {
    const values: string[] = [
      ...projects.map((project) => project.name),
      ...floors.map((floor) => floor.name),
      ...floors.flatMap((floor) => floor.units.map((unit) => unit.name)),
      ...models.map((model) => model.name),
      ...models.map((model) => String(model.area ?? '')),
      ...models.map((model) => model.face).filter(Boolean) as string[],
    ];

    return Array.from(
      new Set(values.map((value) => value?.trim()).filter(Boolean))
    ) as string[];
  }, [projects, floors, models]);

  const localizeDynamicText = (value?: string | number | null) => {
    if (value === null || value === undefined) return '';
    const normalizedValue = String(value).trim();
    if (!normalizedValue) return '';

    const translatedValue = translatedDynamicText[normalizedValue];
    if (translatedValue) return translatedValue;

    return locale === 'ar'
      ? fallbackArabicText(normalizedValue)
      : normalizedValue;
  };

  const saveEditedFloor = async () => {
  if (!editingFloorData || !tempFloorName.trim() || !projectId) return;

  try {
    // Show loading state (you might want to add a loading spinner)
    setSaving(true);

    // 1. Update floor name first
    if (tempFloorName !== editingFloorData.name) {
      await updateFloor(editingFloorData._id, { name: tempFloorName });
    }

    const originalUnits = editingFloorData.units;
    
    // 2. Handle deleted units (ones in original but not in temp)
    const deletedUnits = originalUnits.filter(
      originalUnit => !tempUnits.some(tempUnit => tempUnit._id === originalUnit._id)
    );
    
    for (const unit of deletedUnits) {
      await deleteUnit(editingFloorData._id, unit._id);
    }

    // 3. Handle new units (ones with temp IDs)
    const newUnits = tempUnits.filter(unit => unit._id.startsWith('temp-'));
    
    for (const unit of newUnits) {
      await addUnit(editingFloorData._id, { name: unit.name });
      // Note: status defaults to 'available' from the store
    }

    // 4. Handle updated units (same ID but changed name or status)
    const updatedUnits = tempUnits.filter(tempUnit => {
      if (tempUnit._id.startsWith('temp-')) return false; // Skip new units
      
      const originalUnit = originalUnits.find(u => u._id === tempUnit._id);
      return originalUnit && (
        originalUnit.name !== tempUnit.name || 
        originalUnit.status !== tempUnit.status
      );
    });

    for (const unit of updatedUnits) {
      await updateUnit(editingFloorData._id, unit._id, {
        name: unit.name,
        status: unit.status
      });
    }

    // 5. Refresh floors data to get latest state
    await getFloors(projectId);

    // Close modal and reset state
    setShowEditFloorModal(false);
    setEditingFloorData(null);
    setTempFloorName('');
    setTempUnits([]);
    setNewUnitInEdit('');
    setSaving(false);

    // Optional: Show success message
    // toast.success('Floor updated successfully');

  } catch (error) {
    
    setSaving(false);
    // Optional: Show error message
    // toast.error('Failed to update floor');
  }
};
  // Load data when component mounts and projectId is available
  useEffect(() => {
    if (user?.id) {
      getProjects(user.id);
    }
  }, [user, getProjects]);

  useEffect(() => {
    if (projectId) {
      getModels(projectId);
      getFloors(projectId);
    }
  }, [projectId, getModels, getFloors]);

  // Auto-select first floor when floors change
  useEffect(() => {
    if (floors.length > 0) {
      if (!selectedFloorId || !floors.find(f => f._id === selectedFloorId)) {
        setSelectedFloorId(floors[0]._id);
      }
    } else {
      setSelectedFloorId('');
    }
  }, [floors, selectedFloorId]);

  useEffect(() => {
    let active = true;

    if (textsToTranslate.length === 0) {
      setTranslatedDynamicText({});
      return;
    }

    const fetchDynamicTranslations = async () => {
      try {
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            target: locale,
            source: 'auto',
            texts: textsToTranslate,
          }),
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch dynamic translations');
        }

        const data = (await response.json()) as {
          translations?: Record<string, string>;
        };

        if (active) {
          setTranslatedDynamicText(data.translations ?? {});
        }
      } catch {
        if (active) {
          setTranslatedDynamicText({});
        }
      }
    };

    fetchDynamicTranslations();

    return () => {
      active = false;
    };
  }, [locale, textsToTranslate]);
  
  // Get selected floor and its units
  const selectedFloor = floors.find(f => f._id === selectedFloorId);
  const unitsInSelectedFloor = selectedFloor?.units.map(unit => ({
    ...unit,
    floorId: selectedFloor._id,
    floorName: selectedFloor.name
  })) || [];

  const getStatusColor = (status: UnitStatus) => {
    switch (status) {
      case 'available':
        return 'bg-green-700';
      case 'reserved':
        return 'bg-yellow-500';
      case 'sold':
        return 'bg-red-900';
    }
  };

  const handleDeleteUnit = (floorId: string, unitId: string) => {
    deleteUnit(floorId, unitId);
  };

  const handleDeleteFloor = (floorId: string) => {
    deleteFloor(floorId);
  };

  const handleAddUnit = (floorId: string) => {
    setActiveFloorForAdd(floorId);
    setNewUnitName('');
    setShowAddUnitModal(true);
  };

  const handleSave = () => {
    router.push("/dashboard");
  };

  const handleAddFloor = () => {
    setNewFloorName('');
    setShowAddFloorModal(true);
  };

  const confirmAddFloor = async () => {
    if (!newFloorName.trim() || !projectId) return;
    
    await addFloor({
      projectId,
      name: newFloorName
    });
    
    setShowAddFloorModal(false);
    setNewFloorName('');
  };

  const confirmAddUnit = async () => {
    if (!newUnitName.trim() || !activeFloorForAdd) return;
    
    await addUnit(activeFloorForAdd, { name: newUnitName });
    
    setShowAddUnitModal(false);
    setNewUnitName('');
  };

  const handleUpdateUnitStatus = async (floorId: string, unitId: string, newStatus: UnitStatus) => {
    const unit = floors.find(f => f._id === floorId)?.units.find(u => u._id === unitId);
    if (unit) {
      await updateUnit(floorId, unitId, { name: unit.name, status: newStatus });
    }
  };

  const handleFloorClick = (floorId: string) => {
    setSelectedFloorId(floorId);
  };

  const openEditFloorModal = (floorId: string) => {
    const floorToEdit = floors.find(f => f._id === floorId);
    if (floorToEdit) {
      setEditingFloorData(floorToEdit);
      setTempFloorName(floorToEdit.name);
      setTempUnits([...floorToEdit.units]);
      setShowEditFloorModal(true);
    }
  };

 

  const updateTempUnitName = (unitId: string, newName: string) => {
    setTempUnits(tempUnits.map(unit => 
      unit._id === unitId ? { ...unit, name: newName } : unit
    ));
  };

  const updateTempUnitStatus = (unitId: string, newStatus: UnitStatus) => {
    setTempUnits(tempUnits.map(unit => 
      unit._id === unitId ? { ...unit, status: newStatus } : unit
    ));
  };

  const addTempUnit = () => {
    if (!newUnitInEdit.trim()) return;
    const newUnit: Unit = {
      _id: `temp-${Date.now()}`,
      name: newUnitInEdit,
      status: 'available'
    };
    setTempUnits([...tempUnits, newUnit]);
    setNewUnitInEdit('');
  };

  const removeTempUnit = (unitId: string) => {
    setTempUnits(tempUnits.filter(unit => unit._id !== unitId));
  };

  // Model Management Functions
  const handleAddModel = () => {
    setNewModelName('');
    setNewModelArea('');
    setNewModelFace('');
    setShowAddModelModal(true);
  };

  const confirmAddModel = async () => {
    if (!newModelName.trim() || !newModelArea.trim() || !projectId) return;
    
    await addModel({
      projectId,
      name: newModelName,
      area: parseFloat(newModelArea) || undefined,
      face: newModelFace || undefined
    });
    
    setShowAddModelModal(false);
    setNewModelName('');
    setNewModelArea('');
    setNewModelFace('');
  };

  const openEditModelModal = (modelId: string) => {
    const modelToEdit = models.find(m => m._id === modelId);
    if (modelToEdit) {
      setEditingModelData(modelToEdit);
      setTempModelName(modelToEdit.name);
      setTempModelArea(modelToEdit.area?.toString() || '');
      setTempModelFace(modelToEdit.face || '');
      setShowEditModelModal(true);
    }
  };

  const saveEditedModel = async () => {
    if (!editingModelData || !tempModelName.trim() || !tempModelArea.trim()) return;

    await updateModel(editingModelData._id, {
      name: tempModelName,
      area: parseFloat(tempModelArea) || undefined,
      face: tempModelFace || undefined
    });

    setShowEditModelModal(false);
    setEditingModelData(null);
    setTempModelName('');
    setTempModelArea('');
    setTempModelFace('');
  };

  const handleDeleteModel = async (modelId: string) => {
    await deleteModel(modelId);
  };

  // Loading states
  if (projectsLoading || modelsLoading || floorsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('loadingProjectData')}</p>
        </div>
      </div>
    );
  }

  return (
    <div dir="ltr" className="pt-14 sm:pt-16">
      {/* <Navbar /> */}
      <div className="fixed right-3 top-3 z-[100]">
        <ThemeToggle />
      </div>
      
      <div className="flex min-h-screen flex-col xl:flex-row">
        {/* Sidebar */}
        <div className={`w-full border-b border-gray-200 bg-white dark:bg-[#28272A] xl:w-[420px] 2xl:w-[520px] xl:border-b-0 xl:border-r flex flex-col ${isArabic ? 'text-right' : 'text-left'}`}>
          {/* Property Structure */}
          <div className="border-b border-gray-200 p-4 sm:p-6 xl:p-8">
            <h2 className="font-inter font-semibold text-base leading-6 tracking-[-0.5px] dark:text-[#FFFFFF] text-gray-900 mb-4">{t('propertyStructure')}</h2>
            <div className="space-y-1">
              {projects.map((project) => (
                <button
                  key={project._id}
                  onClick={() => router.push(`/dashboard/${project._id}`)}
                  className={`w-full dark:text-[#FFFFFF] text-[#000000] px-3 py-2.5 rounded text-sm flex items-center gap-2 transition-colors ${
                    isArabic ? 'text-right flex-row-reverse' : 'text-left'
                  } ${
                    project._id === projectId
                      ? 'dark:bg-[#0088FF33] bg-blue-100 text-gray-900'
                      : 'text-gray-700 dark:hover:bg-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  {localizeDynamicText(project.name)}
                </button>
              ))}
            </div>
          </div>

          {/* Model Management */}
          <div className="border-b border-gray-200 p-4 sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-inter font-semibold text-base leading-6 tracking-[-0.5px] dark:text-[#FFFFFF] text-gray-900">{t('models')}</h2>
              <button
                onClick={handleAddModel}
                className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5"
              >
                + {t('addModel')}
              </button>
            </div>
            
            <div className="space-y-2">
              {models.map((model) => (
                <div key={model._id} className="flex flex-col gap-2 rounded bg-gray-50 p-2 dark:bg-gray-700 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="font-medium text-gray-900 dark:text-white">{localizeDynamicText(model.name)}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{localizeDynamicText(model.area ?? '')} {t('sqft')}</div>
                    {model.face && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">{t('faceValue', { face: localizeDynamicText(model.face) })}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 self-end sm:self-auto">
                    <button
                      onClick={() => openEditModelModal(model._id)}
                      className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      title={t('editModel')}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteModel(model._id)}
                      className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      title={t('deleteModel')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {models.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-2">{t('noModelsAdded')}</p>
              )}
            </div>
          </div>

          {/* Unit Status Management */}
          <div className="flex-1 overflow-visible p-4 sm:p-6 xl:overflow-auto">
            <h2 className="font-inter font-semibold text-base leading-6 tracking-[-0.5px] dark:text-[#FFFFFF] text-gray-900 mb-4">{t('unitStatusManagement')}</h2>
            
            <div className="space-y-3">
              {unitsInSelectedFloor.length > 0 ? (
                unitsInSelectedFloor.map((unit, index) => (
                  <div key={`${unit._id}-${unit.name}-${index}`} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                    <span className="w-full text-sm text-gray-700 dark:text-[#FFFFFF] sm:w-24">{t('unitWithName', { name: localizeDynamicText(unit.name) })}</span>
                    <select
                      value={unit.status}
                      onChange={(e) => handleUpdateUnitStatus(unit.floorId, unit._id, e.target.value as UnitStatus)}
                      className="flex-1 px-3 py-1.5 text-sm border text-gray-600 dark:text-white border-gray-300 rounded bg-white dark:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="available">{t('status.available')}</option>
                      <option value="reserved">{t('status.reserved')}</option>
                      <option value="sold">{t('status.sold')}</option>
                    </select>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">
                  {selectedFloorId ? t('noUnitsInFloor') : t('selectFloorToManage')}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex min-w-0 flex-1 flex-col bg-white dark:bg-black">
          {/* Header with Theme Toggle */}
          <div className="flex items-center justify-end px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link href="/dashboard">
                <button className="w-full rounded-lg px-4 py-2 text-sm text-gray-700 hover:text-gray-900 dark:border-1 dark:border-gray-500 dark:text-gray-50 dark:hover:text-gray-300 sm:w-auto">
                  {t('cancel')}
                </button>
              </Link>
              <button onClick={handleSave} className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700 sm:w-auto">
                {t('saveChanges')}
              </button>
            </div>
          </div>

          {/* Live Preview - Table Style Layout */}
          <div className="flex-1 overflow-auto px-4 pb-6 sm:px-6 lg:px-8 xl:px-12">
            <div className='flex flex-col gap-3 pb-6 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:pb-8'>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-[#E5E7EB]">{t('livePreview')}</h1>
              <div>
                <button onClick={handleAddFloor} className='rounded-lg bg-[#E1EFFB] p-3 text-[#0088FF] hover:bg-[#e0e3e6]'>
                  + {t('addFloor')}
                </button>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white dark:bg-[#1A1A1A] p-[16px] md:p-[32px] ">
              {floors.map((floor) => (
                <div 
                  key={floor._id} 
                  onClick={() => handleFloorClick(floor._id)}
                  className={`my-2 flex cursor-pointer flex-col gap-3 rounded-lg border-1 border-[#E5E7EB] px-4 py-4 transition-all dark:border-none sm:px-5 lg:flex-row lg:items-center ${
                    selectedFloorId === floor._id 
                      ? 'bg-blue-50 dark:bg-gray-900' 
                      : 'bg-white hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800' 
                  }`}
                >
                  {/* Floor Label */}
                  <div className="w-full flex-shrink-0 text-base font-medium text-gray-900 dark:text-[#FFFFFF] lg:w-24">
                    {localizeDynamicText(floor.name)}
                  </div>
                  
                  {/* Units */}
                  <div className="my-1 flex flex-1 flex-wrap items-center gap-2">
                    {floor.units.map((unit, unitIndex) => (
                      <div key={`${unit._id}-${unit.name}-${unitIndex}`} className="relative rounded-lg border-1 border-[#E5E7EB] dark:border-none">
                        {/* Delete X button on unit */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteUnit(floor._id, unit._id);
                          }}

                          
                          className="absolute -top-2 -right-2 w-4 h-4 bg-white border border-red-400 rounded-full flex items-center justify-center z-10 hover:bg-red-50"
                        >
                          <svg className="w-2.5 h-2.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        
                        {/* Unit Box */}
                        <div className={`${getStatusColor(unit.status)} text-white px-5 py-2.5 rounded text-sm font-medium`}>
                          {localizeDynamicText(unit.name)}
                        </div>
                      </div>
                    ))}
                    
                    {/* Add Unit Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddUnit(floor._id);
                      }}
                      className="px-4 py-2.5 bg-blue-50 text-blue-600 rounded text-sm font-medium hover:bg-blue-100 transition-colors flex items-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                      </svg>
                      {t('addUnit')}
                    </button>
                  </div>

                  {/* Action Buttons - Edit and Delete */}
                  <div className="ml-0 flex flex-shrink-0 flex-wrap items-center gap-2 lg:ml-4 lg:flex-nowrap">
                    {/* Edit Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditFloorModal(floor._id);
                      }}
                      className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 rounded-lg flex items-center gap-1.5 transition-colors"
                      title={t('editFloorAndUnits')}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      {t('edit')}
                    </button>
                    
                    {/* Delete Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFloor(floor._id);
                      }}
                      className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50 rounded-lg flex items-center gap-1.5 transition-colors"
                      title={t('deleteFloor')}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      {t('delete')}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-700 rounded"></div>
                <span className="text-sm text-gray-600">{t('status.available')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="text-sm text-gray-600">{t('status.reserved')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-900 rounded"></div>
                <span className="text-sm text-gray-600">{t('status.sold')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modals - All modals remain the same but with store integration */}
        {/* Add Floor Modal */}
        {showAddFloorModal && (
          <div className="fixed inset-0 backdrop-blur-xl flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                {t('addFloorModal.title')}
              </h3>
              
              <input
                type="text"
                value={newFloorName}
                onChange={(e) => setNewFloorName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && confirmAddFloor()}
                placeholder={t('addFloorModal.placeholder')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-base focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                autoFocus
              />
              
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => {
                    setShowAddFloorModal(false);
                    setNewFloorName('');
                  }}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={confirmAddFloor}
                  disabled={!newFloorName.trim()}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                  {t('add')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Unit Modal */}
        {showAddUnitModal && (
          <div className="fixed inset-0 backdrop-blur-xl flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                {t('addUnitModal.title')}
              </h3>
              
              <div className="space-y-4">
                <input
                  type="text"
                  value={newUnitName}
                  onChange={(e) => setNewUnitName(e.target.value)}
                  placeholder={t('addUnitModal.placeholder')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>
              
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => {
                    setShowAddUnitModal(false);
                    setNewUnitName('');
                  }}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={confirmAddUnit}
                  disabled={!newUnitName.trim()}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                  {t('add')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Floor Modal */}
        {showEditFloorModal && editingFloorData && (
          <div className="fixed inset-0 backdrop-blur-xl flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
                  {t('editFloorModal.title')}
                </h3>
                
                {/* Floor Name */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('editFloorModal.floorName')}
                  </label>
                  <input
                    type="text"
                    value={tempFloorName}
                    onChange={(e) => setTempFloorName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t('editFloorModal.floorNamePlaceholder')}
                  />
                </div>

                {/* Units Section */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                      {t('editFloorModal.unitsCount', { count: tempUnits.length })}
                    </h4>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newUnitInEdit}
                        onChange={(e) => setNewUnitInEdit(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addTempUnit()}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                        placeholder={t('editFloorModal.newUnitPlaceholder')}
                      />
                      <button
                        onClick={addTempUnit}
                        disabled={!newUnitInEdit.trim()}
                        className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                      >
                        {t('addUnit')}
                      </button>
                    </div>
                  </div>

                  {/* Units List */}
                  {tempUnits.length > 0 ? (
                    <div className="space-y-3">
                      {tempUnits.map((unit, index) => (
                        <div key={`${unit._id}-${unit.name}-${index}`} className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                          <div className="flex-1">
                            <input
                              type="text"
                              value={unit.name}
                              onChange={(e) => updateTempUnitName(unit._id, e.target.value)}
                              className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                          <select
                            value={unit.status}
                            onChange={(e) => updateTempUnitStatus(unit._id, e.target.value as UnitStatus)}
                            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="available">{t('status.available')}</option>
                            <option value="reserved">{t('status.reserved')}</option>
                            <option value="sold">{t('status.sold')}</option>
                          </select>
                          <button
                            onClick={() => removeTempUnit(unit._id)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                      <p className="text-gray-500 dark:text-gray-400">{t('noUnitsInFloor')}</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 border-t border-gray-200 pt-4 dark:border-gray-700 sm:flex-row">
                  <button
                    onClick={() => {
                      setShowEditFloorModal(false);
                      setEditingFloorData(null);
                      setTempFloorName('');
                      setTempUnits([]);
                    }}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    {t('cancel')}
                  </button>
                 <button
  onClick={saveEditedFloor}
  disabled={!tempFloorName.trim() || saving}
  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
>
  {saving ? (
    <>
      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      {t('saving')}
    </>
  ) : (
    t('saveChanges')
  )}
</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Model Modal */}
        {showAddModelModal && (
          <div className="fixed inset-0 backdrop-blur-xl flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                {t('addModelModal.title')}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('addModelModal.modelName')} *
                  </label>
                  <input
                    type="text"
                    value={newModelName}
                    onChange={(e) => setNewModelName(e.target.value)}
                    placeholder={t('addModelModal.modelNamePlaceholder')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('addModelModal.totalArea')} *
                  </label>
                  <input
                    type="number"
                    value={newModelArea}
                    onChange={(e) => setNewModelArea(e.target.value)}
                    placeholder={t('addModelModal.totalAreaPlaceholder')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('addModelModal.faceOptional')}
                  </label>
                  <input
                    type="text"
                    value={newModelFace}
                    onChange={(e) => setNewModelFace(e.target.value)}
                    placeholder={t('addModelModal.facePlaceholder')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => {
                    setShowAddModelModal(false);
                    setNewModelName('');
                    setNewModelArea('');
                    setNewModelFace('');
                  }}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={confirmAddModel}
                  disabled={!newModelName.trim() || !newModelArea.trim()}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                  {t('addModel')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Model Modal */}
        {showEditModelModal && editingModelData && (
          <div className="fixed inset-0 backdrop-blur-xl flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                {t('editModelModal.title')}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('editModelModal.modelName')} *
                  </label>
                  <input
                    type="text"
                    value={tempModelName}
                    onChange={(e) => setTempModelName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('editModelModal.totalArea')} *
                  </label>
                  <input
                    type="number"
                    value={tempModelArea}
                    onChange={(e) => setTempModelArea(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('editModelModal.faceOptional')}
                  </label>
                  <input
                    type="text"
                    value={tempModelFace}
                    onChange={(e) => setTempModelFace(e.target.value)}
                    placeholder={t('editModelModal.facePlaceholder')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => {
                    setShowEditModelModal(false);
                    setEditingModelData(null);
                    setTempModelName('');
                    setTempModelArea('');
                    setTempModelFace('');
                  }}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={saveEditedModel}
                  disabled={!tempModelName.trim() || !tempModelArea.trim()}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                  {t('saveChanges')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
