export interface SiteSettings {
  general: GeneralSettings;
  contact: ContactSettings;
  hours: HoursSettings;
  social: SocialSettings;
  booking: BookingSettings;
  appearance: AppearanceSettings;
  footer: FooterSettings;
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
  primaryColor: string;
  darkModeDefault: boolean;
}

export interface FooterSettings {
  copyrightText: string;
  quickLinks: Array<{ label: string; url: string }>;
}

export interface PublicSettings extends Omit<SiteSettings, "booking"> {
  booking: Omit<BookingSettings, "notificationEmail">;
}
