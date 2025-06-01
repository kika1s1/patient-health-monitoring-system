import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "@/components/ui/sonner";
import { Patient } from "@/utils/types";
import { AxiosError } from "axios";

interface PatientStore {
  patients: Patient[];
  currentPatient: Patient | null;
  totalPages: number;
  currentPage: number;
  totalPatients: number;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;

  fetchPatients: (page?: number, limit?: number, search?: string) => Promise<void>;
  fetchPatient: (id: string) => Promise<void>;
  createPatient: (data: Partial<Patient>) => Promise<void>;
  updatePatient: (id: string, data: Partial<Patient>) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;
}

export const usePatientStore = create<PatientStore>((set, get) => ({
  patients: [],
  currentPatient: null,
  totalPages: 0,
  currentPage: 1,
  totalPatients: 0,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,

  fetchPatients: async (page = 1, limit = 10, search = "") => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/patients", { params: { page, limit, search } });
      const { patients, totalPages, currentPage, totalPatients } = res.data;
      set({ patients, totalPages, currentPage, totalPatients });
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Failed to fetch patients.");
      console.error("fetchPatients error:", err);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchPatient: async (id) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/patients/${id}`);
      set({ currentPatient: res.data });
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Failed to fetch patient.");
      console.error("fetchPatient error:", err);
    } finally {
      set({ isLoading: false });
    }
  },

  createPatient: async (data) => {
    set({ isCreating: true });
    try {
      const res = await axiosInstance.post("/patients", data);
      set((state) => ({ patients: [res.data, ...state.patients] }));
      toast.success("Patient created successfully!");
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Failed to create patient.");
      console.error("createPatient error:", err);
    } finally {
      set({ isCreating: false });
    }
  },

  updatePatient: async (id, data) => {
    set({ isUpdating: true });
    try {
      const res = await axiosInstance.put(`/patients/${id}`, data);
      set((state) => ({
        patients: state.patients.map((p) => (p.id === id ? res.data : p)),
        currentPatient: state.currentPatient?.id === id ? res.data : state.currentPatient,
      }));
      toast.success("Patient updated successfully!");
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Failed to update patient.");
      console.error("updatePatient error:", err);
    } finally {
      set({ isUpdating: false });
    }
  },

  deletePatient: async (id) => {
    set({ isDeleting: true });
    try {
      await axiosInstance.delete(`/patients/${id}`);
      set((state) => ({ patients: state.patients.filter((p) => p.id !== id) }));
      toast.success("Patient deleted successfully!");
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Failed to delete patient.");
      console.error("deletePatient error:", err);
    } finally {
      set({ isDeleting: false });
    }
  },
}));