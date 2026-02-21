'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { InvestigationType, Severity } from '@/lib/types/investigations';

export default function NewInvestigationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'incident' as InvestigationType,
    severity: 'medium' as Severity,
    timeWindowStart: '',
    timeWindowEnd: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orgId = localStorage.getItem('organizationId') || 'demo-org';
      const userId = localStorage.getItem('userId') || 'demo-user';

      const response = await fetch('/api/investigations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-organization-id': orgId,
          'x-user-id': userId,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          type: formData.type,
          severity: formData.severity,
          timeWindowStart: new Date(formData.timeWindowStart),
          timeWindowEnd: new Date(formData.timeWindowEnd),
        }),
      });

      if (!response.ok) throw new Error('Failed to create investigation');
      
      const investigation = await response.json();
      router.push(`/investigations/${investigation.id}`);
    } catch (error) {
      console.error('Error creating investigation:', error);
      alert('Failed to create investigation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isValid =
    formData.title &&
    formData.timeWindowStart &&
    formData.timeWindowEnd &&
    new Date(formData.timeWindowStart) < new Date(formData.timeWindowEnd);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/investigations"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Investigations
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Create Investigation</h1>
          <p className="text-muted-foreground mt-1">
            Start a new AI-powered investigation for incident analysis
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle>Investigation Details</CardTitle>
              <CardDescription>
                Provide basic information about your investigation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-foreground">
                  Investigation Title *
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Payment Processing API Timeout - 2024-02-21"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="mt-2 bg-background border-border/50"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-foreground">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the incident, symptoms, or context..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="mt-2 bg-background border-border/50 min-h-28"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type" className="text-foreground">
                    Investigation Type *
                  </Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        type: value as InvestigationType,
                      })
                    }
                  >
                    <SelectTrigger
                      id="type"
                      className="mt-2 bg-background border-border/50"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="incident">Incident</SelectItem>
                      <SelectItem value="audit">Audit</SelectItem>
                      <SelectItem value="performance">Performance</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="change">Change</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="severity" className="text-foreground">
                    Severity *
                  </Label>
                  <Select
                    value={formData.severity}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        severity: value as Severity,
                      })
                    }
                  >
                    <SelectTrigger
                      id="severity"
                      className="mt-2 bg-background border-border/50"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Time Window */}
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle>Time Window</CardTitle>
              <CardDescription>
                Specify when the incident occurred or the period to investigate
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start-time" className="text-foreground">
                    Start Time *
                  </Label>
                  <Input
                    id="start-time"
                    type="datetime-local"
                    value={formData.timeWindowStart}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        timeWindowStart: e.target.value,
                      })
                    }
                    className="mt-2 bg-background border-border/50"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="end-time" className="text-foreground">
                    End Time *
                  </Label>
                  <Input
                    id="end-time"
                    type="datetime-local"
                    value={formData.timeWindowEnd}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        timeWindowEnd: e.target.value,
                      })
                    }
                    className="mt-2 bg-background border-border/50"
                    required
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                The system will fetch logs and events within this time window for analysis.
              </p>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={!isValid || loading}
              size="lg"
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Investigation...
                </>
              ) : (
                'Create Investigation'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              asChild
              disabled={loading}
            >
              <Link href="/investigations">Cancel</Link>
            </Button>
          </div>

          {!isValid && formData.title && (
            <Card className="border-destructive/50 bg-destructive/5">
              <CardContent className="pt-4">
                <p className="text-sm text-destructive">
                  Please complete all required fields and ensure end time is after start time.
                </p>
              </CardContent>
            </Card>
          )}
        </form>
      </div>
    </div>
  );
}
