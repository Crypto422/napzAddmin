
export interface UserModel {
  id: number
  user_auth_id: string
  name: string
  username: string
  email: string
  user_role: string
  password: string | undefined
  auth_provider: string
  timezone: string
  avatar_url: string
  avatar_id: string
  currency: string
  login_date: Date
  banned: string
  created_date: Date
  updated_date: Date
}
