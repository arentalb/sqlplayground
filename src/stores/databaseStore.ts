import { create } from "zustand";
import { Project } from "@prisma/client";

interface DatabaseState {
  query: string;
  highlightedCode: string;
  result: string | null;
  error: string | null;
  connectionStatus: boolean;
  connectionLoading: boolean;
  project: Project | null;
  setQuery: (query: string) => void;
  setHighlightedCode: (code: string) => void;
  setResult: (result: string | null) => void;
  setError: (error: string | null | undefined) => void;
  setConnectionStatus: (status: boolean) => void;
  setConnectionLoading: (loading: boolean) => void;
  setProject: (project: Project | null) => void;
}

const useDatabaseStore = create<DatabaseState>((set) => ({
  query: "",
  highlightedCode: "",
  result: null,
  error: null,
  connectionStatus: false,
  connectionLoading: false,
  project: null,
  setQuery: (query) => set({ query }),
  setHighlightedCode: (code) => set({ highlightedCode: code }),
  setResult: (result) => set({ result }),
  setError: (error) => set({ error }),
  setConnectionStatus: (status) => set({ connectionStatus: status }),
  setConnectionLoading: (loading) => set({ connectionLoading: loading }),
  setProject: (project) => set({ project }),
}));

export default useDatabaseStore;
