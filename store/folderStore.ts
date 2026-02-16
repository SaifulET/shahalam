import { create } from 'zustand';
import  { AxiosError } from 'axios';
import { useAuthStore } from './authStore';
import api from '@/lib/api';


interface FolderState {
folders: Folder[];
  loading: boolean;
  error: string | null;
  createFolder: (data: { name: string; description: string; color: string }) => Promise<void>;
  fetchFolders: (userId: string) => Promise<void>;
    addProjectToFolder: (folderId: string, projectId: string) => void;
    deleteRecent: (recentId: string) => Promise<void>;
}
export interface Project {
  _id: string;
  userId: string;
  name: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}


export interface Folder {
  _id: string;
  userId: string;
  name: string;
  description: string;
  color: string;
  projects: Project[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}



export const useFolderStore = create<FolderState>((set) => ({
  loading: false,
  error: null,
  folders: [],

  createFolder: async ({ name, description, color }) => {
    const user = useAuthStore.getState().user;

    if (!user?.id) {
      set({ error: 'User not authenticated' });
      return;
    }

    const body = {
      userId: user.id,
      name,
      description,
      color,
    };

    set({ loading: true, error: null });

    try {
      await api.post('/folders', body);
      set({ loading: false });
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      set({
        loading: false,
        error: error.response?.data?.message || error.message,
      });
    }
  },

    fetchFolders: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get<{ success: boolean; count: number; data: Folder[] }>(
        `/folders/user/${userId}`
      );
      set({ folders: response.data.data, loading: false });
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      set({ loading: false, error: error.response?.data?.message || error.message });
    }
  },


  addProjectToFolder: (folderId: string, projectId: string) => {
    try {
        console.log('Adding project to folder:', { folderId, projectId });
        const response= api.patch(`/folders/${folderId}/add-project`, { projectId });
        console.log('Add project response:', response);
    } catch (error) {
        console.log('Error adding project to folder:', error);
    }


  },


  deleteRecent: async (recentId: string) => {
    try {
        await api.delete(`/recents/${recentId}`);
    } catch (error) {
        console.log('Error deleting recent:', error);  
    }


  },


}));
