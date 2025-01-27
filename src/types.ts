export interface Response {
  content: string;
  timestamp: number;
}

export interface ResponseRulesConfig {
  repetitionWindow: number;
  similarityThreshold: number;
}