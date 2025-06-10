import { it, describe, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useRegisteredNoDepositAnalysisStore } from '@/stores/registeredNoDepositAnalysis.js'

describe('useRegisteredNoDepositAnalysisStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with correct values', () => {
    const store = useRegisteredNoDepositAnalysisStore()

    expect(store.selectDepositValue).toBe('all')
    expect(store.slideVlaue).toStrictEqual([0, 10])
    expect(store.ipDuplicateRange).toBe('0;10')
  })
})
