interface MapperConfig {
  map: Record<string, string>
}

interface Mapper {
  map: (input: unknown) => unknown
}

export function createMapper(config: MapperConfig): Mapper {
  return {
    map: (input: unknown) => {
      return input
    },
  }
}
