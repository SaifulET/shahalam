'use client'
import { useState } from 'react';
import RecentProjects from "./recentProjectPage";
import FoldersComponent from '../forderSection';


interface Project {
  id: string;
  image: string;
  title: string;
  location: string;
  status: 'Active' | 'Inactive';
}

export default function RecentProjectsComponent() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      image: '/rc1.png',
      title: 'Downtown Plaza',
      location: 'New York, NY',
      status: 'Active',
    },
    {
      id: '2',
      image: '/rc2.png',
      title: 'Riverside Residences',
      location: 'Austin, TX',
      status: 'Active',
    },
    {
      id: '3',
      image: '/rc3.png',
      title: 'Tech Hub Campus',
      location: 'San Francisco, CA',
      status: 'Active',
    },
    {
      id: '4',
      image: '/rc1.png',
      title: 'Metro Shopping Center',
      location: 'Chicago, IL',
      status: 'Active',
    },
    {
      id: '5',
      image: '/rc3.png',
      title: 'Grand Hotel Renovation',
      location: 'Miami, FL',
      status: 'Active',
    },
    {
      id: '6',
      image: '/rc2.png',
      title: 'Innovation Academy',
      location: 'Seattle, WA',
      status: 'Active',
    },
    {
      id: '7',
      image: '/rc3.png',
      title: 'Logistics Hub',
      location: 'Denver, CO',
      status: 'Active',
    },
    {
      id: '8',
      image: '/rc2.png',
      title: 'Athletic Complex',
      location: 'Portland, OR',
      status: 'Active',
    },
  ]);

  const handleProjectDropped = (folderName: string, projectId?: string) => {
    if (projectId) {
      // Remove specific project by ID
      setProjects(prev => prev.filter(project => project.id !== projectId));
    } else if (folderName) {
      // This will be called from the folder component
      // The project ID will be in the drag data
    }
  };

  const removeProjectFromList = (projectId: string) => {
    setProjects(prev => prev.filter(project => project.id !== projectId));
  };

  return (
    <main className="min-h-screen bg-white dark:bg-black ">
      <FoldersComponent onProjectDropped={(folderName) => handleProjectDropped(folderName)} />
      <RecentProjects 
        projects={projects} 
        onProjectMoved={removeProjectFromList}
      />
    </main>
  );
}