'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export interface App {
  id: string;
  applicationName: string;
  applicationType: string;
  owner: string;
  department: string;
  status: string;
  lastSync: string;
}

interface SelectedAppsContextType {
  selectedApps: App[];
  addApp: (app: App) => void;
  removeApp: (appId: string) => void;
  clearApps: () => void;
  setSelectedApps: (apps: App[]) => void;
}

const SelectedAppsContext = createContext<SelectedAppsContextType | undefined>(undefined);

export function SelectedAppsProvider({ children }: { children: ReactNode }) {
  const [selectedApps, setSelectedApps] = useState<App[]>([]);

  const addApp = useCallback((app: App) => {
    setSelectedApps((prev) => {
      if (prev.some((a) => a.id === app.id)) {
        return prev;
      }
      return [...prev, app];
    });
  }, []);

  const removeApp = useCallback((appId: string) => {
    setSelectedApps((prev) => prev.filter((app) => app.id !== appId));
  }, []);

  const clearApps = useCallback(() => {
    setSelectedApps([]);
  }, []);

  const value = {
    selectedApps,
    addApp,
    removeApp,
    clearApps,
    setSelectedApps,
  };

  return <SelectedAppsContext.Provider value={value}>{children}</SelectedAppsContext.Provider>;
}

export function useSelectedApps(): SelectedAppsContextType {
  const context = useContext(SelectedAppsContext);
  if (context === undefined) {
    throw new Error('useSelectedApps must be used within a SelectedAppsProvider');
  }
  return context;
}

