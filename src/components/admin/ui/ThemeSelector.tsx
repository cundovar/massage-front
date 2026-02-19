"use client";

import { THEME_PRESETS, type ThemePreset } from "@/lib/themes";

interface ThemeSelectorProps {
  value: ThemePreset;
  onChange: (preset: ThemePreset) => void;
}

export function ThemeSelector({ value, onChange }: ThemeSelectorProps) {
  const presets = Object.entries(THEME_PRESETS) as Array<[ThemePreset, (typeof THEME_PRESETS)[ThemePreset]]>;

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-stone-700">Theme du site</label>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {presets.map(([key, theme]) => (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={`
              relative rounded-lg border-2 p-4 text-left transition-all
              ${value === key ? "border-amber-500 ring-2 ring-amber-200" : "border-stone-200 hover:border-stone-300"}
            `}
          >
            <div className="mb-3 flex gap-1">
              <div className="h-6 w-6 rounded-full" style={{ background: theme.colors.primaryStart }} />
              <div className="h-6 w-6 rounded-full" style={{ background: theme.colors.primaryEnd }} />
              <div
                className="h-6 w-6 rounded-full border"
                style={{
                  background: theme.colors.background,
                  borderColor: theme.colors.cardBorder,
                }}
              />
            </div>

            <p className="font-medium text-stone-900">{theme.name}</p>

            {value === key ? (
              <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500">
                <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            ) : null}
          </button>
        ))}
      </div>

      <p className="text-sm text-stone-500">{THEME_PRESETS[value].description}</p>

      <div
        className="rounded-lg border p-6"
        style={{
          background: THEME_PRESETS[value].colors.background,
          borderColor: THEME_PRESETS[value].colors.cardBorder,
        }}
      >
        <p className="mb-3 text-xs text-stone-400">Apercu</p>

        <div
          className="mb-4 p-4"
          style={{
            background: THEME_PRESETS[value].colors.cardBg,
            borderRadius: THEME_PRESETS[value].cards.radius,
            border: `1px solid ${THEME_PRESETS[value].colors.cardBorder}`,
          }}
        >
          <h3
            className="mb-1 text-lg"
            style={{
              fontFamily: THEME_PRESETS[value].typography.fontHeading,
              color: THEME_PRESETS[value].colors.textPrimary,
            }}
          >
            Massage Abhyanga
          </h3>
          <p className="text-sm" style={{ color: THEME_PRESETS[value].colors.textSecondary }}>
            Massage ayurvedique a l&apos;huile chaude
          </p>
        </div>

        <button
          type="button"
          className="px-6 py-2 font-medium transition-transform hover:scale-105"
          style={{
            background: THEME_PRESETS[value].buttons.bg,
            color: THEME_PRESETS[value].buttons.text,
            borderRadius: THEME_PRESETS[value].buttons.radius,
            border: THEME_PRESETS[value].buttons.border ? `2px solid ${THEME_PRESETS[value].buttons.border}` : "none",
          }}
        >
          Reserver
        </button>
      </div>
    </div>
  );
}
