"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"

interface User {
  id: string
  name: string
  email: string
  role: string
  accessGroup: string
}

const roles = [
  { id: "admin", name: "Administrador" },
  { id: "manager", name: "Gerente" },
  { id: "seller", name: "Vendedor" },
]

export function UserManagement() {
  const { accessGroups } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [showDialog, setShowDialog] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [newUser, setNewUser] = useState<Omit<User, "id">>({
    name: "",
    email: "",
    role: "",
    accessGroup: "",
  })

  useEffect(() => {
    // Simular carregamento de usuários
    const fakeUsers: User[] = [
      { id: "1", name: "João Silva", email: "joao@example.com", role: "admin", accessGroup: "1" },
      { id: "2", name: "Maria Santos", email: "maria@example.com", role: "manager", accessGroup: "2" },
      { id: "3", name: "Pedro Oliveira", email: "pedro@example.com", role: "seller", accessGroup: "3" },
    ]
    setUsers(fakeUsers)
  }, [])

  const handleAddUser = () => {
    const user: User = {
      id: Date.now().toString(),
      ...newUser,
    }
    setUsers([...users, user])
    setShowDialog(false)
    setNewUser({ name: "", email: "", role: "", accessGroup: "" })
    toast({
      title: "Usuário adicionado",
      description: `O usuário ${user.name} foi adicionado com sucesso.`,
    })
  }

  const handleUpdateUser = () => {
    if (currentUser) {
      setUsers(users.map((u) => (u.id === currentUser.id ? { ...currentUser, ...newUser } : u)))
      setShowDialog(false)
      setCurrentUser(null)
      setNewUser({ name: "", email: "", role: "", accessGroup: "" })
      toast({
        title: "Usuário atualizado",
        description: `O usuário ${currentUser.name} foi atualizado com sucesso.`,
      })
    }
  }

  const getRoleName = (roleId: string) => {
    return roles.find((r) => r.id === roleId)?.name || roleId
  }

  const getAccessGroupName = (groupId: string) => {
    return accessGroups?.find((g) => g.id === groupId)?.name || groupId
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciamento de Usuários</CardTitle>
        <CardDescription>Gerencie os usuários do sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Grupo de Acesso</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{getRoleName(user.role)}</TableCell>
                <TableCell>{getAccessGroupName(user.accessGroup)}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentUser(user)
                      setNewUser(user)
                      setShowDialog(true)
                    }}
                  >
                    Editar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => {
            setCurrentUser(null)
            setNewUser({ name: "", email: "", role: "", accessGroup: "" })
            setShowDialog(true)
          }}
        >
          Adicionar Usuário
        </Button>
      </CardFooter>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentUser ? "Editar Usuário" : "Adicionar Usuário"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input
                id="name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Função
              </Label>
              <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione uma função" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="accessGroup" className="text-right">
                Grupo de Acesso
              </Label>
              <Select
                value={newUser.accessGroup}
                onValueChange={(value) => setNewUser({ ...newUser, accessGroup: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione um grupo de acesso" />
                </SelectTrigger>
                <SelectContent>
                  {accessGroups?.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={currentUser ? handleUpdateUser : handleAddUser}>
              {currentUser ? "Atualizar" : "Adicionar"} Usuário
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

