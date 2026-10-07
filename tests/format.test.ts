import { describe, expect, it } from 'vitest';
import { formatDaysHours, formatKm, traitToBlocks } from '../src/utils/format';

describe('formatKm', () => {
  it('gebruikt een komma', () => {
    expect(formatKm(38.7)).toBe('38,7 km');
    expect(formatKm(0)).toBe('0,0 km');
  });
});

describe('formatDaysHours', () => {
  it('zet uren om in dagen en uren', () => {
    expect(formatDaysHours(166)).toBe('6 d 22 u');
    expect(formatDaysHours(5)).toBe('0 d 5 u');
  });
});

describe('traitToBlocks', () => {
  it('zet 0–100 om naar 0–8 blokjes', () => {
    expect(traitToBlocks(0)).toBe(0);
    expect(traitToBlocks(1)).toBe(1);
    expect(traitToBlocks(50)).toBe(4);
    expect(traitToBlocks(100)).toBe(8);
    expect(traitToBlocks(150)).toBe(8);
  });
});
