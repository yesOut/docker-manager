// src/types/navigation.ts
import { ReactNode } from 'react';

export interface NavItem {
  key: string;
  label: string;
  path: string;
  icon?: ReactNode;
}

export interface NavigationProps {
  items: NavItem[];
  activeKey?: string;
  onNavigate?: (key: string, path: string) => void;
}