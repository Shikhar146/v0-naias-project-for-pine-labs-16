import { NextRequest, NextResponse } from 'next/server';
import { generateQueriesFromInvestigation } from '@/lib/services/query-generator';
import { Investigation } from '@/lib/types/investigations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { investigation, userContext, dataSourcePreferences } = body as {
      investigation: Investigation;
      userContext: string;
      dataSourcePreferences: string[];
    };

    if (!investigation || !investigation.title) {
      return NextResponse.json(
        { error: 'Investigation data required' },
        { status: 400 }
      );
    }

    const queries = await generateQueriesFromInvestigation({
      investigation,
      userContext,
      dataSourcePreferences: dataSourcePreferences || [
        'athena',
        'cloudwatch',
      ],
    });

    return NextResponse.json(queries);
  } catch (error) {
    console.error('Error generating query:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to generate query',
      },
      { status: 500 }
    );
  }
}
