"use client"

import { createContext, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from "next-auth/react"

export type User = {
  id: string
  name: string
  email: string
  phone: string
  userType: 'customer' | 'pharmacy' | 'admin'
  location?: any
  avatar?: string
  createdAt?: string | Date
}

type AuthContextType = {
  user: User | null
  login: (userData: User) => void
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  const user = session?.user ? {
    id: (session.user as any).id,
    name: session.user.name || '',
    email: session.user.email || '',
    userType: (session.user as any).userType || 'customer',
    phone: (session.user as any).phone || '',
    avatar: session.user.image || '',
  } as User : null;

  console.log("AuthContext Debug: status =", status, "user =", user);

  const login = (userData: User) => {
    if (userData.userType === 'pharmacy' || userData.userType === 'admin') {
      router.push('/pharmacy-dashboard')
    } else {
      router.push('/')
    }
  }

  const logout = async () => {
    await signOut({ redirect: false })
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading: status === 'loading' }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
