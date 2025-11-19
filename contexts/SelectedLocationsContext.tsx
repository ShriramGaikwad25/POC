'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export interface Location {
  id: string;
  name: string;
  type: 'store' | 'region' | 'customGroup';
  storeNumber?: string;
  location?: string;
  brand?: string;
  region?: string;
  description?: string;
  numberOfStores?: number;
}

interface SelectedLocationsContextType {
  selectedLocations: Location[];
  addLocation: (location: Location) => void;
  removeLocation: (locationId: string) => void;
  clearLocations: () => void;
  setSelectedLocations: (locations: Location[]) => void;
}

const SelectedLocationsContext = createContext<SelectedLocationsContextType | undefined>(undefined);

export function SelectedLocationsProvider({ children }: { children: ReactNode }) {
  const [selectedLocations, setSelectedLocations] = useState<Location[]>([]);

  const addLocation = useCallback((location: Location) => {
    setSelectedLocations((prev) => {
      if (prev.some((l) => l.id === location.id)) {
        return prev;
      }
      return [...prev, location];
    });
  }, []);

  const removeLocation = useCallback((locationId: string) => {
    setSelectedLocations((prev) => prev.filter((location) => location.id !== locationId));
  }, []);

  const clearLocations = useCallback(() => {
    setSelectedLocations([]);
  }, []);

  const value = {
    selectedLocations,
    addLocation,
    removeLocation,
    clearLocations,
    setSelectedLocations,
  };

  return <SelectedLocationsContext.Provider value={value}>{children}</SelectedLocationsContext.Provider>;
}

export function useSelectedLocations(): SelectedLocationsContextType {
  const context = useContext(SelectedLocationsContext);
  if (context === undefined) {
    throw new Error('useSelectedLocations must be used within a SelectedLocationsProvider');
  }
  return context;
}


