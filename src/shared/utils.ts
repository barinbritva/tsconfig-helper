import {BackRelation, Relation} from './interfaces'
import {DefaultDefinedCondition, DefaultDescriptor, DefaultMultipleCondition} from './types'

export function isMultipleCondition(value: DefaultDescriptor): value is DefaultMultipleCondition {
  if (
    'conditions' in (value as DefaultMultipleCondition) &&
    'values' in (value as DefaultMultipleCondition).conditions
  ) {
    return true
  }

  return false
}

export function isDefinedCondition(value: DefaultDescriptor): value is DefaultDefinedCondition {
  if (
    'conditions' in (value as DefaultDefinedCondition) &&
    'defined' in (value as DefaultDefinedCondition).conditions
  ) {
    return true
  }

  return false
}

export function isBackRelation(value: Relation | BackRelation): value is BackRelation {
  if ('to' in value && 'look' in value) {
    return true
  }

  return false
}

export function isDirectRelation(value: Relation | BackRelation): value is Relation {
  if ('to' in value && 'type' in value) {
    return true
  }

  return false
}
