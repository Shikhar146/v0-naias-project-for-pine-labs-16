import { NextRequest, NextResponse } from 'next/server';

// Mock investigations data
const investigations = [
  {
    id: '1',
    title: 'Payment Processing API Timeout',
    description: 'Orders failing to process between 14:30 and 14:45 UTC',
    type: 'incident',
    status: 'completed',
    severity: 'critical',
    createdAt: new Date('2024-02-21T14:30:00Z'),
    timeWindowStart: new Date('2024-02-21T14:30:00Z'),
    timeWindowEnd: new Date('2024-02-21T14:45:00Z'),
    resourceFilters: {
      service: ['payment-api'],
      region: ['us-east-1'],
    },
    aiInsights: {
      rootCause: 'Database connection pool exhaustion',
      confidence: 0.87,
      evidence: ['Connection timeout logs', 'VPC Flow anomalies'],
    },
  },
  {
    id: '2',
    title: 'Network Latency Spike',
    description: 'Elevated latency detected on production networks',
    type: 'performance',
    status: 'running',
    severity: 'high',
    createdAt: new Date('2024-02-20T10:15:00Z'),
    timeWindowStart: new Date('2024-02-20T10:00:00Z'),
    timeWindowEnd: new Date('2024-02-20T11:00:00Z'),
    resourceFilters: {},
  },
  {
    id: '3',
    title: 'Security Audit - Unencrypted Credentials',
    description: 'PCI-DSS compliance check for credential storage',
    type: 'audit',
    status: 'draft',
    severity: 'critical',
    createdAt: new Date('2024-02-19T09:00:00Z'),
    timeWindowStart: new Date('2024-02-19T00:00:00Z'),
    timeWindowEnd: new Date('2024-02-19T23:59:59Z'),
    resourceFilters: {},
  },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const severity = searchParams.get('severity');

    let filtered = investigations;

    if (status) {
      filtered = filtered.filter((inv) => inv.status === status);
    }

    if (severity) {
      filtered = filtered.filter((inv) => inv.severity === severity);
    }

    return NextResponse.json(filtered);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch investigations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const investigation = {
      id: String(investigations.length + 1),
      title: body.title,
      description: body.description,
      type: body.type || 'incident',
      status: 'draft',
      severity: body.severity || 'medium',
      createdAt: new Date(),
      timeWindowStart: body.timeWindowStart,
      timeWindowEnd: body.timeWindowEnd,
      resourceFilters: body.resourceFilters || {},
    };

    investigations.push(investigation);

    return NextResponse.json(investigation, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create investigation' },
      { status: 400 }
    );
  }
}
