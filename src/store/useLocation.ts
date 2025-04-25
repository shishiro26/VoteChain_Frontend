import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { toast } from "sonner";

type State = {
  name: string;
};

type Constituency = {
  name: string;
};

type Mandal = {
  name: string;
};

type DistrictData = {
  name: string;
  constituencies: Constituency[];
  mandals: Mandal[];
};

type LocationState = {
  states: State[];
  districts: Record<string, DistrictData[]>;
  selectedState: string | null;
  selectedDistrict: string | null;
  selectedMandal: string | null;
  selectedConstituency: string | null;
  fetchStates: () => Promise<void>;
  fetchDistricts: (state: string) => Promise<void>;
  setSelectedState: (state: string) => void;
  setSelectedDistrict: (district: string) => void;
  setSelectedMandal: (mandal: string) => void;
  setSelectedConstituency: (constituency: string) => void;
};

export const useLocationStore = create(
  persist<LocationState>(
    (set, get) => ({
      states: [],
      districts: {},
      selectedState: null,
      selectedDistrict: null,
      selectedMandal: null,
      selectedConstituency: null,

      fetchStates: async () => {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/v1/location/states`
          );
          set({ states: res.data });
        } catch (error) {
          console.error("Error fetching states", error);
          toast.error("Failed to fetch states");
        }
      },

      fetchDistricts: async (state: string) => {
        console.log("state", state);
        const existing = get().districts[state];
        if (existing) return;

        try {
          const res = await axios.get(
            `${
              import.meta.env.VITE_API_URL
            }/api/v1/location/districts?state=${state}`
          );
          set((prev) => ({
            districts: {
              ...prev.districts,
              [state]: res.data,
            },
          }));
        } catch (error) {
          console.error("Error fetching districts", error);
          toast.error("Failed to fetch districts");
        }
      },

      setSelectedState: (state: string) => {
        set({
          selectedState: state,
          selectedDistrict: null,
          selectedMandal: null,
          selectedConstituency: null,
        });
      },

      setSelectedDistrict: (district: string) => {
        set({
          selectedDistrict: district,
          selectedMandal: null,
          selectedConstituency: null,
        });
      },

      setSelectedMandal: (mandal: string) => {
        set({ selectedMandal: mandal });
      },

      setSelectedConstituency: (constituency: string) => {
        set({ selectedConstituency: constituency });
      },
    }),
    {
      name: "location-store",
      partialize: (state): LocationState => ({
        states: state.states || [],
        districts: state.districts || {},
        selectedState: state.selectedState || null,
        selectedDistrict: state.selectedDistrict || null,
        selectedMandal: state.selectedMandal || null,
        selectedConstituency: state.selectedConstituency || null,
        fetchStates: state.fetchStates,
        fetchDistricts: state.fetchDistricts,
        setSelectedState: state.setSelectedState,
        setSelectedDistrict: state.setSelectedDistrict,
        setSelectedMandal: state.setSelectedMandal,
        setSelectedConstituency: state.setSelectedConstituency,
      }),
    }
  )
);
