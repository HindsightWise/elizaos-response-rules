import { ResponseRules } from '../responseRules';

describe('ResponseRules', () => {
  let responseRules: ResponseRules;

  beforeEach(() => {
    responseRules = new ResponseRules({
      repetitionWindow: 3,
      similarityThreshold: 0.8
    });
  });

  test('should allow unique responses', () => {
    expect(responseRules.isResponseAllowed('Hello')).toBe(true);
    responseRules.addResponse('Hello');

    expect(responseRules.isResponseAllowed('How are you?')).toBe(true);
    responseRules.addResponse('How are you?');
  });

  test('should reject similar responses', () => {
    responseRules.addResponse('Hello there!');
    expect(responseRules.isResponseAllowed('Hello there')).toBe(false);
  });

  test('should maintain window size', () => {
    responseRules.addResponse('One');
    responseRules.addResponse('Two');
    responseRules.addResponse('Three');
    responseRules.addResponse('Four');

    // Should allow a response similar to 'One' since it's outside the window
    expect(responseRules.isResponseAllowed('One')).toBe(true);
  });

  test('should clear history', () => {
    responseRules.addResponse('Test response');
    responseRules.clearHistory();
    expect(responseRules.isResponseAllowed('Test response')).toBe(true);
  });

  test('should return correct config', () => {
    const config = responseRules.getConfig();
    expect(config).toEqual({
      repetitionWindow: 3,
      similarityThreshold: 0.8
    });
  });
});