'use client';

import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />
      <main className="ml-64 mt-16 p-6 min-h-screen">
        {children}
      </main>
    </div>
  );
}
