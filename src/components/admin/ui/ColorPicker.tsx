"use client";

import { useState, useRef, useEffect } from "react";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  presets?: string[];
}

const DEFAULT_PRESETS = [
  "#D4A574",
  "#F59E0B",
  "#EF4444",
  "#EC4899",
  "#8B5CF6",
  "#3B82F6",
  "#10B981",
  "#78716C",
];

export function ColorPicker({ value, onChange, presets = DEFAULT_PRESETS }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-10 h-10 rounded-lg border border-stone-200 shadow-sm"
          style={{ backgroundColor: value }}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-28 rounded-md border border-stone-200 px-3 py-2 text-sm font-mono"
          placeholder="#000000"
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 p-3 bg-white rounded-lg shadow-lg border border-stone-200 z-10">
          <div className="grid grid-cols-4 gap-2 mb-3">
            {presets.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => {
                  onChange(color);
                  setIsOpen(false);
                }}
                className={`w-8 h-8 rounded-lg border-2 ${
                  value === color ? "border-stone-900" : "border-transparent"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-8 cursor-pointer"
          />
        </div>
      )}
    </div>
  );
}
