export interface AthenaQuery {
  queryId: string;
  queryText: string;
  status: 'QUEUED' | 'RUNNING' | 'SUCCEEDED' | 'FAILED' | 'CANCELLED';
  outputLocation: string;
  dataScannedBytes: number;
  executionTimeMs: number;
  resultRows: number;
}

export interface CloudWatchLog {
  timestamp: number;
  message: string;
  logStream: string;
  logGroup: string;
}

export interface VPCFlow {
  version: string;
  accountId: string;
  interfaceId: string;
  srcAddr: string;
  dstAddr: string;
  srcPort: number;
  dstPort: number;
  protocol: number;
  packets: number;
  bytes: number;
  windowStart: number;
  windowEnd: number;
  action: 'ACCEPT' | 'REJECT';
  logStatus: 'OK' | 'NODATA' | 'SKIPDATA';
}

export interface SecurityHubFinding {
  id: string;
  title: string;
  description: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFORMATIONAL';
  types: string[];
  firstObservedAt: string;
  lastObservedAt: string;
  recordState: 'ACTIVE' | 'ARCHIVED';
  complianceStatus: 'PASSED' | 'FAILED' | 'WARNING' | 'INSUFFICIENT_DATA' | 'NOT_APPLICABLE';
}

export interface AnomalyDetected {
  type: 'traffic_spike' | 'unusual_source' | 'port_scan' | 'data_exfiltration' | 'connection_failure';
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  baseline: number;
  actual: number;
  deviationPercent: number;
  startTime: Date;
  endTime: Date;
  affectedResources: string[];
}

export interface AWSCredentials {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken?: string;
  expiration?: Date;
}
