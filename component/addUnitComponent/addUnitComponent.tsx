'use client';

import { useState, useRef } from 'react';
import { Plus, X, Upload } from 'lucide-react';
import ThemeToggle from '@/component/ThemeToggle/ThemeToggle';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Floor {
  id: string;
  name: string;
  units: string[];
}

export default function PropertyUnitForm() {
  const [propertyName, setPropertyName] = useState('');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [floors, setFloors] = useState<Floor[]>([
    { id: '1', name: 'First Floor', units: ['802', '803', '804', '805', '806'] },
    { id: '2', name: '2nd Floor', units: ['702', '703', '704', '705', '706'] }
  ]);
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [currentFloorId, setCurrentFloorId] = useState<string>('');
  const [newUnitName, setNewUnitName] = useState('');
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFloor = () => {
    const newFloor: Floor = {
      id: Date.now().toString(),
      name: `${floors.length + 1}${getOrdinalSuffix(floors.length + 1)} Floor`,
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

  const saveNewUnit = () => {
    if (!newUnitName.trim()) {
      alert('Please enter a unit name');
      return;
    }

    const currentFloor = floors.find(f => f.id === currentFloorId);
    if (currentFloor) {
      const isDuplicate = currentFloor.units.some(
        unit => unit.trim().toLowerCase() === newUnitName.trim().toLowerCase()
      );

      if (isDuplicate) {
        alert(`Unit name "${newUnitName}" already exists on this floor. Unit names must be unique per floor.`);
        return;
      }
    }

    setFloors(floors.map(floor => {
      if (floor.id === currentFloorId) {
        return { ...floor, units: [...floor.units, newUnitName.trim()] };
      }
      return floor;
    }));

    closeUnitModal();
  };

  const updateUnit = (floorId: string, index: number, value: string) => {
    setFloors(floors.map(floor => {
      if (floor.id === floorId) {
        const newUnits = [...floor.units];
        
        const isDuplicate = floor.units.some((unit, idx) => 
          idx !== index && unit.trim().toLowerCase() === value.trim().toLowerCase()
        );
        
        if (isDuplicate) {
          alert(`Unit name "${value}" already exists on this floor. Unit names must be unique per floor.`);
          return floor;
        }
        
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

  const getOrdinalSuffix = (num: number) => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return 'st';
    if (j === 2 && k !== 12) return 'nd';
    if (j === 3 && k !== 13) return 'rd';
    return 'th';
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (PNG or JPG)');
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
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
const route= useRouter()
const handleSave=()=>{
  route.push("/dashboard")
}
  return (
    <div className="min-h-screen px-[24px] md:px-[268px] pt-[35px] pb-[40px] bg-white  dark:bg-black">
      {/* Theme Toggle in Top Right Corner */}
      
      
      <div>
        {/* Header */}
        <div className=" mb-6 ">
          <div className="px-4 sm:px-6 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h1 className="font-inter font-semibold text-[24px] leading-[32px] tracking-[-0.5px] text-black dark:text-white">Unit Type</h1>
            <div className="flex gap-2 sm:gap-3">
              <Link href="/dashboard"><button className="px-[32px] py-[12px] font-inter font-medium text-[14px] leading-[14px] tracking-[-0.5px] text-center border rounded-lg border-[#D1D5DB] text-[#374151] hover:bg-gray-50 dark:text-gray-50 dark:hover:bg-gray-700 transition-colors">
                Cancel
              </button></Link>
              <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors">
                Save Property
              </button>
            </div>
          </div>

          {/* Property Information */}
          <div className="p-4 sm:p-6 border rounded-lg border-[#E5E7EB] bg-white dark:bg-[#1A1A1A]">
            <h2 className="font-inter font-medium text-[18px] leading-[28px] tracking-[-0.5px] text-gray-900 dark:text-[#FFFFFF] mb-4">Property Information</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700  dark:text-[#FFFFFF]  mb-2">
                  Property Name
                </label>
                <input
                  type="text"
                  placeholder="Enter property name"
                  value={propertyName}
                  onChange={(e) => setPropertyName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600 dark:text-[#D4D4D4]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700  dark:text-[#FFFFFF]  mb-2">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="City, Area"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 text-gray-600 dark:text-[#D4D4D4] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-[#FFFFFF]  text-gray-700 mb-2">
                Address
              </label>
              <textarea
                placeholder="Enter full address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border text-gray-600 dark:text-[#D4D4D4] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <Link href="/addmodel"><div className=" gap-1 px-3 py-3 text-sm font-medium text-blue-600 bg-blue-100 rounded-md hover:bg-blue-100 transition-colors text-center mt-2">Add Model</div></Link>
          </div>
        </div>

        {/* Floors Section */}
        <div className="bg-white dark:bg-[#1A1A1A] rounded-lg border border-[#E5E7EB] mb-6">
          <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
            <h2 className="font-inter font-medium text-[18px] leading-[28px] tracking-[-0.5px] text-gray-900 dark:text-[#FFFFFF]">Floors</h2>
            <button
              onClick={addFloor}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Floor
            </button>
          </div>

          <div className="p-4 sm:p-6 space-y-4">
            {floors.map((floor) => (
              <div key={floor.id} className="relative">
                <button
                  onClick={() => removeFloor(floor.id)}
                  className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-10 "
                >
                  <X className="w-3 h-3" />
                </button>
                
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 dark:bg-[#28272A] ">
                  <h3 className="text-sm font-medium text-gray-900 mb-3 dark:text-[#FFFFFF]">{floor.name}</h3>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-3">
                    {floor.units.map((unit, index) => (
                      <div key={index} className="relative group">
                        <input
                          type="text"
                          value={unit}
                          placeholder={`Unit ${index + 1}`}
                          className="w-full px-3 py-2 pr-8 text-sm border text-[#000000] dark:text-[#E5E7EB] border-gray-300 rounded-md bg-white dark:bg-[#28272A] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          onChange={(e) => updateUnit(floor.id, index, e.target.value)}
                        />
                        <button
                          onClick={() => removeUnit(floor.id, index)}
                          className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center bg-red-100 text-red-600 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200"
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
                    Add Unit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cover Image */}
        <div className="bg-white rounded-lg border border-[#E5E7EB] dark:bg-[#111827]">
          <div className="px-4 sm:px-6 py-4">
            <h2 className="font-inter font-medium text-[18px] leading-[28px] tracking-[-0.5px] text-gray-900 dark:text-[#FFFFFF]">Cover Image</h2>
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
              <div className="relative border-2 border-gray-300 rounded-lg overflow-hidden">
                <img 
                  src={coverImage} 
                  alt="Cover preview" 
                  className="w-full h-64 object-cover"
                />
                <button
                  onClick={removeCoverImage}
                  className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
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
                  <h3 className="text-sm font-medium text-gray-900 mb-1">Upload property image</h3>
                  <p className="text-sm text-gray-500 mb-4">Drag and drop your file here, or click to browse</p>
                  <button 
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerFileInput();
                    }}
                  >
                    Choose File
                  </button>
                  <p className="text-xs text-gray-400 mt-3">(PNG, JPG up to 10MB)</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Unit Modal */}
      {showUnitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                Name of your Unit
              </h2>
              
              <input
                type="text"
                value={newUnitName}
                onChange={(e) => setNewUnitName(e.target.value)}
                placeholder="Enter unit name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-6"
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
                  className="flex-1 px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveNewUnit}
                  className="flex-1 px-6 py-3 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}