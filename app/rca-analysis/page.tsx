'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  LinkIcon,
} from 'lucide-react';
import { useState } from 'react';

export default function RCAAnalysisPage() {
  const [selectedInvestigation, setSelectedInvestigation] = useState<string>('');

  // Mock data for demonstration
  const mockRCAResults = {
    rootCause:
      'Database connection pool exhaustion in payment processor service. The service failed to properly return connections after processing, leading to connection timeout errors.',
    confidence: 0.87,
    evidence: [
      {
        type: 'CloudWatch Log',
        timestamp: '2024-02-21 14:32:45',
        message: 'Connection pool size: 100/100 (exhausted)',
        severity: 'critical',
      },
      {
        type: 'VPC Flow Log',
        timestamp: '2024-02-21 14:32:42',
        message: 'Connection reset from db-primary-01 to payment-svc-03',
        severity: 'high',
      },
      {
        type: 'Security Hub',
        timestamp: '2024-02-21 14:31:15',
        message: 'Unusual traffic pattern detected on port 5432',
        severity: 'medium',
      },
    ],
    remediationSteps: [
      {
        step: 1,
        action: 'Increase database connection pool size from 100 to 200',
        priority: 'immediate',
        estimatedTime: '5 minutes',
      },
      {
        step: 2,
        action: 'Implement connection pool health check every 30 seconds',
        priority: 'high',
        estimatedTime: '30 minutes',
      },
      {
        step: 3,
        action: 'Add monitoring alert for connection pool usage > 80%',
        priority: 'high',
        estimatedTime: '15 minutes',
      },
      {
        step: 4,
        action: 'Review connection timeout settings in application code',
        priority: 'medium',
        estimatedTime: '2 hours',
      },
    ],
    alternativeCauses: [
      { cause: 'Network latency increase', probability: 0.08 },
      { cause: 'Database server memory pressure', probability: 0.05 },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-foreground">RCA Analysis</h1>
          <p className="text-muted-foreground mt-1">
            AI-powered root cause analysis with evidence correlation
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Investigation Selector */}
        <Card className="border-border/50 bg-card/50 mb-8">
          <CardHeader>
            <CardTitle>Select Investigation</CardTitle>
            <CardDescription>
              Choose an investigation to view its root cause analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedInvestigation} onValueChange={setSelectedInvestigation}>
              <SelectTrigger className="bg-background border-border/50">
                <SelectValue placeholder="Select an investigation..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="demo-1">
                  Payment Processing API Timeout - 2024-02-21
                </SelectItem>
                <SelectItem value="demo-2">
                  Network Latency Spike - 2024-02-20
                </SelectItem>
                <SelectItem value="demo-3">
                  Database Failover Issue - 2024-02-19
                </SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {selectedInvestigation && (
          <div className="space-y-6">
            {/* Root Cause Summary */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <CardTitle>Root Cause Analysis</CardTitle>
                      <CardDescription className="mt-1">
                        AI-generated analysis with confidence score
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-green-500/10 text-green-500">
                    {Math.round(mockRCAResults.confidence * 100)}% Confidence
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-foreground leading-relaxed">
                  {mockRCAResults.rootCause}
                </p>
              </CardContent>
            </Card>

            {/* Evidence Links */}
            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <LinkIcon className="w-5 h-5 text-primary" />
                  <CardTitle>Correlated Evidence</CardTitle>
                </div>
                <CardDescription>
                  Events and logs that support the root cause
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockRCAResults.evidence.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-4 p-4 bg-background/50 rounded-lg border border-border/50"
                    >
                      <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-foreground">
                            {item.type}
                          </span>
                          <Badge
                            variant="outline"
                            className="text-xs capitalize"
                          >
                            {item.severity}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.timestamp}
                        </p>
                        <p className="text-sm text-foreground mt-2">{item.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Remediation Steps */}
            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <CardTitle>Recommended Actions</CardTitle>
                </div>
                <CardDescription>
                  Step-by-step remediation plan to resolve the issue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRCAResults.remediationSteps.map((step) => (
                    <div
                      key={step.step}
                      className="flex gap-4 p-4 bg-background/50 rounded-lg border border-border/50"
                    >
                      <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold">
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-semibold text-foreground">
                            {step.action}
                          </p>
                          <Badge
                            variant="outline"
                            className="text-xs capitalize"
                          >
                            {step.priority}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Est. Time: {step.estimatedTime}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Alternative Causes */}
            {mockRCAResults.alternativeCauses.length > 0 && (
              <Card className="border-border/50 bg-card/50">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    <CardTitle>Alternative Root Causes</CardTitle>
                  </div>
                  <CardDescription>
                    Other potential causes with lower confidence scores
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockRCAResults.alternativeCauses.map((cause, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/50"
                      >
                        <p className="text-foreground">{cause.cause}</p>
                        <Badge variant="outline">
                          {Math.round(cause.probability * 100)}% Probability
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <Button variant="outline">Share Analysis</Button>
              <Button variant="outline">Export Report</Button>
              <Button>Create Ticket</Button>
            </div>
          </div>
        )}

        {!selectedInvestigation && (
          <Card className="border-border/50 bg-card/50">
            <CardContent className="pt-12 pb-12 text-center">
              <TrendingDown className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No Investigation Selected
              </h3>
              <p className="text-muted-foreground">
                Select an investigation above to view its root cause analysis
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
