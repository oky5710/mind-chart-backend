import { NotFoundException } from '@nestjs/common'

export function findOwnedOrThrow<T>(record: T | null): T {
  if (!record) throw new NotFoundException()
  return record
}
