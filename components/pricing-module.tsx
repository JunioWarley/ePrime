"use client"

import { useState } from "react"
import { Save, FileDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"

type ListingType = "classic" | "premium"

interface PricingResult {
  sellingPrice: number
  profit: number
  mlFee: number
  taxes: number
  shipping: number
  finalProfit: number
  isViable: boolean
}

export function PricingModule() {
  const [cost, setCost] = useState<number>(0)
  const [desiredMargin, setDesiredMargin] = useState<number>(30)
  const [listingType, setListingType] = useState<ListingType>("classic")
  const [freeShipping, setFreeShipping] = useState<boolean>(false)
  const [shippingCost, setShippingCost] = useState<number>(0)
  const [targetPrice, setTargetPrice] = useState<number>(0)
  const [result, setResult] = useState<PricingResult | null>(null)

  const ML_CLASSIC_FEE = 12
  const ML_PREMIUM_FEE = 17
  const TAX_RATE = 12

  const calculateIdealPrice = () => {
    const mlFee = listingType === "classic" ? ML_CLASSIC_FEE : ML_PREMIUM_FEE
    const totalCost = cost + (freeShipping ? shippingCost : 0)
    const basePrice = totalCost / (1 - (mlFee + TAX_RATE + desiredMargin) / 100)
    const fees = basePrice * (mlFee / 100)
    const taxes = basePrice * (TAX_RATE / 100)
    const profit = basePrice * (desiredMargin / 100)

    setResult({
      sellingPrice: Number(basePrice.toFixed(2)),
      profit: Number(profit.toFixed(2)),
      mlFee: Number(fees.toFixed(2)),
      taxes: Number(taxes.toFixed(2)),
      shipping: freeShipping ? shippingCost : 0,
      finalProfit: Number((profit - (freeShipping ? shippingCost : 0)).toFixed(2)),
      isViable: true,
    })
  }

  const calculateViability = () => {
    const mlFee = listingType === "classic" ? ML_CLASSIC_FEE : ML_PREMIUM_FEE
    const totalCost = cost + (freeShipping ? shippingCost : 0)
    const fees = targetPrice * (mlFee / 100)
    const taxes = targetPrice * (TAX_RATE / 100)
    const profit = targetPrice - totalCost - fees - taxes - (freeShipping ? shippingCost : 0)
    const margin = (profit / targetPrice) * 100

    setResult({
      sellingPrice: targetPrice,
      profit: Number(profit.toFixed(2)),
      mlFee: Number(fees.toFixed(2)),
      taxes: Number(taxes.toFixed(2)),
      shipping: freeShipping ? shippingCost : 0,
      finalProfit: profit,
      isViable: margin >= 10, // Consideramos viável se a margem for de pelo menos 10%
    })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Calculadora de Preços</CardTitle>
        <CardDescription>Calcule o preço ideal ou verifique a viabilidade de um preço</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="ideal">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ideal">Preço Ideal</TabsTrigger>
            <TabsTrigger value="viability">Verificar Viabilidade</TabsTrigger>
          </TabsList>
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cost">Custo do Produto (R$)</Label>
                <Input
                  id="cost"
                  type="number"
                  min="0"
                  step="0.01"
                  value={cost || ""}
                  onChange={(e) => setCost(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="listingType">Tipo de Anúncio</Label>
                <Select value={listingType} onValueChange={(value: ListingType) => setListingType(value)}>
                  <SelectTrigger id="listingType">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="classic">Clássico ({ML_CLASSIC_FEE}%)</SelectItem>
                    <SelectItem value="premium">Premium ({ML_PREMIUM_FEE}%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="freeShipping">Frete Grátis</Label>
                <Switch id="freeShipping" checked={freeShipping} onCheckedChange={setFreeShipping} />
              </div>
              {freeShipping && (
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={shippingCost || ""}
                  onChange={(e) => setShippingCost(Number(e.target.value))}
                  placeholder="Custo do frete"
                />
              )}
            </div>
            <TabsContent value="ideal">
              <div className="space-y-2">
                <Label htmlFor="margin">Margem de Lucro Desejada (%)</Label>
                <Slider
                  id="margin"
                  min={0}
                  max={100}
                  step={1}
                  value={[desiredMargin]}
                  onValueChange={(value) => setDesiredMargin(value[0])}
                />
                <div className="text-right text-sm text-muted-foreground">{desiredMargin}%</div>
              </div>
              <Button className="w-full mt-4" onClick={calculateIdealPrice}>
                Calcular Preço Ideal
              </Button>
            </TabsContent>
            <TabsContent value="viability">
              <div className="space-y-2">
                <Label htmlFor="targetPrice">Preço de Venda Desejado (R$)</Label>
                <Input
                  id="targetPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={targetPrice || ""}
                  onChange={(e) => setTargetPrice(Number(e.target.value))}
                />
              </div>
              <Button className="w-full mt-4" onClick={calculateViability}>
                Verificar Viabilidade
              </Button>
            </TabsContent>
          </div>
        </Tabs>
        {result && (
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Resultado:</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>Preço de Venda:</div>
              <div className="text-right">{formatCurrency(result.sellingPrice)}</div>
              <div>Tarifa ML:</div>
              <div className="text-right">{formatCurrency(result.mlFee)}</div>
              <div>Impostos:</div>
              <div className="text-right">{formatCurrency(result.taxes)}</div>
              <div>Frete:</div>
              <div className="text-right">{formatCurrency(result.shipping)}</div>
              <div>Lucro Final:</div>
              <div className="text-right">{formatCurrency(result.finalProfit)}</div>
              {result.isViable !== undefined && (
                <>
                  <div>Viabilidade:</div>
                  <div className={`text-right ${result.isViable ? "text-green-600" : "text-red-600"}`}>
                    {result.isViable ? "Viável" : "Não Viável"}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => {
            toast({
              title: "Preço salvo",
              description: "O preço foi salvo e será atualizado no cadastro do produto.",
            })
          }}
        >
          <Save className="mr-2 h-4 w-4" /> Salvar Preço
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            toast({
              title: "Exportando dados",
              description: "Os dados da precificação estão sendo exportados.",
            })
          }}
        >
          <FileDown className="mr-2 h-4 w-4" /> Exportar
        </Button>
      </CardFooter>
    </Card>
  )
}

