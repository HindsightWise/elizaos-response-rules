import { ResponseRules } from './responseRules';
import { Response, ResponseRulesConfig } from './types';

export class ResponseProcessor {
    private responseManager: ResponseRules;
    private fallbackStrategies: FallbackStrategy[] = [];
    
    // Initialize metrics tracking with specific data structure
    private metrics = {
        responses: [] as string[],
        duplicateCount: 0,
        similarities: [] as number[],
        startTime: Date.now()
    };

    constructor(config: ResponseRulesConfig) {
        this.responseManager = new ResponseRules(config);
        this.initializeFallbackStrategies();
    }

    public async processResponse(response: string, context?: ConversationContext): Promise<string> {
        // Track response
        this.metrics.responses.push(response);
        
        // Calculate similarity with previous responses
        if (this.metrics.responses.length > 1) {
            const prevResponse = this.metrics.responses[this.metrics.responses.length - 2];
            const similarity = this.calculateSimilarity(prevResponse, response);
            this.metrics.similarities.push(similarity);
            
            // If similarity exceeds threshold, count as duplicate
            if (similarity > this.responseManager.getConfig().similarityThreshold) {
                this.metrics.duplicateCount++;
            }
        }
        
        // Process through response rules
        if (this.responseManager.isResponseAllowed(response)) {
            this.responseManager.addResponse(response);
            return response;
        }

        return await this.handleDuplicateResponse(response, context);
    }

    private calculateSimilarity(str1: string, str2: string): number {
        // Implement Jaro-Winkler similarity
        let matches = 0;
        let transpositions = 0;
        
        // Calculate matching characters
        const range = Math.floor(Math.max(str1.length, str2.length) / 2) - 1;
        const matchFlags1 = new Array(str1.length).fill(false);
        const matchFlags2 = new Array(str2.length).fill(false);
        
        for (let i = 0; i < str1.length; i++) {
            const start = Math.max(0, i - range);
            const end = Math.min(i + range + 1, str2.length);
            
            for (let j = start; j < end; j++) {
                if (!matchFlags2[j] && str1[i] === str2[j]) {
                    matchFlags1[i] = matchFlags2[j] = true;
                    matches++;
                    break;
                }
            }
        }
        
        if (matches === 0) return 0;
        
        // Calculate transpositions
        let k = 0;
        for (let i = 0; i < str1.length; i++) {
            if (matchFlags1[i]) {
                while (!matchFlags2[k]) k++;
                if (str1[i] !== str2[k]) transpositions++;
                k++;
            }
        }
        
        // Jaro similarity
        const similarity = (
            matches / str1.length +
            matches / str2.length +
            (matches - transpositions/2) / matches
        ) / 3;
        
        return similarity;
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

    public getMetrics(): MetricsReport {
        const avgSimilarity = this.metrics.similarities.length > 0
            ? this.metrics.similarities.reduce((a, b) => a + b, 0) / this.metrics.similarities.length
            : 0;

        return {
            totalResponses: this.metrics.responses.length,
            duplicatesDetected: this.metrics.duplicateCount,
            averageSimilarity: avgSimilarity,
            metricsCollectionTime: Date.now() - this.metrics.startTime,
            uniqueResponseCount: new Set(this.metrics.responses).size
        };
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

interface MetricsReport {
    totalResponses: number;
    duplicatesDetected: number;
    averageSimilarity: number;
    metricsCollectionTime: number;
    uniqueResponseCount: number;
}