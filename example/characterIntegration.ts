import { ResponseProcessor } from '../src/responseProcessor';

export interface CharacterConfig {
  name: string;
  personality: string;
  settings: {
    responseRules: {
      repetitionWindow: number;
      similarityThreshold: number;
    };
    userPreferences: Record<string, any>;
  };
}

export class ElizaCharacter {
  private responseProcessor: ResponseProcessor;
  private conversationHistory: string[] = [];
  private characterConfig: CharacterConfig;

  constructor(config: CharacterConfig) {
    this.characterConfig = config;
    this.responseProcessor = new ResponseProcessor({
      repetitionWindow: config.settings.responseRules.repetitionWindow,
      similarityThreshold: config.settings.responseRules.similarityThreshold
    });
  }

  /**
   * Generate a response to user input
   */
  public async generateResponse(userInput: string): Promise<string> {
    // Build conversation context
    const context = {
      recentTopics: this.extractRecentTopics(),
      userPreferences: this.characterConfig.settings.userPreferences,
      conversationHistory: this.conversationHistory
    };

    // Generate initial response using character's base logic
    const initialResponse = await this.generateInitialResponse(userInput);

    // Process through response rules
    const processedResponse = await this.responseProcessor.processResponse(
      initialResponse,
      context
    );

    // Update conversation history
    this.conversationHistory.push(processedResponse);
    
    return processedResponse;
  }

  /**
   * Get response metrics from the processor
   */
  public getResponseMetrics() {
    return this.responseProcessor.getMetrics();
  }

  /**
   * Generate initial response using character's base personality
   */
  private async generateInitialResponse(userInput: string): Promise<string> {
    // Mock response generation based on character personality
    const personality = this.characterConfig.personality;
    const responses = [
      `As a ${personality} assistant, I would suggest...`,
      `Based on my ${personality} approach, I think...`,
      `Drawing from my ${personality} background, I'd say...`,
      `With my ${personality} perspective, I can tell you that...`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)] + 
           ` [Response to: ${userInput}]`;
  }

  /**
   * Extract recent conversation topics
   */
  private extractRecentTopics(): string[] {
    return this.conversationHistory
      .slice(-5)
      .map(msg => this.extractMainTopic(msg));
  }

  /**
   * Extract main topic from a message
   */
  private extractMainTopic(message: string): string {
    // Simple topic extraction logic
    const words = message.split(' ');
    // Take first meaningful word as topic
    const topic = words.find(word => word.length > 4) || words[0];
    return topic.toLowerCase();
  }
}