interface MapperConfig {
  map: Record<string, string>
}

interface Mapper {
  map: (input: unknown) => unknown
}

export function createMapper(config: MapperConfig): Mapper {
  return {
    map: (input: unknown) => {
      if (!input || typeof input !== 'object') {
        return input
      }
      const source = input as Record<string, unknown>
      const result: Record<string, unknown> = {}

      for (const [targetKey, sourceKey] of Object.entries(config.map)) {
        if (sourceKey in source) {
          result[targetKey] = source[sourceKey]
        }
      }
      return result
    },
  }
}
