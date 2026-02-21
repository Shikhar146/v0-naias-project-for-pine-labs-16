'use client';

import { useState } from 'react';
import { LayoutWrapper } from '@/components/layout-wrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertCircle,
  Check,
  Copy,
  Database,
  Key,
  Settings,
  Users,
  Lock,
} from 'lucide-react';

export default function AdminPage() {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <LayoutWrapper>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Settings & Configuration
          </h1>
          <p className="text-muted-foreground">
            Manage AWS credentials, users, and system configuration
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="aws-credentials" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="aws-credentials">AWS Credentials</TabsTrigger>
            <TabsTrigger value="users">Users & Roles</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          {/* AWS Credentials Tab */}
          <TabsContent value="aws-credentials" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  AWS IAM Configuration
                </CardTitle>
                <CardDescription>
                  Manage AWS credentials and authentication
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-secondary/50 border border-border rounded-lg p-4 space-y-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-foreground">
                      AWS credentials should be stored as environment variables.
                      Never commit credentials to git or share them.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">
                      Required Environment Variables:
                    </label>
                    <div className="space-y-1 text-xs font-mono text-muted-foreground">
                      <div className="flex items-center justify-between bg-background p-2 rounded">
                        <span>AWS_ACCESS_KEY_ID</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard('AWS_ACCESS_KEY_ID')}
                        >
                          {copied ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      <div className="flex items-center justify-between bg-background p-2 rounded">
                        <span>AWS_SECRET_ACCESS_KEY</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard('AWS_SECRET_ACCESS_KEY')
                          }
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between bg-background p-2 rounded">
                        <span>AWS_REGION</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard('AWS_REGION')}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full">
                    Configure AWS Credentials
                  </Button>
                </div>

                {/* Bedrock Configuration */}
                <div className="border-t border-border pt-4">
                  <h3 className="text-sm font-semibold text-foreground mb-3">
                    Bedrock Configuration
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Claude 3.5 Sonnet
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Primary LLM for query generation and RCA
                        </p>
                      </div>
                      <Check className="w-5 h-5 text-green-500" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AWS Services Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  AWS Services
                </CardTitle>
                <CardDescription>
                  Status of connected AWS services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { name: 'Athena', status: 'connected' },
                    { name: 'CloudWatch Logs', status: 'connected' },
                    { name: 'VPC Flow Logs', status: 'connected' },
                    { name: 'Security Hub', status: 'connected' },
                    { name: 'Bedrock', status: 'connected' },
                  ].map((service) => (
                    <div
                      key={service.name}
                      className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg"
                    >
                      <p className="text-sm font-medium text-foreground">
                        {service.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-xs text-muted-foreground">
                          Connected
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  User Management
                </CardTitle>
                <CardDescription>
                  Manage team members and their roles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      email: 'admin@pinelabs.com',
                      role: 'Admin',
                      lastLogin: '2024-02-21 14:32',
                    },
                    {
                      email: 'analyst1@pinelabs.com',
                      role: 'Analyst',
                      lastLogin: '2024-02-21 13:15',
                    },
                    {
                      email: 'viewer@pinelabs.com',
                      role: 'Viewer',
                      lastLogin: '2024-02-20 09:45',
                    },
                  ].map((user) => (
                    <div
                      key={user.email}
                      className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {user.email}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Last login: {user.lastLogin}
                        </p>
                      </div>
                      <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded">
                        {user.role}
                      </span>
                    </div>
                  ))}
                </div>

                <Button className="w-full mt-4">Add New User</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  System Configuration
                </CardTitle>
                <CardDescription>
                  Global system settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-b border-border pb-4">
                  <label className="text-sm font-semibold text-foreground block mb-2">
                    Query Timeout (seconds)
                  </label>
                  <input
                    type="number"
                    defaultValue="300"
                    className="w-full px-3 py-2 bg-secondary/30 border border-border rounded-lg text-foreground"
                  />
                </div>

                <div className="border-b border-border pb-4">
                  <label className="text-sm font-semibold text-foreground block mb-2">
                    Max Concurrent Queries
                  </label>
                  <input
                    type="number"
                    defaultValue="5"
                    className="w-full px-3 py-2 bg-secondary/30 border border-border rounded-lg text-foreground"
                  />
                </div>

                <div className="border-b border-border pb-4">
                  <label className="text-sm font-semibold text-foreground block mb-2">
                    Data Retention (days)
                  </label>
                  <input
                    type="number"
                    defaultValue="90"
                    className="w-full px-3 py-2 bg-secondary/30 border border-border rounded-lg text-foreground"
                  />
                </div>

                <Button>Save Configuration</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </LayoutWrapper>
  );
}
