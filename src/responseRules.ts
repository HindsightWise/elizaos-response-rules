import { Response } from './types';
import { JaroWinklerDistance } from 'natural';

export class ResponseRules {
  private responseHistory: Response[] = [];
  private repetitionWindow: number;
  private similarityThreshold: number;

  constructor(config: { repetitionWindow: number; similarityThreshold: number }) {
    this.repetitionWindow = config.repetitionWindow;
    this.similarityThreshold = config.similarityThreshold;
  }

  /**
   * Check if a response is allowed based on similarity rules
   */
  public isResponseAllowed(newResponse: string): boolean {
    // Trim the history to the window size
    this.responseHistory = this.responseHistory.slice(-this.repetitionWindow);

    // Check for similar responses within the window
    return !this.responseHistory.some(response => {
      const similarity = JaroWinklerDistance(response.content, newResponse, {});
      return similarity >= this.similarityThreshold;
    });
  }

  /**
   * Add a response to the history
   */
  public addResponse(response: string): void {
    this.responseHistory.push({
      content: response,
      timestamp: Date.now()
    });

    // Keep history within window size
    if (this.responseHistory.length > this.repetitionWindow) {
      this.responseHistory = this.responseHistory.slice(-this.repetitionWindow);
    }
  }

  /**
   * Clear response history
   */
  public clearHistory(): void {
    this.responseHistory = [];
  }

  /**
   * Get current configuration
   */
  public getConfig() {
    return {
      repetitionWindow: this.repetitionWindow,
      similarityThreshold: this.similarityThreshold
    };
  }

  /**
   * Get current response history
   */
  public getHistory(): Response[] {
    return [...this.responseHistory];
  }
}