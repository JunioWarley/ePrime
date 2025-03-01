export interface StockMovement {
  id: string
  productId: string
  quantity: number
  type: "manual_in" | "manual_out" | "automatic_out" | "adjustment" | "transfer"
  userId: string
  reason: string
  timestamp: Date
  supplier?: string
  invoiceNumber?: string
  unitCost?: number
  fromStore?: string
  toStore?: string
}

