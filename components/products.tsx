"use client"

import { useState } from "react"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  price: number
  quantity: number
  minStock: number
  supplier: string
}

export function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [showDialog, setShowDialog] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null)
  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
    name: "",
    sku: "",
    ean: "",
    price: 0,
    quantity: 0,
    minStock: 0,
    supplier: "",
  })

  const handleAddProduct = () => {
    const product: Product = {
      id: Date.now().toString(),
      ...newProduct,
    }
    setProducts([...products, product])
    setShowDialog(false)
    setNewProduct({
      name: "",
      sku: "",
      ean: "",
      price: 0,
      quantity: 0,
      minStock: 0,
      supplier: "",
    })
    toast({
      title: "Produto adicionado",
      description: `O produto ${product.name} foi adicionado com sucesso.`,
    })
  }

  const handleUpdateProduct = () => {
    if (currentProduct) {
      setProducts(products.map((p) => (p.id === currentProduct.id ? { ...currentProduct, ...newProduct } : p)))
      setShowDialog(false)
      setCurrentProduct(null)
      setNewProduct({
        name: "",
        sku: "",
        ean: "",
        price: 0,
        quantity: 0,
        minStock: 0,
        supplier: "",
      })
      toast({
        title: "Produto atualizado",
        description: `O produto ${currentProduct.name} foi atualizado com sucesso.`,
      })
    }
  }

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id))
    toast({
      title: "Produto removido",
      description: "O produto foi removido com sucesso.",
    })
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Produtos</CardTitle>
          <CardDescription>Gerencie os produtos do seu catálogo</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>EAN</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Estoque Mínimo</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.ean}</TableCell>
                  <TableCell>R$ {product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>{product.minStock}</TableCell>
                  <TableCell>{product.supplier}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCurrentProduct(product)
                        setNewProduct(product)
                        setShowDialog(true)
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteProduct(product.id)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remover
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
              setCurrentProduct(null)
              setNewProduct({
                name: "",
                sku: "",
                ean: "",
                price: 0,
                quantity: 0,
                minStock: 0,
                supplier: "",
              })
              setShowDialog(true)
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Produto
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentProduct ? "Editar Produto" : "Adicionar Produto"}</DialogTitle>
            <DialogDescription>
              {currentProduct ? "Edite os detalhes do produto" : "Preencha os detalhes do novo produto"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input
                id="name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sku" className="text-right">
                SKU
              </Label>
              <Input
                id="sku"
                value={newProduct.sku}
                onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ean" className="text-right">
                EAN
              </Label>
              <Input
                id="ean"
                value={newProduct.ean}
                onChange={(e) => setNewProduct({ ...newProduct, ean: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Preço
              </Label>
              <Input
                id="price"
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantidade
              </Label>
              <Input
                id="quantity"
                type="number"
                value={newProduct.quantity}
                onChange={(e) => setNewProduct({ ...newProduct, quantity: Number(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="minStock" className="text-right">
                Estoque Mínimo
              </Label>
              <Input
                id="minStock"
                type="number"
                value={newProduct.minStock}
                onChange={(e) => setNewProduct({ ...newProduct, minStock: Number(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="supplier" className="text-right">
                Fornecedor
              </Label>
              <Input
                id="supplier"
                value={newProduct.supplier}
                onChange={(e) => setNewProduct({ ...newProduct, supplier: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={currentProduct ? handleUpdateProduct : handleAddProduct}>
              {currentProduct ? "Atualizar" : "Adicionar"} Produto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

