import { ElizaCharacter } from './characterIntegration';
import { createLogger } from 'winston';

// Configure logging
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new transports.Console()
  ]
});

// Demo character configuration
const demoConfig = {
  name: "DemoAssistant",
  personality: "helpful and technical",
  settings: {
    responseRules: {
      repetitionWindow: 25,
      similarityThreshold: 0.82
    },
    userPreferences: {
      verbosity: "medium",
      tone: "technical"
    }
  }
};

async function runDemo() {
  logger.info('Initializing Demo Character...');
  const character = new ElizaCharacter(demoConfig);

  // Demonstration conversation flow
  const conversationFlow = [
    "Hello! Can you help me with some technical questions?",
    "What's your approach to solving complex problems?",
    "Could you explain your problem-solving methodology?", // Similar to previous question
    "What programming languages do you work with?",
    "Can you tell me about your technical expertise?",
    "What's your experience with different programming languages?" // Similar to previous questions
  ];

  logger.info('Starting conversation demonstration...');
  
  for (const userInput of conversationFlow) {
    logger.info(`User Input: ${userInput}`);
    const response = await character.generateResponse(userInput);
    logger.info(`Character Response: ${response}\n`);
    
    // Add delay between responses for readability
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Display response metrics
  const metrics = character.getResponseMetrics();
  logger.info('Response Metrics:', metrics);
}

// Run the demo
runDemo().catch(error => {
  logger.error('Error running demo:', error);
  process.exit(1);
});