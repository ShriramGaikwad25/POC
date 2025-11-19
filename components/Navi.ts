import { ListTodo, ListTree, LayoutDashboard, LayoutPanelLeft, User2Icon, UserCircle2Icon, ScreenShareIcon, Package, Plus, Server, Key, FileText, ClipboardList, Search, User, Store, Users, Shield, Image } from 'lucide-react';

export interface NavItem {
  name: string;
  href: string;
  icon: any;
  subItems?: NavItem[];
}

export const navLinks: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Profile', href: '/profile', icon: User },
  { name: 'Request Access', href: '/access-request', icon: Key },
  { name: 'My Stores', href: '/stores', icon: Store },
  { name: 'My Users', href: '/user', icon: Users },
  { name: 'Roles', href: '/roles', icon: Shield },
  // { name: 'Banner', href: '/banner', icon: Image },
];
