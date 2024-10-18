import { create } from "zustand";
import { Project, QueryHistory } from "@prisma/client";

interface DatabaseState {
  query: string;
  terminalResult: string | null;
  terminalError: string | null;
  history: QueryHistory[];
  connectionStatus: boolean;
  connectionLoading: boolean;
  project: Project | null;
  setQuery: (query: string) => void;
  setTerminalResult: (result: string | null) => void;
  setTerminalError: (error: string | null | undefined) => void;
  setConnectionStatus: (status: boolean) => void;
  setConnectionLoading: (loading: boolean) => void;
  setProject: (project: Project | null) => void;
  setHistory: (history: QueryHistory[]) => void;
}

const useDatabaseStore = create<DatabaseState>((set) => ({
  query: "",
  terminalResult: null,
  terminalError: null,
  connectionStatus: false,
  connectionLoading: false,
  project: null,
  history: [],
  setQuery: (query) => set({ query }),
  setTerminalResult: (result) => set({ terminalResult: result }),
  setTerminalError: (error) => set({ terminalError: error }),
  setConnectionStatus: (status) => set({ connectionStatus: status }),
  setConnectionLoading: (loading) => set({ connectionLoading: loading }),
  setProject: (project) => set({ project }),
  setHistory: (history) => set({ history }),
}));

export default useDatabaseStore;
