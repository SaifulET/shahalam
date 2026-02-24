import { create } from "zustand";
import api from "@/lib/api";

interface Project {
  _id: string;
  name: string;
}

interface Unit {
  _id: string;
  name: string;
  status: "available" | "reserved" | "sold";
}

interface Floor {
  _id: string;
  name: string;
  units: Unit[];
}

interface Model {
  _id: string;
  name: string;
  area: string;
  face: string;
}

interface ProjectState {
  projects: Project[];
  floors: Floor[];
  models: Model[];
  selectedProjectId: string | null;

  fetchProjects: (userId: string) => Promise<void>;
  fetchFloors: (projectId: string) => Promise<void>;
  fetchModels: (projectId: string) => Promise<void>;
  setSelectedProject: (id: string) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  floors: [],
  models: [],
  selectedProjectId: null,

  setSelectedProject: (id) => set({ selectedProjectId: id }),

  fetchProjects: async (userId) => {
    const res = await api.get(`/projects/my-projects/${userId}`);
    set({ projects: res.data.projects });
  },

  fetchFloors: async (projectId) => {
    const res = await api.get(`/floors/project/${projectId}`);
    set({ floors: res.data.data });
  },

  fetchModels: async (projectId) => {
    const res = await api.get(`/models/${projectId}`);
    set({ models: res.data.data });
  },
}));
