import { describe, it, expect } from 'vitest'
import { converterTimestampParaDate, formatarDataHoraCompletaComHoraStr, formatarDataSimples } from '@/utils/firebaseDate'

describe('firebaseDate utils', () => {
  it('converterTimestampParaDate - handles null/undefined and invalid', () => {
    expect(converterTimestampParaDate(null)).toBeNull()
    // @ts-expect-error testing runtime guard
    expect(converterTimestampParaDate({})).toBeNull()
  })

  it('converterTimestampParaDate - converts seconds to Date', () => {
    const d = converterTimestampParaDate({ seconds: 1723612345, nanoseconds: 0 })
    expect(d).toBeInstanceOf(Date)
  })

  it('formatarDataHoraCompletaComHoraStr - returns mensagem for null data', () => {
    expect(formatarDataHoraCompletaComHoraStr(null, '08:00')).toBe('Data inválida')
  })

  it('formatarDataSimples - returns mensagem for null data', () => {
    expect(formatarDataSimples(null)).toBe('Data inválida')
  })
})
