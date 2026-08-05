export interface TelemetrySample {
  ts: number;
  q_in: number;
  q_out: number;
  q_branch: number;
  current_ma: number;
  voltage_v: number;
  pressure_bar: number;
  residual: number;
  leak_active: boolean;
}

export interface DetectorOutput {
  method: string;
  residual?: number;
  threshold?: number;
  current_ma?: number;
  current_delta_ma?: number;
  score?: number;
  is_alarm: boolean;
  confidence: number;
}

export interface DetectionEval {
  ts: number;
  latest_sample: TelemetrySample;
  detectors: {
    mass_balance: DetectorOutput;
    current_signature: DetectorOutput;
    mnf: DetectorOutput;
    cusum: DetectorOutput;
  };
  fusion: {
    fused_confidence: number;
    is_alarm: boolean;
    severity: string;
  };
}

export interface ReplayRun {
  run_id: string;
  operator: string;
  date: string;
  leak_size_lpm: number;
  location: string;
  duration_sec: number;
  f1_score: number;
  precision: number;
  recall: number;
  latency_sec: number;
}

export interface WorkOrder {
  id: string;
  leak_event_id: number;
  location_node: string;
  severity_lpm: number;
  priority: string;
  assigned_crew: string;
  scheduled_start: string;
  estimated_hrs: number;
  status: string;
}

export interface FileNode {
  name: string;
  path: string;
  type: "file" | "directory";
  children?: FileNode[];
}
