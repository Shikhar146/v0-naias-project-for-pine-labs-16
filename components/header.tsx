'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, Settings, LogOut } from 'lucide-react';
import React from 'react';

export function Header() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string>('');

  // Get user email from localStorage
  React.useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserEmail(userData.email || 'user@pinelabs.com');
      } catch {
        setUserEmail('user@pinelabs.com');
      }
    }
  }, []);

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('organizationId');
    
    // Redirect to home page
    router.push('/');
  };

  const handleSettings = () => {
    router.push('/admin');
  };

  return (
    <header className="fixed top-0 right-0 left-64 bg-card border-b border-border h-16 flex items-center justify-between px-6 z-40">
      {/* Right side actions */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Settings */}
        <Button variant="ghost" size="icon" onClick={handleSettings} title="Settings & Configuration">
          <Settings className="w-5 h-5" />
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-col">
              <span className="text-sm font-medium">Profile</span>
              <span className="text-xs text-muted-foreground">{userEmail}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="w-4 h-4 mr-2" />
              <span>View Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
