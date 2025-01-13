"use client";

import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

const StaffHeader = ({ onMenuClick }: HeaderProps) => {
  return (
    <header className="bg-white border-b p-3 flex items-center sticky top-0 z-10">
      <Button variant="ghost" size="icon" onClick={onMenuClick}>
        <MenuIcon size={16} />
      </Button>
    </header>
  );
};

export default StaffHeader;