import type { LabelItem } from '../types/account'

export function parseLabelToItems(input: string): LabelItem[] {
  return input
    .split(';')
    .map(s => s.trim())
    .filter(Boolean)
    .map(text => ({ text }))
}

export function itemsToLabelString(items: LabelItem[]): string {
  return items.map(i => i.text).join('; ')
}
