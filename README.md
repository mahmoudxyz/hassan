# Hassan

[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
[![npm version](https://badge.fury.io/js/hassan.svg)](https://badge.fury.io/js/hassan)

> Type-safe data mapper for TypeScript with zero runtime overhead

## Quick Start

```bash
npm install hassan
```

```typescript
import { createMapper, h } from 'hassan'

// Simple property mapping
const userMapper = createMapper({
  name: 'firstName',
  email: 'userEmail',
})

const input = {
  firstName: 'John',
  userEmail: 'john@example.com',
  age: 30,
}

const result = userMapper.map(input)
// { name: 'John', email: 'john@example.com' }
```

## Features

- ✅ **100% Type Safe** - Complete TypeScript type inference
- ✅ **Zero Runtime Overhead** - Optimized mapping functions
- ✅ **TDD Driven** - Built with comprehensive test coverage
- ✅ **Simple API** - Intuitive and discoverable interface
- ✅ **Nested Objects** - Deep property mapping support
- ✅ **Conditional Logic** - Context-aware transformations
- ✅ **Transform Functions** - Custom data transformations

## Usage Examples

### Basic Property Mapping

```typescript
const mapper = createMapper({
  name: 'firstName',
  email: 'userEmail',
})

mapper.map({ firstName: 'John', userEmail: 'john@example.com' })
// { name: 'John', email: 'john@example.com' }
```

### Direct Values

```typescript
const mapper = createMapper({
  version: h.direct('1.0'),
  isActive: h.direct(true),
  count: h.direct(42),
})

mapper.map({})
// { version: '1.0', isActive: true, count: 42 }
```

### Transform Functions

```typescript
const mapper = createMapper({
  fullName: source => `${source.firstName} ${source.lastName}`,
  age: source => new Date().getFullYear() - source.birthYear,
  upperEmail: source => source.email.toUpperCase(),
})

const input = {
  firstName: 'John',
  lastName: 'Doe',
  birthYear: 1990,
  email: 'john@example.com',
}

mapper.map(input)
// {
//   fullName: 'John Doe',
//   age: 34,
//   upperEmail: 'JOHN@EXAMPLE.COM'
// }
```

### Conditional Logic

```typescript
const mapper = createMapper({
  status: h.when(
    source => source.isActive,
    h.direct('ACTIVE'),
    h.direct('INACTIVE')
  ),

  grade: h.when(
    source => source.score >= 90,
    () => 'A',
    source => (source.score >= 80 ? 'B' : 'C')
  ),
})

mapper.map({ isActive: true, score: 95 })
// { status: 'ACTIVE', grade: 'A' }
```

### Nested Objects

```typescript
// Source nesting
const mapper = createMapper({
  city: 'address.city',
  country: 'address.location.country',
})

// Target nesting
const mapper = createMapper({
  'user.name': 'firstName',
  'user.profile.email': 'email',
  'user.settings.theme': h.direct('dark'),
})

const input = { firstName: 'John', email: 'john@example.com' }
mapper.map(input)
// {
//   user: {
//     name: 'John',
//     profile: { email: 'john@example.com' },
//     settings: { theme: 'dark' }
//   }
// }
```

### Context-Aware Transformations

```typescript
const mapper = createMapper({
  greeting: (source, context) =>
    `Hello ${source.name}, today is ${context?.date}`,

  accessLevel: h.when(
    (source, context) => context?.currentUser?.role === 'admin',
    h.direct('FULL_ACCESS'),
    h.direct('LIMITED_ACCESS')
  ),
})

const input = { name: 'John' }
const context = {
  date: '2024-01-15',
  currentUser: { role: 'admin' },
}

mapper.map(input, context)
// {
//   greeting: 'Hello John, today is 2024-01-15',
//   accessLevel: 'FULL_ACCESS'
// }
```

### Complex Real-World Example

```typescript
const userMapper = createMapper({
  // Simple mapping
  id: 'userId',

  // Direct values
  version: h.direct('1.0'),

  // Transformations
  fullName: source => `${source.firstName} ${source.lastName}`,

  // Nested source
  country: 'address.country',

  // Nested target
  'profile.displayName': source => source.firstName.toUpperCase(),

  // Context-aware conditionals
  'permissions.canEdit': h.when(
    (source, context) => context?.currentUser?.id === source.userId,
    h.direct(true),
    h.direct(false)
  ),

  // Complex conditional logic
  'status.level': h.when(
    source => source.profile?.premium,
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

userMapper.map(input, context)
// {
//   id: 123,
//   version: '1.0',
//   fullName: 'John Doe',
//   country: 'USA',
//   profile: { displayName: 'JOHN' },
//   permissions: { canEdit: true },
//   status: { level: 'platinum' }
// }
```

## API Reference

### `createMapper(mappingConfig)`

Creates a new mapper instance with the given configuration.

### `h.direct(value)`

Maps to a direct/constant value.

### `h.when(condition, thenValue, elseValue?)`

Conditional mapping based on a predicate function.

- `condition`: `(source, context?) => boolean`
- `thenValue`: Value or function to use when condition is true
- `elseValue`: Optional value or function to use when condition is false

### Transform Functions

Use functions for custom transformations:

```typescript
;(source, context?) => any
```

## Development

This project follows Test-Driven Development (TDD) practices.

### Setup

```bash
git clone https://github.com/mahmoudxyz/hassan.git
cd hassan
npm install
```

### Available Scripts

```bash
npm test              # Run tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage
npm run build         # Build the library
npm run lint          # Lint code
npm run format        # Format code
npm run type-check    # Type check without emit
```

### TDD Workflow

1. Write a failing test (Red)
2. Write minimal code to make it pass (Green)
3. Refactor while keeping tests green (Refactor)

## License

MIT © Mahmoud Ahmed

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/mahmoudxyz"><img src="https://avatars.githubusercontent.com/u/100426555?v=4?s=100" width="100px;" alt="Mahmoud Ahmed"/><br /><sub><b>Mahmoud Ahmed</b></sub></a><br /><a href="https://github.com/mahmoudxyz/hassan/commits?author=mahmoudxyz" title="Code">💻</a> <a href="https://github.com/mahmoudxyz/hassan/commits?author=mahmoudxyz" title="Documentation">📖</a> <a href="https://github.com/mahmoudxyz/hassan/commits?author=mahmoudxyz" title="Tests">⚠️</a></td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td align="center" size="13px" colspan="7">
        <img src="https://raw.githubusercontent.com/all-contributors/all-contributors-cli/1b8533af435da9854653492b1327a23a4dbd0a10/assets/logo-small.svg">
          <a href="https://all-contributors.js.org/docs/en/bot/usage">Add your contributions</a>
        </img>
      </td>
    </tr>
  </tfoot>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
