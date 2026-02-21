import { NextRequest, NextResponse } from 'next/server';

// Mock investigation details
const mockInvestigation = {
  id: '1',
  title: 'Payment Processing API Timeout',
  description: 'Orders failing to process between 14:30 and 14:45 UTC. 2500+ transactions affected.',
  type: 'incident',
  status: 'completed',
  severity: 'critical',
  createdAt: '2024-02-21T14:30:00Z',
  timeWindowStart: '2024-02-21T14:30:00Z',
  timeWindowEnd: '2024-02-21T14:45:00Z',
  resourceFilters: {
    service: ['payment-api', 'payment-processor'],
    region: ['us-east-1a', 'us-east-1b'],
  },
  aiInsights: {
    rootCause: 'Database connection pool exhaustion in payment processor service. Service failed to properly return connections after processing.',
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
    ],
    remediationSteps: [
      {
        step: 1,
        action: 'Increase database connection pool size from 100 to 200',
        priority: 'immediate',
      },
      {
        step: 2,
        action: 'Implement connection pool health check every 30 seconds',
        priority: 'high',
      },
    ],
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // In a real app, query the database
    if (id === '1') {
      return NextResponse.json(mockInvestigation);
    }

    // Return mock data for demo
    return NextResponse.json({
      ...mockInvestigation,
      id,
      title: `Investigation ${id}`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch investigation' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // In a real app, update in database
    const updated = { ...mockInvestigation, ...body, id: params.id };

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update investigation' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // In a real app, archive in database
    return NextResponse.json({ id: params.id, archived: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete investigation' },
      { status: 500 }
    );
  }
}
