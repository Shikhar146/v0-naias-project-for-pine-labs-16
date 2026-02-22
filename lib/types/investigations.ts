export type InvestigationType = 'incident' | 'audit' | 'performance' | 'security' | 'change';
export type InvestigationStatus = 'draft' | 'running' | 'completed' | 'failed' | 'archived';
export type Severity = 'critical' | 'high' | 'medium' | 'low';

export interface ResourceFilter {
  [key: string]: string[];
}

export interface AIInsights {
  rootCause: string;
  confidence: number;
  evidence: Array<{
    type: string;
    timestamp: string;
    message: string;
    severity?: string;
  }>;
  remediationSteps?: Array<{
    step: number;
    action: string;
    priority: string;
    estimatedTime?: string;
  }>;
  alternativeCauses?: Array<{
    cause: string;
    probability: number;
  }>;
}

export interface Investigation {
  completedAt: any;
  id: string;
  title: string;
  description?: string;
  type: InvestigationType;
  status: InvestigationStatus;
  severity: Severity;
  createdAt: string | Date;
  timeWindowStart: string | Date;
  timeWindowEnd: string | Date;
  resourceFilters?: ResourceFilter;
  aiInsights?: AIInsights;
  queries?: Query[];
  events?: Event[];
  organizationId?: string;
}

export interface Query {
  id: string;
  investigationId: string;
  type: 'athena' | 'cloudwatch' | 'vpc_flows' | 'security_hub';
  query: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  results?: any;
  error?: string;
  executionTime?: number;
  executedAt?: Date;
}

export interface Event {
  id: string;
  investigationId: string;
  timestamp: Date;
  service: string;
  eventType: string;
  severity: Severity;
  message: string;
  metadata?: Record<string, any>;
}

export interface RCAResult {
  id: string;
  investigationId: string;
  rootCause: string;
  confidence: number;
  evidence: string[];
  remediationSteps: RemediationStep[];
  alternativeCauses: AlternativeCause[];
  generatedAt: Date;
}

export interface RemediationStep {
  step: number;
  action: string;
  priority: 'immediate' | 'high' | 'medium' | 'low';
  estimatedTime?: string;
  status?: 'pending' | 'in-progress' | 'completed';
}

export interface AlternativeCause {
  cause: string;
  probability: number;
  evidence?: string[];
}

export interface CreateInvestigationRequest {
  title: string;
  description?: string;
  type: InvestigationType;
  severity: Severity;
  timeWindowStart: Date;
  timeWindowEnd: Date;
  resourceFilters?: ResourceFilter;
}

export interface ExecuteInvestigationRequest {
  investigationId: string;
  includeAIAnalysis?: boolean;
}
