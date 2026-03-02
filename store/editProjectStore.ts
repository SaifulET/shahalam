// store/useApiStore.ts
import { create } from "zustand";
import api from "@/lib/api";

// ------------------- Types ------------------- //

export interface Project {
  _id: string;
  userId: string;
  name: string;
  location?: string;
  address?: string;
  image?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Model {
  _id: string;
  projectId: string;
  name: string;
  area?: number;
  face?: string;
  createdAt: string;
  updatedAt: string;
}

export type UnitStatus = "available" | "reserved" | "sold";

export interface Unit {
  _id: string;
  name: string;
  status: UnitStatus;
}

export interface Floor {
  _id: string;
  projectId: string;
  name: string;
  unitName?: string;
  units: Unit[];
  createdAt: string;
  updatedAt: string;
}

// API Response Types
interface ProjectsResponse {
  projects: Project[];
  totalPages?: number;
  currentPage?: number;
}

interface FolderProjectsResponse {
  projects: Project[];
}

interface ModelsResponse {
  data: Model[];
  message?: string;
}

interface ModelResponse {
  data: Model;
  message?: string;
}

interface FloorsResponse {
  data: Floor[];
  message?: string;
}

interface FloorResponse {
  data: Floor;
  message?: string;
}

interface UnitResponse {
  data: Unit;
  message?: string;
}

// Error Response Type
interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

// ------------------- Store Interface ------------------- //

interface ApiStoreState {
  // ---------- Projects ----------
  projects: Project[];
  projectsLoading: boolean;
  projectsError: string | null;
  projectsTotalPages?: number;
  projectsCurrentPage?: number;

  getProjects: (userId: string, page?: number) => Promise<void>;
  fetchfolderProject: (folderId: string) => Promise<void>;

  // ---------- Models ----------
  models: Model[];
  modelsLoading: boolean;
  modelsError: string | null;

  addModel: (data: { projectId: string; name: string; area?: number; face?: string }) => Promise<void>;
  getModels: (projectId: string) => Promise<void>;
  updateModel: (modelId: string, data: { name: string; area?: number; face?: string }) => Promise<void>;
  deleteModel: (modelId: string) => Promise<void>;

  // ---------- Floors ----------
  floors: Floor[];
  floorsLoading: boolean;
  floorsError: string | null;

  getFloors: (projectId: string) => Promise<void>;
  addFloor: (data: { projectId: string; name: string }) => Promise<void>;
  updateFloor: (floorId: string, data: { name: string }) => Promise<void>;
  deleteFloor: (floorId: string) => Promise<void>;

  // ---------- Units ----------
  addUnit: (floorId: string, data: { name: string }) => Promise<void>;
  updateUnit: (floorId: string, unitId: string, data: { name: string; status: UnitStatus }) => Promise<void>;
  deleteUnit: (floorId: string, unitId: string) => Promise<void>;
}

// Error handler helper
const handleApiError = (error: unknown): string => {
  if (error && typeof error === 'object') {
    // Handle Axios error
    if ('response' in error) {
      const axiosError = error as { response?: { data?: ApiError } };
      return axiosError.response?.data?.message || "An error occurred";
    }
    
    // Handle standard Error object
    if ('message' in error) {
      return (error as Error).message;
    }
  }
  
  return "An unexpected error occurred";
};

const isUnitStatus = (value: unknown): value is UnitStatus =>
  value === "available" || value === "reserved" || value === "sold";

// ------------------- Zustand Store ------------------- //

export const useApiStore = create<ApiStoreState>((set, get) => ({
  // ---------------- Projects ---------------- //
  projects: [],
  projectsLoading: false,
  projectsError: null,
  projectsTotalPages: undefined,
  projectsCurrentPage: undefined,
  
  getProjects: async (userId: string) => {
    set({ projectsLoading: true, projectsError: null });
    try {
      const response = await api.get<ProjectsResponse>(`/projects/my-projects/${userId}`);
      set({ 
        projects: response.data.projects, 
        projectsLoading: false,
        projectsTotalPages: response.data.totalPages,
        projectsCurrentPage: response.data.currentPage
      });
    } catch (error: unknown) {
      set({ 
        projectsError: handleApiError(error), 
        projectsLoading: false 
      });
    }
  },

  fetchfolderProject: async (folderId: string) => {
    set({ projectsLoading: true, projectsError: null });
    try {
      const response = await api.get<FolderProjectsResponse>(`/folders/folder/project/${folderId}`);
      set({
        projects: Array.isArray(response.data?.projects) ? response.data.projects : [],
        projectsLoading: false,
      });
    } catch (error: unknown) {
      set({
        projectsError: handleApiError(error),
        projectsLoading: false,
      });
    }
  },

  // ---------------- Models ---------------- //
  models: [],
  modelsLoading: false,
  modelsError: null,
  
  addModel: async (data: { projectId: string; name: string; area?: number; face?: string }) => {
    set({ modelsLoading: true, modelsError: null });
    try {
      const response = await api.post<ModelResponse>("/models", data);
      set({ 
        models: [...get().models, response.data.data], 
        modelsLoading: false 
      });
    } catch (error: unknown) {
      set({ 
        modelsError: handleApiError(error), 
        modelsLoading: false 
      });
    }
  },
  
  getModels: async (projectId: string) => {
    set({ modelsLoading: true, modelsError: null });
    try {
        
      const response = await api.get<ModelsResponse>(`/models/${projectId}`);
     
      set({ 
        models: response.data.data, 
        modelsLoading: false 
      });
    } catch (error: unknown) {
       
      set({ 
        modelsError: handleApiError(error), 
        modelsLoading: false 
      });
    }
  },
  
  updateModel: async (modelId: string, data: { name: string; area?: number; face?: string }) => {
    set({ modelsLoading: true, modelsError: null });
    try {
      await api.patch(`/models/${modelId}`, data);
      const updatedModels = get().models.map((model) => 
        model._id === modelId ? { ...model, ...data } : model
      );
      set({ 
        models: updatedModels, 
        modelsLoading: false 
      });
    } catch (error: unknown) {
      set({ 
        modelsError: handleApiError(error), 
        modelsLoading: false 
      });
    }
  },
  
  deleteModel: async (modelId: string) => {
    set({ modelsLoading: true, modelsError: null });
    try {
      await api.delete(`/models/${modelId}`);
      set({ 
        models: get().models.filter((model) => model._id !== modelId), 
        modelsLoading: false 
      });
    } catch (error: unknown) {
      set({ 
        modelsError: handleApiError(error), 
        modelsLoading: false 
      });
    }
  },

  // ---------------- Floors ---------------- //
  floors: [],
  floorsLoading: false,
  floorsError: null,
  
  getFloors: async (projectId: string) => {
    set({ floorsLoading: true, floorsError: null });
    try {
      const response = await api.get<FloorsResponse>(`/floors/project/${projectId}`);
      set({ 
        floors: response.data.data, 
        floorsLoading: false 
      });
    } catch (error: unknown) {
      set({ 
        floorsError: handleApiError(error), 
        floorsLoading: false 
      });
    }
  },
  
  addFloor: async (data: { projectId: string; name: string }) => {
    set({ floorsLoading: true, floorsError: null });
    try {
      const response = await api.post<FloorResponse>("/floors", data);
      set({ 
        floors: [...get().floors, response.data.data], 
        floorsLoading: false 
      });
    } catch (error: unknown) {
      set({ 
        floorsError: handleApiError(error), 
        floorsLoading: false 
      });
    }
  },
  
  updateFloor: async (floorId: string, data: { name: string }) => {
    set({ floorsLoading: true, floorsError: null });
    try {
      await api.patch(`/floors/${floorId}`, data);
      const updatedFloors = get().floors.map((floor) => 
        floor._id === floorId ? { ...floor, ...data } : floor
      );
      set({ 
        floors: updatedFloors, 
        floorsLoading: false 
      });
    } catch (error: unknown) {
      set({ 
        floorsError: handleApiError(error), 
        floorsLoading: false 
      });
    }
  },
  
  deleteFloor: async (floorId: string) => {
    set({ floorsLoading: true, floorsError: null });
    try {
      await api.delete(`/floors/${floorId}`);
      set({ 
        floors: get().floors.filter((floor) => floor._id !== floorId), 
        floorsLoading: false 
      });
    } catch (error: unknown) {
      set({ 
        floorsError: handleApiError(error), 
        floorsLoading: false 
      });
    }
  },

  // ---------------- Units ---------------- //
  addUnit: async (floorId: string, data: { name: string }) => {
    set({ floorsLoading: true, floorsError: null });
    try {
      const response = await api.post<UnitResponse>(`/floors/${floorId}/unit`, data);

      // Backend may return either the created Unit or the updated Floor payload.
      const payload = response.data.data as unknown;
      const payloadObj = payload && typeof payload === "object" ? (payload as Record<string, unknown>) : null;
      const payloadUnits = Array.isArray(payloadObj?.units) ? (payloadObj?.units as unknown[]) : null;
      const lastUnitInPayload =
        payloadUnits && payloadUnits.length > 0 && typeof payloadUnits[payloadUnits.length - 1] === "object"
          ? (payloadUnits[payloadUnits.length - 1] as Record<string, unknown>)
          : null;
      const directUnitPayload = payloadObj && !Array.isArray(payloadObj?.units) ? payloadObj : null;
      const extractedUnit = lastUnitInPayload ?? directUnitPayload;

      const extractedId = typeof extractedUnit?._id === "string" ? extractedUnit._id : "";
      const extractedStatus = isUnitStatus(extractedUnit?.status) ? extractedUnit.status : "available";
      const normalizedUnit: Unit = {
        _id: extractedId || `temp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        // Always trust submitted name for immediate preview correctness.
        name: data.name.trim(),
        status: extractedStatus,
      };
      
      const updatedFloors = get().floors.map((floor) => {
        if (floor._id !== floorId) return floor;
        return {
          ...floor,
          units: [...floor.units, normalizedUnit]
        };
      });
      
      set({ 
        floors: updatedFloors, 
        floorsLoading: false 
      });
    } catch (error: unknown) {
      set({ 
        floorsError: handleApiError(error), 
        floorsLoading: false 
      });
    }
  },
  
  updateUnit: async (floorId: string, unitId: string, data: { name: string; status: UnitStatus }) => {
    set({ floorsLoading: true, floorsError: null });
    try {
      await api.patch(`/floors/${floorId}/${unitId}`, data);
      
      const updatedFloors = get().floors.map((floor) => {
        if (floor._id !== floorId) return floor;
        return {
          ...floor,
          units: floor.units.map((unit) => 
            unit._id === unitId ? { ...unit, ...data } : unit
          )
        };
      });
      
      set({ 
        floors: updatedFloors, 
        floorsLoading: false 
      });
    } catch (error: unknown) {
      set({ 
        floorsError: handleApiError(error), 
        floorsLoading: false 
      });
    }
  },
  
  deleteUnit: async (floorId: string, unitId: string) => {
    set({ floorsLoading: true, floorsError: null });
    try {
      await api.delete(`/floors/${floorId}/${unitId}`);
      
      const updatedFloors = get().floors.map((floor) => {
        if (floor._id !== floorId) return floor;
        return {
          ...floor,
          units: floor.units.filter((unit) => unit._id !== unitId)
        };
      });
      
      set({ 
        floors: updatedFloors, 
        floorsLoading: false 
      });
    } catch (error: unknown) {
      set({ 
        floorsError: handleApiError(error), 
        floorsLoading: false 
      });
    }
  },
}));
