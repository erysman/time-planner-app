
export type DimensionInPercent = `${number}%`

export type Layout = {
    height: number,
    width: number
}

export type Priority = typeof Priority[keyof typeof Priority];

export const Priority = {
  IMPORTANT_URGENT: 'IMPORTANT_URGENT',
  IMPORTANT: 'IMPORTANT',
  URGENT: 'URGENT',
  NORMAL: 'NORMAL',
} as const;