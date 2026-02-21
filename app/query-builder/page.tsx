'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Play, Loader2, Copy, Check } from 'lucide-react';

export default function QueryBuilderPage() {
  const [queryType, setQueryType] = useState('athena');
  const [queryText, setQueryText] = useState('');
  const [executing, setExecuting] = useState(false);
  const [results, setResults] = useState<Record<string, unknown>[] | null>(null);
  const [executionStats, setExecutionStats] = useState<{
    executionTimeMs?: number;
    dataScannedBytes?: number;
    estimatedCost?: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const queryTemplates = {
    athena: {
      vpcFlows: `SELECT 
  srcaddr, 
  dstaddr, 
  srcport, 
  dstport, 
  protocol,
  action,
  COUNT(*) as packet_count,
  SUM(bytes) as total_bytes
FROM vpc_flows
WHERE date >= '2024-02-21' 
  AND timestamp >= 1708521600
GROUP BY srcaddr, dstaddr, srcport, dstport, protocol, action
ORDER BY total_bytes DESC
LIMIT 100;`,
      errors: `SELECT 
  timestamp,
  message,
  log_stream,
  error_code
FROM logs_table
WHERE timestamp >= 1708521600 
  AND message LIKE '%error%'
ORDER BY timestamp DESC
LIMIT 500;`,
      requests: `SELECT 
  timestamp,
  request_path,
  http_status,
  response_time_ms,
  user_id
FROM request_logs
WHERE timestamp >= 1708521600
GROUP BY request_path, http_status
ORDER BY COUNT(*) DESC;`,
    },
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const executeQuery = async () => {
    if (!queryText.trim()) {
      setError('Please enter a query');
      return;
    }

    setExecuting(true);
    setError(null);
    setResults(null);

    try {
      // Simulate query execution with mock data
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockResults: Record<string, unknown>[] = [
        {
          srcaddr: '10.0.1.45',
          dstaddr: '10.0.2.78',
          srcport: 54321,
          dstport: 443,
          protocol: 6,
          action: 'ACCEPT',
          packet_count: 2847,
          total_bytes: 1234567,
        },
        {
          srcaddr: '10.0.1.67',
          dstaddr: '172.31.0.50',
          srcport: 39282,
          dstport: 5432,
          protocol: 6,
          action: 'REJECT',
          packet_count: 432,
          total_bytes: 45678,
        },
        {
          srcaddr: '192.168.1.100',
          dstaddr: '10.0.3.20',
          srcport: 61234,
          dstport: 8080,
          protocol: 6,
          action: 'ACCEPT',
          packet_count: 5621,
          total_bytes: 2345678,
        },
      ];

      setResults(mockResults);
      setExecutionStats({
        executionTimeMs: 2156,
        dataScannedBytes: 1024 * 1024 * 512, // 512 MB
        estimatedCost: 0.00325, // ~$0.00325
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Query execution failed');
    } finally {
      setExecuting(false);
    }
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
          <h1 className="text-3xl font-bold text-foreground">Query Builder</h1>
          <p className="text-muted-foreground mt-1">
            Build and execute custom Athena and CloudWatch queries
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Templates */}
          <div className="lg:col-span-1">
            <Card className="border-border/50 bg-card/50 sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">Query Templates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(queryTemplates.athena).map(
                  ([name, template]) => (
                    <Button
                      key={name}
                      variant="outline"
                      className="w-full justify-start text-left h-auto"
                      onClick={() => setQueryText(template)}
                    >
                      <span className="truncate capitalize">{name}</span>
                    </Button>
                  )
                )}
              </CardContent>
            </Card>
          </div>

          {/* Query Editor and Results */}
          <div className="lg:col-span-3 space-y-6">
            {/* Query Editor */}
            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Query Editor</CardTitle>
                    <CardDescription>Write your SQL query below</CardDescription>
                  </div>
                  <Select value={queryType} onValueChange={setQueryType}>
                    <SelectTrigger className="w-40 bg-background border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="athena">Athena (SQL)</SelectItem>
                      <SelectItem value="cloudwatch">CloudWatch Insights</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Textarea
                    placeholder="Enter your SQL query here..."
                    value={queryText}
                    onChange={(e) => setQueryText(e.target.value)}
                    className="font-mono text-sm bg-background border-border/50 min-h-64"
                  />
                  <div className="absolute top-2 right-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(queryText)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {copied ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={executeQuery}
                    disabled={executing}
                    size="lg"
                    className="gap-2"
                  >
                    {executing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Executing...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Execute Query
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="lg">
                    Clear
                  </Button>
                </div>

                {error && (
                  <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Execution Stats */}
            {executionStats && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    label: 'Execution Time',
                    value: `${executionStats.executionTimeMs} ms`,
                  },
                  {
                    label: 'Data Scanned',
                    value: `${(
                      (executionStats.dataScannedBytes || 0) / 1024 / 1024
                    ).toFixed(2)} MB`,
                  },
                  {
                    label: 'Estimated Cost',
                    value: `$${(executionStats.estimatedCost || 0).toFixed(5)}`,
                  },
                ].map((stat, idx) => (
                  <Card key={idx} className="border-border/50 bg-card/50">
                    <CardContent className="pt-4">
                      <p className="text-xs text-muted-foreground uppercase">
                        {stat.label}
                      </p>
                      <p className="text-lg font-semibold text-foreground mt-1">
                        {stat.value}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Results */}
            {results && (
              <Card className="border-border/50 bg-card/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Results</CardTitle>
                    <Badge variant="outline">
                      {results.length} rows returned
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border/50">
                          {Object.keys(results[0] || {}).map((key) => (
                            <th
                              key={key}
                              className="px-4 py-2 text-left text-muted-foreground font-medium"
                            >
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {results.map((row, idx) => (
                          <tr
                            key={idx}
                            className="border-b border-border/50 hover:bg-primary/5"
                          >
                            {Object.values(row).map((val, colIdx) => (
                              <td
                                key={colIdx}
                                className="px-4 py-2 text-foreground"
                              >
                                {typeof val === 'object'
                                  ? JSON.stringify(val)
                                  : String(val)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
