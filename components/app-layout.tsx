"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  BarChart3,
  ChevronDown,
  LayoutDashboard,
  MessageSquare,
  Package,
  Store,
  LogOut,
  User,
  Settings,
  Key,
  Building,
  Users,
  ArrowUpDown,
  Sun,
  Moon,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"

// Updated navigation structure
const navigation = [
  {
    label: "Principal",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, module: "dashboard" },
      { name: "Chat", href: "/chat", icon: MessageSquare, module: "chat" },
    ],
  },
  {
    label: "Gestão de Produtos",
    items: [
      { name: "Produtos", href: "/produtos", icon: Package, module: "products" },
      { name: "Movimentações", href: "/movimentacoes", icon: ArrowUpDown, module: "movements" },
      { name: "Fornecedores", href: "/fornecedores", icon: Building, module: "suppliers" },
    ],
  },
  {
    label: "Relatórios",
    items: [
      { name: "Vendas", href: "/relatorios/vendas", icon: BarChart3, module: "sales-reports" },
      { name: "Estoque", href: "/relatorios/estoque", icon: Package, module: "inventory-reports" },
      { name: "Financeiro", href: "/relatorios/financeiro", icon: BarChart3, module: "financial-reports" },
      { name: "Fornecedores", href: "/relatorios/fornecedores", icon: Building, module: "supplier-reports" },
    ],
  },
  {
    label: "Configurações",
    items: [
      { name: "Lojas", href: "/lojas", icon: Store, module: "stores" },
      { name: "Usuários", href: "/usuarios", icon: Users, module: "users" },
      { name: "Acessos", href: "/acessos", icon: Key, module: "access" },
    ],
  },
]

// Add this new component for the user menu
function UserMenu({
  user,
  handleLogout,
  handleUserAction,
}: {
  user: any
  handleLogout: () => void
  handleUserAction: (action: string) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative flex items-center gap-2 hover:bg-accent">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
            <span className="text-sm font-medium text-primary-foreground">{user?.name?.[0] ?? "A"}</span>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium">{user?.name ?? "Administrador"}</span>
            <span className="text-xs text-muted-foreground">{user?.role ?? "Admin"}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleUserAction("profile")}>
          <User className="mr-2 h-4 w-4" />
          Perfil
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleUserAction("password")}>
          <Key className="mr-2 h-4 w-4" />
          Alterar Senha
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleUserAction("preferences")}>
          <Settings className="mr-2 h-4 w-4" />
          Preferências
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Update the theme toggle component
function ThemeToggleButton() {
  const { setTheme, theme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Alternar tema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>Claro</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>Escuro</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>Sistema</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout, currentStore, updateUser } = useAuth()
  const [openGroups, setOpenGroups] = useState<string[]>(["Principal"])
  const [showUserDialog, setShowUserDialog] = useState(false)
  const [dialogContent, setDialogContent] = useState<{
    title: string
    content: React.ReactNode
  } | null>(null)

  const toggleGroup = (label: string) => {
    setOpenGroups((current) =>
      current.includes(label) ? current.filter((item) => item !== label) : [...current, label],
    )
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const handleUserAction = (action: string) => {
    switch (action) {
      case "profile":
        setDialogContent({
          title: "Editar Perfil",
          content: (
            <div className="space-y-4">
              <div className="space-y-2">
                <label>Nome</label>
                <input type="text" className="w-full p-2 border rounded" defaultValue={user?.name} />
              </div>
              <div className="space-y-2">
                <label>Email</label>
                <input type="email" className="w-full p-2 border rounded" defaultValue={user?.email} />
              </div>
              <Button onClick={() => setShowUserDialog(false)}>Salvar</Button>
            </div>
          ),
        })
        break
      case "password":
        setDialogContent({
          title: "Alterar Senha",
          content: (
            <div className="space-y-4">
              <div className="space-y-2">
                <label>Senha Atual</label>
                <input type="password" className="w-full p-2 border rounded" />
              </div>
              <div className="space-y-2">
                <label>Nova Senha</label>
                <input type="password" className="w-full p-2 border rounded" />
              </div>
              <div className="space-y-2">
                <label>Confirmar Nova Senha</label>
                <input type="password" className="w-full p-2 border rounded" />
              </div>
              <Button onClick={() => setShowUserDialog(false)}>Alterar Senha</Button>
            </div>
          ),
        })
        break
      case "preferences":
        setDialogContent({
          title: "Preferências",
          content: (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Notificações</span>
                <input type="checkbox" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span>Email Alerts</span>
                <input type="checkbox" defaultChecked />
              </div>
              <Button onClick={() => setShowUserDialog(false)}>Salvar</Button>
            </div>
          ),
        })
        break
    }
    setShowUserDialog(true)
  }

  if (!user || !currentStore) {
    return null
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-sidebar text-sidebar-foreground flex flex-col">
        <div className="p-4 border-b border-sidebar-border">
          <h1 className="text-xl font-bold flex items-center">
            <Package className="mr-2 h-6 w-6" />
            ePrime
          </h1>
        </div>
        <nav className="flex-1 overflow-y-auto p-4">
          {navigation.map((group) => (
            <Collapsible
              key={group.label}
              open={openGroups.includes(group.label)}
              onOpenChange={() => toggleGroup(group.label)}
              className="space-y-2 mb-4"
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full px-2 py-1 text-sm font-medium hover:bg-sidebar-accent rounded-md">
                {group.label}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    openGroups.includes(group.label) ? "transform rotate-180" : ""
                  }`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 pl-2">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-2 py-1 text-sm rounded-md transition-colors ${
                      pathname === item.href
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                ))}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </nav>
        <div className="p-4 border-t border-sidebar-border flex justify-between items-center">
          <UserMenu user={user} handleLogout={handleLogout} handleUserAction={handleUserAction} />
          <ThemeToggleButton />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b bg-background flex items-center px-6">
          <h1 className="text-xl font-semibold">
            {navigation.flatMap((g) => g.items).find((item) => item.href === pathname)?.name || "Dashboard"}
          </h1>
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>

      {/* User Action Dialog */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogContent?.title}</DialogTitle>
            <DialogDescription>{dialogContent?.content}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

