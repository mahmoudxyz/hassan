## [1.1.3](https://github.com/mahmoudxyz/hassan/compare/v1.1.2...v1.1.3) (2025-07-26)

### 🐛 Bug Fixes

* **ci:** resolve duplicate GitHub release assets conflict ([9b6bbe0](https://github.com/mahmoudxyz/hassan/commit/9b6bbe0d903694ae9e0e7b76bca685143d836e42))

## [1.1.2](https://github.com/mahmoudxyz/hassan/compare/v1.1.1...v1.1.2) (2025-07-26)

### 🐛 Bug Fixes

* make scoped package public for npm publishing ([7d147e6](https://github.com/mahmoudxyz/hassan/commit/7d147e6e216742509b4571fe8f77a925363f43b3))

## [1.1.1](https://github.com/mahmoudxyz/hassan/compare/v1.1.0...v1.1.1) (2025-07-26)

### 🐛 Bug Fixes

* update package name to scoped @mahmoudxyz/hassan ([8002c0f](https://github.com/mahmoudxyz/hassan/commit/8002c0fb7631b6131703db3ccff29f095654d4f9))
* update package name to scoped @mahmoudxyz/hassan ([376f2fa](https://github.com/mahmoudxyz/hassan/commit/376f2fa404407518a5a20066c7e7ecd9a80e0150))

## [1.1.0](https://github.com/mahmoudxyz/hassan/compare/v1.0.0...v1.1.0) (2025-07-26)

### 🚀 Features

* add new feature to test semantic-release ([6f29828](https://github.com/mahmoudxyz/hassan/commit/6f298286a2d8d3a15b31e67eacdd09cb58610313))

## 1.0.0 (2025-07-26)

### ⚠ BREAKING CHANGES

* **mapper:** `MapperConfig` interface removed.
`createMapper` now accepts mappings directly.

### 🚀 Features

* **mapper:** implement adding direct basic value with the mapped values ([2b0bbeb](https://github.com/mahmoudxyz/hassan/commit/2b0bbeba2c2bafb30921089368d7ac3ff7843060))
* **mapper:** implement createMapper to map basic properties correctly ([c1b7a3c](https://github.com/mahmoudxyz/hassan/commit/c1b7a3c9bcbbf5bcd7b515e722da045cf8cddacc))
* **mapper:** implement createMapper to return a mapper instance ([d048e5d](https://github.com/mahmoudxyz/hassan/commit/d048e5d30bff93237960bc1f10221c2274b22443))
* **mapper:** implement dynamic mapper with advanced transformation features ([abd1958](https://github.com/mahmoudxyz/hassan/commit/abd1958824449537d84cb7fa567131f4876f7cfd))

### 🐛 Bug Fixes

* **eslint:** remove `project` property from parserOptions to resolve parsing issue ([bf763d3](https://github.com/mahmoudxyz/hassan/commit/bf763d3a5980502e95bae8cee72b05f9af08d35f))

### ♻️ Code Refactoring

* **mapper:** enhance createMapper with property mapping and validation ([786eb42](https://github.com/mahmoudxyz/hassan/commit/786eb428670f7c6cc4518215a663ac13f16a2d8d))

### ✅ Tests

* **jest:** add setup file with export and lifecycle hooks ([17d529b](https://github.com/mahmoudxyz/hassan/commit/17d529baadefe677b83312c63b02132c0ef05ce5))
* **mapper:** add TDD test for adding direct basic value with the mapped values, not from the source ([66f7ff5](https://github.com/mahmoudxyz/hassan/commit/66f7ff5c59c865efa7d59cb838fdee0dcc742de8))
* **mapper:** add TDD test for basic property mapping in core mapper logic ([5cc941f](https://github.com/mahmoudxyz/hassan/commit/5cc941f637187d1ed06d65357821b5cdba1eb608))
* **mapper:** add TDD test for mapping basic properties correctly ([7accb9e](https://github.com/mahmoudxyz/hassan/commit/7accb9e8a7873f1f366a6aebe1fabb1caa8e0535))
* **mapper:** add test for injecting object directly outside the source ([4f6fd00](https://github.com/mahmoudxyz/hassan/commit/4f6fd00d3112b5af0a32156633a88fb3dcf4b53f))

### 📦 Build System

* add missing conventional-changelog dependency ([6aed611](https://github.com/mahmoudxyz/hassan/commit/6aed61178f2a93dc082f61bf63dca64785d3f210))
* add TypeScript build configuration ([254d58c](https://github.com/mahmoudxyz/hassan/commit/254d58c6f444ef2a2fa2aac2e8451199b8e9c6b8))

### 🔄 Continuous Integration

* add comprehensive GitHub Actions workflows and templates ([54f2642](https://github.com/mahmoudxyz/hassan/commit/54f264253fd5ae57836120b29f7e09d2e7f12c6d))
* support master branch for release workflow ([6ea235b](https://github.com/mahmoudxyz/hassan/commit/6ea235b4e330f2d6b518ab8c9fc56fcb7bae652c))
