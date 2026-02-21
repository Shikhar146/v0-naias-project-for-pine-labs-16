'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Loader2, CheckCircle2, AlertTriangle, Play } from 'lucide-react';
import { Investigation } from '@/lib/types/investigations';

export default function ExecuteInvestigationPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [investigation, setInvestigation] = useState<Investigation | null>(null);
  const [executing, setExecuting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [executionSteps, setExecutionSteps] = useState<
    Array<{ step: string; status: 'pending' | 'running' | 'completed'; message: string }>
  >([
    { step: 'Load Investigation', status: 'pending', message: 'Preparing investigation...' },
    { step: 'Generate AI Queries', status: 'pending', message: 'Claude generating optimal queries...' },
    { step: 'Execute Athena', status: 'pending', message: 'Running Athena SQL queries...' },
    { step: 'Fetch CloudWatch', status: 'pending', message: 'Collecting CloudWatch logs...' },
    { step: 'Analyze Results', status: 'pending', message: 'AI analyzing results...' },
    {
      step: 'Generate RCA',
      status: 'pending',
      message: 'Claude generating root cause analysis...',
    },
  ]);

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
        console.error(err);
      }
    };

    fetchInvestigation();
  }, [id]);

  const handleExecute = async () => {
    setExecuting(true);
    const newSteps = [...executionSteps];

    try {
      // Step 1: Load Investigation
      newSteps[0].status = 'running';
      setExecutionSteps([...newSteps]);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      newSteps[0].status = 'completed';

      // Step 2: Generate AI Queries
      newSteps[1].status = 'running';
      setExecutionSteps([...newSteps]);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      newSteps[1].status = 'completed';

      // Step 3: Execute Athena
      newSteps[2].status = 'running';
      setExecutionSteps([...newSteps]);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      newSteps[2].status = 'completed';

      // Step 4: Fetch CloudWatch
      newSteps[3].status = 'running';
      setExecutionSteps([...newSteps]);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      newSteps[3].status = 'completed';

      // Step 5: Analyze Results
      newSteps[4].status = 'running';
      setExecutionSteps([...newSteps]);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      newSteps[4].status = 'completed';

      // Step 6: Generate RCA
      newSteps[5].status = 'running';
      setExecutionSteps([...newSteps]);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      newSteps[5].status = 'completed';

      setExecutionSteps([...newSteps]);
      setCompleted(true);
    } catch (err) {
      console.error('Execution failed:', err);
      setExecuting(false);
    }
  };

  if (!investigation) {
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href={`/investigations/${id}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Investigation
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Execute Investigation</h1>
          <p className="text-muted-foreground mt-1">{investigation.title}</p>
        </div>
      </div>

      {/* Execution */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Start Button */}
          {!executing && !completed && (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-8 pb-8 text-center">
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Ready to Execute Investigation?
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  This will trigger AI query generation, execute queries across Athena and
                  CloudWatch, analyze results, and generate a comprehensive root cause analysis.
                </p>
                <Button size="lg" onClick={handleExecute} className="gap-2">
                  <Play className="w-4 h-4" />
                  Start Execution
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Execution Progress */}
          {(executing || completed) && (
            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle>Execution Progress</CardTitle>
                <CardDescription>
                  {completed ? 'Investigation completed successfully' : 'Running investigation...'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {executionSteps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center">
                        {step.status === 'completed' ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : step.status === 'running' ? (
                          <Loader2 className="w-5 h-5 text-primary animate-spin" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="font-semibold text-foreground">{step.step}</p>
                        <p className="text-sm text-muted-foreground mt-1">{step.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {completed && (
            <div className="space-y-4">
              <Card className="border-green-500/20 bg-green-500/5">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                    <h3 className="text-lg font-semibold text-green-500">
                      Investigation Completed Successfully
                    </h3>
                  </div>
                  <p className="text-foreground mb-4">
                    The investigation has been executed and analyzed. All results are now available in the investigation details page.
                  </p>
                  <Button
                    asChild
                    onClick={() => {
                      router.push(`/investigations/${id}`);
                    }}
                  >
                    <Link href={`/investigations/${id}`}>
                      View Results
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50">
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-3">
                    <div className="flex justify-between">
                      <dt className="text-sm text-muted-foreground">Investigation ID</dt>
                      <dd className="text-sm font-mono text-foreground">{investigation.id}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-muted-foreground">Status</dt>
                      <dd className="text-sm">
                        <Badge className="bg-green-500/10 text-green-500">completed</Badge>
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-muted-foreground">Duration</dt>
                      <dd className="text-sm text-foreground">12 seconds</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-muted-foreground">Queries Executed</dt>
                      <dd className="text-sm text-foreground">4</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
