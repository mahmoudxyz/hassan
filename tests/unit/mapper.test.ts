import { createMapper } from '../../src/index'

describe('Hassan Data Mapper - Core Mapper Logic', () => {
  describe('Basic Property Mapping', () => {
    it('should create a mapper with basic property mapping', () => {
      const mapper = createMapper({
        map: {
          id: 'user_id',
          email: 'email_address',
          active: 'is_active',
        },
      })

      expect(mapper).toBeDefined()
      expect(typeof mapper.map).toBe('function')
    })

    it('should map basic properties correctly', () => {
      const mapper = createMapper({
        map: {
          id: 'user_id',
          email: 'email_address',
          active: 'is_active',
          cool: 'cool',
        },
      })

      const source = {
        user_id: 123,
        email_address: 'test@example.com',
        is_active: true,
      }

      const result = mapper.map(source)

      expect(result).toEqual({
        id: 123,
        email: 'test@example.com',
        active: true,
      })
    })
  })
})
