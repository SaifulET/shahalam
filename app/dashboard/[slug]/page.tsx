'use client';

import Navbar from '@/component/home/navbar';
import ThemeToggle from '@/component/ThemeToggle/ThemeToggle';
import { Add01FreeIcons } from '@hugeicons/core-free-icons';
import { ArrowDownToDot, Edit, Trash2, Pencil, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

type UnitStatus = 'available' | 'reserved' | 'sold';

interface Model {
  id: string;
  name: string;
  totalArea: string;
}

interface Unit {
  id: string;
  number: string;
  status: UnitStatus;
  modelId?: string;
}

interface Floor {
  id: string;
  name: string;
  units: Unit[];
}

interface Property {
  id: string;
  name: string;
  floors: Floor[];
  models: Model[];
}

const initialProperties: Property[] = [
  {
    id: '1',
    name: 'Downtown Plaza',
    floors: [],
    models: []
  },
  {
    id: '2',
    name: 'Riverside Residences',
    floors: [],
    models: []
  },
  {
    id: '3',
    name: 'Tech Hub Campus',
    floors: [
      { id: 'f1', name: '1F', units: [
        { id: 'u1', number: '801', status: 'available', modelId: 'm1' },
        { id: 'u2', number: '802', status: 'reserved', modelId: 'm2' },
        { id: 'u3', number: '803', status: 'sold', modelId: 'm1' },
        { id: 'u4', number: '804', status: 'sold', modelId: 'm3' },
        { id: 'u5', number: '805', status: 'available', modelId: 'm2' },
      ]},
      { id: 'f2', name: '2F', units: [
        { id: 'u6', number: '901', status: 'reserved', modelId: 'm1' },
        { id: 'u7', number: '902', status: 'available', modelId: 'm3' },
        { id: 'u8', number: '903', status: 'sold', modelId: 'm2' },
        { id: 'u9', number: '904', status: 'sold', modelId: 'm1' },
        { id: 'u10', number: '905', status: 'sold', modelId: 'm3' },
      ]},
      { id: 'f3', name: '3F', units: [
        { id: 'u11', number: '801', status: 'reserved' },
        { id: 'u12', number: '802', status: 'sold' },
        { id: 'u13', number: '803', status: 'available' },
        { id: 'u14', number: '804', status: 'sold' },
      ]},
      { id: 'f4', name: '4F', units: [
        { id: 'u15', number: '701', status: 'available' },
        { id: 'u16', number: '702', status: 'reserved' },
        { id: 'u17', number: '703', status: 'available' },
        { id: 'u18', number: '704', status: 'sold' },
      ]},
      { id: 'f5', name: '5F', units: [
        { id: 'u19', number: '801', status: 'reserved' },
        { id: 'u20', number: '602', status: 'available' },
        { id: 'u21', number: '603', status: 'sold' },
        { id: 'u22', number: '604', status: 'reserved' },
      ]},
      { id: 'f6', name: '6F', units: [
        { id: 'u23', number: '501', status: 'sold' },
        { id: 'u24', number: '502', status: 'available' },
        { id: 'u25', number: '503', status: 'available' },
        { id: 'u26', number: '504', status: 'reserved' },
      ]},
    ],
    models: [
      { id: 'm1', name: 'Model A', totalArea: '1200 sqft' },
      { id: 'm2', name: 'Model B', totalArea: '1500 sqft' },
      { id: 'm3', name: 'Model C', totalArea: '1800 sqft' },
    ]
  },
  {
    id: '4',
    name: 'Metro Shopping Center',
    floors: [],
    models: []
  },
  {
    id: '5',
    name: 'Grand Hotel Renovation',
    floors: [],
    models: []
  },
  {
    id: '6',
    name: 'Innovation Academy',
    floors: [],
    models: []
  },
];

export default function Home() {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('3');
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
  const [showEditModelModal, setShowEditModelModal] = useState(false);
  const [editingModelData, setEditingModelData] = useState<Model | null>(null);
  const [tempModelName, setTempModelName] = useState('');
  const [tempModelArea, setTempModelArea] = useState('');
  const [selectedModelForUnit, setSelectedModelForUnit] = useState<string>('');

  const selectedProperty = properties.find(p => p.id === selectedPropertyId);
  
  // Auto-select first floor when property changes
  useEffect(() => {
    if (selectedProperty && selectedProperty.floors.length > 0) {
      // If no floor is selected or the selected floor doesn't exist in current property, select first floor
      if (!selectedFloorId || !selectedProperty.floors.find(f => f.id === selectedFloorId)) {
        setSelectedFloorId(selectedProperty.floors[0].id);
      }
    } else {
      setSelectedFloorId('');
    }
  }, [selectedProperty, selectedFloorId]);

  // Get units from the selected floor only
  const selectedFloor = selectedProperty?.floors.find(f => f.id === selectedFloorId);
  const unitsInSelectedFloor = selectedFloor?.units.map(unit => ({
    ...unit,
    floorId: selectedFloor.id,
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

  const deleteUnit = (floorId: string, unitId: string) => {
    setProperties(properties.map(property => {
      if (property.id === selectedPropertyId) {
        return {
          ...property,
          floors: property.floors.map(floor => {
            if (floor.id === floorId) {
              return {
                ...floor,
                units: floor.units.filter(unit => unit.id !== unitId)
              };
            }
            return floor;
          })
        };
      }
      return property;
    }));
  };

  const deleteFloor = (floorId: string) => {
    setProperties(properties.map(property => {
      if (property.id === selectedPropertyId) {
        const updatedFloors = property.floors.filter(floor => floor.id !== floorId);
        // If we're deleting the selected floor, select the next available one or clear selection
        if (floorId === selectedFloorId) {
          if (updatedFloors.length > 0) {
            setSelectedFloorId(updatedFloors[0].id);
          } else {
            setSelectedFloorId('');
          }
        }
        return {
          ...property,
          floors: updatedFloors
        };
      }
      return property;
    }));
  };

  const addUnit = (floorId: string) => {
    setActiveFloorForAdd(floorId);
    setNewUnitName('');
    setSelectedModelForUnit(selectedProperty?.models[0]?.id || '');
    setShowAddUnitModal(true);
  };

  const route = useRouter();
  
  const handleSave = () => {
    route.push("/dashboard");
  };

  const addFloor = () => {
    setNewFloorName('');
    setShowAddFloorModal(true);
  };

  const confirmAddFloor = () => {
    if (!newFloorName.trim()) return;
    
    setProperties(properties.map(property => {
      if (property.id === selectedPropertyId) {
        const newFloor: Floor = {
          id: `f${Date.now()}`,
          name: newFloorName,
          units: []
        };
        
        return {
          ...property,
          floors: [...property.floors, newFloor]
        };
      }
      return property;
    }));
    
    setShowAddFloorModal(false);
    setNewFloorName('');
  };

  const confirmAddUnit = () => {
    if (!newUnitName.trim()) return;
    
    setProperties(properties.map(property => {
      if (property.id === selectedPropertyId) {
        return {
          ...property,
          floors: property.floors.map(floor => {
            if (floor.id === activeFloorForAdd) {
              return {
                ...floor,
                units: [...floor.units, {
                  id: `u${Date.now()}`,
                  number: newUnitName,
                  status: 'available' as UnitStatus,
                  modelId: selectedModelForUnit || undefined
                }]
              };
            }
            return floor;
          })
        };
      }
      return property;
    }));
    
    setShowAddUnitModal(false);
    setNewUnitName('');
    setSelectedModelForUnit('');
  };

  const updateUnitStatus = (floorId: string, unitId: string, newStatus: UnitStatus) => {
    setProperties(properties.map(property => {
      if (property.id === selectedPropertyId) {
        return {
          ...property,
          floors: property.floors.map(floor => {
            if (floor.id === floorId) {
              return {
                ...floor,
                units: floor.units.map(unit =>
                  unit.id === unitId ? { ...unit, status: newStatus } : unit
                )
              };
            }
            return floor;
          })
        };
      }
      return property;
    }));
  };

  const handleFloorClick = (floorId: string) => {
    setSelectedFloorId(floorId);
  };

  const openEditFloorModal = (floorId: string) => {
    const floorToEdit = selectedProperty?.floors.find(f => f.id === floorId);
    if (floorToEdit) {
      setEditingFloorData(floorToEdit);
      setTempFloorName(floorToEdit.name);
      setTempUnits([...floorToEdit.units]);
      setShowEditFloorModal(true);
    }
  };

  const saveEditedFloor = () => {
    if (!editingFloorData || !tempFloorName.trim()) return;

    setProperties(properties.map(property => {
      if (property.id === selectedPropertyId) {
        return {
          ...property,
          floors: property.floors.map(floor => {
            if (floor.id === editingFloorData.id) {
              return {
                ...floor,
                name: tempFloorName,
                units: tempUnits
              };
            }
            return floor;
          })
        };
      }
      return property;
    }));

    setShowEditFloorModal(false);
    setEditingFloorData(null);
    setTempFloorName('');
    setTempUnits([]);
  };

  const updateTempUnitName = (unitId: string, newName: string) => {
    setTempUnits(tempUnits.map(unit => 
      unit.id === unitId ? { ...unit, number: newName } : unit
    ));
  };

  const updateTempUnitStatus = (unitId: string, newStatus: UnitStatus) => {
    setTempUnits(tempUnits.map(unit => 
      unit.id === unitId ? { ...unit, status: newStatus } : unit
    ));
  };

  const addTempUnit = () => {
    if (!newUnitInEdit.trim()) return;
    const newUnit: Unit = {
      id: `u${Date.now()}`,
      number: newUnitInEdit,
      status: 'available'
    };
    setTempUnits([...tempUnits, newUnit]);
    setNewUnitInEdit('');
  };

  const removeTempUnit = (unitId: string) => {
    setTempUnits(tempUnits.filter(unit => unit.id !== unitId));
  };

  // Model Management Functions
  const addModel = () => {
    setNewModelName('');
    setNewModelArea('');
    setShowAddModelModal(true);
  };

  const confirmAddModel = () => {
    if (!newModelName.trim() || !newModelArea.trim()) return;
    
    setProperties(properties.map(property => {
      if (property.id === selectedPropertyId) {
        const newModel: Model = {
          id: `m${Date.now()}`,
          name: newModelName,
          totalArea: newModelArea
        };
        
        return {
          ...property,
          models: [...property.models, newModel]
        };
      }
      return property;
    }));
    
    setShowAddModelModal(false);
    setNewModelName('');
    setNewModelArea('');
  };

  const openEditModelModal = (modelId: string) => {
    const modelToEdit = selectedProperty?.models.find(m => m.id === modelId);
    if (modelToEdit) {
      setEditingModelData(modelToEdit);
      setTempModelName(modelToEdit.name);
      setTempModelArea(modelToEdit.totalArea);
      setShowEditModelModal(true);
    }
  };

  const saveEditedModel = () => {
    if (!editingModelData || !tempModelName.trim() || !tempModelArea.trim()) return;

    setProperties(properties.map(property => {
      if (property.id === selectedPropertyId) {
        return {
          ...property,
          models: property.models.map(model => {
            if (model.id === editingModelData.id) {
              return {
                ...model,
                name: tempModelName,
                totalArea: tempModelArea
              };
            }
            return model;
          })
        };
      }
      return property;
    }));

    setShowEditModelModal(false);
    setEditingModelData(null);
    setTempModelName('');
    setTempModelArea('');
  };

  const deleteModel = (modelId: string) => {
    setProperties(properties.map(property => {
      if (property.id === selectedPropertyId) {
        // Remove model from property
        const updatedModels = property.models.filter(model => model.id !== modelId);
        
        // Remove model reference from all units
        const updatedFloors = property.floors.map(floor => ({
          ...floor,
          units: floor.units.map(unit => 
            unit.modelId === modelId ? { ...unit, modelId: undefined } : unit
          )
        }));
        
        return {
          ...property,
          models: updatedModels,
          floors: updatedFloors
        };
      }
      return property;
    }));
  };

  return (
    <div>
      <Navbar></Navbar>
      <div className="absolute right-1 top-3">
        <ThemeToggle />
      </div>
      
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-[150px] md:w-[520px] dark:bg-[#28272A] bg-white border-r border-gray-200 flex flex-col">
          {/* Property Structure */}
          <div className="p-[24px] md:p-[32px] border-b border-gray-200">
            <h2 className="font-inter font-semibold text-base leading-6 tracking-[-0.5px] dark:text-[#FFFFFF] text-gray-900 mb-4">Property Structure</h2>
            <div className="space-y-1">
              {properties.map((property) => (
                <button
                  key={property.id}
                  onClick={() => setSelectedPropertyId(property.id)}
                  className={`w-full dark:text-[#FFFFFF] text-[#000000] text-left px-3 py-2.5 rounded text-sm flex items-center gap-2 transition-colors ${
                    selectedPropertyId === property.id
                      ? 'dark:bg-[#0088FF33] bg-blue-100 text-gray-900'
                      : 'text-gray-700 dark:hover:bg-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  {property.name}
                </button>
              ))}
            </div>
          </div>

          {/* Model Management - NEW SECTION ADDED */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-inter font-semibold text-base leading-6 tracking-[-0.5px] dark:text-[#FFFFFF] text-gray-900">Models</h2>
              <button
                onClick={addModel}
                className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5"
              >
                + Add Model
              </button>
            </div>
            
            <div className="space-y-2">
              {selectedProperty?.models.map((model) => (
                <div key={model.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{model.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{model.totalArea}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModelModal(model.id)}
                      className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      title="Edit model"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteModel(model.id)}
                      className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      title="Delete model"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {selectedProperty?.models.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-2">No models added yet</p>
              )}
            </div>
          </div>

          {/* Unit Status Management */}
          <div className="p-6 flex-1 overflow-auto">
            <h2 className="font-inter font-semibold text-base leading-6 tracking-[-0.5px] dark:text-[#FFFFFF] text-gray-900 mb-4">Unit Status Management</h2>
            
            <div className="space-y-3">
              {unitsInSelectedFloor.length > 0 ? (
                unitsInSelectedFloor.map((unit) => (
                  <div key={unit.id} className="flex items-center gap-3">
                    <span className="text-sm text-gray-700 w-24 dark:text-[#FFFFFF]">Unit {unit.number}</span>
                    <select
                      value={unit.status}
                      onChange={(e) => updateUnitStatus(unit.floorId, unit.id, e.target.value as UnitStatus)}
                      className="flex-1 px-3 py-1.5 text-sm border text-gray-600 dark:text-white border-gray-300 rounded bg-white dark:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="available">Available</option>
                      <option value="reserved">Reserved</option>
                      <option value="sold">Sold</option>
                    </select>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">
                  {selectedFloorId ? 'No units in this floor' : 'Select a floor to manage units'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Main Content - EXACTLY THE SAME AS BEFORE */}
        <div className="flex-1 flex flex-col dark:bg-black bg-white">
          {/* Header with Theme Toggle */}
          <div className="px-8 py-[38px] flex items-center justify-end">
            <div className="flex gap-3">
              <Link href="/dashboard">
                <button className="px-4 py-2 text-sm text-gray-700 dark:text-gray-50 dark:border-1 dark:border-gray-500 rounded-lg dark:hover:text-gray-300 hover:text-gray-900">
                  Cancel
                </button>
              </Link>
              <button onClick={handleSave} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Save Changes
              </button>
            </div>
          </div>

          {/* Live Preview - Table Style Layout */}
          <div className="flex-1 overflow-auto px-[52px]">
            <div className='flex justify-between '>
              <h1 className="text-lg font-semibold dark:text-[#E5E7EB] text-gray-900 pb-[32px]">Live Preview</h1>
              <div>
                <button onClick={addFloor} className='text-[#0088FF] bg-[#E1EFFB] p-[12px] rounded-lg hover:bg-[#e0e3e6]'>
                  + Add Floor
                </button>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white dark:bg-[#1A1A1A] p-[16px] md:p-[32px] ">
              {selectedProperty?.floors.map((floor, index) => (
                <div 
                  key={floor.id} 
                  onClick={() => handleFloorClick(floor.id)}
                  className={`flex items-center px-6 py-4 my-2 border-1 border-[#E5E7EB] dark:border-none last:border-b-0 cursor-pointer transition-all rounded-lg ${
                    selectedFloorId === floor.id 
                      ? 'bg-blue-50 dark:bg-gray-900' 
                      : 'bg-white hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800' 
                  }`}
                >
                  {/* Floor Label */}
                  <div className="text-base font-medium text-gray-900 dark:text-[#FFFFFF] w-16 flex-shrink-0">
                    {floor.name}
                  </div>
                  
                  {/* Units */}
                  <div className="flex items-center my-2 gap-2 flex-1 flex-wrap">
                    {floor.units.map((unit) => (
                      <div key={unit.id} className="relative rounded-lg border-1 border-[#E5E7EB] dark:border-none">
                        {/* Delete X button on unit */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent floor selection when deleting unit
                            deleteUnit(floor.id, unit.id);
                          }}
                          className="absolute -top-2 -right-2 w-4 h-4 bg-white border border-red-400 rounded-full flex items-center justify-center z-10 hover:bg-red-50"
                        >
                          <svg className="w-2.5 h-2.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        
                        {/* Unit Box */}
                        <div className={`${getStatusColor(unit.status)} text-white px-5 py-2.5 rounded text-sm font-medium`}>
                          {unit.number}
                        </div>
                      </div>
                    ))}
                    
                    {/* Add Unit Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent floor selection when adding unit
                        addUnit(floor.id);
                      }}
                      className="px-4 py-2.5 bg-blue-50 text-blue-600 rounded text-sm font-medium hover:bg-blue-100 transition-colors flex items-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Unit
                    </button>
                  </div>

                  {/* Action Buttons - Edit and Delete */}
                  <div className="ml-4 flex items-center gap-2 flex-shrink-0">
                    {/* Edit Button - More Prominent */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent floor selection when editing
                        openEditFloorModal(floor.id);
                      }}
                      className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 rounded-lg flex items-center gap-1.5 transition-colors"
                      title="Edit floor and units"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    
                    {/* Delete Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent floor selection when deleting
                        deleteFloor(floor.id);
                      }}
                      className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50 rounded-lg flex items-center gap-1.5 transition-colors"
                      title="Delete floor"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-8 flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-700 rounded"></div>
                <span className="text-sm text-gray-600">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="text-sm text-gray-600">Reserved</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-900 rounded"></div>
                <span className="text-sm text-gray-600">Sold</span>
              </div>
            </div>
          </div>
        </div>

        {/* Add Floor Modal */}
        {showAddFloorModal && (
          <div className="fixed inset-0 backdrop-blur-xl flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                Name of your Floor
              </h3>
              
              <input
                type="text"
                value={newFloorName}
                onChange={(e) => setNewFloorName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && confirmAddFloor()}
                placeholder="Enter the Floor Name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-base focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                autoFocus
              />
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowAddFloorModal(false);
                    setNewFloorName('');
                  }}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAddFloor}
                  disabled={!newFloorName.trim()}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Unit Modal - UPDATED WITH MODEL SELECTION */}
        {showAddUnitModal && (
          <div className="fixed inset-0 backdrop-blur-xl flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                Add New Unit
              </h3>
              
              <div className="space-y-4">
                <input
                  type="text"
                  value={newUnitName}
                  onChange={(e) => setNewUnitName(e.target.value)}
                  placeholder="Enter unit number/name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                
                {selectedProperty && selectedProperty.models.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Model (Optional)
                    </label>
                    <select
                      value={selectedModelForUnit}
                      onChange={(e) => setSelectedModelForUnit(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">No Model</option>
                      {selectedProperty.models.map((model) => (
                        <option key={model.id} value={model.id}>
                          {model.name} ({model.totalArea})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddUnitModal(false);
                    setNewUnitName('');
                    setSelectedModelForUnit('');
                  }}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAddUnit}
                  disabled={!newUnitName.trim()}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Floor Modal - EXACTLY THE SAME AS BEFORE */}
        {showEditFloorModal && editingFloorData && (
          <div className="fixed inset-0 backdrop-blur-xl flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
                  Edit Floor & Units
                </h3>
                
                {/* Floor Name */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Floor Name
                  </label>
                  <input
                    type="text"
                    value={tempFloorName}
                    onChange={(e) => setTempFloorName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter floor name"
                  />
                </div>

                {/* Units Section */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                      Units ({tempUnits.length})
                    </h4>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newUnitInEdit}
                        onChange={(e) => setNewUnitInEdit(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addTempUnit()}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                        placeholder="New unit name"
                      />
                      <button
                        onClick={addTempUnit}
                        disabled={!newUnitInEdit.trim()}
                        className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                      >
                        Add Unit
                      </button>
                    </div>
                  </div>

                  {/* Units List */}
                  {tempUnits.length > 0 ? (
                    <div className="space-y-3">
                      {tempUnits.map((unit) => (
                        <div key={unit.id} className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                          <div className="flex-1">
                            <input
                              type="text"
                              value={unit.number}
                              onChange={(e) => updateTempUnitName(unit.id, e.target.value)}
                              className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                          <select
                            value={unit.status}
                            onChange={(e) => updateTempUnitStatus(unit.id, e.target.value as UnitStatus)}
                            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="available">Available</option>
                            <option value="reserved">Reserved</option>
                            <option value="sold">Sold</option>
                          </select>
                          <button
                            onClick={() => removeTempUnit(unit.id)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                      <p className="text-gray-500 dark:text-gray-400">No units in this floor</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => {
                      setShowEditFloorModal(false);
                      setEditingFloorData(null);
                      setTempFloorName('');
                      setTempUnits([]);
                    }}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveEditedFloor}
                    disabled={!tempFloorName.trim()}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Model Modal - NEW MODAL */}
        {showAddModelModal && (
          <div className="fixed inset-0 backdrop-blur-xl flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                Add New Model
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Model Name *
                  </label>
                  <input
                    type="text"
                    value={newModelName}
                    onChange={(e) => setNewModelName(e.target.value)}
                    placeholder="e.g., Model A, Premium Suite"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Area *
                  </label>
                  <input
                    type="text"
                    value={newModelArea}
                    onChange={(e) => setNewModelArea(e.target.value)}
                    placeholder="e.g., 1200 sqft, 150 m²"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddModelModal(false);
                    setNewModelName('');
                    setNewModelArea('');
                  }}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAddModel}
                  disabled={!newModelName.trim() || !newModelArea.trim()}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                  Add Model
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Model Modal - NEW MODAL */}
        {showEditModelModal && editingModelData && (
          <div className="fixed inset-0 backdrop-blur-xl flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                Edit Model
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Model Name *
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
                    Total Area *
                  </label>
                  <input
                    type="text"
                    value={tempModelArea}
                    onChange={(e) => setTempModelArea(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowEditModelModal(false);
                    setEditingModelData(null);
                    setTempModelName('');
                    setTempModelArea('');
                  }}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEditedModel}
                  disabled={!tempModelName.trim() || !tempModelArea.trim()}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}