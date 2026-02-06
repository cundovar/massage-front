export * from "./sections";

export interface ServicePrice {
  label: string;
  price: number;
}

export interface ServiceItem {
  id: number;
  category: string;
  name: string;
  description: string;
  prices: ServicePrice[];
  highlight: boolean;
  sortOrder: number;
}
