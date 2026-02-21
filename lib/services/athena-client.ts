import {
  AthenaClient,
  StartQueryExecutionCommand,
  GetQueryExecutionCommand,
  GetQueryResultsCommand,
  StopQueryExecutionCommand,
} from '@aws-sdk/client-athena';

interface QueryExecutionParams {
  queryString: string;
  database: string;
  outputLocation: string;
}

interface QueryResults {
  queryId: string;
  status: string;
  dataScannedBytes: number;
  executionTimeMs: number;
  rows: Record<string, unknown>[];
}

export class AthenaClientService {
  private client: AthenaClient;

  constructor(region: string = process.env.AWS_REGION || 'us-east-1') {
    this.client = new AthenaClient({ region });
  }

  async executeQuery(params: QueryExecutionParams): Promise<string> {
    try {
      const command = new StartQueryExecutionCommand({
        QueryString: params.queryString,
        QueryExecutionContext: {
          Database: params.database,
        },
        ResultConfiguration: {
          OutputLocation: params.outputLocation,
        },
      });

      const response = await this.client.send(command);
      return response.QueryExecutionId!;
    } catch (error) {
      console.error('Error executing Athena query:', error);
      throw new Error('Failed to execute Athena query');
    }
  }

  async getQueryStatus(queryExecutionId: string): Promise<string> {
    try {
      const command = new GetQueryExecutionCommand({
        QueryExecutionId: queryExecutionId,
      });

      const response = await this.client.send(command);
      return response.QueryExecution?.Status?.State || 'UNKNOWN';
    } catch (error) {
      console.error('Error getting query status:', error);
      throw new Error('Failed to get query status');
    }
  }

  async getQueryResults(
    queryExecutionId: string
  ): Promise<QueryResults | null> {
    try {
      // First get execution details
      const execCommand = new GetQueryExecutionCommand({
        QueryExecutionId: queryExecutionId,
      });

      const execResponse = await this.client.send(execCommand);
      const execution = execResponse.QueryExecution;

      if (!execution || execution.Status?.State !== 'SUCCEEDED') {
        return null;
      }

      // Then get results
      const resultsCommand = new GetQueryResultsCommand({
        QueryExecutionId: queryExecutionId,
      });

      const resultsResponse = await this.client.send(resultsCommand);
      const rows: Record<string, unknown>[] = [];

      if (resultsResponse.ResultSet?.Rows) {
        const headers = resultsResponse.ResultSet.Rows[0]?.Data?.map(
          (col) => col.VarCharValue
        ) || [];

        for (let i = 1; i < resultsResponse.ResultSet.Rows.length; i++) {
          const rowData = resultsResponse.ResultSet.Rows[i];
          const row: Record<string, unknown> = {};

          rowData?.Data?.forEach((col, idx) => {
            row[headers[idx] as string] = col.VarCharValue;
          });

          rows.push(row);
        }
      }

      return {
        queryId: queryExecutionId,
        status: execution.Status.State || 'SUCCEEDED',
        dataScannedBytes:
          execution.Statistics?.DataScannedInBytes || 0,
        executionTimeMs:
          execution.Statistics?.EngineExecutionTimeInMillis || 0,
        rows,
      };
    } catch (error) {
      console.error('Error getting query results:', error);
      throw new Error('Failed to get query results');
    }
  }

  async stopQuery(queryExecutionId: string): Promise<void> {
    try {
      const command = new StopQueryExecutionCommand({
        QueryExecutionId: queryExecutionId,
      });

      await this.client.send(command);
    } catch (error) {
      console.error('Error stopping query:', error);
      throw new Error('Failed to stop query');
    }
  }

  estimateCost(dataScannedBytes: number): number {
    // AWS Athena costs $6.25 per TB of data scanned
    const costPerTB = 6.25;
    const teraBytes = dataScannedBytes / (1024 * 1024 * 1024 * 1024);
    return teraBytes * costPerTB;
  }
}

export const athenaClient = new AthenaClientService();
