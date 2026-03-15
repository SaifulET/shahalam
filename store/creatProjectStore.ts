import { create } from "zustand";
import api from "@/lib/api";

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
    models?: ModelPayload[],
    folderId?:string
  ) => Promise<boolean>;
}

export const useCreatProjectStore = create<ProjectState>((set) => ({
  loading: false,
  error: null,

  createFullProject: async (projectData, floors, models = [],folderId) => {
    try {
      set({ loading: true, error: null });

      // 1️⃣ CREATE PROJECT
      const formData = new FormData();
      formData.append("userId", projectData.userId);
      formData.append("name", projectData.name);
      formData.append("location", projectData.location);
      if(folderId)formData.append("folderId",folderId);

      if (projectData.image) {
        formData.append("image", projectData.image);
      }
      let projectId;
if(!folderId){
  const projectRes = await api.post("/projects/",formData,
        {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
      );
      projectId = projectRes.data.data._id;
}
else{
  const projectRes = await api.post("/projects/createproject/addtoFolder",formData,
        {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
      );
      projectId = projectRes.data.data._id;
}
     

      // 2️⃣ CREATE FLOORS
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
      return true;
    } catch (error: unknown) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: { message?: string } } }).response
          ?.data?.message === "string"
          ? (error as { response?: { data?: { message?: string } } }).response!
              .data!.message!
          : error instanceof Error
            ? error.message
            : "Failed to create property";

      set({
        loading: false,
        error: message,
      });
      return false;
    }
  },
}));
