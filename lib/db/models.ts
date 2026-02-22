import { ObjectId } from 'mongodb';

// Investigation Document Type
export interface Investigation {
  _id?: ObjectId;
  id: string; // UUID string for API compatibility
  organizationId: string;
  title: string;
  description?: string;
  type: 'incident' | 'audit' | 'performance' | 'security' | 'change';
  status: 'draft' | 'pending' | 'running' | 'completed' | 'failed' | 'archived';
  severity: 'critical' | 'high' | 'medium' | 'low';
  timeWindowStart: Date;
  timeWindowEnd: Date;
  resourceFilters?: Record<string, any>;
  aiInsights?: any;
  queries?: Query[];
  timeline?: Timeline[];
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  deletedAt?: Date;
}

// Query Document Type
export interface Query {
  _id?: ObjectId;
  id: string;
  investigationId: string;
  type: 'athena' | 'cloudwatch' | 'vpc_flows' | 'opensearch' | 'security_hub';
  query: string;
  results?: any;
  status: 'pending' | 'running' | 'completed' | 'failed';
  executedAt?: Date;
  completedAt?: Date;
}

// Timeline Event Document Type
export interface Timeline {
  _id?: ObjectId;
  id: string;
  investigationId: string;
  timestamp: Date;
  eventType: 'cloudwatch_log' | 'vpc_flow' | 'security_finding' | 'metric_anomaly' | 'custom_event';
  description: string;
  data?: any;
}

// User Document Type
export interface User {
  _id?: ObjectId;
  id: string;
  email: string;
  organizationId: string;
  fullName?: string;
  role: 'admin' | 'analyst' | 'viewer';
  createdAt: Date;
  lastLogin?: Date;
  active: boolean;
}

// Organization Document Type
export interface Organization {
  _id?: ObjectId;
  id: string;
  name: string;
  domain?: string;
  awsAccountId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Session Document Type
export interface Session {
  _id?: ObjectId;
  userId: string;
  email: string;
  fullName: string;
  organizationId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

// Collection Names
export const COLLECTIONS = {
  INVESTIGATIONS: 'investigations',
  QUERIES: 'queries',
  TIMELINES: 'timelines',
  USERS: 'users',
  ORGANIZATIONS: 'organizations',
  SESSIONS: 'sessions',
};
