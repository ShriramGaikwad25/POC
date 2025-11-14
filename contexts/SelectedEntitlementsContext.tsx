'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export interface Entitlement {
  id: string;
  entitlementName: string;
  entitlementType: string;
  applicationName: string;
  description: string;
  risk: string;
  lastReviewed: string;
  scope: string;
}

interface SelectedEntitlementsContextType {
  selectedEntitlements: Entitlement[];
  addEntitlement: (entitlement: Entitlement) => void;
  removeEntitlement: (entitlementId: string) => void;
  clearEntitlements: () => void;
  setSelectedEntitlements: (entitlements: Entitlement[]) => void;
}

const SelectedEntitlementsContext = createContext<SelectedEntitlementsContextType | undefined>(undefined);

export function SelectedEntitlementsProvider({ children }: { children: ReactNode }) {
  const [selectedEntitlements, setSelectedEntitlements] = useState<Entitlement[]>([]);

  const addEntitlement = useCallback((entitlement: Entitlement) => {
    setSelectedEntitlements((prev) => {
      if (prev.some((e) => e.id === entitlement.id)) {
        return prev;
      }
      return [...prev, entitlement];
    });
  }, []);

  const removeEntitlement = useCallback((entitlementId: string) => {
    setSelectedEntitlements((prev) => prev.filter((entitlement) => entitlement.id !== entitlementId));
  }, []);

  const clearEntitlements = useCallback(() => {
    setSelectedEntitlements([]);
  }, []);

  const value = {
    selectedEntitlements,
    addEntitlement,
    removeEntitlement,
    clearEntitlements,
    setSelectedEntitlements,
  };

  return <SelectedEntitlementsContext.Provider value={value}>{children}</SelectedEntitlementsContext.Provider>;
}

export function useSelectedEntitlements(): SelectedEntitlementsContextType {
  const context = useContext(SelectedEntitlementsContext);
  if (context === undefined) {
    throw new Error('useSelectedEntitlements must be used within a SelectedEntitlementsProvider');
  }
  return context;
}

