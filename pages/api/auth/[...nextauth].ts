import NextAuth from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import { Session, User } from 'next-auth'

const prisma = new PrismaClient()

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || '',
      clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
      authorization: { params: { scope: 'identify email' } },
    }),
  ],
  callbacks: {
    session: async ({ session, user }: { session: Session; user: User }) => {
      if (session?.user) {
        session.user.id = user.id
      }
      return session
    },
  },
  pages: {
    signIn: '/',
    signOut: '/',
    error: '/',
  },
}

export default NextAuth(authOptions) 