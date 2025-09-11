import { describe, it, expect } from 'vitest';

describe('CI test', () => {
  it('should pass', () => {
    expect(2 + 2).toBe(4);
  });
});