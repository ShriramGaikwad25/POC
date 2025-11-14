'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export interface UserGroup {
  id: string;
  groupName: string;
  description: string;
  creationDate: string;
  numberOfUsers: number;
}

interface SelectedGroupsContextType {
  selectedGroups: UserGroup[];
  addGroup: (group: UserGroup) => void;
  removeGroup: (groupId: string) => void;
  clearGroups: () => void;
  setSelectedGroups: (groups: UserGroup[]) => void;
}

const SelectedGroupsContext = createContext<SelectedGroupsContextType | undefined>(undefined);

export function SelectedGroupsProvider({ children }: { children: ReactNode }) {
  const [selectedGroups, setSelectedGroups] = useState<UserGroup[]>([]);

  const addGroup = useCallback((group: UserGroup) => {
    setSelectedGroups((prev) => {
      if (prev.some((g) => g.id === group.id)) {
        return prev;
      }
      return [...prev, group];
    });
  }, []);

  const removeGroup = useCallback((groupId: string) => {
    setSelectedGroups((prev) => prev.filter((group) => group.id !== groupId));
  }, []);

  const clearGroups = useCallback(() => {
    setSelectedGroups([]);
  }, []);

  const value = {
    selectedGroups,
    addGroup,
    removeGroup,
    clearGroups,
    setSelectedGroups,
  };

  return <SelectedGroupsContext.Provider value={value}>{children}</SelectedGroupsContext.Provider>;
}

export function useSelectedGroups(): SelectedGroupsContextType {
  const context = useContext(SelectedGroupsContext);
  if (context === undefined) {
    throw new Error('useSelectedGroups must be used within a SelectedGroupsProvider');
  }
  return context;
}

