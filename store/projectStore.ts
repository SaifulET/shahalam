import { create } from "zustand";
import api from "@/lib/api";

interface Project {
  _id: string;
  name: string;
  image?: string | null;
  location?: string;
}

interface RecentProjectItem {
  _id: string;
  projectId: Project;
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
  folderId: string;
  selectedProjectId: string | null;

  fetchProjects: (userId: string) => Promise<void>;
  fetchRecentProjects: (userId: string) => Promise<void>;
  fetchfolderProject: (folderId: string) => Promise<void>;
  fetchFloors: (projectId: string) => Promise<void>;
  fetchModels: (projectId: string) => Promise<void>;
  setSelectedProject: (id: string | null) => void;
  setFolderId: (folderId: string) => void;
  clearFolderId: () => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  floors: [],
  models: [],
  folderId: "",
  selectedProjectId: null,

  setSelectedProject: (id) => set({ selectedProjectId: id }),
  setFolderId: (folderId) => set({ folderId }),
  clearFolderId: () => set({ folderId: "" }),

  fetchProjects: async (userId) => {
    const res = await api.get(`/projects/my-projects/${userId}`);
    const projects = Array.isArray(res.data?.projects) ? (res.data.projects as Project[]) : [];
    set({
      projects,
      selectedProjectId: projects[0]?._id ?? null,
    });
  },

  fetchRecentProjects: async (userId) => {
    const res = await api.get(`/recents/user/${userId}`);
    const items = Array.isArray(res.data?.data)
      ? (res.data.data as RecentProjectItem[])
      : [];
    const projects = items
      .map((item) => item.projectId)
      .filter((project): project is Project => Boolean(project?._id));
    const uniqueProjects = Array.from(
      new Map(projects.map((project) => [project._id, project])).values()
    );
    set({
      projects: uniqueProjects,
      selectedProjectId: uniqueProjects[0]?._id ?? null,
    });
  },

  fetchfolderProject: async (folderId) => {
    const res = await api.get(`/folders/folder/project/${folderId}`);
    const projects = Array.isArray(res.data?.projects) ? (res.data.projects as Project[]) : [];
    set({
      projects,
      selectedProjectId: projects[0]?._id ?? null,
    });
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
