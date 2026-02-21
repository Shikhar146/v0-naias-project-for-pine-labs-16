'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Search,
  Grid,
  Network,
  Shield,
  Settings,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const NAVIGATION = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Grid,
    description: 'Overview and quick start',
  },
  {
    name: 'Investigations',
    href: '/investigations',
    icon: Search,
    description: 'Create and manage investigations',
  },
  {
    name: 'RCA Analysis',
    href: '/rca-analysis',
    icon: BarChart3,
    description: 'AI-powered root cause analysis',
  },
  {
    name: 'Network Topology',
    href: '/network-topology',
    icon: Network,
    description: 'Network visualization and flows',
  },
  {
    name: 'Compliance',
    href: '/compliance',
    icon: Shield,
    description: 'Security and audit findings',
  },
  {
    name: 'Query Builder',
    href: '/query-builder',
    icon: Search,
    description: 'Custom Athena queries',
  },
  {
    name: 'Settings',
    href: '/admin',
    icon: Settings,
    description: 'Configuration and management',
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-card border-r border-border h-screen fixed left-0 top-0 overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">
              ⚡
            </span>
          </div>
          <div>
            <h1 className="font-bold text-lg text-foreground">NAIAS</h1>
            <p className="text-xs text-muted-foreground">
              Network AI System
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {NAVIGATION.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? 'default' : 'ghost'}
                className="w-full justify-start gap-3 h-auto py-3 px-4"
              >
                <Icon className="w-5 h-5" />
                <div className="text-left flex-1">
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {item.description}
                  </p>
                </div>
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-card border-t border-border">
        <div className="bg-secondary/50 rounded-lg p-3">
          <p className="text-xs font-semibold text-foreground mb-1">
            Pine Labs Creditplus
          </p>
          <p className="text-xs text-muted-foreground">
            v1.0.0 • Enterprise Edition
          </p>
        </div>
      </div>
    </aside>
  );
}
