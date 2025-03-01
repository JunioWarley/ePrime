"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"

type Store = {
  id: string
  name: string
  address: string
  phone: string
  email: string
  isActive: boolean
}

type Permission = {
  module: string
  create: boolean
  read: boolean
  update: boolean
  delete: boolean
}

type UserGroup = {
  id: string
  name: string
  permissions: Permission[]
}

type User = {
  id: string
  username: string
  name: string
  email: string
  phone?: string
  role: "admin" | "manager" | "stockist" | "financial"
  store: Store
  group: UserGroup
  isActive: boolean
  avatar?: string
  lastLogin?: Date
  use2FA: boolean
}

interface AccessGroup {
  id: string
  name: string
  permissions: Permission[]
}

type AuthContextType = {
  user: User | null
  stores: Store[]
  currentStore: Store | null
  accessGroups: AccessGroup[] // Adicionado
  login: (username: string, password: string, storeId: string) => Promise<boolean>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  switchStore: (storeId: string) => void
  hasPermission: (module: string, action: "create" | "read" | "update" | "delete") => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock data
const mockStores: Store[] = [
  {
    id: "1",
    name: "Loja Principal",
    address: "Rua Principal, 123",
    phone: "(11) 1234-5678",
    email: "principal@eprime.com",
    isActive: true,
  },
  {
    id: "2",
    name: "Filial 1",
    address: "Av. Secundária, 456",
    phone: "(11) 8765-4321",
    email: "filial1@eprime.com",
    isActive: true,
  },
]

const mockPermissions: Permission[] = [
  { module: "dashboard", create: true, read: true, update: true, delete: true },
  { module: "products", create: true, read: true, update: true, delete: true },
  { module: "inventory", create: true, read: true, update: true, delete: true },
  { module: "suppliers", create: true, read: true, update: true, delete: true },
  { module: "reports", create: true, read: true, update: true, delete: true },
  { module: "users", create: true, read: true, update: true, delete: true },
]

// Adicione os grupos de acesso mock
const mockAccessGroups: AccessGroup[] = [
  {
    id: "1",
    name: "Administradores",
    permissions: mockPermissions,
  },
  {
    id: "2",
    name: "Gerentes",
    permissions: mockPermissions.map((p) => ({ ...p, delete: false })),
  },
  {
    id: "3",
    name: "Vendedores",
    permissions: mockPermissions.map((p) => ({ ...p, create: false, delete: false })),
  },
]

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [currentStore, setCurrentStore] = useState<Store | null>(null)
  const [stores] = useState<Store[]>(mockStores)

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user")
    const storedStore = localStorage.getItem("currentStore")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    if (storedStore) {
      setCurrentStore(JSON.parse(storedStore))
    }
  }, [])

  const login = async (username: string, password: string, storeId: string) => {
    try {
      // Simulated login validation
      if (username === "adm" && password === "AAJgestao") {
        const store = stores.find((s) => s.id === storeId)
        if (!store) {
          throw new Error("Loja inválida")
        }

        const user: User = {
          id: "1",
          username,
          name: "Administrador",
          email: "admin@eprime.com",
          role: "admin",
          store,
          group: {
            id: "1",
            name: "Administradores",
            permissions: mockPermissions,
          },
          isActive: true,
          use2FA: false,
        }

        setUser(user)
        setCurrentStore(store)
        localStorage.setItem("user", JSON.stringify(user))
        localStorage.setItem("currentStore", JSON.stringify(store))
        return true
      }
      return false
    } catch (error) {
      console.error("Erro no login:", error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    setCurrentStore(null)
    localStorage.removeItem("user")
    localStorage.removeItem("currentStore")
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  const switchStore = (storeId: string) => {
    const store = stores.find((s) => s.id === storeId)
    if (store && user) {
      const updatedUser = { ...user, store }
      setUser(updatedUser)
      setCurrentStore(store)
      localStorage.setItem("user", JSON.stringify(updatedUser))
      localStorage.setItem("currentStore", JSON.stringify(store))
    }
  }

  const hasPermission = (module: string, action: "create" | "read" | "update" | "delete") => {
    if (!user || !user.group) return false
    const permission = user.group.permissions.find((p) => p.module === module)
    return permission ? permission[action] : false
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        stores,
        currentStore,
        accessGroups: mockAccessGroups, // Adicione os grupos de acesso
        login,
        logout,
        updateUser,
        switchStore,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

