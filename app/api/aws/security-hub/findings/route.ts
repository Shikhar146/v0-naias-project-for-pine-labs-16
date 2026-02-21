import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { startTime, endTime, severityFilter, complianceFramework } = body;

    // Mock Security Hub findings - in production, use AWS SDK
    const mockFindings = [
      {
        id: 'finding-001',
        title: 'Unencrypted RDS Database',
        severity: 'HIGH',
        status: 'NOTIFIED',
        productArn: 'arn:aws:securityhub:us-east-1::product/aws/rds',
        resourceId: 'arn:aws:rds:us-east-1:123456789012:db:production-db',
        description:
          'RDS database is not encrypted at rest. PCI-DSS requires encryption for sensitive data.',
        remediationUrl:
          'https://console.aws.amazon.com/rds/home?region=us-east-1#databases:id=production-db',
        complianceFramework: 'PCI-DSS-3.4',
        firstObservedAt: startTime,
        lastObservedAt: endTime,
      },
      {
        id: 'finding-002',
        title: 'Security Group Allows Unrestricted SSH Access',
        severity: 'HIGH',
        status: 'NOTIFIED',
        productArn:
          'arn:aws:securityhub:us-east-1::product/aws/guardduty/access-key-unusually-used',
        resourceId:
          'arn:aws:ec2:us-east-1:123456789012:security-group/sg-0a1b2c3d',
        description:
          'Security group sg-0a1b2c3d allows SSH (port 22) access from 0.0.0.0/0. Restrict to known IPs.',
        remediationUrl:
          'https://console.aws.amazon.com/ec2/v2/home?region=us-east-1#SecurityGroups:',
        complianceFramework: 'CIS-AWS',
        firstObservedAt: startTime,
        lastObservedAt: endTime,
      },
      {
        id: 'finding-003',
        title: 'CloudTrail Not Enabled',
        severity: 'MEDIUM',
        status: 'ACTIVE',
        productArn: 'arn:aws:securityhub:us-east-1::product/aws/cloudtrail',
        resourceId: 'arn:aws:cloudtrail:us-east-1:123456789012:trail/default',
        description:
          'CloudTrail is not enabled for all regions. Required for audit logging and compliance.',
        remediationUrl:
          'https://console.aws.amazon.com/cloudtrail/home?region=us-east-1',
        complianceFramework: 'SOC-2',
        firstObservedAt: startTime,
        lastObservedAt: endTime,
      },
      {
        id: 'finding-004',
        title: 'Suspicious API Activity Detected',
        severity: 'CRITICAL',
        status: 'NOTIFIED',
        productArn: 'arn:aws:securityhub:us-east-1::product/aws/guardduty',
        resourceId: 'arn:aws:iam::123456789012:user/automation-user',
        description:
          'Unusual number of API calls detected (1000+ calls in 10 minutes). May indicate credential compromise.',
        remediationUrl:
          'https://console.aws.amazon.com/iam/home#/users/automation-user',
        complianceFramework: 'THREAT-DETECTION',
        firstObservedAt: new Date(new Date(startTime).getTime() + 120000).toISOString(),
        lastObservedAt: endTime,
      },
    ];

    const filtered = mockFindings.filter((finding) => {
      if (
        severityFilter &&
        !severityFilter.includes(finding.severity)
      ) {
        return false;
      }
      if (
        complianceFramework &&
        !finding.complianceFramework.includes(complianceFramework)
      ) {
        return false;
      }
      return true;
    });

    return NextResponse.json({
      findings: filtered,
      statistics: {
        totalFindings: filtered.length,
        critical: filtered.filter((f) => f.severity === 'CRITICAL').length,
        high: filtered.filter((f) => f.severity === 'HIGH').length,
        medium: filtered.filter((f) => f.severity === 'MEDIUM').length,
        low: filtered.filter((f) => f.severity === 'LOW').length,
      },
      complianceFrameworks: [
        'PCI-DSS',
        'SOC-2',
        'CIS-AWS',
        'HIPAA',
        'GDPR',
      ],
    });
  } catch (error) {
    console.error('[v0] Security Hub API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Security Hub findings' },
      { status: 500 }
    );
  }
}
