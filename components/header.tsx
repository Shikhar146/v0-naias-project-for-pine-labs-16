'use client';

import { Button } from '@/components/ui/button';
import { Bell, User, Settings } from 'lucide-react';

export function Header() {
  return (
    <header className="fixed top-0 right-0 left-64 bg-card border-b border-border h-16 flex items-center justify-between px-6 z-40">
      {/* Right side actions */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
        </Button>

        {/* User menu */}
        <Button variant="ghost" size="icon">
          <User className="w-5 h-5" />
        </Button>

        {/* Settings */}
        <Button variant="ghost" size="icon">
          <Settings className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}
