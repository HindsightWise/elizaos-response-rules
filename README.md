# ElizaOS Response Rules

This module implements response deduplication and similarity checking for ElizaOS character configurations.

## Configuration

The response rules are configured with two main parameters:

- `repetitionWindow`: Number of previous responses to check (default: 25)
- `similarityThreshold`: Similarity threshold for considering responses as duplicates (0.0 - 1.0, default: 0.82)

## Usage

```typescript
import { ResponseRules } from './src/responseRules';

const rules = new ResponseRules({
  repetitionWindow: 25,
  similarityThreshold: 0.82
});

// Check if a response is allowed
const newResponse = 'Hello, how can I help you?';
if (rules.isResponseAllowed(newResponse)) {
  // Send the response
  rules.addResponse(newResponse);
}
```

## Implementation Details

The response rules system:

1. Maintains a history of recent responses
2. Checks new responses against the history for similarity
3. Prevents responses that are too similar to recent ones
4. Uses string similarity comparison for duplicate detection

This helps maintain more natural conversations by avoiding repetitive responses.