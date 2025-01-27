# ElizaOS Response Rules

A comprehensive response deduplication and management system for ElizaOS characters.

## Quick Start

```bash
# Clone the repository
git clone https://github.com/HindsightWise/elizaos-response-rules.git

# Install dependencies
cd elizaos-response-rules
npm install

# Build the project
npm run build

# Run the demo
npm start
```

## Features

- Response similarity detection
- Configurable similarity thresholds
- Advanced fallback strategies
- Conversation context awareness
- Response metrics tracking

## Configuration

The response rules system is configured through two main parameters:

```typescript
{
  "responseRules": {
    "repetitionWindow": 25,      // Number of previous responses to check
    "similarityThreshold": 0.82  // Similarity threshold (0.0 - 1.0)
  }
}
```

## Integration

1. Initialize the ResponseProcessor:

```typescript
import { ResponseProcessor } from 'elizaos-response-rules';

const processor = new ResponseProcessor({
  repetitionWindow: 25,
  similarityThreshold: 0.82
});
```

2. Process responses:

```typescript
const response = await processor.processResponse(
  initialResponse,
  conversationContext
);
```

## Development

- `npm run build` - Build the project
- `npm test` - Run tests
- `npm start` - Run the demo

## Project Structure

```
elizaos-response-rules/
├── src/
│   ├── responseRules.ts     - Core response rules implementation
│   ├── responseProcessor.ts - Response processing logic
│   ├── types.ts            - TypeScript type definitions
│   └── __tests__/          - Test files
├── example/
│   ├── characterIntegration.ts - Example character integration
│   └── demo.ts                 - Runnable demonstration
└── docs/
    └── integration.md          - Integration documentation
```

## Running the Demo

The demo script (`example/demo.ts`) demonstrates:
- Character response processing
- Duplicate detection
- Fallback strategies
- Response metrics

To run the demo:

```bash
npm start
```

## Testing

Run the test suite:

```bash
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License