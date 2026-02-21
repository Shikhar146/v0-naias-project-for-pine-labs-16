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
import { ArrowLeft, Network, Zap, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function NetworkTopologyPage() {
  const [timeRange, setTimeRange] = useState('1h');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Mock network data
  const networkNodes = [
    { id: 'lb-01', label: 'Load Balancer', type: 'elb', region: 'us-east-1' },
    { id: 'app-01', label: 'App Server 1', type: 'ec2', region: 'us-east-1a' },
    { id: 'app-02', label: 'App Server 2', type: 'ec2', region: 'us-east-1b' },
    { id: 'db-primary', label: 'Primary DB', type: 'rds', region: 'us-east-1a' },
    { id: 'db-replica', label: 'Replica DB', type: 'rds', region: 'us-east-1b' },
    { id: 'cache-01', label: 'ElastiCache', type: 'cache', region: 'us-east-1' },
  ];

  const networkConnections = [
    {
      source: 'lb-01',
      target: 'app-01',
      trafficMbps: 124,
      status: 'healthy',
    },
    {
      source: 'lb-01',
      target: 'app-02',
      trafficMbps: 98,
      status: 'healthy',
    },
    {
      source: 'app-01',
      target: 'db-primary',
      trafficMbps: 87,
      status: 'healthy',
    },
    {
      source: 'app-02',
      target: 'db-primary',
      trafficMbps: 64,
      status: 'healthy',
    },
    {
      source: 'db-primary',
      target: 'db-replica',
      trafficMbps: 156,
      status: 'warning',
    },
    {
      source: 'app-01',
      target: 'cache-01',
      trafficMbps: 45,
      status: 'healthy',
    },
    {
      source: 'app-02',
      target: 'cache-01',
      trafficMbps: 38,
      status: 'healthy',
    },
  ];

  // Mock traffic data
  const trafficData = [
    {
      time: '14:00',
      inbound: 420,
      outbound: 380,
      anomaly: false,
    },
    {
      time: '14:10',
      inbound: 460,
      outbound: 410,
      anomaly: false,
    },
    {
      time: '14:20',
      inbound: 380,
      outbound: 340,
      anomaly: false,
    },
    {
      time: '14:30',
      inbound: 950,
      outbound: 920,
      anomaly: true,
    },
    {
      time: '14:40',
      inbound: 1200,
      outbound: 1150,
      anomaly: true,
    },
    {
      time: '14:50',
      inbound: 680,
      outbound: 620,
      anomaly: false,
    },
  ];

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
          <h1 className="text-3xl font-bold text-foreground">Network Topology</h1>
          <p className="text-muted-foreground mt-1">
            Real-time network visualization and traffic analysis
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Time Range Selector */}
          <div className="flex gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40 bg-card/50 border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15m">Last 15 Minutes</SelectItem>
                <SelectItem value="1h">Last Hour</SelectItem>
                <SelectItem value="6h">Last 6 Hours</SelectItem>
                <SelectItem value="24h">Last 24 Hours</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Network Diagram */}
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="w-5 h-5 text-primary" />
                Network Architecture
              </CardTitle>
              <CardDescription>
                Interactive topology showing all network nodes and connections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-background rounded-lg p-8 min-h-96 flex items-center justify-center">
                {/* Simplified ASCII-based topology visualization */}
                <div className="w-full max-w-2xl">
                  <div className="flex justify-center mb-8">
                    <div className="px-4 py-2 bg-primary/10 border border-primary rounded-lg">
                      <div className="text-sm font-semibold text-primary">Load Balancer</div>
                    </div>
                  </div>

                  <div className="flex justify-around mb-8">
                    {['App Server 1', 'App Server 2'].map((label) => (
                      <div
                        key={label}
                        className="px-4 py-2 bg-blue-500/10 border border-blue-500 rounded-lg cursor-pointer hover:bg-blue-500/20 transition"
                        onClick={() => setSelectedNode(label)}
                      >
                        <div className="text-sm font-semibold text-blue-500">{label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-around">
                    <div className="px-4 py-2 bg-green-500/10 border border-green-500 rounded-lg">
                      <div className="text-sm font-semibold text-green-500">Primary DB</div>
                    </div>
                    <div className="px-4 py-2 bg-green-500/10 border border-green-500 rounded-lg">
                      <div className="text-sm font-semibold text-green-500">Replica DB</div>
                    </div>
                    <div className="px-4 py-2 bg-purple-500/10 border border-purple-500 rounded-lg">
                      <div className="text-sm font-semibold text-purple-500">ElastiCache</div>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground text-center mt-8">
                    Click on nodes to view detailed traffic and connection information
                  </p>
                </div>
              </div>

              {/* Node Details */}
              {selectedNode && (
                <div className="mt-6 pt-6 border-t border-border/50">
                  <h3 className="font-semibold text-foreground mb-4">{selectedNode}</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Status</p>
                      <p className="text-green-500 font-semibold">Healthy</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Region</p>
                      <p className="text-foreground font-semibold">us-east-1a</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Incoming Traffic</p>
                      <p className="text-foreground font-semibold">245 Mbps</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Outgoing Traffic</p>
                      <p className="text-foreground font-semibold">198 Mbps</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Traffic Analysis */}
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Network Traffic
              </CardTitle>
              <CardDescription>
                Inbound and outbound traffic over time with anomaly detection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trafficData}>
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
                  <Line
                    type="monotone"
                    dataKey="inbound"
                    stroke="var(--color-primary)"
                    dot={{ fill: 'var(--color-primary)' }}
                    name="Inbound (Mbps)"
                  />
                  <Line
                    type="monotone"
                    dataKey="outbound"
                    stroke="var(--color-accent)"
                    dot={{ fill: 'var(--color-accent)' }}
                    name="Outbound (Mbps)"
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-6 pt-6 border-t border-border/50">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-semibold text-foreground">
                    Anomalies Detected
                  </span>
                </div>
                <div className="space-y-2">
                  {trafficData
                    .filter((d) => d.anomaly)
                    .map((d, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between p-3 bg-background rounded-lg border border-yellow-500/20"
                      >
                        <span className="text-sm text-foreground">
                          {d.time} - Traffic spike detected
                        </span>
                        <Badge variant="outline" className="text-yellow-500">
                          +{Math.round((d.inbound / 450 - 1) * 100)}%
                        </Badge>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Connections Table */}
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle>Active Connections</CardTitle>
              <CardDescription>
                All active network connections and traffic flows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="px-4 py-2 text-left text-muted-foreground font-medium">
                        Source
                      </th>
                      <th className="px-4 py-2 text-left text-muted-foreground font-medium">
                        Destination
                      </th>
                      <th className="px-4 py-2 text-left text-muted-foreground font-medium">
                        Traffic
                      </th>
                      <th className="px-4 py-2 text-left text-muted-foreground font-medium">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {networkConnections.map((conn, idx) => (
                      <tr key={idx} className="border-b border-border/50 hover:bg-primary/5">
                        <td className="px-4 py-2 text-foreground">
                          {networkNodes.find((n) => n.id === conn.source)?.label}
                        </td>
                        <td className="px-4 py-2 text-foreground">
                          {networkNodes.find((n) => n.id === conn.target)?.label}
                        </td>
                        <td className="px-4 py-2 text-foreground">
                          {conn.trafficMbps} Mbps
                        </td>
                        <td className="px-4 py-2">
                          <Badge
                            variant="outline"
                            className={
                              conn.status === 'healthy'
                                ? 'text-green-500'
                                : 'text-yellow-500'
                            }
                          >
                            {conn.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
