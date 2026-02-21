import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/client';
import { queries } from '@/lib/db/schema';
import { athenaClient } from '@/lib/services/athena-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      investigationId,
      queryText,
      database = 'default',
      outputLocation,
      generatedByAi = false,
    } = body as {
      investigationId: string;
      queryText: string;
      database?: string;
      outputLocation: string;
      generatedByAi?: boolean;
    };

    if (!investigationId || !queryText || !outputLocation) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Execute Athena query
    const queryExecutionId = await athenaClient.executeQuery({
      queryString: queryText,
      database,
      outputLocation,
    });

    // Store in database
    const [storedQuery] = await db
      .insert(queries)
      .values({
        investigationId,
        queryType: 'athena',
        queryText,
        generatedByAi,
        executionStatus: 'running',
      })
      .returning();

    return NextResponse.json({
      queryId: storedQuery.id,
      executionId: queryExecutionId,
      status: 'running',
    });
  } catch (error) {
    console.error('Error executing Athena query:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to execute query',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const executionId = searchParams.get('executionId');
    const queryId = searchParams.get('queryId');

    if (!executionId || !queryId) {
      return NextResponse.json(
        { error: 'Missing executionId or queryId' },
        { status: 400 }
      );
    }

    // Get query status
    const status = await athenaClient.getQueryStatus(executionId);

    if (status === 'SUCCEEDED') {
      // Get results
      const results = await athenaClient.getQueryResults(executionId);

      if (results) {
        // Update database
        await db
          .update(queries)
          .set({
            executionStatus: 'succeeded',
            executionTimeMs: results.executionTimeMs,
            rowCount: results.rows.length,
            costUsd: athenaClient.estimateCost(results.dataScannedBytes),
            resultSummary: {
              dataScannedBytes: results.dataScannedBytes,
              rowCount: results.rows.length,
            },
          })
          .where(queries.id === queryId);

        return NextResponse.json({
          status: 'succeeded',
          results: results.rows,
          stats: {
            executionTimeMs: results.executionTimeMs,
            dataScannedBytes: results.dataScannedBytes,
            rowCount: results.rows.length,
            estimatedCost: athenaClient.estimateCost(
              results.dataScannedBytes
            ),
          },
        });
      }
    } else if (
      status === 'FAILED' ||
      status === 'CANCELLED'
    ) {
      // Update database
      await db
        .update(queries)
        .set({
          executionStatus: status.toLowerCase(),
        })
        .where(queries.id === queryId);

      return NextResponse.json({
        status: status.toLowerCase(),
        error: `Query ${status.toLowerCase()}`,
      });
    }

    // Still running or queued
    return NextResponse.json({
      status: status.toLowerCase(),
    });
  } catch (error) {
    console.error('Error getting query status:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to get query status',
      },
      { status: 500 }
    );
  }
}
