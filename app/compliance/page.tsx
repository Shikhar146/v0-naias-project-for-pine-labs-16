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
import { ArrowLeft, Shield, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function CompliancePage() {
  const [selectedFramework, setSelectedFramework] = useState('pci-dss');

  const complianceData = [
    { framework: 'PCI-DSS', passed: 42, failed: 3, warnings: 5 },
    { framework: 'SOC 2', passed: 38, failed: 1, warnings: 4 },
    { framework: 'GDPR', passed: 35, failed: 2, warnings: 6 },
  ];

  const findings = {
    'pci-dss': [
      {
        id: 'PCI-001',
        title: 'Unencrypted Cardholder Data',
        severity: 'critical',
        status: 'open',
        affectedSystems: 3,
        deadline: '2024-02-28',
      },
      {
        id: 'PCI-002',
        title: 'Weak Password Policy',
        severity: 'high',
        status: 'in-progress',
        affectedSystems: 8,
        deadline: '2024-03-15',
      },
      {
        id: 'PCI-003',
        title: 'Missing Security Patches',
        severity: 'high',
        status: 'open',
        affectedSystems: 5,
        deadline: '2024-03-10',
      },
      {
        id: 'PCI-004',
        title: 'Inadequate Access Controls',
        severity: 'medium',
        status: 'open',
        affectedSystems: 2,
        deadline: '2024-03-30',
      },
    ],
  };

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
      open: 'bg-red-500/10 text-red-500',
      'in-progress': 'bg-yellow-500/10 text-yellow-500',
      resolved: 'bg-green-500/10 text-green-500',
    };
    return colors[status] || colors.open;
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
          <h1 className="text-3xl font-bold text-foreground">Compliance & Audit</h1>
          <p className="text-muted-foreground mt-1">
            Security posture and compliance framework tracking
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Compliance Score Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                framework: 'PCI-DSS',
                score: 93,
                status: 'compliant',
                icon: CheckCircle2,
              },
              {
                framework: 'SOC 2',
                score: 97,
                status: 'compliant',
                icon: CheckCircle2,
              },
              {
                framework: 'GDPR',
                score: 85,
                status: 'review-needed',
                icon: AlertTriangle,
              },
            ].map((item, idx) => (
              <Card
                key={idx}
                className="border-border/50 bg-card/50 cursor-pointer hover:bg-card/80 transition"
                onClick={() => setSelectedFramework(item.framework.toLowerCase())}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground uppercase">
                        {item.framework}
                      </p>
                      <p className="text-3xl font-bold text-primary mt-1">
                        {item.score}%
                      </p>
                    </div>
                    <item.icon className="w-6 h-6 text-green-500 flex-shrink-0" />
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      item.status === 'compliant'
                        ? 'text-green-500'
                        : 'text-yellow-500'
                    }
                  >
                    {item.status === 'compliant' ? 'Compliant' : 'Review Needed'}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Compliance Status Chart */}
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle>Compliance Status by Framework</CardTitle>
              <CardDescription>
                Overview of passed, failed, and warning findings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={complianceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis stroke="var(--color-muted-foreground)" />
                  <YAxis stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-card)',
                      border: '1px solid var(--color-border)',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="passed" fill="var(--color-chart-2)" name="Passed" />
                  <Bar dataKey="failed" fill="var(--color-destructive)" name="Failed" />
                  <Bar dataKey="warnings" fill="var(--color-chart-4)" name="Warnings" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Findings Details */}
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Security Findings</CardTitle>
                  <CardDescription>
                    Active compliance issues and remediation status
                  </CardDescription>
                </div>
                <Select value={selectedFramework} onValueChange={setSelectedFramework}>
                  <SelectTrigger className="w-40 bg-background border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pci-dss">PCI-DSS</SelectItem>
                    <SelectItem value="soc2">SOC 2</SelectItem>
                    <SelectItem value="gdpr">GDPR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {findings['pci-dss' as keyof typeof findings].map((finding) => (
                  <div
                    key={finding.id}
                    className="flex flex-col gap-3 p-4 bg-background/50 rounded-lg border border-border/50 hover:border-primary/30 transition"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono text-muted-foreground">
                            {finding.id}
                          </span>
                          <Badge className={getSeverityColor(finding.severity)}>
                            {finding.severity}
                          </Badge>
                          <Badge className={getStatusColor(finding.status)}>
                            {finding.status}
                          </Badge>
                        </div>
                        <h4 className="font-semibold text-foreground">
                          {finding.title}
                        </h4>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>
                        Affected Systems: {finding.affectedSystems}
                      </span>
                      <span>Deadline: {finding.deadline}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Remediation Timeline */}
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Remediation Progress
              </CardTitle>
              <CardDescription>
                Timeline of compliance remediation activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    date: '2024-02-25',
                    activity: 'PCI-001 Remediation Started',
                    status: 'in-progress',
                  },
                  {
                    date: '2024-02-20',
                    activity: 'Security Audit Completed',
                    status: 'completed',
                  },
                  {
                    date: '2024-02-15',
                    activity: 'Compliance Gap Assessment',
                    status: 'completed',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 pb-4 border-b border-border/50 last:border-b-0">
                    <div className="flex-shrink-0 w-3 h-3 rounded-full bg-primary mt-2" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">
                        {item.activity}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.date}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        item.status === 'completed'
                          ? 'text-green-500'
                          : 'text-yellow-500'
                      }
                    >
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button variant="outline">Generate Report</Button>
            <Button>Create Audit Task</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
