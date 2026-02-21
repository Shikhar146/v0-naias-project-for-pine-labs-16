import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { Investigation } from '@/lib/types/investigations';

interface QueryGenerationRequest {
  investigation: Investigation;
  userContext: string;
  dataSourcePreferences: string[];
}

interface GeneratedQuery {
  athenaQuery?: string;
  cloudwatchQuery?: string;
  vpcFlowQuery?: string;
  explanation: string;
  confidence: number;
}

const BEDROCK_MODEL_ID = 'anthropic.claude-3-5-sonnet-20241022-v2:0';

export async function generateQueriesFromInvestigation(
  request: QueryGenerationRequest
): Promise<GeneratedQuery> {
  const client = new BedrockRuntimeClient({
    region: process.env.AWS_REGION || 'us-east-1',
  });

  const systemPrompt = `You are an expert network infrastructure engineer specializing in AWS cloud infrastructure analysis. 
Your task is to generate precise and efficient database queries for investigating network incidents and security issues.

When given an investigation context, generate:
1. Athena SQL query for analyzing VPC Flow Logs and CloudWatch logs stored in S3
2. CloudWatch Insights query for real-time log analysis
3. Analysis explanation in plain English
4. Confidence score (0-1) for the query accuracy

Format your response as JSON with keys: athenaQuery, cloudwatchQuery, explanation, confidence`;

  const userPrompt = `Generate investigation queries for the following incident:

Investigation Title: ${request.investigation.title}
Type: ${request.investigation.type}
Severity: ${request.investigation.severity}
Time Window: ${request.investigation.timeWindowStart} to ${request.investigation.timeWindowEnd}
Description: ${request.investigation.description || 'No additional context'}
User Context: ${request.userContext}
Preferred Data Sources: ${request.dataSourcePreferences.join(', ')}

Generate comprehensive queries that will help identify root causes.`;

  try {
    const command = new InvokeModelCommand({
      modelId: BEDROCK_MODEL_ID,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-06-01',
        max_tokens: 2000,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt,
          },
        ],
      }),
    });

    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    
    // Extract the text content from Claude's response
    const content = responseBody.content[0].text;
    const parsed = JSON.parse(content);

    return {
      athenaQuery: parsed.athenaQuery,
      cloudwatchQuery: parsed.cloudwatchQuery,
      explanation: parsed.explanation,
      confidence: parsed.confidence,
    };
  } catch (error) {
    console.error('Error generating queries:', error);
    throw new Error('Failed to generate investigation queries');
  }
}

export function generatePromptForRCA(
  investigationTitle: string,
  queryResults: Record<string, unknown>[],
  events: Record<string, unknown>[]
): string {
  return `Analyze the following investigation results and identify the root cause:

Investigation: ${investigationTitle}

Query Results Summary:
${JSON.stringify(queryResults.slice(0, 5), null, 2)}

Correlated Events:
${JSON.stringify(events.slice(0, 5), null, 2)}

Provide:
1. Root cause explanation
2. Confidence score (0-1)
3. Supporting evidence
4. Remediation steps
5. Alternative root causes`;
}
