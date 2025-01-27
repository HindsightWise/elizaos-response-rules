import { ResponseRules } from './responseRules';
import { Response, ResponseRulesConfig, ResponseMetrics } from './types';

export class ResponseProcessor {
  private responseManager: ResponseRules;
  private fallbackStrategies: FallbackStrategy[] = [];
  private responseMetrics: ResponseMetrics = {
    totalResponses: 0,
    duplicatesDetected: 0,
    averageSimilarity: 0,
    totalSimilarityScore: 0  // Added for average calculation
  };

  constructor(config: ResponseRulesConfig) {
    this.responseManager = new ResponseRules(config);
    this.initializeFallbackStrategies();
  }

  public async processResponse(response: string, context?: ConversationContext): Promise<string> {
    this.responseMetrics.totalResponses++;
    
    // Calculate similarity with most recent response
    const similarity = this.responseManager.calculateSimilarity(response);
    this.responseMetrics.totalSimilarityScore += similarity;
    this.responseMetrics.averageSimilarity = 
      this.responseMetrics.totalSimilarityScore / this.responseMetrics.totalResponses;
    
    if (this.responseManager.isResponseAllowed(response)) {
      this.responseManager.addResponse(response);
      return response;
    }

    this.responseMetrics.duplicatesDetected++;
    return await this.handleDuplicateResponse(response, context);
  }

  private async handleDuplicateResponse(
    originalResponse: string, 
    context?: ConversationContext
  ): Promise<string> {
    for (const strategy of this.fallbackStrategies) {
      const alternativeResponse = await strategy.generateAlternative(
        originalResponse,
        context
      );
      
      if (this.responseManager.isResponseAllowed(alternativeResponse)) {
        this.responseManager.addResponse(alternativeResponse);
        return alternativeResponse;
      }
    }

    return this.emergencyFallbackResponse(originalResponse);
  }

  private initializeFallbackStrategies(): void {
    this.fallbackStrategies = [
      {
        generateAlternative: async (response: string) => {
          return `To express this differently: ${response}`;
        }
      },
      {
        generateAlternative: async (response: string) => {
          return `Let me rephrase that: ${response}`;
        }
      },
      {
        generateAlternative: async (response: string) => {
          return `From another perspective: ${response}`;
        }
      }
    ];
  }

  private emergencyFallbackResponse(originalResponse: string): string {
    const prefixes = [
      "Alternatively, ",
      "To put it another way, ",
      "In other words, "
    ];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    return prefix + originalResponse;
  }

  public getMetrics(): ResponseMetrics {
    // Format numbers to 2 decimal places
    return {
      totalResponses: this.responseMetrics.totalResponses,
      duplicatesDetected: this.responseMetrics.duplicatesDetected,
      averageSimilarity: Number(this.responseMetrics.averageSimilarity.toFixed(2))
    };
  }

  public addFallbackStrategy(strategy: FallbackStrategy): void {
    this.fallbackStrategies.push(strategy);
  }

  public clearFallbackStrategies(): void {
    this.fallbackStrategies = [];
  }
}

interface FallbackStrategy {
  generateAlternative: (
    response: string,
    context?: ConversationContext
  ) => Promise<string>;
}

interface ConversationContext {
  recentTopics?: string[];
  userPreferences?: Record<string, any>;
  conversationHistory?: string[];
}