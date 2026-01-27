'use client';

import ThemeToggle from '@/component/ThemeToggle/ThemeToggle';
import { useState, useEffect } from 'react';

type UnitStatus = 'available' | 'reserved' | 'sold';

interface Unit {
  id: string;
  number: string;
  status: UnitStatus;
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
}

const initialProperties: Property[] = [
  {
    id: '1',
    name: 'Downtown Plaza',
    floors: []
  },
  {
    id: '2',
    name: 'Riverside Residences',
    floors: []
  },
  {
    id: '3',
    name: 'Tech Hub Campus',
    floors: [
      { id: 'f1', name: '1F', units: [
        { id: 'u1', number: '801', status: 'available' },
        { id: 'u2', number: '802', status: 'reserved' },
        { id: 'u3', number: '803', status: 'sold' },
        { id: 'u4', number: '804', status: 'sold' },
        { id: 'u5', number: '805', status: 'available' },
      ]},
      { id: 'f2', name: '2F', units: [
        { id: 'u6', number: '901', status: 'reserved' },
        { id: 'u7', number: '902', status: 'available' },
        { id: 'u8', number: '903', status: 'sold' },
        { id: 'u9', number: '904', status: 'sold' },
        { id: 'u10', number: '905', status: 'sold' },
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
    ]
  },
  {
    id: '4',
    name: 'Metro Shopping Center',
    floors: []
  },
  {
    id: '5',
    name: 'Grand Hotel Renovation',
    floors: []
  },
  {
    id: '6',
    name: 'Innovation Academy',
    floors: []
  },
];

export default function Home() {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('3');
  const [selectedFloorId, setSelectedFloorId] = useState<string>('');
  const [showAddUnitModal, setShowAddUnitModal] = useState(false);
  const [activeFloorForAdd, setActiveFloorForAdd] = useState<string>('');
  const [newUnitName, setNewUnitName] = useState('');

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
    setShowAddUnitModal(true);
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
                  status: 'available' as UnitStatus
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

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-[150px] md:w-[520px] dark:bg-[#28272A] bg-white border-r border-gray-200 flex flex-col">
        {/* Unite Structure */}
        <div className="p-[24px] md:p-[32px] border-b border-gray-200">
          <h2 className="font-inter font-semibold text-base leading-6 tracking-[-0.5px] dark:text-[#FFFFFF] text-gray-900 mb-4">Unite Structure</h2>
          <div className="space-y-1">
            {properties.map((property) => (
              <button
                key={property.id}
                onClick={() => setSelectedPropertyId(property.id)}
                className={`w-full dark:text-[#FFFFFF] text-left px-3 py-2.5 rounded text-sm flex items-center gap-2 transition-colors ${
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

        {/* Unit Status Management */}
        <div className="p-6 flex-1 overflow-auto">
         <h2 className="font-inter font-semibold text-base leading-6 tracking-[-0.5px] dark:text-[#FFFFFF] text-gray-900 mb-4">Unit Status Management</h2>
          
          {/* Units in Selected Floor */}
          <div className="space-y-3">
            {unitsInSelectedFloor.length > 0 ? (
              unitsInSelectedFloor.map((unit) => (
                <div key={unit.id} className="flex items-center gap-3">
                  <span className="text-sm text-gray-700 w-24 dark:text-[#FFFFFF]">Unit {unit.number}</span>
                  <select
                    value={unit.status}
                    onChange={(e) => updateUnitStatus(unit.floorId, unit.id, e.target.value as UnitStatus)}
                    className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col dark:bg-black bg-white">
        {/* Header with Theme Toggle */}
        <div className="px-8 py-[38px] flex items-center justify-end">
          {/* Theme Toggle on the left */}
         
          
          {/* Action buttons on the right */}
          <div className="flex gap-3">
            <button className="px-4 py-2 text-sm text-gray-700 dark:text-gray-50 dark:border-1 dark:border-gray-500 rounded-lg dark:hover:text-gray-300 hover:text-gray-900">
              Cancel
            </button>
            <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Save Changes
            </button>
             <div className="flex items-center">
            <ThemeToggle />
          </div>
          </div>
        </div>

        {/* Live Preview - Table Style Layout */}
        <div className="flex-1 overflow-auto px-[52px]">
          <h1 className="text-lg font-semibold dark:text-[#E5E7EB] text-gray-900 pb-[32px]">Live Preview</h1>
          <div className="border border-gray-200  rounded-lg overflow-hidden bg-white dark:bg-[#1A1A1A] p-[16px] md:p-[32px] ">
            {selectedProperty?.floors.map((floor, index) => (
              <div 
                key={floor.id} 
                onClick={() => handleFloorClick(floor.id)}
                className={`flex items-center px-6 py-4 my-2 border-1 border-[#E5E7EB] dark:border-none last:border-b-0 cursor-pointer transition-all rounded-lg ${
                  selectedFloorId === floor.id 
                    ? 'bg-blue-50  dark:bg-gray-900' 
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
                    <div key={unit.id} className="relative rounded-lg  border-1 border-[#E5E7EB] dark:border-none">
                      {/* Delete X button on unit */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent floor selection when deleting unit
                          deleteUnit(floor.id, unit.id);
                        }}
                        className="absolute -top-2 -right-2 w-4 h-4 bg-white border border-red-400 rounded-full flex items-center justify-center z-10 hover:bg-red-50 "
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

                {/* Delete Floor Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent floor selection when deleting floor
                    deleteFloor(floor.id);
                  }}
                  className="ml-4 text-red-500 hover:text-red-700 flex-shrink-0"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
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

      {/* Add Unit Modal */}
      {showAddUnitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              Name of your Unit
            </h3>
            
            <input
              type="text"
              value={newUnitName}
              onChange={(e) => setNewUnitName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && confirmAddUnit()}
              placeholder="810"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-base focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              autoFocus
            />
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAddUnitModal(false);
                  setNewUnitName('');
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
    </div>
  );
}