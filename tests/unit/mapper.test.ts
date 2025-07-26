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
  })
})
