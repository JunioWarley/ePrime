"use client"

import { useState } from "react"
import { AlertCircle, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ViabilityAnalysis() {
  const [sellingPrice, setSellingPrice] = useState<number>(0)
  const [costs, setCosts] = useState<number>(0)
  const [profit, setProfit] = useState<number | null>(null)
  const [viability, setViability] = useState<"viable" | "attention" | "loss" | null>(null)

  const calculateViability = () => {
    const profitAmount = sellingPrice - costs
    setProfit(Number(profitAmount.toFixed(2)))

    if (profitAmount > 0.2 * sellingPrice) {
      setViability("viable")
    } else if (profitAmount > 0) {
      setViability("attention")
    } else {
      setViability("loss")
    }
  }

  const saveAnalysis = () => {
    // Implementação futura: Salvar no banco de dados
    console.log("Analysis saved:", { sellingPrice, costs, profit, viability })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Análise de Viabilidade</CardTitle>
        <CardDescription>Verifique a viabilidade do seu preço de venda</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="sellingPrice">Preço de Venda</Label>
          <Input
            id="sellingPrice"
            type="number"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="costs">Custos Totais</Label>
          <Input id="costs" type="number" value={costs} onChange={(e) => setCosts(Number(e.target.value))} />
        </div>
        {profit !== null && viability && (
          <div
            className={`p-4 rounded-md ${
              viability === "viable"
                ? "bg-green-100 text-green-800"
                : viability === "attention"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
            }`}
          >
            <p className="font-semibold">Lucro: R$ {profit}</p>
            <p>Status: {viability === "viable" ? "Viável" : viability === "attention" ? "Atenção" : "Prejuízo"}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={calculateViability}>
          <AlertCircle className="mr-2 h-4 w-4" /> Analisar Viabilidade
        </Button>
        <Button onClick={saveAnalysis} variant="outline">
          <Save className="mr-2 h-4 w-4" /> Salvar Análise
        </Button>
      </CardFooter>
    </Card>
  )
}

