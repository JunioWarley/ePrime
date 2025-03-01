"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"

interface AccessGroup {
  id: string
  name: string
  permissions: {
    [key: string]: {
      read: boolean
      write: boolean
    }
  }
  stores: string[]
}

const initialModules = ["dashboard", "inventory", "products", "suppliers", "reports", "users", "stores"]

export function AccessManagement() {
  const { stores } = useAuth()
  const [accessGroups, setAccessGroups] = useState<AccessGroup[]>([])
  const [showDialog, setShowDialog] = useState(false)
  const [currentGroup, setCurrentGroup] = useState<AccessGroup | null>(null)
  const [newGroup, setNewGroup] = useState<Omit<AccessGroup, "id">>({
    name: "",
    permissions: {},
    stores: [],
  })

  const handleAddGroup = () => {
    const group: AccessGroup = {
      id: Date.now().toString(),
      ...newGroup,
    }
    setAccessGroups([...accessGroups, group])
    setShowDialog(false)
    setNewGroup({ name: "", permissions: {}, stores: [] })
    toast({
      title: "Grupo de acesso adicionado",
      description: `O grupo ${group.name} foi adicionado com sucesso.`,
    })
  }

  const handleUpdateGroup = () => {
    if (currentGroup) {
      setAccessGroups(accessGroups.map((g) => (g.id === currentGroup.id ? { ...currentGroup, ...newGroup } : g)))
      setShowDialog(false)
      setCurrentGroup(null)
      setNewGroup({ name: "", permissions: {}, stores: [] })
      toast({
        title: "Grupo de acesso atualizado",
        description: `O grupo ${currentGroup.name} foi atualizado com sucesso.`,
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grupos de Acesso</CardTitle>
        <CardDescription>Gerencie os grupos de acesso e suas permissões</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome do Grupo</TableHead>
              <TableHead>Módulos com Acesso</TableHead>
              <TableHead>Lojas com Acesso</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accessGroups.map((group) => (
              <TableRow key={group.id}>
                <TableCell>{group.name}</TableCell>
                <TableCell>
                  {Object.entries(group.permissions)
                    .filter(([, perm]) => perm.read || perm.write)
                    .map(([module]) => module)
                    .join(", ")}
                </TableCell>
                <TableCell>{group.stores.join(", ")}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentGroup(group)
                      setNewGroup(group)
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
            setCurrentGroup(null)
            setNewGroup({ name: "", permissions: {}, stores: [] })
            setShowDialog(true)
          }}
        >
          Adicionar Grupo de Acesso
        </Button>
      </CardFooter>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{currentGroup ? "Editar Grupo de Acesso" : "Adicionar Grupo de Acesso"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="groupName" className="text-right">
                Nome do Grupo
              </Label>
              <Input
                id="groupName"
                value={newGroup.name}
                onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="space-y-2">
              <Label>Permissões de Módulos</Label>
              {initialModules.map((module) => (
                <div key={module} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${module}-read`}
                    checked={newGroup.permissions[module]?.read}
                    onCheckedChange={(checked) =>
                      setNewGroup({
                        ...newGroup,
                        permissions: {
                          ...newGroup.permissions,
                          [module]: { ...newGroup.permissions[module], read: checked as boolean },
                        },
                      })
                    }
                  />
                  <Label htmlFor={`${module}-read`}>Ler</Label>
                  <Checkbox
                    id={`${module}-write`}
                    checked={newGroup.permissions[module]?.write}
                    onCheckedChange={(checked) =>
                      setNewGroup({
                        ...newGroup,
                        permissions: {
                          ...newGroup.permissions,
                          [module]: { ...newGroup.permissions[module], write: checked as boolean },
                        },
                      })
                    }
                  />
                  <Label htmlFor={`${module}-write`}>Escrever</Label>
                  <span className="ml-2">{module}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Label>Acesso às Lojas</Label>
              {stores.map((store) => (
                <div key={store.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`store-${store.id}`}
                    checked={newGroup.stores.includes(store.id)}
                    onCheckedChange={(checked) =>
                      setNewGroup({
                        ...newGroup,
                        stores: checked
                          ? [...newGroup.stores, store.id]
                          : newGroup.stores.filter((id) => id !== store.id),
                      })
                    }
                  />
                  <Label htmlFor={`store-${store.id}`}>{store.name}</Label>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={currentGroup ? handleUpdateGroup : handleAddGroup}>
              {currentGroup ? "Atualizar" : "Adicionar"} Grupo de Acesso
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

