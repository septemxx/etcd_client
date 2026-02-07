import { create } from 'zustand';
import { ConnectionConfig } from '../types';

interface ConnectionState {
  isConnected: boolean;
  currentConnection: ConnectionConfig | null;
  setConnected: (connected: boolean, config?: ConnectionConfig) => void;
  disconnect: () => void;
}

export const useConnectionStore = create<ConnectionState>((set) => ({
  isConnected: false,
  currentConnection: null,
  setConnected: (connected, config) => set({ isConnected: connected, currentConnection: config || null }),
  disconnect: () => set({ isConnected: false, currentConnection: null }),
}));
