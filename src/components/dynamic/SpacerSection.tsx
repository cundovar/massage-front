export interface SpacerSectionContent {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const spacerClasses: Record<NonNullable<SpacerSectionContent["size"]>, string> = {
  xs: "h-4 md:h-6",
  sm: "h-8 md:h-10",
  md: "h-12 md:h-16",
  lg: "h-20 md:h-28",
  xl: "h-28 md:h-40",
};

export function SpacerSection({ content }: { content: SpacerSectionContent }) {
  const size = content.size ?? "md";

  return <div className={spacerClasses[size]} aria-hidden="true" />;
}
