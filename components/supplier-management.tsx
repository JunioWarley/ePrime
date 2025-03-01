"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Edit, Trash2, FileDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"

interface Supplier {
  id: string
  name: string
  email: string
  phone: string
  address: string
  category: string
  contactPerson: string
  status: "active" | "inactive"
}

export function SupplierManagement() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: "1",
      name: "Fornecedor A",
      email: "contato@fornecedora.com",
      phone: "(11) 99999-9999",
      address: "Rua A, 123",
      category: "Eletrônicos",
      contactPerson: "João Silva",
      status: "active",
    },
  ])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [formData, setFormData] = useState<Partial<Supplier>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingSupplier) {
      setSuppliers(suppliers.map((s) => (s.id === editingSupplier.id ? { ...editingSupplier, ...formData } : s)))
      toast({
        title: "Fornecedor atualizado",
        description: "As informações do fornecedor foram atualizadas com sucesso.",
      })
    } else {
      const newSupplier: Supplier = {
        id: Date.now().toString(),
        status: "active",
        ...(formData as Omit<Supplier, "id" | "status">),
      }
      setSuppliers([...suppliers, newSupplier])
      toast({
        title: "Fornecedor adicionado",
        description: "O novo fornecedor foi adicionado com sucesso.",
      })
    }

    setIsDialogOpen(false)
    setFormData({})
    setEditingSupplier(null)
  }

  const handleDelete = (id: string) => {
    setSuppliers(suppliers.filter((s) => s.id !== id))
    toast({
      title: "Fornecedor removido",
      description: "O fornecedor foi removido com sucesso.",
    })
  }

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier)
    setFormData(supplier)
    setIsDialogOpen(true)
  }

  const exportSuppliers = () => {
    // Implement CSV export
    toast({
      title: "Exportando fornecedores",
      description: "A lista de fornecedores está sendo exportada.",
    })
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Fornecedores</CardTitle>
          <div className="space-x-2">
            <Button variant="outline" onClick={exportSuppliers}>
              <FileDown className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button
              onClick={() => {
                setEditingSupplier(null)
                setFormData({})
                setIsDialogOpen(true)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Fornecedor
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-medium">{supplier.name}</TableCell>
                  <TableCell>{supplier.contactPerson}</TableCell>
                  <TableCell>{supplier.email}</TableCell>
                  <TableCell>{supplier.phone}</TableCell>
                  <TableCell>{supplier.category}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        supplier.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {supplier.status === "active" ? "Ativo" : "Inativo"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(supplier)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(supplier.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSupplier ? "Editar Fornecedor" : "Novo Fornecedor"}</DialogTitle>
            <DialogDescription>Preencha os dados do fornecedor abaixo</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Input
                  id="category"
                  value={formData.category || ""}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone || ""}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                value={formData.address || ""}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPerson">Pessoa de Contato</Label>
              <Input
                id="contactPerson"
                value={formData.contactPerson || ""}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit">{editingSupplier ? "Salvar Alterações" : "Adicionar Fornecedor"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

