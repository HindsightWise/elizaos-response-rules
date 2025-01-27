// Core response type definition
export interface Response {
  content: string;
  timestamp: number;
}

// Configuration interface for response rules
export interface ResponseRulesConfig {
  repetitionWindow: number;
  similarityThreshold: number;
}

// Metrics interface for response analysis
export interface ResponseMetrics {
  totalResponses: number;
  duplicatesDetected: number;
  averageSimilarity: number;
}

// Conversation context interface
export interface ConversationContext {
  recentTopics?: string[];
  userPreferences?: Record<string, any>;
  conversationHistory?: string[];
}

// Strategy interface for generating alternative responses
export interface FallbackStrategy {
  generateAlternative: (
    response: string,
    context?: ConversationContext
  ) => Promise<string>;
}