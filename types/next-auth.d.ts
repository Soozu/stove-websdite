import 'next-auth'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
    accessToken?: string
  }

  interface Profile {
    id: string
    username: string
    email: string
    avatar: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    accessToken?: string
  }
} 