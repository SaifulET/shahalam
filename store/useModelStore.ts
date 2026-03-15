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
  updateModel: (
    id: string,
    model: Omit<ModelPayload, "id">
  ) => void;
  removeModel: (id: string) => void;
  clearModels: () => void;
}

export const useModelStore = create<ModelStore>((set) => ({
  models: [],

  addModel: (model) =>
    set((state) => ({
      models: [...state.models, model],
    })),

  updateModel: (id, model) =>
    set((state) => ({
      models: state.models.map((item) =>
        item.id === id ? { ...item, ...model, id } : item
      ),
    })),

  removeModel: (id) =>
    set((state) => ({
      models: state.models.filter((m) => m.id !== id),
    })),

  clearModels: () => set({ models: [] }),
}));
