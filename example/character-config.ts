import { ResponseRules } from '../src';

// Example character configuration demonstrating response rules integration
export const characterConfig = {
  name: "Assistant",
  version: "1.0.0",
  description: "An AI assistant with response deduplication",
  settings: {
    personality: {
      traits: ["helpful", "friendly", "professional"]
    },
    // Response rules configuration
    responseRules: {
      repetitionWindow: 25,      // Number of previous responses to check
      similarityThreshold: 0.82  // Threshold for considering responses as duplicates (0.0 - 1.0)
    }
  },
  responseManager: new ResponseRules({
    repetitionWindow: 25,
    similarityThreshold: 0.82
  })
};

// Example usage demonstrating response deduplication
function processResponse(response: string): boolean {
  const { responseManager } = characterConfig;
  
  // Check if response is allowed (not too similar to recent responses)
  if (responseManager.isResponseAllowed(response)) {
    // Add response to history and proceed with sending it
    responseManager.addResponse(response);
    return true;
  }
  
  // Response was too similar to a recent one
  return false;
}