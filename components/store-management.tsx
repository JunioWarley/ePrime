"use client"

import { useState } from "react"
import { Store, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

type Store = {
  id: string
  name: string
  address: string
  phone: string
  email: string
  responsible: string
}

const mockStores: Store[] = [
  {
    id: "1",
    name: "Loja Principal",
    address: "Rua A, 123",
    phone: "(11) 1234-5678",
    email: "principal@eprime.com",
    responsible: "João",
  },
  {
    id: "2",
    name: "Filial 1",
    address: "Av. B, 456",
    phone: "(11) 2345-6789",
    email: "filial1@eprime.com",
    responsible: "Maria",
  },
]

export function StoreManagement() {
  const [stores, setStores] = useState<Store[]>(mockStores)
  const [newStore, setNewStore] = useState<Partial<Store>>({})
  const [editingStore, setEditingStore] = useState<Store | null>(null)
  const [showDialog, setShowDialog] = useState(false)

  const addStore = () => {
    if (newStore.name && newStore.address && newStore.phone && newStore.email && newStore.responsible) {
      setStores([...stores, { ...newStore, id: Date.now().toString() } as Store])
      setNewStore({})
      setShowDialog(false)
      toast({ title: "Loja adicionada", description: "A nova loja foi adicionada com sucesso." })
    }
  }

  const updateStore = () => {
    if (editingStore) {
      setStores(stores.map((s) => (s.id === editingStore.id ? editingStore : s)))
      setEditingStore(null)
      setShowDialog(false)
      toast({ title: "Loja atualizada", description: "As informações da loja foram atualizadas com sucesso." })
    }
  }

  const deleteStore = (id: string) => {
    setStores(stores.filter((s) => s.id !== id))
    toast({ title: "Loja removida", description: "A loja foi removida com sucesso." })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciamento de Lojas</CardTitle>
        <CardDescription>Gerencie as lojas do seu negócio</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Endereço</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stores.map((store) => (
              <TableRow key={store.id}>
                <TableCell>{store.name}</TableCell>
                <TableCell>{store.address}</TableCell>
                <TableCell>{store.phone}</TableCell>
                <TableCell>{store.email}</TableCell>
                <TableCell>{store.responsible}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mr-2"
                    onClick={() => {
                      setEditingStore(store)
                      setShowDialog(true)
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => deleteStore(store.id)}>
                    <Trash2 className="h-4 w-4" />
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
            setEditingStore(null)
            setNewStore({})
            setShowDialog(true)
          }}
        >
          <Store className="mr-2 h-4 w-4" /> Adicionar Loja
        </Button>
      </CardFooter>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingStore ? "Editar Loja" : "Adicionar Nova Loja"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input
                id="name"
                value={editingStore?.name || newStore.name || ""}
                onChange={(e) =>
                  editingStore
                    ? setEditingStore({ ...editingStore, name: e.target.value })
                    : setNewStore({ ...newStore, name: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Endereço
              </Label>
              <Input
                id="address"
                value={editingStore?.address || newStore.address || ""}
                onChange={(e) =>
                  editingStore
                    ? setEditingStore({ ...editingStore, address: e.target.value })
                    : setNewStore({ ...newStore, address: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Telefone
              </Label>
              <Input
                id="phone"
                value={editingStore?.phone || newStore.phone || ""}
                onChange={(e) =>
                  editingStore
                    ? setEditingStore({ ...editingStore, phone: e.target.value })
                    : setNewStore({ ...newStore, phone: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                value={editingStore?.email || newStore.email || ""}
                onChange={(e) =>
                  editingStore
                    ? setEditingStore({ ...editingStore, email: e.target.value })
                    : setNewStore({ ...newStore, email: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="responsible" className="text-right">
                Responsável
              </Label>
              <Input
                id="responsible"
                value={editingStore?.responsible || newStore.responsible || ""}
                onChange={(e) =>
                  editingStore
                    ? setEditingStore({ ...editingStore, responsible: e.target.value })
                    : setNewStore({ ...newStore, responsible: e.target.value })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={editingStore ? updateStore : addStore}>
              {editingStore ? "Atualizar" : "Adicionar"} Loja
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

