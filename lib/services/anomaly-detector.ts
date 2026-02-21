export interface AnomalyEvent {
  id: string;
  timestamp: Date;
  type: 'traffic_spike' | 'unusual_source' | 'port_scan' | 'data_exfiltration';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  sourceIp: string;
  destinationIp: string;
  baseline: number;
  observed: number;
  deviation: number; // percentage
}

export class AnomalyDetector {
  private readonly TRAFFIC_SPIKE_THRESHOLD = 1.5; // 50% increase
  private readonly PORT_SCAN_THRESHOLD = 100; // connections to 100+ ports
  private readonly EXFILTRATION_THRESHOLD = 10; // 10GB out in short time

  /**
   * Detect traffic volume spikes
   */
  detectTrafficSpikes(
    currentBytes: number,
    baselineBytes: number
  ): AnomalyEvent | null {
    const deviation = (currentBytes - baselineBytes) / baselineBytes;

    if (deviation > this.TRAFFIC_SPIKE_THRESHOLD) {
      return {
        id: `spike-${Date.now()}`,
        timestamp: new Date(),
        type: 'traffic_spike',
        severity: deviation > 2 ? 'critical' : 'high',
        description: `Unusual traffic spike detected: ${(deviation * 100).toFixed(1)}% above baseline`,
        sourceIp: '10.0.0.0',
        destinationIp: '0.0.0.0',
        baseline: baselineBytes,
        observed: currentBytes,
        deviation: deviation * 100,
      };
    }

    return null;
  }

  /**
   * Detect unusual connection sources
   */
  detectUnusualSources(sourceIp: string, knownSources: string[]): boolean {
    return !knownSources.includes(sourceIp);
  }

  /**
   * Detect port scanning activity
   */
  detectPortScanning(ports: number[]): AnomalyEvent | null {
    // Check if accessing many different ports (typical of port scanning)
    if (ports.length > this.PORT_SCAN_THRESHOLD) {
      return {
        id: `portscan-${Date.now()}`,
        timestamp: new Date(),
        type: 'port_scan',
        severity: 'high',
        description: `Possible port scanning detected: ${ports.length} unique ports accessed`,
        sourceIp: '10.0.0.0',
        destinationIp: '0.0.0.0',
        baseline: 10,
        observed: ports.length,
        deviation: ((ports.length - 10) / 10) * 100,
      };
    }

    return null;
  }

  /**
   * Detect data exfiltration patterns
   */
  detectDataExfiltration(
    outboundBytes: number,
    timeWindowMinutes: number
  ): AnomalyEvent | null {
    const bytesPerMinute = outboundBytes / timeWindowMinutes;
    const gbPerMinute = bytesPerMinute / (1024 * 1024 * 1024);

    if (gbPerMinute > this.EXFILTRATION_THRESHOLD) {
      return {
        id: `exfil-${Date.now()}`,
        timestamp: new Date(),
        type: 'data_exfiltration',
        severity: 'critical',
        description: `Potential data exfiltration: ${gbPerMinute.toFixed(2)} GB/min outbound`,
        sourceIp: '10.0.0.0',
        destinationIp: '0.0.0.0',
        baseline: 1,
        observed: gbPerMinute,
        deviation: ((gbPerMinute - 1) / 1) * 100,
      };
    }

    return null;
  }

  /**
   * Score anomaly severity (0-100)
   */
  scoreAnomaly(anomaly: AnomalyEvent): number {
    const severityScores = {
      low: 25,
      medium: 50,
      high: 75,
      critical: 100,
    };

    const deviationScore = Math.min(100, anomaly.deviation / 2);
    return (severityScores[anomaly.severity] + deviationScore) / 2;
  }
}
