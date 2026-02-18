import { create } from "zustand";
import api from "@/lib/api";
import { useModelStore } from "./useModelStore";




interface FloorPayload {
  name: string;
  units: string[]; // Assuming units are represented by their names or IDs
}


interface ModelPayload {
  name: string;
  area: number;
  face: string;
}

interface ProjectState {
  loading: boolean;
  error: string | null;

  createFullProject: (
    projectData: {
      userId: string;
      name: string;
      location: string;
      image?: File | null;
    },
    floors: FloorPayload[],
    models?: ModelPayload[]
  ) => Promise<void>;
}

export const useCreatProjectStore = create<ProjectState>((set) => ({
  loading: false,
  error: null,

  createFullProject: async (projectData, floors, models = []) => {
    try {
      set({ loading: true, error: null });

      // 1️⃣ CREATE PROJECT
      const formData = new FormData();
      formData.append("userId", projectData.userId);
      formData.append("name", projectData.name);
      formData.append("location", projectData.location);

      if (projectData.image) {
        formData.append("image", projectData.image);
      }

      const projectRes = await api.post("/projects/", projectData);
console.log("projectRessss:", projectRes);
      const projectId = projectRes.data.data._id;
      console.log("Project created with ID:", projectId);

      // 2️⃣ CREATE FLOORS
      console.log("Creating floossssrs for project ID:", floors);
      for (const floor of floors) {
        await api.post("/floors", {
          projectId,
          name: floor.name,
          units:  floor.units,
        });
      }

      // 3️⃣ CREATE MODELS
      
      for (const model of models) {
        await api.post("/models", {
          projectId,
          name: model.name,
          area: model.area,
          face: model.face,
        });
      }

      set({ loading: false });
    } catch (error: unknown) {
      set({
        loading: false,
       
      });
    }
  },
}));
