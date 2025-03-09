// nurseContext.tsx
"use client";
import React, { createContext, useContext, useState } from "react";
import { GetAllNurse } from "@/types/nurse";

interface NurseContextType {
  selectedNurse: GetAllNurse | null;
  setSelectedNurse: (nurse: GetAllNurse | null) => void;
}

const NurseContext = createContext<NurseContextType | undefined>(undefined);

export const NurseProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedNurse, setSelectedNurse] = useState<GetAllNurse | null>(null);
  return (
    <NurseContext.Provider value={{ selectedNurse, setSelectedNurse }}>
      {children}
    </NurseContext.Provider>
  );
};

export const useNurse = () => {
  const context = useContext(NurseContext);
  if (context === undefined) {
    throw new Error("useNurse must be used within a NurseProvider");
  }
  return context;
};
