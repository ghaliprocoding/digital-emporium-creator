
import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardSidebar from '@/components/DashboardSidebar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';

const DashboardLayout: React.FC = () => {
  const { logout } = useAuth();
  
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      
      <div className="flex-1">
        <header className="border-b bg-white p-4 flex items-center justify-between md:hidden">
          <Link to="/" className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-md bg-brand-600 text-white grid place-items-center font-bold">DM</span>
            <span className="font-bold">Dashboard</span>
          </Link>
          <Button variant="ghost" size="sm" onClick={logout}>
            Log out
          </Button>
        </header>
        
        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
