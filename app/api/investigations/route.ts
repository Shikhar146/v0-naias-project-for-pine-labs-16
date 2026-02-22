import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db/client';
import { COLLECTIONS } from '@/lib/db/models';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  try {
    const db = await getDb();
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const severity = searchParams.get('severity');
    const orgId = request.headers.get('x-organization-id') || 'demo-org';

    // Build query
    const query: any = {
      organizationId: orgId,
      deletedAt: { $exists: false }, // Exclude soft-deleted investigations
    };

    if (status) {
      query.status = status;
    }

    if (severity) {
      query.severity = severity;
    }

    // Fetch from MongoDB
    const investigations = await db
      .collection(COLLECTIONS.INVESTIGATIONS)
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(investigations);
  } catch (error) {
    console.error('Error fetching investigations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch investigations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await getDb();
    const body = await request.json();
    const orgId = request.headers.get('x-organization-id') || 'demo-org';

    const investigationId = uuidv4();

    const investigation = {
      id: investigationId,
      organizationId: orgId,
      title: body.title,
      description: body.description,
      type: body.type || 'incident',
      status: 'draft',
      severity: body.severity || 'medium',
      timeWindowStart: new Date(body.timeWindowStart),
      timeWindowEnd: new Date(body.timeWindowEnd),
      resourceFilters: body.resourceFilters || {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db
      .collection(COLLECTIONS.INVESTIGATIONS)
      .insertOne(investigation as any);

    return NextResponse.json(investigation, { status: 201 });
  } catch (error) {
    console.error('Error creating investigation:', error);
    return NextResponse.json(
      { error: 'Failed to create investigation' },
      { status: 400 }
    );
  }
}
