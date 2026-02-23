export interface NavItem {
  slug: string;
  title: string;
  path: string;
  isExternal?: boolean;
  openInNewTab?: boolean;
}

export interface NavigationResponse {
  items: NavItem[];
}
