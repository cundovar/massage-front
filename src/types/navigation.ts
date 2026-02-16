export interface NavItem {
  slug: string;
  title: string;
  path: string;
}

export interface NavigationResponse {
  items: NavItem[];
}
