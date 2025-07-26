import { createMapper, h } from '../../src/core/mapper'

describe('Dynamic Mapper', () => {
  describe('Basic property mapping', () => {
    test('should map simple properties', () => {
      const mapper = createMapper({
        name: 'firstName',
        email: 'userEmail',
      })

      const input = {
        firstName: 'John',
        userEmail: 'john@example.com',
        age: 30,
      }
      const result = mapper.map(input)

      expect(result).toEqual({
        name: 'John',
        email: 'john@example.com',
      })
    })

    test('should handle missing properties', () => {
      const mapper = createMapper({
        name: 'firstName',
        missing: 'nonExistent',
      })

      const input = { firstName: 'John' }
      const result = mapper.map(input)

      expect(result).toEqual({
        name: 'John',
      })
    })

    test('should handle non-object input', () => {
      const mapper = createMapper({ name: 'firstName' })

      expect(mapper.map('string')).toBe('string')
      expect(mapper.map(123)).toBe(123)
      expect(mapper.map(null)).toBe(null)
      expect(mapper.map([])).toEqual([])
    })
  })

  describe('Direct values', () => {
    test('should handle direct values', () => {
      const mapper = createMapper({
        constant: h.direct('CONSTANT_VALUE'),
        number: h.direct(42),
        boolean: h.direct(true),
      })

      const input = { firstName: 'John' }
      const result = mapper.map(input)

      expect(result).toEqual({
        constant: 'CONSTANT_VALUE',
        number: 42,
        boolean: true,
      })
    })
  })

  describe('Transform functions', () => {
    test('should apply transformation functions', () => {
      const mapper = createMapper({
        fullName: source => `${source.firstName} ${source.lastName}`,
        age: source => new Date().getFullYear() - (source.birthYear as number),
        upperEmail: source => (source.email as string).toUpperCase(),
      })

      const input = {
        firstName: 'John',
        lastName: 'Doe',
        birthYear: 1990,
        email: 'john@example.com',
      }
      const result = mapper.map(input)

      expect(result.fullName).toBe('John Doe')
      expect(result.age).toBe(new Date().getFullYear() - 1990)
      expect(result.upperEmail).toBe('JOHN@EXAMPLE.COM')
    })

    test('should handle complex transformations', () => {
      const mapper = createMapper({
        discount: source => {
          const isPremium = source.isPremium as boolean
          const orderValue = source.orderValue as number

          if (isPremium && orderValue > 100) {
            return orderValue * 0.1
          }
          return 0
        },
      })

      const premiumInput = { isPremium: true, orderValue: 150 }
      const regularInput = { isPremium: false, orderValue: 150 }
      const lowValueInput = { isPremium: true, orderValue: 50 }

      expect(mapper.map(premiumInput)).toEqual({ discount: 15 })
      expect(mapper.map(regularInput)).toEqual({ discount: 0 })
      expect(mapper.map(lowValueInput)).toEqual({ discount: 0 })
    })
  })

  describe('Conditional logic', () => {
    test('should handle conditional mappings with then/else', () => {
      const mapper = createMapper({
        status: h.when(
          source => source.isActive as boolean,
          h.direct('ACTIVE'),
          h.direct('INACTIVE')
        ),
      })

      const activeInput = { isActive: true }
      const inactiveInput = { isActive: false }

      expect(mapper.map(activeInput)).toEqual({ status: 'ACTIVE' })
      expect(mapper.map(inactiveInput)).toEqual({ status: 'INACTIVE' })
    })

    test('should handle conditional mappings without else clause', () => {
      const mapper = createMapper({
        bonus: h.when(source => (source.score as number) > 90, h.direct(100)),
      })

      const highScoreInput = { score: 95 }
      const lowScoreInput = { score: 80 }

      expect(mapper.map(highScoreInput)).toEqual({ bonus: 100 })
      expect(mapper.map(lowScoreInput)).toEqual({})
    })

    test('should handle conditional mappings with functions', () => {
      const mapper = createMapper({
        grade: h.when(
          source => (source.score as number) >= 90,
          () => 'A',
          source => ((source.score as number) >= 80 ? 'B' : 'C')
        ),
      })

      expect(mapper.map({ score: 95 })).toEqual({ grade: 'A' })
      expect(mapper.map({ score: 85 })).toEqual({ grade: 'B' })
      expect(mapper.map({ score: 75 })).toEqual({ grade: 'C' })
    })

    test('should handle conditional mappings with property references', () => {
      const mapper = createMapper({
        displayName: h.when(
          source => source.nickname as boolean,
          'nickname',
          'firstName'
        ),
      })

      const withNickname = { nickname: 'Johnny', firstName: 'John' }
      const withoutNickname = { firstName: 'John' }

      expect(mapper.map(withNickname)).toEqual({ displayName: 'Johnny' })
      expect(mapper.map(withoutNickname)).toEqual({ displayName: 'John' })
    })
  })

  describe('Nested object support', () => {
    test('should handle nested source properties', () => {
      const mapper = createMapper({
        city: 'address.city',
        street: 'address.street',
        country: 'address.location.country',
      })

      const input = {
        name: 'John',
        address: {
          city: 'New York',
          street: '123 Main St',
          location: {
            country: 'USA',
          },
        },
      }

      const result = mapper.map(input)
      expect(result).toEqual({
        city: 'New York',
        street: '123 Main St',
        country: 'USA',
      })
    })

    test('should handle nested target properties', () => {
      const mapper = createMapper({
        'user.name': 'firstName',
        'user.profile.email': 'email',
        'user.settings.theme': h.direct('dark'),
      })

      const input = { firstName: 'John', email: 'john@example.com' }
      const result = mapper.map(input)

      expect(result).toEqual({
        user: {
          name: 'John',
          profile: {
            email: 'john@example.com',
          },
          settings: {
            theme: 'dark',
          },
        },
      })
    })

    test('should handle missing nested properties gracefully', () => {
      const mapper = createMapper({
        city: 'address.city',
        missing: 'address.missing.deeply.nested',
      })

      const input = { name: 'John' }
      const result = mapper.map(input)

      expect(result).toEqual({})
    })
  })

  describe('Context-aware transformations', () => {
    test('should pass context to transformation functions', () => {
      const mapper = createMapper({
        greeting: (source, context) =>
          `Hello ${source.name}, today is ${context?.date}`,
        userLevel: (source, context) => {
          const user = context?.currentUser as { isAdmin: boolean }
          return user?.isAdmin ? 'admin' : 'user'
        },
      })

      const input = { name: 'John' }
      const context = {
        date: '2024-01-15',
        currentUser: { isAdmin: true },
      }

      const result = mapper.map(input, context)
      expect(result).toEqual({
        greeting: 'Hello John, today is 2024-01-15',
        userLevel: 'admin',
      })
    })

    test('should pass context to conditional mappings', () => {
      const mapper = createMapper({
        accessLevel: h.when(
          (source, context) => {
            const user = context?.currentUser as { role: string }
            return user?.role === 'admin'
          },
          h.direct('FULL_ACCESS'),
          h.direct('LIMITED_ACCESS')
        ),
      })

      const input = { name: 'John' }
      const adminContext = { currentUser: { role: 'admin' } }
      const userContext = { currentUser: { role: 'user' } }

      expect(mapper.map(input, adminContext)).toEqual({
        accessLevel: 'FULL_ACCESS',
      })
      expect(mapper.map(input, userContext)).toEqual({
        accessLevel: 'LIMITED_ACCESS',
      })
    })

    test('should work without context', () => {
      const mapper = createMapper({
        name: 'firstName',
        contextAware: (source, context) =>
          context ? 'has context' : 'no context',
      })

      const input = { firstName: 'John' }

      expect(mapper.map(input)).toEqual({
        name: 'John',
        contextAware: 'no context',
      })

      expect(mapper.map(input, { some: 'context' })).toEqual({
        name: 'John',
        contextAware: 'has context',
      })
    })
  })

  describe('Complex combinations', () => {
    test('should handle complex combinations of all features', () => {
      const mapper = createMapper({
        id: 'userId',

        version: h.direct('1.0'),

        fullName: source => `${source.firstName} ${source.lastName}`,

        country: 'address.country',

        'profile.displayName': source =>
          (source.firstName as string).toUpperCase(),

        'permissions.canEdit': h.when(
          (source, context) => {
            const user = context?.currentUser as { id: number }
            return user?.id === (source.userId as number)
          },
          h.direct(true),
          h.direct(false)
        ),

        'status.level': h.when(
          source => source.profile?.premium as boolean,
          source => source.profile?.tier || 'gold',
          h.direct('basic')
        ),
      })

      const input = {
        userId: 123,
        firstName: 'John',
        lastName: 'Doe',
        address: { country: 'USA' },
        profile: { premium: true, tier: 'platinum' },
      }

      const context = { currentUser: { id: 123 } }
      const result = mapper.map(input, context)

      expect(result).toEqual({
        id: 123,
        version: '1.0',
        fullName: 'John Doe',
        country: 'USA',
        profile: {
          displayName: 'JOHN',
        },
        permissions: {
          canEdit: true,
        },
        status: {
          level: 'platinum',
        },
      })
    })
  })
})
