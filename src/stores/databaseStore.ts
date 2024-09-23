import { create } from "zustand";
import { Project, QueryHistory } from "@prisma/client";

interface DatabaseState {
  query: string;
  result: string | null;
  error: string | null;
  history: QueryHistory[];
  connectionStatus: boolean;
  connectionLoading: boolean;
  project: Project | null;
  setQuery: (query: string) => void;
  setResult: (result: string | null) => void;
  setError: (error: string | null | undefined) => void;
  setConnectionStatus: (status: boolean) => void;
  setConnectionLoading: (loading: boolean) => void;
  setProject: (project: Project | null) => void;
  setHistory: (history: QueryHistory[]) => void;
}

const useDatabaseStore = create<DatabaseState>((set) => ({
  query: "",
  result: null,
  error: null,
  connectionStatus: false,
  connectionLoading: false,
  project: null,
  history: [],
  setQuery: (query) => set({ query }),
  setResult: (result) => set({ result }),
  setError: (error) => set({ error }),
  setConnectionStatus: (status) => set({ connectionStatus: status }),
  setConnectionLoading: (loading) => set({ connectionLoading: loading }),
  setProject: (project) => set({ project }),
  setHistory: (history) => set({ history }),
}));

export default useDatabaseStore;
