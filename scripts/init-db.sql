-- Create enums
CREATE TYPE investigation_type AS ENUM ('incident', 'audit', 'performance', 'security', 'change');
CREATE TYPE investigation_status AS ENUM ('draft', 'running', 'completed', 'failed', 'archived');
CREATE TYPE severity AS ENUM ('critical', 'high', 'medium', 'low');
CREATE TYPE query_type AS ENUM ('athena', 'cloudwatch', 'vpc_flows', 'opensearch', 'security_hub');
CREATE TYPE event_type AS ENUM ('cloudwatch_log', 'vpc_flow', 'security_finding', 'metric_anomaly', 'custom_event');
CREATE TYPE user_role AS ENUM ('admin', 'analyst', 'viewer');

-- Create organizations table
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  domain VARCHAR(255) UNIQUE,
  aws_account_id VARCHAR(12) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  aws_iam_user VARCHAR(255) UNIQUE,
  organization_id UUID NOT NULL REFERENCES organizations(id),
  role user_role DEFAULT 'viewer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  active BOOLEAN DEFAULT true,
  INDEX users_organization_id_idx (organization_id),
  INDEX users_email_idx (email)
);

-- Create investigations table
CREATE TABLE investigations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type investigation_type NOT NULL,
  status investigation_status DEFAULT 'draft',
  severity severity DEFAULT 'medium',
  time_window_start TIMESTAMP NOT NULL,
  time_window_end TIMESTAMP NOT NULL,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  resource_filters JSONB,
  ai_insights JSONB,
  INDEX investigations_organization_id_idx (organization_id),
  INDEX investigations_created_by_idx (created_by),
  INDEX investigations_status_idx (status),
  INDEX investigations_type_idx (type)
);

-- Create queries table
CREATE TABLE queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investigation_id UUID NOT NULL REFERENCES investigations(id),
  query_type query_type NOT NULL,
  query_text TEXT NOT NULL,
  generated_by_ai BOOLEAN DEFAULT false,
  execution_status VARCHAR(50) DEFAULT 'pending',
  execution_time_ms INTEGER,
  cost_usd DECIMAL(10, 6),
  result_summary JSONB,
  row_count INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  executed_at TIMESTAMP,
  INDEX queries_investigation_id_idx (investigation_id),
  INDEX queries_execution_status_idx (execution_status)
);

-- Create rca_results table
CREATE TABLE rca_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investigation_id UUID NOT NULL UNIQUE REFERENCES investigations(id),
  root_cause_description TEXT NOT NULL,
  confidence_score DECIMAL(3, 2) NOT NULL,
  evidence_links JSONB DEFAULT '[]'::jsonb,
  remediation_steps JSONB DEFAULT '[]'::jsonb,
  alternative_root_causes JSONB DEFAULT '[]'::jsonb,
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX rca_results_investigation_id_idx (investigation_id)
);

-- Create events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investigation_id UUID NOT NULL REFERENCES investigations(id),
  event_type event_type NOT NULL,
  source_service VARCHAR(100) NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  severity severity DEFAULT 'low',
  raw_data JSONB NOT NULL,
  correlated_with UUID[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX events_investigation_id_idx (investigation_id),
  INDEX events_event_type_idx (event_type),
  INDEX events_timestamp_idx (timestamp)
);

-- Create audit_logs table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(100) NOT NULL,
  resource_id UUID,
  changes JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX audit_logs_user_id_idx (user_id),
  INDEX audit_logs_action_idx (action),
  INDEX audit_logs_created_at_idx (created_at)
);

-- Create aws_credentials table
CREATE TABLE aws_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL UNIQUE REFERENCES organizations(id),
  encrypted_access_key TEXT NOT NULL,
  encrypted_secret_key TEXT NOT NULL,
  region VARCHAR(50) DEFAULT 'us-east-1',
  last_rotated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  rotated_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX aws_credentials_organization_id_idx (organization_id)
);

-- Create investigation_templates table
CREATE TABLE investigation_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type investigation_type NOT NULL,
  query_template JSONB DEFAULT '[]'::jsonb,
  suggested_filters JSONB,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX investigation_templates_organization_id_idx (organization_id)
);
