"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { FileUploader } from "@/components/file-uploader"
import { RichTextEditor } from "@/components/rich-text-editor"
import { PriceHistory } from "@/components/price-history"
import { PricingCalculator } from "@/components/pricing-calculator"
import { CSVLink } from "react-csv"

type Product = {
  id: string
  sku: string
  name: string
  category: string
  subcategory: string
  description: string
  price: number
  minPrice: number
  maxPrice: number
  stock: number
  supplier: string
  imageUrl?: string
}

const initialProducts: Product[] = [
  {
    id: "1",
    sku: "SKU001",
    name: "Produto A",
    category: "Eletrônicos",
    subcategory: "Smartphones",
    description: "Um smartphone avançado",
    price: 999.99,
    minPrice: 899.99,
    maxPrice: 1099.99,
    stock: 50,
    supplier: "Fornecedor X",
  },
  // Add more mock products here
]

export function ProductsModule() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [filter, setFilter] = useState("")
  const [newProduct, setNewProduct] = useState<Partial<Product>>({})
  const [showPriceHistory, setShowPriceHistory] = useState(false)
  const [showPricingCalculator, setShowPricingCalculator] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value.toLowerCase())
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(filter) ||
      product.sku.toLowerCase().includes(filter) ||
      product.category.toLowerCase().includes(filter) ||
      product.supplier.toLowerCase().includes(filter),
  )

  const handleNewProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewProduct({
      ...newProduct,
      [e.target.name]: e.target.value,
    })
  }

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.sku) {
      setProducts([...products, { ...newProduct, id: Date.now().toString() } as Product])
      setNewProduct({})
      toast({
        title: "Produto adicionado",
        description: "O novo produto foi adicionado com sucesso.",
      })
    }
  }

  const handleImageUpload = (file: File) => {
    // Simulating image upload
    const imageUrl = URL.createObjectURL(file)
    setNewProduct({ ...newProduct, imageUrl })
  }

  const handleDescriptionChange = (content: string) => {
    setNewProduct({ ...newProduct, description: content })
  }

  const handleShowPriceHistory = (productId: string) => {
    setSelectedProductId(productId)
    setShowPriceHistory(true)
  }

  const handleShowPricingCalculator = (productId: string) => {
    setSelectedProductId(productId)
    setShowPricingCalculator(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input placeholder="Filtrar produtos..." value={filter} onChange={handleFilterChange} className="max-w-sm" />
        <Dialog>
          <DialogTrigger asChild>
            <Button>Adicionar Produto</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Novo Produto</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <Input id="sku" name="sku" value={newProduct.sku || ""} onChange={handleNewProductChange} />
                </div>
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" name="name" value={newProduct.name || ""} onChange={handleNewProductChange} />
                </div>
              </div>
              <div>
                <Label htmlFor="category">Categoria</Label>
                <Select onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eletronicos">Eletrônicos</SelectItem>
                    <SelectItem value="roupas">Roupas</SelectItem>
                    <SelectItem value="alimentos">Alimentos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <RichTextEditor initialValue="" onChange={handleDescriptionChange} />
              </div>
              <div>
                <Label htmlFor="price">Preço</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={newProduct.price || ""}
                  onChange={handleNewProductChange}
                />
              </div>
              <div>
                <Label htmlFor="image">Imagem do Produto</Label>
                <FileUploader onFileSelect={handleImageUpload} />
              </div>
            </div>
            <div className="flex justify-between">
              <Button onClick={handleAddProduct}>Adicionar Produto</Button>
              <Button onClick={() => setShowPricingCalculator(true)}>Calculadora de Preços</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SKU</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead>Estoque</TableHead>
            <TableHead>Fornecedor</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProducts.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.sku}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>R$ {product.price.toFixed(2)}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>{product.supplier}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" onClick={() => handleShowPriceHistory(product.id)}>
                  Histórico de Preços
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShowPricingCalculator(product.id)}
                  className="ml-2"
                >
                  Calcular Preço
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-end mt-4">
        <CSVLink data={products} filename={"produtos.csv"}>
          <Button variant="outline">Exportar para CSV</Button>
        </CSVLink>
      </div>

      {showPriceHistory && selectedProductId && (
        <Dialog open={showPriceHistory} onOpenChange={setShowPriceHistory}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Histórico de Preços</DialogTitle>
            </DialogHeader>
            <PriceHistory productId={selectedProductId} />
          </DialogContent>
        </Dialog>
      )}

      {showPricingCalculator && selectedProductId && (
        <Dialog open={showPricingCalculator} onOpenChange={setShowPricingCalculator}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Calculadora de Preços</DialogTitle>
            </DialogHeader>
            <PricingCalculator productId={selectedProductId} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

