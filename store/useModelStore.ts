import { create } from "zustand";

export interface ModelPayload {
    id: string;
  name: string;
  area: number;
  face: string;
}

interface ModelStore {
  models: ModelPayload[];
  addModel: (model: ModelPayload) => void;
  removeModel: (name: string) => void;
  clearModels: () => void;
}

export const useModelStore = create<ModelStore>((set) => ({
  models: [],

  addModel: (model) =>
    set((state) => ({
      models: [...state.models, model],
    })),

  removeModel: (name) =>
    set((state) => ({
      models: state.models.filter((m) => m.name !== name),
    })),

  clearModels: () => set({ models: [] }),
}));
