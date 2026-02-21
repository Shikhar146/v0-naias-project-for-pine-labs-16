import {
  pgTable,
  pgEnum,
  uuid,
  text,
  timestamp,
  jsonb,
  integer,
  boolean,
  decimal,
  varchar,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const investigationTypeEnum = pgEnum('investigation_type', [
  'incident',
  'audit',
  'performance',
  'security',
  'change',
]);

export const investigationStatusEnum = pgEnum('investigation_status', [
  'draft',
  'running',
  'completed',
  'failed',
  'archived',
]);

export const severityEnum = pgEnum('severity', [
  'critical',
  'high',
  'medium',
  'low',
]);

export const queryTypeEnum = pgEnum('query_type', [
  'athena',
  'cloudwatch',
  'vpc_flows',
  'opensearch',
  'security_hub',
]);

export const eventTypeEnum = pgEnum('event_type', [
  'cloudwatch_log',
  'vpc_flow',
  'security_finding',
  'metric_anomaly',
  'custom_event',
]);

export const userRoleEnum = pgEnum('user_role', [
  'admin',
  'analyst',
  'viewer',
]);

// Tables
export const users = pgTable(
  'users',
  {
    id: uuid().defaultRandom().primaryKey(),
    email: varchar({ length: 255 }).unique().notNull(),
    awsIamUser: varchar({ length: 255 }).unique(),
    organizationId: uuid().notNull(),
    role: userRoleEnum().default('viewer').notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    lastLogin: timestamp(),
    active: boolean().default(true).notNull(),
  },
  (table) => ({
    organizationIdIdx: index('users_organization_id_idx').on(
      table.organizationId
    ),
    emailIdx: index('users_email_idx').on(table.email),
  })
);

export const organizations = pgTable('organizations', {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  domain: varchar({ length: 255 }).unique(),
  awsAccountId: varchar({ length: 12 }).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

export const investigations = pgTable(
  'investigations',
  {
    id: uuid().defaultRandom().primaryKey(),
    organizationId: uuid().notNull(),
    title: varchar({ length: 255 }).notNull(),
    description: text(),
    type: investigationTypeEnum().notNull(),
    status: investigationStatusEnum().default('draft').notNull(),
    severity: severityEnum().default('medium').notNull(),
    timeWindowStart: timestamp().notNull(),
    timeWindowEnd: timestamp().notNull(),
    createdBy: uuid().notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
    completedAt: timestamp(),
    resourceFilters: jsonb().$type<Record<string, string[]>>(),
    aiInsights: jsonb().$type<Record<string, unknown>>(),
  },
  (table) => ({
    organizationIdIdx: index('investigations_organization_id_idx').on(
      table.organizationId
    ),
    createdByIdx: index('investigations_created_by_idx').on(table.createdBy),
    statusIdx: index('investigations_status_idx').on(table.status),
    typeIdx: index('investigations_type_idx').on(table.type),
  })
);

export const queries = pgTable(
  'queries',
  {
    id: uuid().defaultRandom().primaryKey(),
    investigationId: uuid().notNull(),
    queryType: queryTypeEnum().notNull(),
    queryText: text().notNull(),
    generatedByAi: boolean().default(false).notNull(),
    executionStatus: varchar({ length: 50 }).default('pending').notNull(),
    executionTimeMs: integer(),
    costUsd: decimal({ precision: 10, scale: 6 }),
    resultSummary: jsonb().$type<Record<string, unknown>>(),
    rowCount: integer(),
    createdAt: timestamp().defaultNow().notNull(),
    executedAt: timestamp(),
  },
  (table) => ({
    investigationIdIdx: index('queries_investigation_id_idx').on(
      table.investigationId
    ),
    statusIdx: index('queries_execution_status_idx').on(table.executionStatus),
  })
);

export const rcaResults = pgTable(
  'rca_results',
  {
    id: uuid().defaultRandom().primaryKey(),
    investigationId: uuid().unique().notNull(),
    rootCauseDescription: text().notNull(),
    confidenceScore: decimal({ precision: 3, scale: 2 }).notNull(),
    evidenceLinks: jsonb()
      .$type<
        Array<{
          eventId: string;
          type: string;
          timestamp: string;
          evidence: string;
        }>
      >()
      .default([]),
    remediationSteps: jsonb()
      .$type<
        Array<{
          step: number;
          action: string;
          priority: string;
          estimatedTime: string;
        }>
      >()
      .default([]),
    alternativeRootCauses: jsonb()
      .$type<
        Array<{
          cause: string;
          probability: number;
        }>
      >()
      .default([]),
    generatedAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
  },
  (table) => ({
    investigationIdIdx: index('rca_results_investigation_id_idx').on(
      table.investigationId
    ),
  })
);

export const events = pgTable(
  'events',
  {
    id: uuid().defaultRandom().primaryKey(),
    investigationId: uuid().notNull(),
    eventType: eventTypeEnum().notNull(),
    sourceService: varchar({ length: 100 }).notNull(),
    timestamp: timestamp().notNull(),
    severity: severityEnum().default('low').notNull(),
    rawData: jsonb().$type<Record<string, unknown>>().notNull(),
    correlatedWith: uuid().array(),
    createdAt: timestamp().defaultNow().notNull(),
  },
  (table) => ({
    investigationIdIdx: index('events_investigation_id_idx').on(
      table.investigationId
    ),
    typeIdx: index('events_event_type_idx').on(table.eventType),
    timestampIdx: index('events_timestamp_idx').on(table.timestamp),
  })
);

export const auditLogs = pgTable(
  'audit_logs',
  {
    id: uuid().defaultRandom().primaryKey(),
    userId: uuid().notNull(),
    action: varchar({ length: 100 }).notNull(),
    resourceType: varchar({ length: 100 }).notNull(),
    resourceId: uuid(),
    changes: jsonb().$type<Record<string, unknown>>(),
    ipAddress: varchar({ length: 45 }),
    userAgent: text(),
    createdAt: timestamp().defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('audit_logs_user_id_idx').on(table.userId),
    actionIdx: index('audit_logs_action_idx').on(table.action),
    createdAtIdx: index('audit_logs_created_at_idx').on(table.createdAt),
  })
);

export const awsCredentials = pgTable(
  'aws_credentials',
  {
    id: uuid().defaultRandom().primaryKey(),
    organizationId: uuid().unique().notNull(),
    encryptedAccessKey: text().notNull(),
    encryptedSecretKey: text().notNull(),
    region: varchar({ length: 50 }).default('us-east-1').notNull(),
    lastRotated: timestamp().defaultNow().notNull(),
    rotatedBy: uuid(),
    createdAt: timestamp().defaultNow().notNull(),
  },
  (table) => ({
    organizationIdIdx: index('aws_credentials_organization_id_idx').on(
      table.organizationId
    ),
  })
);

export const investigationTemplates = pgTable(
  'investigation_templates',
  {
    id: uuid().defaultRandom().primaryKey(),
    organizationId: uuid().notNull(),
    name: varchar({ length: 255 }).notNull(),
    description: text(),
    type: investigationTypeEnum().notNull(),
    queryTemplate: jsonb()
      .$type<Array<Record<string, unknown>>>()
      .default([]),
    suggestedFilters: jsonb().$type<Record<string, string[]>>(),
    createdBy: uuid().notNull(),
    createdAt: timestamp().defaultNow().notNull(),
  },
  (table) => ({
    organizationIdIdx: index('investigation_templates_organization_id_idx').on(
      table.organizationId
    ),
  })
);

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  organization: one(organizations, {
    fields: [users.organizationId],
    references: [organizations.id],
  }),
  investigations: many(investigations),
  auditLogs: many(auditLogs),
}));

export const organizationsRelations = relations(
  organizations,
  ({ many, one }) => ({
    users: many(users),
    investigations: many(investigations),
    credentials: one(awsCredentials),
    templates: many(investigationTemplates),
  })
);

export const investigationsRelations = relations(
  investigations,
  ({ many, one }) => ({
    organization: one(organizations, {
      fields: [investigations.organizationId],
      references: [organizations.id],
    }),
    creator: one(users, {
      fields: [investigations.createdBy],
      references: [users.id],
    }),
    queries: many(queries),
    events: many(events),
    rcaResult: one(rcaResults),
  })
);

export const queriesRelations = relations(queries, ({ one }) => ({
  investigation: one(investigations, {
    fields: [queries.investigationId],
    references: [investigations.id],
  }),
}));

export const rcaResultsRelations = relations(rcaResults, ({ one }) => ({
  investigation: one(investigations, {
    fields: [rcaResults.investigationId],
    references: [investigations.id],
  }),
}));

export const eventsRelations = relations(events, ({ one }) => ({
  investigation: one(investigations, {
    fields: [events.investigationId],
    references: [investigations.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
}));

export const awsCredentialsRelations = relations(
  awsCredentials,
  ({ one }) => ({
    organization: one(organizations, {
      fields: [awsCredentials.organizationId],
      references: [organizations.id],
    }),
  })
);

export const investigationTemplatesRelations = relations(
  investigationTemplates,
  ({ one }) => ({
    organization: one(organizations, {
      fields: [investigationTemplates.organizationId],
      references: [organizations.id],
    }),
    creator: one(users, {
      fields: [investigationTemplates.createdBy],
      references: [users.id],
    }),
  })
);
