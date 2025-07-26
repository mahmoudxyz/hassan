interface DirectValue {
  __type: 'direct'
  value: unknown
}

interface ConditionalMapping {
  __type: 'conditional'
  when: TransformFunction
  then: string | DirectValue | TransformFunction
  else?: string | DirectValue | TransformFunction
}

type TransformFunction = (
  source: Record<string, unknown>,
  context?: Record<string, unknown>
) => unknown

type MappingValue =
  | string
  | DirectValue
  | TransformFunction
  | ConditionalMapping

interface Mapper {
  map: (input: unknown, context?: Record<string, unknown>) => unknown
}

export const h = {
  direct: (value: unknown): DirectValue => ({
    __type: 'direct',
    value,
  }),

  when: (
    condition: TransformFunction,
    thenValue: string | DirectValue | TransformFunction,
    elseValue?: string | DirectValue | TransformFunction
  ): ConditionalMapping => {
    const mapping: ConditionalMapping = {
      __type: 'conditional',
      when: condition,
      then: thenValue,
    }

    if (elseValue !== undefined) {
      mapping.else = elseValue
    }

    return mapping
  },
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

const isConditionalMapping = (value: unknown): value is ConditionalMapping => {
  return (
    typeof value === 'object' &&
    value !== null &&
    (value as ConditionalMapping).__type === 'conditional'
  )
}

const isTransformFunction = (value: unknown): value is TransformFunction => {
  return typeof value === 'function'
}

const setNestedProperty = (
  obj: Record<string, unknown>,
  path: string,
  value: unknown
): void => {
  const keys = path.split('.')
  let current = obj

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]! // Non-null assertion since we know the length
    if (!(key in current) || !isValidObject(current[key])) {
      current[key] = {}
    }
    current = current[key] as Record<string, unknown>
  }

  current[keys[keys.length - 1]!] = value // Non-null assertion
}

const getNestedProperty = (
  obj: Record<string, unknown>,
  path: string
): unknown => {
  const keys = path.split('.')
  let current: unknown = obj

  for (const key of keys) {
    if (!isValidObject(current) || !(key in current)) {
      return undefined
    }
    current = current[key]
  }

  return current
}

const resolveMappingValue = (
  source: Record<string, unknown>,
  mapping: string | DirectValue | TransformFunction,
  context?: Record<string, unknown>
): unknown => {
  if (isDirectValue(mapping)) {
    return mapping.value
  }

  if (isTransformFunction(mapping)) {
    return mapping(source, context)
  }

  // It's a string path - support nested paths
  if (mapping.includes('.')) {
    return getNestedProperty(source, mapping)
  }

  return source[mapping]
}

const mapProperty = (
  source: Record<string, unknown>,
  targetKey: string,
  mapping: MappingValue,
  context?: Record<string, unknown>
): [string, unknown] | null => {
  if (isConditionalMapping(mapping)) {
    const conditionResult = mapping.when(source, context)

    if (conditionResult) {
      const resolvedValue = resolveMappingValue(source, mapping.then, context)
      return [targetKey, resolvedValue]
    } else if (mapping.else !== undefined) {
      const resolvedValue = resolveMappingValue(source, mapping.else, context)
      return [targetKey, resolvedValue]
    }

    return null
  }

  const resolvedValue = resolveMappingValue(source, mapping, context)
  return resolvedValue !== undefined ? [targetKey, resolvedValue] : null
}

const buildMappedObject = (
  source: Record<string, unknown>,
  mappings: Record<string, MappingValue>,
  context?: Record<string, unknown>
): Record<string, unknown> => {
  const result: Record<string, unknown> = {}

  for (const [targetKey, mapping] of Object.entries(mappings)) {
    const mappedProperty = mapProperty(source, targetKey, mapping, context)

    if (mappedProperty !== null) {
      const [key, value] = mappedProperty

      // Handle nested target keys
      if (key.includes('.')) {
        setNestedProperty(result, key, value)
      } else {
        result[key] = value
      }
    }
  }

  return result
}

export function createMapper(mappings: Record<string, MappingValue>): Mapper {
  return {
    map: (input: unknown, context?: Record<string, unknown>) => {
      if (!isValidObject(input)) {
        return input
      }

      return buildMappedObject(input, mappings, context)
    },
  }
}
