"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { toast } from "@/components/ui/use-toast"

export function ReportGenerator() {
  const [reportType, setReportType] = useState("")
  const [dateRange, setDateRange] = useState({ from: new Date(), to: new Date() })

  const generateReport = () => {
    // This is where you'd implement the actual report generation logic
    // For now, we'll just show a toast message
    toast({
      title: "Relatório gerado",
      description: `Relatório de ${reportType} gerado para o período de ${dateRange.from.toLocaleDateString()} a ${dateRange.to.toLocaleDateString()}`,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerador de Relatórios</CardTitle>
        <CardDescription>Selecione o tipo de relatório e o período desejado</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Select onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de relatório" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vendas">Relatório de Vendas</SelectItem>
                <SelectItem value="estoque">Relatório de Estoque</SelectItem>
                <SelectItem value="financeiro">Relatório Financeiro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={generateReport} disabled={!reportType}>
          Gerar Relatório
        </Button>
      </CardFooter>
    </Card>
  )
}

