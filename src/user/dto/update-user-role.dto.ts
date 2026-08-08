import { IsIn } from 'class-validator'

// admin은 이 API로 지정/해제할 수 없다 — DB에서만 승격한다(docs/architecture.md 참고).
export const ASSIGNABLE_ROLES = ['user', 'researcher'] as const
export type AssignableRole = (typeof ASSIGNABLE_ROLES)[number]

export class UpdateUserRoleDto {
  @IsIn(ASSIGNABLE_ROLES)
  role: AssignableRole
}
