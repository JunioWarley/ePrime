"use client"

import { useState } from "react"
import { Plus, AlertTriangle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
import type { StockMovement } from "@/types/stock-movement"

type Product = {
  id: number
  name: string
  sku: string
  quantity: number
  price: number
  minStock: number
  depot: string
}

type Supplier = {
  id: string
  name: string
}

export function InventoryControl() {
  const { user, stores } = useAuth()
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Produto A", sku: "SKU001", quantity: 100, price: 50, minStock: 20, depot: "Central" },
    { id: 2, name: "Produto B", sku: "SKU002", quantity: 75, price: 30, minStock: 15, depot: "Filial 1" },
    { id: 3, name: "Produto C", sku: "SKU003", quantity: 5, price: 100, minStock: 10, depot: "Central" },
  ])
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([])
  const [showStockEntryDialog, setShowStockEntryDialog] = useState(false)
  const [showStockAdjustmentDialog, setShowStockAdjustmentDialog] = useState(false)
  const [showStockTransferDialog, setShowStockTransferDialog] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null)
  const [stockEntry, setStockEntry] = useState({
    quantity: 0,
    supplier: "",
    invoiceNumber: "",
    unitCost: 0,
    date: new Date().toISOString().split("T")[0],
  })
  const [stockAdjustment, setStockAdjustment] = useState({
    quantity: 0,
    reason: "",
  })
  const [stockTransfer, setStockTransfer] = useState({
    quantity: 0,
    fromStore: "",
    toStore: "",
    reason: "",
  })

  // Mock suppliers (replace with actual data in a real application)
  const suppliers: Supplier[] = [
    { id: "1", name: "Supplier A" },
    { id: "2", name: "Supplier B" },
    { id: "3", name: "Supplier C" },
  ]

  const handleStockEntry = () => {
    if (!currentProduct || !user) return

    const newMovement: StockMovement = {
      id: Date.now().toString(),
      productId: currentProduct.id.toString(),
      quantity: stockEntry.quantity,
      type: "manual_in",
      userId: user.id,
      reason: "Entrada de estoque",
      timestamp: new Date(),
      supplier: stockEntry.supplier,
      invoiceNumber: stockEntry.invoiceNumber,
      unitCost: stockEntry.unitCost,
    }

    setStockMovements([...stockMovements, newMovement])
    setProducts(
      products.map((p) => (p.id === currentProduct.id ? { ...p, quantity: p.quantity + stockEntry.quantity } : p)),
    )

    setShowStockEntryDialog(false)
    setStockEntry({
      quantity: 0,
      supplier: "",
      invoiceNumber: "",
      unitCost: 0,
      date: new Date().toISOString().split("T")[0],
    })
    toast({
      title: "Entrada de estoque registrada",
      description: `${stockEntry.quantity} unidades adicionadas ao produto ${currentProduct.name}`,
    })
  }

  const handleStockAdjustment = () => {
    if (!currentProduct || !user) return

    const newMovement: StockMovement = {
      id: Date.now().toString(),
      productId: currentProduct.id.toString(),
      quantity: stockAdjustment.quantity - currentProduct.quantity,
      type: "adjustment",
      userId: user.id,
      reason: stockAdjustment.reason,
      timestamp: new Date(),
    }

    setStockMovements([...stockMovements, newMovement])
    setProducts(products.map((p) => (p.id === currentProduct.id ? { ...p, quantity: stockAdjustment.quantity } : p)))

    setShowStockAdjustmentDialog(false)
    setStockAdjustment({ quantity: 0, reason: "" })
    toast({
      title: "Estoque ajustado",
      description: `Quantidade do produto ${currentProduct.name} ajustada para ${stockAdjustment.quantity}`,
    })
  }

  const handleStockTransfer = () => {
    if (!currentProduct || !user) return

    const newMovement: StockMovement = {
      id: Date.now().toString(),
      productId: currentProduct.id.toString(),
      quantity: stockTransfer.quantity,
      type: "transfer",
      userId: user.id,
      reason: stockTransfer.reason,
      timestamp: new Date(),
      fromStore: stockTransfer.fromStore,
      toStore: stockTransfer.toStore,
    }

    setStockMovements([...stockMovements, newMovement])
    setProducts(
      products.map((p) =>
        p.id === currentProduct.id
          ? { ...p, quantity: p.quantity - stockTransfer.quantity, depot: stockTransfer.toStore }
          : p,
      ),
    )

    setShowStockTransferDialog(false)
    setStockTransfer({ quantity: 0, fromStore: "", toStore: "", reason: "" })
    toast({
      title: "Transferência de estoque realizada",
      description: `${stockTransfer.quantity} unidades do produto ${currentProduct.name} transferidas de ${stockTransfer.fromStore} para ${stockTransfer.toStore}`,
    })
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Controle de Estoque</CardTitle>
          <CardDescription>Gerencie o estoque dos seus produtos</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Depósito</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>
                    {product.quantity}
                    {product.quantity <= product.minStock && (
                      <AlertTriangle className="inline ml-2 h-4 w-4 text-yellow-500" />
                    )}
                  </TableCell>
                  <TableCell>R$ {product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.depot}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      onClick={() => {
                        setCurrentProduct(product)
                        setShowStockEntryDialog(true)
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Entrada
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setCurrentProduct(product)
                        setShowStockAdjustmentDialog(true)
                      }}
                    >
                      Ajustar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setCurrentProduct(product)
                        setShowStockTransferDialog(true)
                      }}
                    >
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Transferir
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showStockEntryDialog} onOpenChange={setShowStockEntryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Entrada de Estoque</DialogTitle>
            <DialogDescription>Registre a entrada de produtos no estoque</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantidade
              </Label>
              <Input
                id="quantity"
                type="number"
                value={stockEntry.quantity}
                onChange={(e) => setStockEntry({ ...stockEntry, quantity: Number.parseInt(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="supplier" className="text-right">
                Fornecedor
              </Label>
              <Select
                value={stockEntry.supplier}
                onValueChange={(value) => setStockEntry({ ...stockEntry, supplier: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione um fornecedor" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="invoiceNumber" className="text-right">
                Nota Fiscal
              </Label>
              <Input
                id="invoiceNumber"
                value={stockEntry.invoiceNumber}
                onChange={(e) => setStockEntry({ ...stockEntry, invoiceNumber: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="unitCost" className="text-right">
                Custo Unitário
              </Label>
              <Input
                id="unitCost"
                type="number"
                value={stockEntry.unitCost}
                onChange={(e) => setStockEntry({ ...stockEntry, unitCost: Number.parseFloat(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Data de Entrada
              </Label>
              <Input
                id="date"
                type="date"
                value={stockEntry.date}
                onChange={(e) => setStockEntry({ ...stockEntry, date: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleStockEntry}>Registrar Entrada</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showStockAdjustmentDialog} onOpenChange={setShowStockAdjustmentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajuste de Estoque</DialogTitle>
            <DialogDescription>Ajuste a quantidade em estoque do produto</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="adjustQuantity" className="text-right">
                Nova Quantidade
              </Label>
              <Input
                id="adjustQuantity"
                type="number"
                value={stockAdjustment.quantity}
                onChange={(e) => setStockAdjustment({ ...stockAdjustment, quantity: Number.parseInt(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="adjustReason" className="text-right">
                Motivo
              </Label>
              <Input
                id="adjustReason"
                value={stockAdjustment.reason}
                onChange={(e) => setStockAdjustment({ ...stockAdjustment, reason: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleStockAdjustment}>Ajustar Estoque</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showStockTransferDialog} onOpenChange={setShowStockTransferDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transferência de Estoque</DialogTitle>
            <DialogDescription>Transfira produtos entre lojas</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="transferQuantity" className="text-right">
                Quantidade
              </Label>
              <Input
                id="transferQuantity"
                type="number"
                value={stockTransfer.quantity}
                onChange={(e) => setStockTransfer({ ...stockTransfer, quantity: Number.parseInt(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fromStore" className="text-right">
                De
              </Label>
              <Select
                value={stockTransfer.fromStore}
                onValueChange={(value) => setStockTransfer({ ...stockTransfer, fromStore: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione a loja de origem" />
                </SelectTrigger>
                <SelectContent>
                  {stores.map((store) => (
                    <SelectItem key={store.id} value={store.id}>
                      {store.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="toStore" className="text-right">
                Para
              </Label>
              <Select
                value={stockTransfer.toStore}
                onValueChange={(value) => setStockTransfer({ ...stockTransfer, toStore: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione a loja de destino" />
                </SelectTrigger>
                <SelectContent>
                  {stores.map((store) => (
                    <SelectItem key={store.id} value={store.id}>
                      {store.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="transferReason" className="text-right">
                Motivo
              </Label>
              <Input
                id="transferReason"
                value={stockTransfer.reason}
                onChange={(e) => setStockTransfer({ ...stockTransfer, reason: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleStockTransfer}>Realizar Transferência</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

