import { ResponseProcessor } from '../src/responseProcessor';

/**
 * ElizaOS Character Integration Example
 * Demonstrates integration of response rules with character processing
 */
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
   * Process user input and generate response
   * @param userInput - The user's message
   * @returns Processed and validated response
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
   * Generate initial response using character's base personality
   * @param userInput - The user's message
   */
  private async generateInitialResponse(userInput: string): Promise<string> {
    // Implement your character's core response generation logic here
    return `Based on ${this.characterConfig.personality}, here's a response...`;
  }

  /**
   * Extract recent conversation topics for context
   */
  private extractRecentTopics(): string[] {
    // Implement topic extraction logic
    return this.conversationHistory
      .slice(-5)
      .map(msg => this.extractMainTopic(msg));
  }

  private extractMainTopic(message: string): string {
    // Implement topic extraction logic
    return 'extracted topic';
  }
}

// Example character configuration
interface CharacterConfig {
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

// Usage example
async function main() {
  const character = new ElizaCharacter({
    name: "Assistant",
    personality: "helpful and friendly",
    settings: {
      responseRules: {
        repetitionWindow: 25,
        similarityThreshold: 0.82
      },
      userPreferences: {
        verbosity: "medium",
        tone: "professional"
      }
    }
  });

  // Example conversation flow
  const response1 = await character.generateResponse("Hello!");
  console.log("Response 1:", response1);

  const response2 = await character.generateResponse("How are you?");
  console.log("Response 2:", response2);
}