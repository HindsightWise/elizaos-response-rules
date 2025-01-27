import { ResponseProcessor } from '../src/responseProcessor';
import { ResponseMetrics, ConversationContext } from '../src/types';

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
   * @param userInput - The user's message to respond to
   * @returns Promise resolving to the generated response
   */
  public async generateResponse(userInput: string): Promise<string> {
    const context = {
      recentTopics: this.extractRecentTopics(),
      userPreferences: this.characterConfig.settings.userPreferences,
      conversationHistory: this.conversationHistory
    };

    const initialResponse = await this.generateInitialResponse(userInput);
    const processedResponse = await this.responseProcessor.processResponse(
      initialResponse,
      context
    );

    this.conversationHistory.push(processedResponse);
    return processedResponse;
  }

  /**
   * Get current response metrics
   * @returns ResponseMetrics object containing response statistics
   */
  public getResponseMetrics(): ResponseMetrics {
    return this.responseProcessor.getMetrics();
  }

  /**
   * Generate initial response using character's base personality
   * @param userInput - The user's message to respond to
   */
  private async generateInitialResponse(userInput: string): Promise<string> {
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
   * Extract recent conversation topics for context
   * @returns Array of recent topics
   */
  private extractRecentTopics(): string[] {
    return this.conversationHistory
      .slice(-5)
      .map(msg => this.extractMainTopic(msg));
  }

  /**
   * Extract main topic from a message
   * @param message - Message to analyze
   * @returns Extracted topic
   */
  private extractMainTopic(message: string): string {
    const words = message.split(' ');
    const topic = words.find(word => word.length > 4) || words[0];
    return topic.toLowerCase();
  }
}