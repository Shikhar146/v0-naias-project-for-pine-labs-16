'use client';

import { useState, useEffect } from 'react';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { InvestigationType, Severity } from '@/lib/types/investigations';

export default function NewInvestigationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'incident' as InvestigationType,
    severity: 'medium' as Severity,
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Check authentication
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/login');
      return;
    }
    setIsAuthenticated(true);

    // Set default time window (last 1 hour)
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    setFormData((prev) => ({
      ...prev,
      startDate: oneHourAgo.toISOString().split('T')[0],
      startTime: oneHourAgo.toISOString().split('T')[1].slice(0, 5),
      endDate: now.toISOString().split('T')[0],
      endTime: now.toISOString().split('T')[1].slice(0, 5),
    }));
  }, [router]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Investigation title is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    }

    if (formData.startDate && formData.startTime && formData.endDate && formData.endTime) {
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

      if (startDateTime >= endDateTime) {
        newErrors.timeWindow = 'End time must be after start time';
      }

      // Check if time window is reasonable (max 7 days)
      const diffInHours = (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60);
      if (diffInHours > 168) {
        newErrors.timeWindow = 'Time window cannot exceed 7 days';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const orgId = localStorage.getItem('organizationId') || 'demo-org';
      const userId = localStorage.getItem('userId') || 'demo-user';

      const timeWindowStart = new Date(`${formData.startDate}T${formData.startTime}`);
      const timeWindowEnd = new Date(`${formData.endDate}T${formData.endTime}`);

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
          timeWindowStart: timeWindowStart.toISOString(),
          timeWindowEnd: timeWindowEnd.toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create investigation');
      }

      const investigation = await response.json();
      router.push(`/investigations/${investigation.id}`);
    } catch (error) {
      console.error('Error creating investigation:', error);
      setErrors({
        submit: 'Failed to create investigation. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const isValid = !errors.title && !errors.startDate && !errors.startTime && !errors.endDate && !errors.endTime && !errors.timeWindow && formData.title.trim();

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/95">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/investigations"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to investigations
        </Link>

        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle>Create New Investigation</CardTitle>
            <CardDescription>
              Provide investigation details and select the time window to analyze
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Alert */}
              {errors.submit && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.submit}</AlertDescription>
                </Alert>
              )}

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="flex items-center gap-2">
                  Investigation Title
                  {errors.title && <span className="text-xs text-destructive">*</span>}
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Unusual API Response Times"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value });
                    if (e.target.value.trim()) {
                      setErrors({ ...errors, title: '' });
                    }
                  }}
                  className={errors.title ? 'border-destructive' : ''}
                />
                {errors.title && (
                  <p className="text-xs text-destructive">{errors.title}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Provide additional context or details about the investigation..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  className="resize-none"
                />
              </div>

              {/* Type and Severity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Investigation Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, type: value as InvestigationType })
                    }
                  >
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="incident">Incident</SelectItem>
                      <SelectItem value="anomaly">Anomaly Detection</SelectItem>
                      <SelectItem value="performance">Performance</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="compliance">Compliance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="severity">Severity Level</Label>
                  <Select
                    value={formData.severity}
                    onValueChange={(value) =>
                      setFormData({ ...formData, severity: value as Severity })
                    }
                  >
                    <SelectTrigger id="severity">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Time Window */}
              <div className="border rounded-lg p-5 space-y-4 bg-background/50">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-base">Time Window</h3>
                  <span className="text-xs text-muted-foreground">Select analysis period</span>
                </div>

                {/* Start Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate" className="flex items-center gap-2">
                      Start Date
                      {errors.startDate && <span className="text-xs text-destructive">*</span>}
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => {
                        setFormData({ ...formData, startDate: e.target.value });
                        if (e.target.value) {
                          setErrors({ ...errors, startDate: '', timeWindow: '' });
                        }
                      }}
                      className={errors.startDate ? 'border-destructive' : ''}
                    />
                    {errors.startDate && (
                      <p className="text-xs text-destructive">{errors.startDate}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startTime" className="flex items-center gap-2">
                      Start Time
                      {errors.startTime && <span className="text-xs text-destructive">*</span>}
                    </Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => {
                        setFormData({ ...formData, startTime: e.target.value });
                        if (e.target.value) {
                          setErrors({ ...errors, startTime: '', timeWindow: '' });
                        }
                      }}
                      className={errors.startTime ? 'border-destructive' : ''}
                    />
                    {errors.startTime && (
                      <p className="text-xs text-destructive">{errors.startTime}</p>
                    )}
                  </div>
                </div>

                {/* End Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="endDate" className="flex items-center gap-2">
                      End Date
                      {errors.endDate && <span className="text-xs text-destructive">*</span>}
                    </Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => {
                        setFormData({ ...formData, endDate: e.target.value });
                        if (e.target.value) {
                          setErrors({ ...errors, endDate: '', timeWindow: '' });
                        }
                      }}
                      className={errors.endDate ? 'border-destructive' : ''}
                    />
                    {errors.endDate && (
                      <p className="text-xs text-destructive">{errors.endDate}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endTime" className="flex items-center gap-2">
                      End Time
                      {errors.endTime && <span className="text-xs text-destructive">*</span>}
                    </Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => {
                        setFormData({ ...formData, endTime: e.target.value });
                        if (e.target.value) {
                          setErrors({ ...errors, endTime: '', timeWindow: '' });
                        }
                      }}
                      className={errors.endTime ? 'border-destructive' : ''}
                    />
                    {errors.endTime && (
                      <p className="text-xs text-destructive">{errors.endTime}</p>
                    )}
                  </div>
                </div>

                {/* Time Window Error */}
                {errors.timeWindow && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.timeWindow}</AlertDescription>
                  </Alert>
                )}

                <p className="text-xs text-muted-foreground">
                  The system will fetch logs and events within this time window for analysis.
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-6 border-t">
                <Button
                  type="submit"
                  disabled={!isValid || loading}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Investigation...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Create Investigation
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
