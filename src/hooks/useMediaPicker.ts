"use client";

import { useState } from "react";

export function useMediaPicker() {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  return {
    selectedPath,
    selectMediaPath: setSelectedPath,
    clearMediaPath: () => setSelectedPath(null),
  };
}
