'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  ArrowLeft,
  Play,
  Download,
  Share2,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { Investigation } from '@/lib/types/investigations';

export default function InvestigationDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [investigation, setInvestigation] = useState<Investigation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchInvestigation = async () => {
      try {
        const orgId = localStorage.getItem('organizationId') || 'demo-org';
        const response = await fetch(`/api/investigations/${id}`, {
          headers: {
            'x-organization-id': orgId,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch investigation');
        const data = await response.json();
        setInvestigation(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchInvestigation();
  }, [id]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="border-border/50 bg-card/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <p className="text-foreground">Loading investigation...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !investigation) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/investigations"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Investigations
          </Link>
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="pt-6">
              <p className="text-destructive">
                {error || 'Investigation not found'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/investigations"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Investigations
          </Link>

          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-foreground">
                  {investigation.title}
                </h1>
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
              {investigation.description && (
                <p className="text-muted-foreground">{investigation.description}</p>
              )}
            </div>

            <div className="flex gap-2">
              {investigation.status === 'draft' && (
                <Button asChild>
                  <Link href={`/investigations/${id}/execute`}>
                    <Play className="w-4 h-4 mr-2" />
                    Execute
                  </Link>
                </Button>
              )}
              <Button variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              icon: Clock,
              label: 'Status',
              value: investigation.status,
              color: 'text-primary',
            },
            {
              icon: AlertTriangle,
              label: 'Severity',
              value: investigation.severity,
              color: 'text-orange-500',
            },
            {
              icon: CheckCircle2,
              label: 'Type',
              value: investigation.type,
              color: 'text-green-500',
            },
            {
              icon: Clock,
              label: 'Created',
              value: new Date(investigation.createdAt).toLocaleDateString(),
              color: 'text-blue-500',
            },
          ].map((stat, idx) => (
            <Card key={idx} className="border-border/50 bg-card/50">
              <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">
                      {stat.label}
                    </p>
                    <p className={`text-lg font-semibold mt-1 capitalize ${stat.color}`}>
                      {stat.value}
                    </p>
                  </div>
                  <stat.icon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-card/50 border-border/50">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="queries">Queries</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="rca">RCA Results</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle>Investigation Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Time Window Start</p>
                    <p className="text-foreground font-semibold mt-1">
                      {new Date(investigation.timeWindowStart).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time Window End</p>
                    <p className="text-foreground font-semibold mt-1">
                      {new Date(investigation.timeWindowEnd).toLocaleString()}
                    </p>
                  </div>
                </div>
                {investigation.resourceFilters &&
                  Object.keys(investigation.resourceFilters).length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Resource Filters</p>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(investigation.resourceFilters).map(
                          ([key, values]) =>
                            Array.isArray(values) ? (
                              values.map((val) => (
                                <Badge key={`${key}-${val}`} variant="outline">
                                  {key}: {val}
                                </Badge>
                              ))
                            ) : null
                        )}
                      </div>
                    </div>
                  )}
              </CardContent>
            </Card>

            {investigation.aiInsights && (
              <Card className="border-border/50 bg-card/50 border-primary/20">
                <CardHeader>
                  <CardTitle>AI Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs text-muted-foreground bg-background p-4 rounded-lg overflow-auto max-h-64">
                    {JSON.stringify(investigation.aiInsights, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="queries">
            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle>Executed Queries</CardTitle>
                <CardDescription>
                  All Athena and CloudWatch queries executed for this investigation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">No queries executed yet.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline">
            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle>Event Timeline</CardTitle>
                <CardDescription>
                  Chronological view of events related to this investigation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">No events recorded yet.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rca">
            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle>Root Cause Analysis</CardTitle>
                <CardDescription>
                  AI-generated root cause analysis and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  RCA will be generated once the investigation is executed.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
