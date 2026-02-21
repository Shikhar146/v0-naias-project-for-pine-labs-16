import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Mock RCA results - in production, fetch from database
    const rcaResults = {
      id: `rca-${id}`,
      investigationId: id,
      rootCauseDescription:
        'Network latency spike caused by AWS NAT Gateway throttling due to unexpected traffic surge at 14:32 UTC. Source: Payment processor connection pool exhaustion leading to connection retry storms.',
      confidenceScore: 0.92,
      evidenceLinks: [
        {
          eventId: 'evt-001',
          timestamp: '2024-02-21T14:32:15Z',
          type: 'vpc_flow_log',
          description: 'Connection refused to NAT Gateway',
          severity: 'critical',
        },
        {
          eventId: 'evt-002',
          timestamp: '2024-02-21T14:31:45Z',
          type: 'cloudwatch_metric',
          description: 'Outbound NAT Gateway connections spike (2M → 10M in 30s)',
          severity: 'high',
        },
        {
          eventId: 'evt-003',
          timestamp: '2024-02-21T14:30:20Z',
          type: 'security_finding',
          description: 'Third-party payment API endpoint degradation detected',
          severity: 'medium',
        },
      ],
      remediationSteps: [
        {
          priority: 'immediate',
          step: 'Scale NAT Gateway to multiple availability zones',
          estimatedTime: '5-10 minutes',
          riskLevel: 'low',
        },
        {
          priority: 'immediate',
          step: 'Implement connection pooling in payment processor client',
          estimatedTime: '30 minutes',
          riskLevel: 'medium',
        },
        {
          priority: 'short-term',
          step: 'Add pre-connection warming to payment service',
          estimatedTime: '2-4 hours',
          riskLevel: 'low',
        },
        {
          priority: 'preventive',
          step: 'Set CloudWatch alarms for NAT Gateway connection limits',
          estimatedTime: '30 minutes',
          riskLevel: 'low',
        },
      ],
      alternativeRootCauses: [
        {
          description: 'Third-party payment API rate limiting',
          confidence: 0.15,
        },
        {
          description: 'Database connection pool exhaustion',
          confidence: 0.08,
        },
      ],
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(rcaResults);
  } catch (error) {
    console.error('[v0] RCA fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch RCA results' },
      { status: 500 }
    );
  }
}
