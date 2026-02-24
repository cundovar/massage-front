export type ThemePreset = "ayurveda" | "spa-luxe" | "nature" | "zen" | "energique";
export type HeaderStyle = "transparent" | "solid" | "sticky";

export interface SiteSettings {
  general: GeneralSettings;
  contact: ContactSettings;
  hours: HoursSettings;
  social: SocialSettings;
  booking: BookingSettings;
  appearance: AppearanceSettings;
  footer: FooterSettings;
  navigation: NavigationSettings;
  updatedAt?: string;
}

export interface GeneralSettings {
  siteName: string;
  logo: string | null;
  favicon: string | null;
  defaultMetaDescription: string;
}

export interface ContactSettings {
  address: {
    street: string;
    postalCode: string;
    city: string;
  };
  phone: string;
  email: string;
  googleMapsUrl: string | null;
  googleMapsEmbed: string | null;
}

export interface HoursSettings {
  schedule: Array<{ days: string; hours: string }>;
  closedMessage: string;
}

export interface SocialSettings {
  instagram: string | null;
  facebook: string | null;
  linkedin: string | null;
}

export interface BookingSettings {
  notificationEmail: string;
  minDelayHours: number;
  confirmationMessage: string;
}

export interface AppearanceSettings {
  themePreset: ThemePreset;
  useCustomAccent: boolean;
  customAccentColor: string | null;
  headerStyle: HeaderStyle;
  showDarkModeToggle: boolean;
}

export interface FooterSettings {
  copyrightText: string;
  quickLinks: Array<{ label: string; url: string }>;
  showSocialLinks: boolean;
  showContactInfo: boolean;
  showHours: boolean;
  customDescription: string | null;
  mentionsLegalesText: string;
  showMentionsLegales: boolean;
}

export interface ExternalNavLink {
  id: string;
  label: string;
  url: string;
  openInNewTab: boolean;
  order: number;
}

export interface NavigationSettings {
  externalLinks: ExternalNavLink[];
}

export interface PublicSettings extends Omit<SiteSettings, "booking"> {
  booking: Omit<BookingSettings, "notificationEmail">;
}
