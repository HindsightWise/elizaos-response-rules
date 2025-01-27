# Integrating Response Rules with ElizaOS Characters

This guide explains how to integrate the response rules system with your ElizaOS character configurations to prevent repetitive or overly similar responses.

## Configuration

In your character configuration file, add the responseRules section:

```json
{
  "name": "Your Character",
  "version": "1.0.0",
  "settings": {
    "responseRules": {
      "repetitionWindow": 25,      // Number of previous responses to check
      "similarityThreshold": 0.82  // Threshold for similar responses (0.0 - 1.0)
    }
  }
}
```

## Implementation

1. Initialize the response rules manager:

```typescript
import { ResponseRules } from 'elizaos-response-rules';

const responseManager = new ResponseRules({
  repetitionWindow: 25,
  similarityThreshold: 0.82
});
```

2. Before sending responses, check if they're allowed:

```typescript
function processResponse(response: string): boolean {
  if (responseManager.isResponseAllowed(response)) {
    responseManager.addResponse(response);
    return true;
  }
  return false;
}
```

## Fine-tuning

### Repetition Window

The `repetitionWindow` parameter controls how many previous responses to check. A larger window provides better detection of repetition but requires more memory.

- Default: 25 responses
- Recommended range: 10-50
- Adjust based on your character's conversation style

### Similarity Threshold

The `similarityThreshold` parameter determines how similar responses must be to trigger the duplicate detection.

- Range: 0.0 - 1.0
- Default: 0.82
- Higher values (e.g., 0.9) allow more similar responses
- Lower values (e.g., 0.7) are more strict about uniqueness

## Example Usage

```typescript
import { ResponseRules } from 'elizaos-response-rules';

// Initialize with custom settings
const responseRules = new ResponseRules({
  repetitionWindow: 30,
  similarityThreshold: 0.85
});

// Check and process responses
function handleResponse(response: string): void {
  if (responseRules.isResponseAllowed(response)) {
    // Send the response
    responseRules.addResponse(response);
  } else {
    // Generate alternative response
    generateAlternativeResponse();
  }
}
```

## Best Practices

1. Clear the response history periodically for long-running conversations
2. Adjust thresholds based on your character's personality
3. Monitor and tune settings based on user feedback
4. Consider implementing fallback responses when duplicates are detected