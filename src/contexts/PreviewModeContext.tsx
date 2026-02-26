"use client";

import { createContext, useContext, type ReactNode } from "react";

const PreviewModeContext = createContext<boolean>(false);

interface PreviewModeProviderProps {
  children: ReactNode;
}

export function PreviewModeProvider({ children }: PreviewModeProviderProps) {
  return <PreviewModeContext.Provider value={true}>{children}</PreviewModeContext.Provider>;
}

export function usePreviewMode(): boolean {
  return useContext(PreviewModeContext);
}
