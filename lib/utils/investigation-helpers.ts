export const INVESTIGATION_TYPES = [
  { value: 'incident', label: 'Incident Investigation', icon: '🚨' },
  { value: 'audit', label: 'Security Audit', icon: '🔒' },
  { value: 'performance', label: 'Performance Troubleshooting', icon: '⚡' },
  { value: 'security', label: 'Security Analysis', icon: '🛡️' },
  { value: 'change', label: 'Change Failure Analysis', icon: '📊' },
];

export const SEVERITY_LEVELS = [
  { value: 'critical', label: 'Critical', color: '#ff0000' },
  { value: 'high', label: 'High', color: '#ff6b00' },
  { value: 'medium', label: 'Medium', color: '#ffa500' },
  { value: 'low', label: 'Low', color: '#0066cc' },
];

export const STATUS_BADGES = {
  draft: { label: 'Draft', variant: 'secondary' },
  running: { label: 'Running', variant: 'default' },
  completed: { label: 'Completed', variant: 'outline' },
  failed: { label: 'Failed', variant: 'destructive' },
  archived: { label: 'Archived', variant: 'secondary' },
};

export function getStatusVariant(
  status: string
): 'default' | 'secondary' | 'destructive' | 'outline' {
  const variants: Record<
    string,
    'default' | 'secondary' | 'destructive' | 'outline'
  > = {
    draft: 'secondary',
    running: 'default',
    completed: 'outline',
    failed: 'destructive',
    archived: 'secondary',
  };
  return variants[status] || 'outline';
}

export function getSeverityColor(severity: string): string {
  const colors: Record<string, string> = {
    critical: '#ff0000',
    high: '#ff6b00',
    medium: '#ffa500',
    low: '#0066cc',
  };
  return colors[severity] || '#666666';
}

export function formatTimeRange(start: Date, end: Date): string {
  const startTime = start.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const endTime = end.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  return `${startTime} - ${endTime}`;
}

export function calculateMTTR(
  createdAt: Date,
  completedAt: Date | null
): string {
  if (!completedAt) return 'In Progress';

  const milliseconds =
    completedAt.getTime() - createdAt.getTime();
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

export function generateInvestigationId(): string {
  return `inv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export const DATA_SOURCE_OPTIONS = [
  { value: 'cloudwatch', label: 'CloudWatch Logs', icon: '📝' },
  { value: 'vpc_flows', label: 'VPC Flow Logs', icon: '🌐' },
  { value: 'security_hub', label: 'Security Hub', icon: '🛡️' },
  { value: 'athena', label: 'Athena Queries', icon: '📊' },
  { value: 'opensearch', label: 'OpenSearch', icon: '🔍' },
];

export const INVESTIGATION_TEMPLATES = [
  {
    id: 'payment-timeout',
    name: 'Payment Timeout Investigation',
    type: 'incident',
    description: 'Debug payment processor timeouts and failures',
    queries: [
      'SELECT * FROM payment_logs WHERE timestamp > ? AND status = "timeout"',
      'SELECT * FROM vpc_flow_logs WHERE dest_addr = "payment-api" AND action = "REJECT"',
    ],
  },
  {
    id: 'network-spike',
    name: 'Network Spike Analysis',
    type: 'performance',
    description: 'Investigate unexpected network traffic spikes',
    queries: [
      'SELECT * FROM vpc_flow_logs WHERE bytes > 1000000 AND timestamp > ?',
      'SELECT source, destination, SUM(bytes) FROM vpc_flow_logs GROUP BY source, destination',
    ],
  },
  {
    id: 'security-alert',
    name: 'Security Alert Investigation',
    type: 'security',
    description: 'Deep dive into security findings',
    queries: [
      'SELECT * FROM security_hub_findings WHERE severity = "CRITICAL"',
      'SELECT * FROM cloudwatch_logs WHERE pattern LIKE "%denied%" OR pattern LIKE "%unauthorized%"',
    ],
  },
];
