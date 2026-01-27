'use client';

import { useState } from 'react';


interface Unit {
  id: string;
  floor: number;
  status: 'available' | 'reserved' | 'sold';
  area: number;
  type: 'studio' | 'apartment';
}

interface Project {
  id: string;
  name: string;
}

type StatusType = 'available' | 'reserved' | 'sold';

const RealEstateDashboard = () => {
  const [selectedProject, setSelectedProject] = useState('Downtown Plaza');

  // Project data
  const projects: Project[] = [
    { id: '1', name: 'Downtown Plaza' },
    { id: '2', name: 'Riverside Residences' },
    { id: '3', name: 'Tech Hub Complex' },
    { id: '4', name: 'Metro Shopping Center' },
    { id: '5', name: 'Grand Hotel Renovation' },
    { id: '6', name: 'Innovation Academy' },
  ];

  // Floor data with units
  const floors: Unit[][] = [
    // Floor 1 (الدور الأول)
    [
      { id: 'A1', floor: 1, status: 'available', area: 113, type: 'apartment' },
      { id: 'C1', floor: 1, status: 'available', area: 83, type: 'apartment' },
      { id: 'B1', floor: 1, status: 'sold', area: 113, type: 'apartment' },
      { id: 'D1', floor: 1, status: 'available', area: 80, type: 'apartment' },
    ],
    // Floor 2 (الدور الثاني)
    [
      { id: 'B2', floor: 2, status: 'reserved', area: 124, type: 'studio' },
      { id: 'C2', floor: 2, status: 'available', area: 162, type: 'studio' },
      { id: 'D2', floor: 2, status: 'available', area: 89, type: 'studio' },
    ],
    // Floor 3 (الدور الثالث)
    [
      { id: 'A3', floor: 3, status: 'available', area: 113, type: 'apartment' },
      { id: 'C3', floor: 3, status: 'reserved', area: 201, type: 'apartment' },
      { id: 'E3', floor: 3, status: 'available', area: 162, type: 'apartment' },
      { id: 'A3-2', floor: 3, status: 'sold', area: 113, type: 'apartment' },
    ],
    // Floor 4 (الدور الرابع)
    [
      { id: 'E4', floor: 4, status: 'sold', area: 202, type: 'apartment' },
      { id: 'D4', floor: 4, status: 'available', area: 83, type: 'apartment' },
    ],
    // Attached building (الملحق)
    [
      { id: 'B-att', floor: 5, status: 'available', area: 0, type: 'apartment' },
      { id: 'A-att', floor: 5, status: 'reserved', area: 0, type: 'apartment' },
      { id: 'E-att', floor: 5, status: 'sold', area: 0, type: 'apartment' },
      { id: 'D-att', floor: 5, status: 'available', area: 0, type: 'apartment' },
    ],
  ];

  const floorNames = ['الدور الأول', 'الدور الثاني', 'الدور الثالث', 'الدور الرابع', 'الملحق'];

  const getStatusColor = (status: StatusType): string => {
    switch (status) {
      case 'available':
        return 'bg-emerald-600 hover:bg-emerald-700';
      case 'reserved':
        return 'bg-amber-400 hover:bg-amber-500';
      case 'sold':
        return 'bg-red-700 hover:bg-red-800';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusLabel = (status: StatusType): string => {
    switch (status) {
      case 'available':
        return 'متاح';
      case 'reserved':
        return 'محجوز';
      case 'sold':
        return 'مباع';
      default:
        return '';
    }
  };

  // Calculate statistics
  const allUnits = floors.flat();
  const availableCount = allUnits.filter((u) => u.status === 'available').length;
  const reservedCount = allUnits.filter((u) => u.status === 'reserved').length;
  const soldCount = allUnits.filter((u) => u.status === 'sold').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200 p-4 md:p-8 font-['Cairo',sans-serif]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          {/* Sidebar */}
          <div className="bg-white rounded-2xl shadow-lg p-6 h-fit">
            <h2 className="text-gray-700 font-semibold mb-4 text-lg">Project Name</h2>
            <div className="space-y-2">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => setSelectedProject(project.name)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                    selectedProject === project.name
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {project.name}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-gradient-to-br from-slate-600/90 via-slate-700/90 to-slate-800/90 rounded-3xl shadow-2xl p-8 backdrop-blur-sm">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="text-emerald-400">
                    <svg className="w-16 h-16" viewBox="0 0 100 100" fill="currentColor">
                      <path d="M20,80 L20,40 L50,20 L80,40 L80,80 Z M30,70 L30,50 L70,50 L70,70 Z" />
                      <path d="M35,45 L50,35 L65,45 M40,60 L40,70 M60,60 L60,70" stroke="currentColor" strokeWidth="3" fill="none" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white text-3xl font-bold tracking-wide">WSL</div>
                    <div className="text-emerald-400 text-sm font-medium tracking-widest">REAL ESTATE</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 rounded-xl transition-all duration-200 shadow-lg">
                  {/* <FiEdit className="w-5 h-5" /> */}
                </button>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-lg font-medium">
                  {/* <BiExport className="w-5 h-5" /> */}
                  Export PDF
                </button>
              </div>
            </div>

            {/* Floor Grid */}
            <div className="space-y-4 mb-8">
              {floors.map((floorUnits, floorIndex) => (
                <div key={floorIndex} className="flex items-center gap-4">
                  {/* Floor Units */}
                  <div className="flex-1 grid grid-cols-4 gap-3">
                    {floorUnits.map((unit) => (
                      <button
                        key={unit.id}
                        className={`${getStatusColor(unit.status)} text-white font-bold text-xl rounded-xl py-6 px-4 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105`}
                      >
                        {unit.id.charAt(0)}
                      </button>
                    ))}
                  </div>

                  {/* Floor Label */}
                  <div className="bg-slate-900/60 backdrop-blur-md text-white px-6 py-8 rounded-2xl min-w-[140px] text-center shadow-lg">
                    <div className="text-lg font-bold" style={{ direction: 'rtl' }}>
                      {floorNames[floorIndex]}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl p-6 mb-6 shadow-lg">
              <div className="flex justify-center gap-8 mb-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-emerald-600 rounded-lg shadow-md"></div>
                  <span className="text-white font-medium">متاح</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-amber-400 rounded-lg shadow-md"></div>
                  <span className="text-white font-medium">محجوز</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-red-700 rounded-lg shadow-md"></div>
                  <span className="text-white font-medium">مباع</span>
                </div>
              </div>
            </div>

            {/* Unit Details */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {allUnits.slice(0, 7).map((unit, index) => (
                <div key={index} className="bg-slate-900/50 backdrop-blur-md rounded-xl p-4 shadow-lg">
                  <div className="text-gray-300 text-sm mb-1" style={{ direction: 'rtl' }}>
                    {unit.type === 'studio' ? 'ستوديو' : 'شقة'} {unit.id}
                  </div>
                  <div className="text-white font-bold text-lg mb-1">
                    مساحة {unit.area || '---'} م²
                  </div>
                  <div className="text-gray-400 text-sm" style={{ direction: 'rtl' }}>
                    {getStatusLabel(unit.status)}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-8 flex justify-center items-center gap-3 text-white">
              <div className="bg-pink-600 p-2 rounded-full">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </div>
              <div className="bg-yellow-400 p-2 rounded-full">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm3.707-11.707L11 13.586 8.707 11.293a.999.999 0 10-1.414 1.414l3 3a.997.997 0 001.414 0l5-5a.999.999 0 10-1.414-1.414z" />
                </svg>
              </div>
              <span className="font-medium text-lg">wsl.realestate</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealEstateDashboard;