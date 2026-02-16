'use client';

import { useEffect, useState } from 'react';
import RecentProjects from "./recentProjectPage";
import FoldersComponent from '../forderSection';
import axios, { AxiosError } from 'axios';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

interface ApiProject {
  _id: string;
  userId: string;
  name: string;
  location: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface RecentApiResponseItem {
  _id: string;
  projectId: ApiProject;
  userId: string;
  viewedAt: string;
  __v: number;
}

interface RecentApiResponse {
  success: boolean;
  count: number;
  data: RecentApiResponseItem[];
}

interface Project {
  id: string;
  image: string;
  title: string;
  location: string;
  recentid: string;
  status: 'Active' | 'Inactive';
}

export default function RecentProjectsComponent() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchRecents = async () => {
      if (!user?.id) return;

      setLoading(true);
      setError(null);

      try {
        const response = await api.get<RecentApiResponse>(
          `/recents/user/${user.id}`
        );

        const mappedProjects: Project[] = response.data.data.map((item) => ({
          id: item.projectId._id,
          image: '/rc1.png', // static image for now
          title: item.projectId.name,
          location: item.projectId.location,
          status: 'Active',
          recentid: item._id,
        }));

        setProjects(mappedProjects);
      } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        setError(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecents();
    
  }, [user?.id]);

  const handleProjectDropped = (folderName: string, projectId?: string) => {
    if (projectId) {
      setProjects((prev) => prev.filter((project) => project.id !== projectId));
    }
  };

  const removeProjectFromList = (projectId: string) => {
    setProjects((prev) => prev.filter((project) => project.id !== projectId));
  };

  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <FoldersComponent 
        onProjectDropped={(folderName ) => handleProjectDropped(folderName)} 
       
      />

      {loading && <p className="px-6 text-gray-500">Loading recent projects...</p>}
      {error && <p className="px-6 text-red-500">{error}</p>}

      <RecentProjects 
        projects={projects} 
        onProjectMoved={removeProjectFromList}
      />
    </main>
  );
}
