import {
  CloudWatchLogsClient,
  FilterLogEventsCommand,
  DescribeLogGroupsCommand,
  DescribeLogStreamsCommand,
} from '@aws-sdk/client-cloudwatch-logs';

export interface LogEvent {
  timestamp: number;
  message: string;
  logStream: string;
  logGroup: string;
  eventId?: string;
}

export class CloudWatchClientService {
  private client: CloudWatchLogsClient;

  constructor(region: string = process.env.AWS_REGION || 'us-east-1') {
    this.client = new CloudWatchLogsClient({ region });
  }

  async getLogs(
    logGroupName: string,
    startTime: number,
    endTime: number,
    pattern?: string
  ): Promise<LogEvent[]> {
    try {
      const command = new FilterLogEventsCommand({
        logGroupName,
        startTime,
        endTime,
        filterPattern: pattern || '',
        limit: 1000, // Max results per call
      });

      const response = await this.client.send(command);
      const events: LogEvent[] = [];

      if (response.events) {
        response.events.forEach((event) => {
          if (event.message && event.timestamp) {
            events.push({
              timestamp: event.timestamp,
              message: event.message,
              logStream: event.logStreamName || '',
              logGroup: logGroupName,
              eventId: event.eventId,
            });
          }
        });
      }

      return events;
    } catch (error) {
      console.error('Error fetching CloudWatch logs:', error);
      throw new Error('Failed to fetch CloudWatch logs');
    }
  }

  async getLogGroups(): Promise<string[]> {
    try {
      const command = new DescribeLogGroupsCommand({
        limit: 50,
      });

      const response = await this.client.send(command);
      return (
        response.logGroups?.map((group) => group.logGroupName || '').filter(Boolean) || []
      );
    } catch (error) {
      console.error('Error fetching log groups:', error);
      throw new Error('Failed to fetch log groups');
    }
  }

  async getLogStreams(logGroupName: string): Promise<string[]> {
    try {
      const command = new DescribeLogStreamsCommand({
        logGroupName,
        limit: 50,
      });

      const response = await this.client.send(command);
      return (
        response.logStreams?.map((stream) => stream.logStreamName || '').filter(Boolean) || []
      );
    } catch (error) {
      console.error('Error fetching log streams:', error);
      throw new Error('Failed to fetch log streams');
    }
  }

  async searchLogs(
    logGroupNames: string[],
    startTime: number,
    endTime: number,
    keywords: string[]
  ): Promise<LogEvent[]> {
    try {
      const allEvents: LogEvent[] = [];
      const pattern = keywords.join(' | ');

      for (const logGroupName of logGroupNames) {
        const events = await this.getLogs(
          logGroupName,
          startTime,
          endTime,
          pattern
        );
        allEvents.push(...events);
      }

      // Sort by timestamp descending
      allEvents.sort((a, b) => b.timestamp - a.timestamp);
      return allEvents;
    } catch (error) {
      console.error('Error searching logs:', error);
      throw new Error('Failed to search logs');
    }
  }
}

export const cloudwatchClient = new CloudWatchClientService();
