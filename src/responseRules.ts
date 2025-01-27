import { Response } from './types';
import { compareTwoStrings } from 'string-similarity';

export class ResponseRules {
  private responseHistory: Response[] = [];
  private repetitionWindow: number;
  private similarityThreshold: number;

  constructor(config: { repetitionWindow: number; similarityThreshold: number }) {
    this.repetitionWindow = config.repetitionWindow;
    this.similarityThreshold = config.similarityThreshold;
  }

  public isResponseAllowed(newResponse: string): boolean {
    // Trim the history to the window size
    this.responseHistory = this.responseHistory.slice(-this.repetitionWindow);

    // Check for similar responses within the window
    return !this.responseHistory.some(response => {
      const similarity = compareTwoStrings(response.content, newResponse);
      return similarity >= this.similarityThreshold;
    });
  }

  public addResponse(response: string): void {
    this.responseHistory.push({
      content: response,
      timestamp: Date.now()
    });
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
}