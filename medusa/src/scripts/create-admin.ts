import {
  IAuthModuleService,
  IUserModuleService,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function createAdmin({ container }: { container: any }) {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  if (!email || !password) {
    console.log("[create-admin] ADMIN_EMAIL or ADMIN_PASSWORD not set, skipping.")
    return
  }

  const userService: IUserModuleService = container.resolve(Modules.USER)
  const authService: IAuthModuleService = container.resolve(Modules.AUTH)

  const existing = await userService.listUsers({ email })
  if (existing.length > 0) {
    console.log("[create-admin] Admin user already exists:", email)
    return
  }

  const { authIdentity, success, error } = await authService.register(
    "emailpass",
    { body: { email, password } }
  )

  if (!success || !authIdentity) {
    console.log("[create-admin] Auth register failed:", error)
    return
  }

  const user = await userService.createUsers({ email })

  await authService.updateAuthIdentities({
    id: authIdentity.id,
    app_metadata: { user_id: user.id },
  })

  console.log("[create-admin] Admin user created successfully:", email)
}
