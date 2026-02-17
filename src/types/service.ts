export interface ServicePrice {
  label: string;
  price: number;
}

export interface Service {
  id: number;
  category: string;
  name: string;
  description: string;
  prices: ServicePrice[];
  highlight: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export type ServiceItem = Service;

export interface ServiceFormData {
  category: string;
  name: string;
  description: string;
  prices: ServicePrice[];
  highlight: boolean;
  sortOrder?: number;
}

export const CATEGORIES = [
  "Ayurveda",
  "Kobido",
  "Reflexologie",
  "Prenatal",
  "Bol Kansu",
  "Padhabyanga",
  "Entreprise",
  "Autre",
] as const;
