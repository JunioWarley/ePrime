"use client"

import { useState } from "react"
import { Plus, Minus, AlertTriangle, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

interface Product {
  id: string
  name: string
  sku: string
  ean: string
  customCode: string
  price: number
  cost: number
  quantity: number
  minStock: number
  supplier: string
}

export function ProductsAndInventory() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Smartphone XYZ",
      sku: "SMXYZ001",
      ean: "1234567890123",
      customCode: "PHONE1",
      price: 999.99,
      cost: 700,
      quantity: 50,
      minStock: 10,
      supplier: "Tech Imports Ltd.",
    },
    {
      id: "2",
      name: "Laptop ABC",
      sku: "LPABC002",
      ean: "2345678901234",
      customCode: "LAP1",
      price: 1499.99,
      cost: 1100,
      quantity: 30,
      minStock: 5,
      supplier: "Computer Wholesalers Inc.",
    },
    // Add more sample products as needed
  ])

  const [stockMovements, setStockMovements] = useState([
    { id: "1", productId: "1", quantity: 10, type: "in", date: new Date(2023, 4, 1) },
    { id: "2", productId: "1", quantity: -5, type: "out", date: new Date(2023, 4, 5) },
    { id: "3", productId: "2", quantity: 15, type: "in", date: new Date(2023, 4, 2) },
    // Add more sample stock movements as needed
  ])
  const [showDialog, setShowDialog] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleAddProduct = (product: Omit<Product, "id">) => {
    const newProduct = {
      ...product,
      id: Date.now().toString(),
    }
    setProducts([...products, newProduct])
    setShowDialog(false)
    toast({
      title: "Produto adicionado",
      description: "O produto foi adicionado com sucesso.",
    })
  }

  const handleUpdateStock = (id: string, change: number) => {
    setProducts(products.map((p) => (p.id === id ? { ...p, quantity: Math.max(0, p.quantity + change) } : p)))
    toast({
      title: "Estoque atualizado",
      description: `Quantidade atualizada com sucesso.`,
    })
  }

  return (
    <Tabs defaultValue="list" className="space-y-4">
      <TabsList>
        <TabsTrigger value="list">Lista de Produtos</TabsTrigger>
        <TabsTrigger value="stock">Movimentações de Estoque</TabsTrigger>
      </TabsList>

      <TabsContent value="list">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Produtos</CardTitle>
            <Button
              onClick={() => {
                setCurrentProduct(null)
                setShowDialog(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo Produto
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>R$ {product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      {product.quantity}
                      {product.quantity <= product.minStock && (
                        <AlertTriangle className="inline ml-2 h-4 w-4 text-yellow-500" />
                      )}
                    </TableCell>
                    <TableCell>{product.supplier}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setCurrentProduct(product)
                          setShowDialog(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setCurrentProduct(product)
                          setShowDeleteConfirm(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="stock">
        <Card>
          <CardHeader>
            <CardTitle>Movimentações de Estoque</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Quantidade Atual</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => handleUpdateStock(product.id, 1)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleUpdateStock(product.id, -1)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Product Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentProduct ? "Editar Produto" : "Novo Produto"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ean">EAN</Label>
                <Input id="ean" defaultValue={currentProduct?.ean} required />
              </div>
              <div>
                <Label htmlFor="customCode">Código Personalizado</Label>
                <Input id="customCode" defaultValue={currentProduct?.customCode} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" defaultValue={currentProduct?.sku} />
              </div>
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input id="name" defaultValue={currentProduct?.name} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Preço</Label>
                <Input id="price" type="number" defaultValue={currentProduct?.price} required />
              </div>
              <div>
                <Label htmlFor="quantity">Quantidade</Label>
                <Input id="quantity" type="number" defaultValue={currentProduct?.quantity} required />
              </div>
            </div>
            <div>
              <Label htmlFor="supplier">Fornecedor</Label>
              <Input id="supplier" defaultValue={currentProduct?.supplier} required />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={() => {
                const form = document.querySelector("form")
                if (form) {
                  const formData = new FormData(form)
                  const product = Object.fromEntries(formData.entries()) as unknown as Omit<Product, "id">
                  handleAddProduct(product)
                }
              }}
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>Tem certeza que deseja excluir este produto?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (currentProduct) {
                  setProducts(products.filter((p) => p.id !== currentProduct.id))
                  setShowDeleteConfirm(false)
                  toast({
                    title: "Produto excluído",
                    description: "O produto foi excluído com sucesso.",
                  })
                }
              }}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Tabs>
  )
}

