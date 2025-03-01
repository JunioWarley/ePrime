"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { useAuth } from "@/contexts/auth-context"

interface StockMovement {
  id: string
  productId: string
  productName: string
  quantity: number
  type: "manual_in" | "manual_out" | "automatic_out" | "adjustment" | "transfer"
  userId: string
  userName: string
  reason: string
  timestamp: Date
  supplier?: string
  invoiceNumber?: string
  unitCost?: number
  fromStore?: string
  toStore?: string
  ean?: string
}

export function StockMovements() {
  const { user, stores } = useAuth()
  const [movements, setMovements] = useState<StockMovement[]>([])
  const [showMovementDialog, setShowMovementDialog] = useState(false)
  const [newMovement, setNewMovement] = useState<Partial<StockMovement>>({
    type: "manual_in",
    quantity: 0,
    reason: "",
    timestamp: new Date(),
  })

  // Simulated products and suppliers (replace with actual data in a real application)
  const products = [
    { id: "1", name: "Product A" },
    { id: "2", name: "Product B" },
    { id: "3", name: "Product C" },
  ]

  const suppliers = [
    { id: "1", name: "Supplier X" },
    { id: "2", name: "Supplier Y" },
    { id: "3", name: "Supplier Z" },
  ]

  useEffect(() => {
    // Simulated data loading (replace with actual API call in a real application)
    setMovements([
      {
        id: "1",
        productId: "1",
        productName: "Product A",
        quantity: 10,
        type: "manual_in",
        userId: "1",
        userName: "John Doe",
        reason: "Restock",
        timestamp: new Date(),
        supplier: "Supplier X",
        invoiceNumber: "INV-001",
        unitCost: 9.99,
        ean: "1234567890123",
      },
      // Add more mock data as needed
    ])
  }, [])

  const handleAddMovement = () => {
    if (!user) return

    const movement: StockMovement = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      ...(newMovement as StockMovement),
    }

    setMovements([...movements, movement])
    setShowMovementDialog(false)
    setNewMovement({
      type: "manual_in",
      quantity: 0,
      reason: "",
      timestamp: new Date(),
    })
    toast({
      title: "Movimentação registrada",
      description: `Nova movimentação de estoque registrada com sucesso.`,
    })
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Movimentações de Estoque</CardTitle>
          <CardDescription>Histórico de todas as movimentações de estoque</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Motivo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movements.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell>{movement.timestamp.toLocaleString()}</TableCell>
                  <TableCell>{movement.productName}</TableCell>
                  <TableCell>{movement.type}</TableCell>
                  <TableCell>{movement.quantity}</TableCell>
                  <TableCell>{movement.userName}</TableCell>
                  <TableCell>{movement.reason}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <Button onClick={() => setShowMovementDialog(true)}>Registrar Nova Movimentação</Button>
        </CardFooter>
      </Card>

      <Dialog open={showMovementDialog} onOpenChange={setShowMovementDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Movimentação de Estoque</DialogTitle>
            <DialogDescription>Preencha os detalhes da movimentação</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="movementType" className="text-right">
                Tipo de Movimentação
              </Label>
              <Select
                value={newMovement.type}
                onValueChange={(value: StockMovement["type"]) => setNewMovement({ ...newMovement, type: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual_in">Entrada Manual</SelectItem>
                  <SelectItem value="manual_out">Saída Manual</SelectItem>
                  <SelectItem value="adjustment">Ajuste de Estoque</SelectItem>
                  <SelectItem value="transfer">Transferência</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="product" className="text-right">
                Produto
              </Label>
              <Select
                value={newMovement.productId}
                onValueChange={(value) => {
                  const product = products.find((p) => p.id === value)
                  setNewMovement({ ...newMovement, productId: value, productName: product?.name })
                }}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o produto" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantidade
              </Label>
              <Input
                id="quantity"
                type="number"
                value={newMovement.quantity}
                onChange={(e) => setNewMovement({ ...newMovement, quantity: Number(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reason" className="text-right">
                Motivo
              </Label>
              <Input
                id="reason"
                value={newMovement.reason}
                onChange={(e) => setNewMovement({ ...newMovement, reason: e.target.value })}
                className="col-span-3"
              />
            </div>
            {newMovement.type === "manual_in" && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="supplier" className="text-right">
                    Fornecedor
                  </Label>
                  <Select
                    value={newMovement.supplier}
                    onValueChange={(value) => setNewMovement({ ...newMovement, supplier: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione o fornecedor" />
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
                  <Label htmlFor="ean" className="text-right">
                    EAN
                  </Label>
                  <Input
                    id="ean"
                    value={newMovement.ean}
                    onChange={(e) => setNewMovement({ ...newMovement, ean: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="invoiceNumber" className="text-right">
                    Nota Fiscal
                  </Label>
                  <Input
                    id="invoiceNumber"
                    value={newMovement.invoiceNumber}
                    onChange={(e) => setNewMovement({ ...newMovement, invoiceNumber: e.target.value })}
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
                    value={newMovement.unitCost}
                    onChange={(e) => setNewMovement({ ...newMovement, unitCost: Number(e.target.value) })}
                    className="col-span-3"
                  />
                </div>
              </>
            )}
            {newMovement.type === "transfer" && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="fromStore" className="text-right">
                    De
                  </Label>
                  <Select
                    value={newMovement.fromStore}
                    onValueChange={(value) => setNewMovement({ ...newMovement, fromStore: value })}
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
                    value={newMovement.toStore}
                    onValueChange={(value) => setNewMovement({ ...newMovement, toStore: value })}
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
              </>
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleAddMovement}>Registrar Movimentação</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

