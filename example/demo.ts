import { ElizaCharacter } from './characterIntegration';
import winston from 'winston';
const { format, transports } = winston;

// Configure logging with structured format
const logger = winston.createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message, ...meta }) => {
            if (Object.keys(meta).length > 0) {
                return `${timestamp} [${level}]: ${message}\n${JSON.stringify(meta, null, 2)}`;
            }
            return `${timestamp} [${level}]: ${message}`;
        })
    ),
    transports: [
        new transports.Console()
    ]
});

// Demo configuration with specific parameters
const demoConfig = {
    name: "DemoAssistant",
    personality: "helpful and technical",
    settings: {
        responseRules: {
            repetitionWindow: 25,          // Number of responses to track
            similarityThreshold: 0.82      // Similarity threshold (0-1)
        },
        userPreferences: {
            verbosity: "medium",
            tone: "technical"
        }
    }
};

async function runDemo() {
    logger.info('Initializing Demo Character with Response Rules');
    const character = new ElizaCharacter(demoConfig);

    // Test conversation with intentional similarities
    const conversationFlow = [
        "Hello! Can you help me with some technical questions?",
        "What's your approach to solving complex problems?",
        "Could you explain your problem-solving methodology?",    // Similar to previous
        "What programming languages do you work with?",
        "Can you tell me about your technical expertise?",
        "What's your experience with different programming languages?" // Similar content
    ];

    logger.info('Starting conversation demonstration with similarity detection');
    
    for (const userInput of conversationFlow) {
        logger.info(`\nUser Input: ${userInput}`);
        const response = await character.generateResponse(userInput);
        logger.info(`Character Response: ${response}`);
        
        // Delay for readability
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Collect and display detailed metrics
    const metrics = character.getResponseMetrics();
    logger.info('\nResponse Processing Metrics', {
        statistics: {
            totalResponses: metrics.totalResponses,
            uniqueResponses: metrics.uniqueResponseCount,
            duplicatesDetected: metrics.duplicatesDetected,
            similarityScore: `${(metrics.averageSimilarity * 100).toFixed(1)}%`,
            processingTimeMs: metrics.metricsCollectionTime
        }
    });
}

// Execute demo with error handling
runDemo().catch(error => {
    logger.error('Demo execution failed:', { error: error.message, stack: error.stack });
    process.exit(1);
});