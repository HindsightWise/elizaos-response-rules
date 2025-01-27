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

  public calculateSimilarity(newResponse: string): number {
    if (this.responseHistory.length === 0) {
      return 0;
    }

    // Get most recent response
    const lastResponse = this.responseHistory[this.responseHistory.length - 1];
    return JaroWinklerDistance(lastResponse.content, newResponse, {});
  }

  public isResponseAllowed(newResponse: string): boolean {
    this.responseHistory = this.responseHistory.slice(-this.repetitionWindow);

    return !this.responseHistory.some(response => {
      const similarity = JaroWinklerDistance(response.content, newResponse, {});
      return similarity >= this.similarityThreshold;
    });
  }

  public addResponse(response: string): void {
    this.responseHistory.push({
      content: response,
      timestamp: Date.now()
    });

    if (this.responseHistory.length > this.repetitionWindow) {
      this.responseHistory = this.responseHistory.slice(-this.repetitionWindow);
    }
  }

  public clearHistory(): void {
    this.responseHistory = [];
  }

  public getConfig() {
    return {
      repetitionWindow: this.repetitionWindow,
      similarityThreshold: this.similarityThreshold
    };
  }

  public getHistory(): Response[] {
    return [...this.responseHistory];
  }
}