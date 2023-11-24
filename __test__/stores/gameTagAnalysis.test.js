import { it, describe, expect, vi, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGameTagAnalysis } from '@/stores/gameTagAnalysis.js'

describe('useSystemStore', () => {
  const date = new Date(2000, 1, 1, 13)

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
    vi.setSystemTime(date)
  })

  afterEach(() => {
    // restoring date after each test run
    vi.useRealTimers()
  })

  it('initializes with correct values', () => {
    const gameTagAnalysisStore = useGameTagAnalysis()

    // Assert initial values
    expect(gameTagAnalysisStore.filterFormData.date).toStrictEqual('')
    expect(gameTagAnalysisStore.filterFormData.searchTag).toStrictEqual('')
    expect(gameTagAnalysisStore.filterFormData.excludeTag).toStrictEqual('')
    expect(gameTagAnalysisStore.filterTimestamp).toStrictEqual(date.getTime())
  })

  it('updates state when mutated', () => {
    const gameTagAnalysisStore = useGameTagAnalysis()

    // Mutate state
    gameTagAnalysisStore.filterFormData.date = '2023-01-01'
    gameTagAnalysisStore.filterFormData.searchTag = 'someSearchTag'
    gameTagAnalysisStore.filterFormData.excludeTag = 'someExcludeTag'
    gameTagAnalysisStore.filterTimestamp = 1625435

    // Assert mutated values
    expect(gameTagAnalysisStore.filterFormData.date).toStrictEqual('2023-01-01')
    expect(gameTagAnalysisStore.filterFormData.searchTag).toStrictEqual('someSearchTag')
    expect(gameTagAnalysisStore.filterFormData.excludeTag).toStrictEqual('someExcludeTag')
    expect(gameTagAnalysisStore.filterTimestamp).toStrictEqual(1625435)
  })
})
