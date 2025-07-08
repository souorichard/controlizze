import { defineAbilityfor, Role, userSchema } from '@controlizze/auth'

export function getUserPermissions(userId: string, role: Role) {
  const authUser = userSchema.parse({
    id: userId,
    role,
  })

  const ability = defineAbilityfor(authUser)

  return ability
}
