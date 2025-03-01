"use client"

import { useState } from "react"
import { BarChart, FileDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function Reports() {
  const [selectedReport, setSelectedReport] = useState<string>("")

  const generateReport = () => {
    // Implementação futura: Gerar relatório baseado na seleção
    console.log(`Gerando relatório: ${selectedReport}`)
  }

  const exportReport = () => {
    // Implementação futura: Exportar relatório em PDF ou Excel
    console.log(`Exportando relatório: ${selectedReport}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Relatórios</CardTitle>
        <CardDescription>Gere e exporte relatórios detalhados</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select onValueChange={setSelectedReport}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione um relatório" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vendas">Relatório de Vendas</SelectItem>
            <SelectItem value="estoque">Relatório de Estoque</SelectItem>
            <SelectItem value="financeiro">Relatório Financeiro</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={generateReport} disabled={!selectedReport}>
          <BarChart className="mr-2 h-4 w-4" /> Gerar Relatório
        </Button>
        <Button onClick={exportReport} variant="outline" disabled={!selectedReport}>
          <FileDown className="mr-2 h-4 w-4" /> Exportar
        </Button>
      </CardFooter>
    </Card>
  )
}

