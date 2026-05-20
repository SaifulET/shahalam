import { create } from "zustand";
import { persist } from "zustand/middleware";
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
  hasHydrated: boolean;

  fetchProjects: (userId: string) => Promise<void>;
  fetchRecentProjects: (userId: string) => Promise<void>;
  fetchfolderProject: (folderId: string) => Promise<void>;
  fetchFloors: (projectId: string) => Promise<void>;
  fetchModels: (projectId: string) => Promise<void>;
  setSelectedProject: (id: string | null) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
  setFolderId: (folderId: string) => void;
  clearFolderId: () => void;
}

const getNextSelectedProjectId = (
  projects: Project[],
  selectedProjectId: string | null
) =>
  selectedProjectId && projects.some((project) => project._id === selectedProjectId)
    ? selectedProjectId
    : projects[0]?._id ?? null;

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: [],
      floors: [],
      models: [],
      folderId: "",
      selectedProjectId: null,
      hasHydrated: false,

      setSelectedProject: (id) => set({ selectedProjectId: id }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      setFolderId: (folderId) => set({ folderId }),
      clearFolderId: () => set({ folderId: "" }),

      fetchProjects: async (userId) => {
        const res = await api.get(`/projects/my-projects/${userId}`);
        const projects = Array.isArray(res.data?.projects) ? (res.data.projects as Project[]) : [];
        set({
          projects,
          selectedProjectId: getNextSelectedProjectId(projects, get().selectedProjectId),
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
          selectedProjectId: getNextSelectedProjectId(uniqueProjects, get().selectedProjectId),
        });
      },

      fetchfolderProject: async (folderId) => {
        const res = await api.get(`/folders/folder/project/${folderId}`);
        const projects = Array.isArray(res.data?.projects) ? (res.data.projects as Project[]) : [];
        set({
          projects,
          selectedProjectId: getNextSelectedProjectId(projects, get().selectedProjectId),
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
    }),
    {
      name: "project-storage",
      partialize: (state) => ({
        selectedProjectId: state.selectedProjectId,
      }),
      onRehydrateStorage: (state) => () => {
        state.setHasHydrated(true);
      },
    }
  )
);
