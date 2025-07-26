interface MapperConfig {
  map: Record<string, string | DirectValue>
}

interface DirectValue {
  __type: 'direct'
  value: unknown
}

interface Mapper {
  map: (input: unknown) => unknown
}

export const h = {
  direct: (value: unknown): DirectValue => ({
    __type: 'direct',
    value,
  }),
}

const isValidObject = (input: unknown): input is Record<string, unknown> => {
  return input !== null && typeof input === 'object' && !Array.isArray(input)
}

const isDirectValue = (value: unknown): value is DirectValue => {
  return (
    typeof value === 'object' &&
    value !== null &&
    (value as DirectValue).__type === 'direct'
  )
}

const mapProperty = (
  source: Record<string, unknown>,
  targetKey: string,
  sourceValue: string | DirectValue
): [string, unknown] | null => {
  if (isDirectValue(sourceValue)) {
    return [targetKey, sourceValue.value]
  }

  return sourceValue in source ? [targetKey, source[sourceValue]] : null
}

const buildMappedObject = (
  source: Record<string, unknown>,
  mappingConfig: Record<string, string | DirectValue>
): Record<string, unknown> => {
  const mappedEntries = Object.entries(mappingConfig)
    .map(([targetKey, sourceValue]) =>
      mapProperty(source, targetKey, sourceValue)
    )
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
