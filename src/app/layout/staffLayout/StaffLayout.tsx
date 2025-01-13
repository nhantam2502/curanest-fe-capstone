"use client";

import CollapsibleSidebar from '@/app/layout/staffLayout/StaffSidebar';
import Header from './StaffHeader';
import { useState } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <div className="flex h-screen">
      <CollapsibleSidebar isCollapsed={isCollapsed} />
      <div className="flex-1 flex flex-col">
        <Header onMenuClick={toggleSidebar} />
        <main className="flex-1 p-4 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}