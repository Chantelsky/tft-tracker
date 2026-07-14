import { describe, it, expect } from 'vitest'
import { formatStageRound, winRate, costBorderClass } from './tft'

it('formats round 37 as stage 6-5', () => {
  expect(formatStageRound(37)).toBe('6-5')
})

it('formats round 1 as stage 1-1', () => {
  expect(formatStageRound(1)).toBe('1-1')
})

it('formats round 4 as stage 1-4', () => {
  expect(formatStageRound(4)).toBe('1-4')
})

it('formats round 5 as stage 2-1', () => {
  expect(formatStageRound(5)).toBe('2-1')
})

it('calculates win rate for a normal case', () => {
  expect(winRate({ wins: 3, losses: 2 })).toBe(60)
})

it('returns 0 win rate when no games played', () => {
  expect(winRate({ wins: 0, losses: 0 })).toBe(0)
})

it('rounds win rate correctly', () => {
  expect(winRate({ wins: 1, losses: 3 })).toBe(25)
})

it('returns correct border class for rarity', () => {
  expect(costBorderClass(0)).toBe('border-gray-400')
  expect(costBorderClass(1)).toBe('border-green-400')
  expect(costBorderClass(2)).toBe('border-blue-400')
  expect(costBorderClass(4)).toBe('border-purple-400')
  expect(costBorderClass(6)).toBe('border-yellow-400')
  expect(costBorderClass(99)).toBe('border-border')
})
