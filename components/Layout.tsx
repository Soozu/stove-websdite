import React from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-base-100">
      <nav className="navbar bg-base-200">
        <div className="flex-1">
          <Link href="/" className="btn btn-ghost normal-case text-xl">
            STOVE Generator
          </Link>
        </div>
        <div className="flex-none gap-2">
          {session ? (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img
                    src={session.user?.image || '/default-avatar.png'}
                    alt="avatar"
                  />
                </div>
              </label>
              <ul
                tabIndex={0}
                className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
              >
                <li>
                  <Link href="/dashboard">Dashboard</Link>
                </li>
                <li>
                  <Link href="/settings">Settings</Link>
                </li>
                <li>
                  <a onClick={() => signOut()}>Logout</a>
                </li>
              </ul>
            </div>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => signIn('discord')}
            >
              Login with Discord
            </button>
          )}
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">{children}</main>
      <footer className="footer footer-center p-4 bg-base-200 text-base-content">
        <div>
          <p>
            Copyright © 2024 - All rights reserved by{' '}
            <a
              href="https://discord.gg/QK6F7KzKZ7"
              target="_blank"
              rel="noopener noreferrer"
              className="link link-primary"
            >
              STOVE Generator
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
} 