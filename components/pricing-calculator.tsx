"use client"

import { useState, useEffect, useCallback } from "react"
import { Calculator, Save, FileDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface PricingResult {
  sellingPrice: number
  profit: number
  commission: number
  taxes: number
  shipping: number
  finalProfit: number
}

export function PricingCalculator() {
  const [productCost, setProductCost] = useState<number>(0)
  const [listingType, setListingType] = useState<"classic" | "premium">("classic")
  const [desiredProfit, setDesiredProfit] = useState<number>(30)
  const [freeShipping, setFreeShipping] = useState<boolean>(false)
  const [shippingCost, setShippingCost] = useState<number>(0)
  const [result, setResult] = useState<PricingResult | null>(null)

  const CLASSIC_COMMISSION = 12
  const PREMIUM_COMMISSION = 17
  const TAX_RATE = 12

  const calculatePrice = useCallback(() => {
    const commission = listingType === "classic" ? CLASSIC_COMMISSION : PREMIUM_COMMISSION
    const totalCost = productCost + shippingCost

    // Cálculo considerando impostos e comissões
    const basePrice = totalCost / (1 - (commission + TAX_RATE + desiredProfit) / 100)

    const commissionValue = basePrice * (commission / 100)
    const taxValue = basePrice * (TAX_RATE / 100)
    const profitValue = basePrice * (desiredProfit / 100)

    setResult({
      sellingPrice: Number(basePrice.toFixed(2)),
      profit: Number(profitValue.toFixed(2)),
      commission: Number(commissionValue.toFixed(2)),
      taxes: Number(taxValue.toFixed(2)),
      shipping: shippingCost,
      finalProfit: Number((profitValue - shippingCost).toFixed(2)),
    })
  }, [productCost, shippingCost, listingType, desiredProfit])

  useEffect(() => {
    if (productCost > 0) {
      calculatePrice()
    }
  }, [productCost, calculatePrice])

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Calculadora de Preços Mercado Livre</CardTitle>
        <CardDescription>Calcule o preço ideal considerando taxas e comissões</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="productCost">Custo do Produto</Label>
            <Input
              id="productCost"
              type="number"
              min="0"
              step="0.01"
              value={productCost || ""}
              onChange={(e) => setProductCost(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="listingType">Tipo de Anúncio</Label>
            <Select value={listingType} onValueChange={(value: "classic" | "premium") => setListingType(value)}>
              <SelectTrigger id="listingType">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="classic">Clássico ({CLASSIC_COMMISSION}%)</SelectItem>
                <SelectItem value="premium">Premium ({PREMIUM_COMMISSION}%)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="profit">Margem de Lucro Desejada (%)</Label>
            <Input
              id="profit"
              type="number"
              min="0"
              max="100"
              value={desiredProfit}
              onChange={(e) => setDesiredProfit(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shipping">Custo de Envio</Label>
            <Input
              id="shipping"
              type="number"
              min="0"
              step="0.01"
              value={shippingCost}
              onChange={(e) => setShippingCost(Number(e.target.value))}
            />
          </div>
        </div>

        {result && (
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">Preço Sugerido</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-2xl font-bold text-primary">R$ {result.sellingPrice.toFixed(2)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">Lucro Final</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className={`text-2xl font-bold ${result.finalProfit > 0 ? "text-green-600" : "text-red-600"}`}>
                    R$ {result.finalProfit.toFixed(2)}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-muted p-4 rounded-lg space-y-2">
              <h4 className="font-semibold">Detalhamento:</h4>
              <ul className="space-y-1">
                <li>Comissão ML: R$ {result.commission.toFixed(2)}</li>
                <li>Impostos: R$ {result.taxes.toFixed(2)}</li>
                <li>Frete: R$ {result.shipping.toFixed(2)}</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={calculatePrice}>
                <Calculator className="mr-2 h-4 w-4" />
                Recalcular
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Atualizar cálculos com os valores atuais</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="space-x-2">
          <Button variant="outline" onClick={() => console.log("Salvando...")}>
            <Save className="mr-2 h-4 w-4" />
            Salvar
          </Button>
          <Button variant="outline" onClick={() => console.log("Exportando...")}>
            <FileDown className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

