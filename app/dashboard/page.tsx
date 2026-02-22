'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutWrapper } from '@/components/layout-wrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRight,
  AlertTriangle,
  Clock,
  TrendingUp,
  Plus,
  Shield,
  Activity,
} from 'lucide-react';
import { Investigation } from '@/lib/types/investigations';

export default function Dashboard() {
  const router = useRouter();
  const [investigations, setInvestigations] = useState<Investigation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const user = localStorage.getItem('user');
    if (!user) {
      // Redirect to login if not authenticated
      router.push('/login');
      return;
    }
    setIsAuthenticated(true);

    const fetchInvestigations = async () => {
      try {
        const orgId = localStorage.getItem('organizationId') || 'demo-org';
        const response = await fetch('/api/investigations', {
          headers: {
            'x-organization-id': orgId,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setInvestigations(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchInvestigations();
  }, [router]);

  const activeInvestigations = investigations.filter(
    (i) => i.status === 'running' || i.status === 'draft'
  ).length;
  const completedToday = investigations.filter(
    (i) =>
      i.status === 'completed' &&
      new Date(i.createdAt).toDateString() === new Date().toDateString()
  ).length;

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      critical: 'bg-destructive/10 text-destructive',
      high: 'bg-orange-500/10 text-orange-500',
      medium: 'bg-yellow-500/10 text-yellow-500',
      low: 'bg-blue-500/10 text-blue-500',
    };
    return colors[severity] || colors.low;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-500/10 text-gray-500',
      running: 'bg-primary/10 text-primary',
      completed: 'bg-green-500/10 text-green-500',
      failed: 'bg-destructive/10 text-destructive',
      archived: 'bg-muted/10 text-muted-foreground',
    };
    return colors[status] || colors.draft;
  };

  // Don't render dashboard if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <LayoutWrapper>
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Welcome to NAIAS - AI-Powered Network Investigation
              </p>
            </div>
            <Button asChild size="lg">
              <Link href="/investigations/new">
                <Plus className="w-4 h-4 mr-2" />
                New Investigation
              </Link>
            </Button>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: Activity,
                label: 'Active Investigations',
                value: activeInvestigations,
                color: 'text-primary',
              },
              {
                icon: TrendingUp,
                label: 'Completed Today',
                value: completedToday,
                color: 'text-green-500',
              },
              {
                icon: Clock,
                label: 'Avg Resolution Time',
                value: '18 min',
                color: 'text-blue-500',
              },
              {
                icon: AlertTriangle,
                label: 'Critical Issues',
                value: investigations.filter((i) => i.severity === 'critical').length,
                color: 'text-destructive',
              },
            ].map((kpi, idx) => (
              <Card
                key={idx}
                className="border-border/50 bg-card/50 hover:bg-card/80 transition"
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{kpi.label}</p>
                      <p className={`text-2xl font-bold mt-1 ${kpi.color}`}>
                        {kpi.value}
                      </p>
                    </div>
                    <div className={`p-2 rounded-lg bg-primary/10 ${kpi.color}`}>
                      <kpi.icon className="w-5 h-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Recent Investigations */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Recent Investigations</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Your latest investigation activities and results
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/investigations">
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>

            {loading ? (
              <Card className="border-border/50 bg-card/50">
                <CardContent className="pt-6">
                  <p className="text-muted-foreground">Loading investigations...</p>
                </CardContent>
              </Card>
            ) : error ? (
              <Card className="border-border/50 bg-card/50">
                <CardContent className="pt-6">
                  <p className="text-destructive">Error: {error}</p>
                </CardContent>
              </Card>
            ) : investigations.length === 0 ? (
              <Card className="border-border/50 bg-card/50">
                <CardContent className="pt-12 pb-12 text-center">
                  <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No investigations yet
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Create your first investigation to get started with AI-powered incident analysis.
                  </p>
                  <Button asChild>
                    <Link href="/investigations/new">Create Investigation</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {investigations.slice(0, 5).map((investigation) => (
                  <Card
                    key={investigation.id}
                    className="border-border/50 bg-card/50 hover:bg-card/80 transition cursor-pointer"
                    onClick={() => {
                      window.location.href = `/investigations/${investigation.id}`;
                    }}
                  >
                    <CardContent className="py-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-foreground">
                              {investigation.title}
                            </h3>
                            <Badge
                              className={getSeverityColor(investigation.severity)}
                              variant="secondary"
                            >
                              {investigation.severity}
                            </Badge>
                            <Badge
                              className={getStatusColor(investigation.status)}
                              variant="secondary"
                            >
                              {investigation.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {investigation.description}
                          </p>
                          <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                            <span>Type: {investigation.type}</span>
                            <span>
                              Created{' '}
                              {new Date(investigation.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0 ml-4" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>

          {/* Quick Start */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">Quick Start</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: 'One-Click Investigation',
                  description: 'Paste error message or incident details for instant AI analysis',
                  href: '/investigations/new?mode=quick',
                },
                {
                  title: 'RCA Analysis',
                  description: 'AI-powered root cause analysis with evidence correlation',
                  href: '/rca-analysis',
                },
                {
                  title: 'Network Topology',
                  description: 'View real-time network traffic and connections',
                  href: '/network-topology',
                },
                {
                  title: 'Transaction Tracer',
                  description: 'Debug payment transactions end-to-end across services',
                  href: '/transaction-tracer',
                },
                {
                  title: 'Compliance Audit',
                  description: 'Review security findings and compliance status',
                  href: '/compliance',
                },
                {
                  title: 'Query Builder',
                  description: 'Build custom Athena queries with AI suggestions',
                  href: '/query-builder',
                },
              ].map((item, idx) => (
                <Button
                  key={idx}
                  asChild
                  variant="outline"
                  className="h-auto justify-start p-4"
                >
                  <Link href={item.href}>
                    <div className="text-left">
                      <p className="font-semibold text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                </Button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
    </LayoutWrapper>
  );
}
