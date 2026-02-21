export const INVESTIGATION_TEMPLATES = [
  {
    id: 'payment-timeout',
    name: 'Payment Processor Timeout',
    type: 'incident',
    severity: 'critical',
    description:
      'Debug payment processor timeouts and failures across transaction pipeline',
    icon: '💳',
    suggestedDataSources: ['cloudwatch', 'vpc_flows', 'security_hub'],
    autoQueries: [
      'SELECT timestamp, error_code, message, service FROM logs WHERE service LIKE "%payment%" AND timestamp > NOW() - INTERVAL "30 minutes" AND level = "ERROR"',
      'SELECT src_addr, dst_addr, dst_port, action, packets FROM vpc_flows WHERE dst_port IN (443, 8443) AND timestamp > NOW() - INTERVAL "30 minutes" LIMIT 1000',
    ],
    expectedRCA:
      'Timeout typically caused by: Connection pool exhaustion, NAT gateway limits, or third-party API degradation',
    remediationSteps: [
      'Check payment processor API status',
      'Scale NAT Gateway connections',
      'Implement connection pooling',
      'Add circuit breaker pattern',
    ],
  },
  {
    id: 'network-spike',
    name: 'Network Traffic Spike',
    type: 'performance',
    severity: 'high',
    description: 'Investigate unexpected network traffic spikes or anomalies',
    icon: '📈',
    suggestedDataSources: ['vpc_flows', 'cloudwatch'],
    autoQueries: [
      'SELECT timestamp, src_addr, dst_addr, SUM(bytes) as total_bytes FROM vpc_flow_logs GROUP BY timestamp, src_addr, dst_addr ORDER BY total_bytes DESC LIMIT 100',
      'SELECT interface_id, action, SUM(bytes) FROM vpc_flow_logs WHERE action = "REJECT" GROUP BY interface_id LIMIT 50',
    ],
    expectedRCA: 'Traffic spike from unexpected source or port scanning activity',
    remediationSteps: [
      'Identify anomalous traffic source',
      'Check for DDoS patterns',
      'Review security group rules',
      'Implement traffic filtering',
    ],
  },
  {
    id: 'security-alert',
    name: 'Security Alert Investigation',
    type: 'security',
    severity: 'high',
    description: 'Deep dive into security findings and potential threats',
    icon: '🔒',
    suggestedDataSources: ['security_hub', 'cloudwatch', 'vpc_flows'],
    autoQueries: [
      'SELECT finding_title, severity, status FROM security_hub_findings WHERE severity IN ("CRITICAL", "HIGH") ORDER BY created_at DESC',
      'SELECT * FROM cloudwatch_logs WHERE level = "WARN" OR level = "ERROR" AND pattern LIKE "%denied%" OR pattern LIKE "%unauthorized%" LIMIT 500',
    ],
    expectedRCA:
      'Security issue typically from: Misconfigured security groups, unencrypted data, or access from unexpected location',
    remediationSteps: [
      'Review Security Hub findings',
      'Check IAM permissions',
      'Validate security group rules',
      'Enable encryption where needed',
    ],
  },
  {
    id: 'database-slowdown',
    name: 'Database Performance Degradation',
    type: 'performance',
    severity: 'high',
    description: 'Investigate database slowdowns and query performance issues',
    icon: '🗄️',
    suggestedDataSources: ['cloudwatch'],
    autoQueries: [
      'SELECT query_type, AVG(execution_time_ms) as avg_time, MAX(execution_time_ms) as max_time FROM database_logs GROUP BY query_type ORDER BY avg_time DESC',
      'SELECT connection_count, timestamp FROM database_metrics WHERE timestamp > NOW() - INTERVAL "1 hour" ORDER BY connection_count DESC',
    ],
    expectedRCA:
      'Database slowdown from: Connection pool exhaustion, long-running queries, or insufficient resources',
    remediationSteps: [
      'Increase connection pool size',
      'Optimize slow queries',
      'Add database indexes',
      'Scale database instance',
    ],
  },
  {
    id: 'deployment-failure',
    name: 'Deployment/Change Failure Analysis',
    type: 'change',
    severity: 'high',
    description: 'Correlate deployment changes with incident occurrence',
    icon: '🚀',
    suggestedDataSources: ['cloudwatch', 'vpc_flows'],
    autoQueries: [
      'SELECT deployment_id, service, version, timestamp FROM deployments WHERE timestamp > NOW() - INTERVAL "2 hours" ORDER BY timestamp DESC',
      'SELECT * FROM error_logs WHERE timestamp > (SELECT MAX(timestamp) FROM deployments) - INTERVAL "10 minutes" LIMIT 1000',
    ],
    expectedRCA:
      'Deployment failure often caused by: Bad configuration, incompatible dependencies, or insufficient testing',
    remediationSteps: [
      'Review deployment changes',
      'Check service logs',
      'Compare before/after metrics',
      'Prepare rollback if needed',
    ],
  },
  {
    id: 'credential-compromise',
    name: 'Potential Credential Compromise',
    type: 'security',
    severity: 'critical',
    description: 'Investigate suspicious API activity suggesting credential compromise',
    icon: '🔑',
    suggestedDataSources: ['security_hub', 'cloudwatch'],
    autoQueries: [
      'SELECT user_id, api_key, SUM(request_count) as total_requests FROM api_logs WHERE timestamp > NOW() - INTERVAL "1 hour" GROUP BY user_id, api_key HAVING total_requests > 1000',
      'SELECT failed_attempts, user_id FROM failed_login_logs WHERE timestamp > NOW() - INTERVAL "1 hour" ORDER BY failed_attempts DESC',
    ],
    expectedRCA:
      'Credential compromise indicated by: Unusual API patterns, failed auth attempts from new IPs, or geographic anomalies',
    remediationSteps: [
      'Rotate compromised credentials',
      'Review recent API calls',
      'Check for data access',
      'Enable MFA if not already active',
    ],
  },
  {
    id: 'resource-exhaustion',
    name: 'Resource Exhaustion Alert',
    type: 'performance',
    severity: 'high',
    description: 'Debug CPU, memory, or disk space exhaustion issues',
    icon: '⚙️',
    suggestedDataSources: ['cloudwatch'],
    autoQueries: [
      'SELECT instance_id, cpu_utilization, memory_utilization FROM instance_metrics WHERE timestamp > NOW() - INTERVAL "1 hour" ORDER BY cpu_utilization DESC LIMIT 100',
      'SELECT disk_usage, instance_id FROM storage_metrics WHERE disk_usage > 90 LIMIT 50',
    ],
    expectedRCA:
      'Resource exhaustion from: Memory leaks, CPU-intensive queries, or insufficient provisioning',
    remediationSteps: [
      'Identify resource consumer process',
      'Scale instance size',
      'Optimize resource-heavy code',
      'Implement auto-scaling',
    ],
  },
  {
    id: 'fintech-audit',
    name: 'Fintech Compliance Audit',
    type: 'audit',
    severity: 'medium',
    description:
      'PCI-DSS and compliance audit for payment infrastructure (Creditplus specific)',
    icon: '📋',
    suggestedDataSources: ['security_hub', 'cloudwatch'],
    autoQueries: [
      'SELECT * FROM compliance_findings WHERE framework IN ("PCI-DSS", "SOC-2") ORDER BY severity DESC',
      'SELECT user_id, action, resource, timestamp FROM audit_logs WHERE resource LIKE "%credit%" OR resource LIKE "%payment%" ORDER BY timestamp DESC LIMIT 5000',
    ],
    expectedRCA:
      'Compliance gaps often from: Missing encryption, insufficient access controls, or inadequate logging',
    remediationSteps: [
      'Review PCI-DSS requirements',
      'Enable encryption at rest and transit',
      'Implement access logging',
      'Schedule penetration testing',
    ],
  },
];

export const QUICK_ACTIONS = [
  {
    title: 'One-Click Investigation',
    description: 'Paste error message for instant analysis',
    action: 'investigations/new?mode=quick',
    icon: '⚡',
  },
  {
    title: 'Payment Transaction Debug',
    description: 'Trace payment through entire pipeline',
    action: 'transaction-tracer',
    icon: '💳',
  },
  {
    title: 'Network Anomaly Check',
    description: 'View network topology and flows',
    action: 'network-topology',
    icon: '🌐',
  },
  {
    title: 'Security Audit',
    description: 'Review recent security findings',
    action: 'compliance',
    icon: '🔒',
  },
];

export const COMMON_ERRORS = [
  {
    pattern: 'timeout',
    probable_cause: 'Connection timeout or NAT Gateway limit',
    data_sources: ['vpc_flows', 'cloudwatch'],
  },
  {
    pattern: 'connection refused',
    probable_cause: 'Security group rule blocking traffic',
    data_sources: ['vpc_flows', 'security_hub'],
  },
  {
    pattern: 'pool exhaustion',
    probable_cause: 'Connection pool limit reached',
    data_sources: ['cloudwatch'],
  },
  {
    pattern: 'unauthorized',
    probable_cause: 'Authentication failure or IAM permission issue',
    data_sources: ['cloudwatch', 'security_hub'],
  },
  {
    pattern: 'rate limit',
    probable_cause: 'Third-party API rate limiting',
    data_sources: ['cloudwatch'],
  },
];

export const FINTECH_SPECIFIC_CONTEXT = {
  domain: 'creditplus',
  organization: 'Pine Labs',
  keyServices: [
    'payment-processor',
    'transaction-engine',
    'settlement-service',
    'fraud-detection',
    'compliance-engine',
  ],
  criticality: {
    'payment-processor': 'CRITICAL',
    'transaction-engine': 'CRITICAL',
    'settlement-service': 'CRITICAL',
    'fraud-detection': 'HIGH',
    'compliance-engine': 'HIGH',
  },
  complianceFrameworks: ['PCI-DSS-3.4', 'SOC-2-Type-II', 'RBI-Guidelines'],
  sensitiveDataPatterns: [
    'credit_card',
    'pan',
    'cvv',
    'payment_token',
    'account_number',
  ],
};

export const INVESTIGATION_FLOW = [
  {
    step: 1,
    title: 'Create Investigation',
    description: 'Select type and provide context',
  },
  {
    step: 2,
    title: 'Generate Queries',
    description: 'AI generates targeted queries',
  },
  {
    step: 3,
    title: 'Execute Queries',
    description: 'Fetch data from all sources',
  },
  {
    step: 4,
    title: 'Correlate Events',
    description: 'Link events across services',
  },
  {
    step: 5,
    title: 'Generate RCA',
    description: 'AI analyzes and recommends',
  },
  {
    step: 6,
    title: 'View Results',
    description: 'Review findings and share',
  },
];
