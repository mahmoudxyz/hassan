interface MapperConfig {
  map: Record<string, string>
}

interface Mapper {
  map: (input: unknown) => unknown
}

const isValidObject = (input: unknown): input is Record<string, unknown> => {
  return input !== null && typeof input === 'object' && !Array.isArray(input)
}

const mapProperty = (
  source: Record<string, unknown>,
  targetKey: string,
  sourceKey: string
): [string, unknown] | null => {
  return sourceKey in source ? [targetKey, source[sourceKey]] : null
}

const buildMappedObject = (
  source: Record<string, unknown>,
  mappingConfig: Record<string, string>
): Record<string, unknown> => {
  const mappedEntries = Object.entries(mappingConfig)
    .map(([targetKey, sourceKey]) => mapProperty(source, targetKey, sourceKey))
    .filter((entry): entry is [string, unknown] => entry !== null)

  return Object.fromEntries(mappedEntries)
}

export function createMapper(config: MapperConfig): Mapper {
  const frozenConfig = Object.freeze({ ...config })

  return {
    map: (input: unknown) => {
      if (!isValidObject(input)) {
        return input
      }

      return buildMappedObject(input, frozenConfig.map)
    },
  }
}
