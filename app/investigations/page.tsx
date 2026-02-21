'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Plus, Search, ArrowRight } from 'lucide-react';
import { Investigation } from '@/lib/types/investigations';

export default function InvestigationsPage() {
  const [investigations, setInvestigations] = useState<Investigation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
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
        console.error('Error fetching investigations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestigations();
  }, []);

  const filteredInvestigations = investigations.filter((inv) => {
    const matchesSearch =
      inv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inv.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesStatus =
      statusFilter === 'all' || inv.status === statusFilter;
    const matchesType = typeFilter === 'all' || inv.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Investigations</h1>
              <p className="text-muted-foreground mt-1">
                Manage and track all incident investigations
              </p>
            </div>
            <Button asChild size="lg">
              <Link href="/investigations/new">
                <Plus className="w-4 h-4 mr-2" />
                New Investigation
              </Link>
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search investigations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-card/50 border-border/50"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40 bg-card/50 border-border/50">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-40 bg-card/50 border-border/50">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="incident">Incident</SelectItem>
                <SelectItem value="audit">Audit</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="change">Change</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <Card className="border-border/50 bg-card/50">
            <CardContent className="pt-6">
              <p className="text-muted-foreground">Loading investigations...</p>
            </CardContent>
          </Card>
        ) : filteredInvestigations.length === 0 ? (
          <Card className="border-border/50 bg-card/50">
            <CardContent className="pt-12 pb-12 text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                  ? 'No investigations found'
                  : 'No investigations yet'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Create your first investigation to get started.'}
              </p>
              {!searchTerm && statusFilter === 'all' && typeFilter === 'all' && (
                <Button asChild>
                  <Link href="/investigations/new">Create Investigation</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredInvestigations.map((investigation) => (
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
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
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
                        <Badge variant="outline" className="text-xs">
                          {investigation.type}
                        </Badge>
                      </div>
                      {investigation.description && (
                        <p className="text-sm text-muted-foreground mb-3">
                          {investigation.description}
                        </p>
                      )}
                      <div className="flex gap-6 text-xs text-muted-foreground flex-wrap">
                        <span>
                          Created {new Date(investigation.createdAt).toLocaleDateString()}
                        </span>
                        {investigation.completedAt && (
                          <span>
                            Completed{' '}
                            {new Date(investigation.completedAt).toLocaleDateString()}
                          </span>
                        )}
                        <span>
                          Window:{' '}
                          {new Date(investigation.timeWindowStart).toLocaleString()} -{' '}
                          {new Date(investigation.timeWindowEnd).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0 ml-4 mt-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
