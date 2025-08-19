import { describe, it, expect } from 'vitest';
import {
  formatarData,
  parseLocalDate,
  parseLocalHour,
  formatarDistanciaLegivel,
  intervaloJogo,
} from '@/utils/aluguelUtils';

describe('aluguelUtils', () => {
  it('formatarData - retorna vazio para null/undefined', () => {
    expect(formatarData(null as any)).toBe('');
    expect(formatarData(undefined as any)).toBe('');
  });

  it('formatarData - formata Date para yyyy-mm-dd', () => {
    const d = new Date('2025-08-15T12:34:56Z');
    expect(formatarData(d)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('parseLocalDate - parse yyyy-mm-dd', () => {
    const d = parseLocalDate('2025-08-01');
    expect(d.getFullYear()).toBe(2025);
    expect(d.getMonth()).toBe(7); // zero-based
    expect(d.getDate()).toBe(1);
  });

  it('parseLocalHour - normaliza HH:mm', () => {
    expect(parseLocalHour('7:5')).toBe('07:05');
    expect(parseLocalHour('09:30')).toBe('09:30');
  });

  it('formatarDistanciaLegivel - lida com metros e km', () => {
    expect(formatarDistanciaLegivel(12)).toBe('0.012 mts');
    expect(formatarDistanciaLegivel(1000)).toBe('1 km');
    expect(formatarDistanciaLegivel(1325)).toBe('1 km e 325 mts');
  });

  it('intervaloJogo - lança se jogos > 100', () => {
    expect(() => intervaloJogo(101)).toThrow();
    expect(intervaloJogo(100)).toBe(100);
  });
});
