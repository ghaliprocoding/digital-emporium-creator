
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
  },
  {
    label: 'My Products',
    href: '/dashboard/products',
  },
  {
    label: 'Add Product',
    href: '/dashboard/products/new',
  },
  {
    label: 'Profile Settings',
    href: '/dashboard/profile',
  },
];

const DashboardSidebar: React.FC = () => {
  const { pathname } = useLocation();
  const { user } = useAuth();

  return (
    <div className="h-screen sticky top-0 w-64 border-r p-6 hidden md:flex flex-col">
      <div className="flex flex-col space-y-6 flex-1">
        <Link to="/" className="flex items-center gap-2">
          <span className="h-8 w-8 rounded-md bg-brand-600 text-white grid place-items-center font-bold">DM</span>
          <span className="font-bold">Digital Marketplace</span>
        </Link>

        <div className="flex flex-col gap-1 py-4">
          <p className="text-sm font-medium text-muted-foreground px-3 py-1">Main Menu</p>

          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                  pathname === item.href 
                    ? "bg-accent text-accent-foreground" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="mt-auto border-t pt-6 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-brand-100 text-brand-800 grid place-items-center font-medium">
            {user?.name ? user.name.substring(0, 2).toUpperCase() : 'U'}
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <Link to="/store" className="text-sm text-brand-600 hover:underline">
          View My Store →
        </Link>
      </div>
    </div>
  );
};

export default DashboardSidebar;
