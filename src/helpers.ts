import { BinaryLike, createHash } from 'crypto'

export function hash(data: BinaryLike) {
  return createHash('sha256').update(JSON.stringify(data)).digest('hex')
}

export function hashValidate({
  hash,
  dificulty = 4,
  prefix = '0'
}: {
  hash: string
  dificulty: number
  prefix: string
}) {
  const check = prefix.repeat(dificulty)
  return hash.startsWith(check)
}
