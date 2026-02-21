'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, Loader2, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { useState } from 'react';

export default function TransactionTracerPage() {
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [transactionData, setTransactionData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Mock transaction trace data
  const mockTransactionTrace = {
    id: 'TXN-2024-02-21-001523',
    status: 'failed',
    amount: 2500.00,
    currency: 'USD',
    merchant: 'Digital Marketplace Inc',
    timestamp: '2024-02-21 14:32:15 UTC',
    duration: '2.3s',
    failureReason: 'Payment processor timeout',
    events: [
      {
        time: '14:32:15.000',
        service: 'API Gateway',
        status: 'success',
        duration: '45ms',
        details: 'Transaction request received and validated',
      },
      {
        time: '14:32:15.200',
        service: 'Fraud Detection Engine',
        status: 'success',
        duration: '120ms',
        details: 'Fraud score: 0.02 (low risk)',
      },
      {
        time: '14:32:15.400',
        service: 'Token Service',
        status: 'success',
        duration: '65ms',
        details: 'Cardholder token generated',
      },
      {
        time: '14:32:15.600',
        service: 'Payment Processor (Stripe)',
        status: 'error',
        duration: '1800ms',
        details: 'Timeout after 1.8s - no response received',
      },
      {
        time: '14:32:17.500',
        service: 'Transaction Rollback',
        status: 'success',
        duration: '150ms',
        details: 'Transaction rolled back, user notified',
      },
    ],
  };

  const handleSearch = async () => {
    if (!transactionId.trim()) {
      setError('Please enter a transaction ID');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setTransactionData(mockTransactionTrace);
    } catch (err) {
      setError('Failed to retrieve transaction');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === 'success') return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    if (status === 'error') return <AlertTriangle className="w-4 h-4 text-destructive" />;
    return <Clock className="w-4 h-4 text-muted-foreground" />;
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
          <h1 className="text-3xl font-bold text-foreground">Transaction Tracer</h1>
          <p className="text-muted-foreground mt-1">
            Track and debug individual payment transactions across all services
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Card */}
        <Card className="border-border/50 bg-card/50 mb-8">
          <CardHeader>
            <CardTitle>Search Transaction</CardTitle>
            <CardDescription>
              Enter a transaction ID, order ID, or customer email to trace the transaction flow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., TXN-2024-02-21-001523"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 bg-background border-border/50"
              />
              <Button
                onClick={handleSearch}
                disabled={loading}
                size="lg"
                className="gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Search
                  </>
                )}
              </Button>
            </div>
            {error && (
              <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Transaction Details */}
        {transactionData && (
          <div className="space-y-6">
            {/* Summary Card */}
            <Card className={`border-border/50 ${
              transactionData.status === 'failed'
                ? 'bg-destructive/5 border-destructive/20'
                : 'bg-green-500/5 border-green-500/20'
            }`}>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Transaction ID</p>
                    <p className="text-sm font-mono text-foreground mt-1">
                      {transactionData.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Amount</p>
                    <p className="text-lg font-bold text-foreground mt-1">
                      ${transactionData.amount.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Status</p>
                    <Badge
                      className={`mt-1 ${
                        transactionData.status === 'failed'
                          ? 'bg-destructive/10 text-destructive'
                          : 'bg-green-500/10 text-green-500'
                      }`}
                      variant="secondary"
                    >
                      {transactionData.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Duration</p>
                    <p className="text-sm font-mono text-foreground mt-1">
                      {transactionData.duration}
                    </p>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-border/50">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold">Merchant:</span>{' '}
                    {transactionData.merchant}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    <span className="font-semibold">Timestamp:</span>{' '}
                    {transactionData.timestamp}
                  </p>
                  {transactionData.failureReason && (
                    <p className="text-sm text-destructive mt-2">
                      <span className="font-semibold">Failure Reason:</span>{' '}
                      {transactionData.failureReason}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Event Timeline */}
            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle>Transaction Flow</CardTitle>
                <CardDescription>
                  Step-by-step execution trace through all payment services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactionData.events.map((event: any, idx: number) => (
                    <div key={idx} className="relative">
                      {/* Timeline line */}
                      {idx < transactionData.events.length - 1 && (
                        <div className="absolute left-4 top-8 w-0.5 h-12 bg-border/50" />
                      )}

                      {/* Timeline item */}
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 mt-1">
                          {getStatusIcon(event.status)}
                        </div>
                        <div className="flex-1 p-4 bg-background/50 rounded-lg border border-border/50 hover:border-primary/30 transition">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-foreground">
                              {event.service}
                            </h4>
                            <span className="text-xs font-mono text-muted-foreground">
                              {event.time}
                            </span>
                          </div>
                          <p className="text-sm text-foreground mb-3">
                            {event.details}
                          </p>
                          <div className="flex gap-3 text-xs text-muted-foreground">
                            <span>Duration: {event.duration}</span>
                            <Badge
                              variant="outline"
                              className={
                                event.status === 'success'
                                  ? 'text-green-500'
                                  : 'text-destructive'
                              }
                            >
                              {event.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            {transactionData.status === 'failed' && (
              <Card className="border-yellow-500/20 bg-yellow-500/5">
                <CardHeader>
                  <CardTitle className="text-yellow-500">Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex gap-2">
                      <span className="text-yellow-500">•</span>
                      <span className="text-foreground">
                        Increase timeout threshold for payment processor integration from 1.8s to 3s
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-yellow-500">•</span>
                      <span className="text-foreground">
                        Implement retry logic with exponential backoff for failed processor requests
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-yellow-500">•</span>
                      <span className="text-foreground">
                        Check payment processor status page and contact support if issues persist
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <Button variant="outline">Export Trace</Button>
              <Button variant="outline">View Network Logs</Button>
              <Button>Create Investigation</Button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!transactionData && !loading && (
          <Card className="border-border/50 bg-card/50">
            <CardContent className="pt-12 pb-12 text-center">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No Transaction Selected
              </h3>
              <p className="text-muted-foreground">
                Enter a transaction ID above to view the complete transaction trace
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
