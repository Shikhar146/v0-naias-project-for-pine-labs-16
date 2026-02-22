import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db/client';
import { COLLECTIONS } from '@/lib/db/models';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDb();
    const orgId = request.headers.get('x-organization-id') || 'demo-org';

    // Find investigation in MongoDB
    const investigation = await db
      .collection(COLLECTIONS.INVESTIGATIONS)
      .findOne({
        id: id,
        organizationId: orgId,
        deletedAt: { $exists: false }, // Exclude soft-deleted investigations
      });

    if (!investigation) {
      return NextResponse.json(
        { error: 'Investigation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(investigation);
  } catch (error) {
    console.error('Error fetching investigation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch investigation' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDb();
    const orgId = request.headers.get('x-organization-id') || 'demo-org';
    const body = await request.json();

    const result = await db
      .collection(COLLECTIONS.INVESTIGATIONS)
      .updateOne(
        {
          id: id,
          organizationId: orgId,
          deletedAt: { $exists: false },
        },
        {
          $set: {
            ...body,
            updatedAt: new Date(),
          },
        }
      );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Investigation not found' },
        { status: 404 }
      );
    }

    // Fetch updated investigation
    const updatedInvestigation = await db
      .collection(COLLECTIONS.INVESTIGATIONS)
      .findOne({ id: id, organizationId: orgId });

    return NextResponse.json(updatedInvestigation);
  } catch (error) {
    console.error('Error updating investigation:', error);
    return NextResponse.json(
      { error: 'Failed to update investigation' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDb();
    const orgId = request.headers.get('x-organization-id') || 'demo-org';

    // Soft delete by marking with deletedAt timestamp
    const result = await db
      .collection(COLLECTIONS.INVESTIGATIONS)
      .updateOne(
        {
          id: id,
          organizationId: orgId,
          deletedAt: { $exists: false },
        },
        {
          $set: {
            deletedAt: new Date(),
            updatedAt: new Date(),
          },
        }
      );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Investigation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        id,
        message: 'Investigation deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting investigation:', error);
    return NextResponse.json(
      { error: 'Failed to delete investigation' },
      { status: 500 }
    );
  }
}
