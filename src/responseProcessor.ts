import { ResponseRules } from './responseRules';
import { Response, ResponseRulesConfig } from './types';

export class ResponseProcessor {
  private responseManager: ResponseRules;
  // Initialize fallbackStrategies with empty array
  private fallbackStrategies: FallbackStrategy[] = [];
  private responseMetrics: ResponseMetrics = {
    totalResponses: 0,
    duplicatesDetected: 0,
    averageSimilarity: 0
  };

  constructor(config: ResponseRulesConfig) {
    this.responseManager = new ResponseRules(config);
    this.initializeFallbackStrategies();
  }

  /**
   * Process a response through duplication detection and optimization
   */
  public async processResponse(response: string, context?: ConversationContext): Promise<string> {
    this.responseMetrics.totalResponses++;
    
    if (this.responseManager.isResponseAllowed(response)) {
      this.responseManager.addResponse(response);
      return response;
    }

    this.responseMetrics.duplicatesDetected++;
    return await this.handleDuplicateResponse(response, context);
  }

  /**
   * Handle cases where a duplicate response is detected
   */
  private async handleDuplicateResponse(
    originalResponse: string, 
    context?: ConversationContext
  ): Promise<string> {
    // Try each fallback strategy in sequence
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

  /**
   * Initialize default fallback strategies
   */
  private initializeFallbackStrategies(): void {
    this.fallbackStrategies = [
      {
        generateAlternative: async (response: string) => {
          return `Let me rephrase that: ${response}`;
        }
      },
      {
        generateAlternative: async (response: string) => {
          return `To put it another way: ${response}`;
        }
      }
    ];
  }

  /**
   * Emergency fallback for when all strategies fail
   */
  private emergencyFallbackResponse(originalResponse: string): string {
    const prefix = "To express this differently: ";
    return prefix + originalResponse;
  }

  /**
   * Get current metrics
   */
  public getMetrics(): ResponseMetrics {
    return { ...this.responseMetrics };
  }

  /**
   * Add a custom fallback strategy
   */
  public addFallbackStrategy(strategy: FallbackStrategy): void {
    this.fallbackStrategies.push(strategy);
  }

  /**
   * Clear all fallback strategies
   */
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

interface ResponseMetrics {
  totalResponses: number;
  duplicatesDetected: number;
  averageSimilarity: number;
}

interface ConversationContext {
  recentTopics?: string[];
  userPreferences?: Record<string, any>;
  conversationHistory?: string[];
}