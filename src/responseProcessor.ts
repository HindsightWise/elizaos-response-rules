import { ResponseRules } from './responseRules';
import { Response, ResponseRulesConfig } from './types';

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

/**
 * ResponseProcessor class handles response deduplication and processing
 * utilizing advanced text analysis and fallback strategies.
 */
export class ResponseProcessor {
  private responseManager: ResponseRules;
  private fallbackStrategies: FallbackStrategy[] = []; // Initialize with empty array
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
   * @param response - Input response to process
   * @param context - Optional conversation context
   * @returns Processed and validated response
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
   * @param originalResponse - The detected duplicate response
   * @param context - Optional conversation context
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
   * Initialize default fallback strategies with advanced response variations
   */
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

  /**
   * Emergency fallback response generation
   * @param originalResponse - The original response to transform
   */
  private emergencyFallbackResponse(originalResponse: string): string {
    const prefixes = [
      "Alternatively, ",
      "To put it another way, ",
      "In other words, "
    ];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    return prefix + originalResponse;
  }

  /**
   * Get current response processing metrics
   */
  public getMetrics(): ResponseMetrics {
    return { ...this.responseMetrics };
  }

  /**
   * Add a custom fallback strategy
   * @param strategy - Custom fallback strategy implementation
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