"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function FinancialReport() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>()
  const [reportType, setReportType] = useState("revenue")
  const [reportData, setReportData] = useState<any[]>([])

  const generateReport = () => {
    if (!dateRange?.from || !dateRange?.to) {
      toast({
        title: "Selecione um período",
        description: "É necessário selecionar um período para gerar o relatório",
        variant: "destructive",
      })
      return
    }

    // Gerar dados fictícios
    const fakeData = [
      { date: "2023-05-01", revenue: 5000, expenses: 3000, profit: 2000 },
      { date: "2023-05-02", revenue: 4500, expenses: 2800, profit: 1700 },
      { date: "2023-05-03", revenue: 6000, expenses: 3500, profit: 2500 },
      { date: "2023-05-04", revenue: 5500, expenses: 3200, profit: 2300 },
      { date: "2023-05-05", revenue: 4800, expenses: 3100, profit: 1700 },
    ]

    setReportData(fakeData)

    toast({
      title: "Relatório gerado",
      description: "O relatório financeiro foi gerado com sucesso",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Relatório Financeiro</CardTitle>
        <CardDescription>Gere relatórios financeiros detalhados</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label>Período</label>
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
        </div>
        <div className="space-y-2">
          <label>Tipo de Relatório</label>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo de relatório" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="revenue">Receitas</SelectItem>
              <SelectItem value="expenses">Despesas</SelectItem>
              <SelectItem value="profit">Lucros e Perdas</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={generateReport}>Gerar Relatório</Button>
        {reportData.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Receita</TableHead>
                <TableHead>Despesas</TableHead>
                <TableHead>Lucro</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>R$ {row.revenue.toFixed(2)}</TableCell>
                  <TableCell>R$ {row.expenses.toFixed(2)}</TableCell>
                  <TableCell>R$ {row.profit.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

