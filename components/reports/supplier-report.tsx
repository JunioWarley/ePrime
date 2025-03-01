"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function SupplierReport() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>()
  const [reportType, setReportType] = useState("purchases")
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
      { supplier: "Fornecedor A", purchases: 10000, onTimeDelivery: "95%", quality: "Excelente" },
      { supplier: "Fornecedor B", purchases: 8500, onTimeDelivery: "88%", quality: "Bom" },
      { supplier: "Fornecedor C", purchases: 12000, onTimeDelivery: "92%", quality: "Muito Bom" },
      { supplier: "Fornecedor D", purchases: 6000, onTimeDelivery: "85%", quality: "Regular" },
      { supplier: "Fornecedor E", purchases: 15000, onTimeDelivery: "98%", quality: "Excelente" },
    ]

    setReportData(fakeData)

    toast({
      title: "Relatório gerado",
      description: "O relatório de fornecedores foi gerado com sucesso",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Relatório de Fornecedores</CardTitle>
        <CardDescription>Gere relatórios relacionados aos fornecedores</CardDescription>
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
              <SelectItem value="purchases">Compras</SelectItem>
              <SelectItem value="performance">Desempenho</SelectItem>
              <SelectItem value="payments">Pagamentos</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={generateReport}>Gerar Relatório</Button>
        {reportData.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Compras</TableHead>
                <TableHead>Entrega no Prazo</TableHead>
                <TableHead>Qualidade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.supplier}</TableCell>
                  <TableCell>R$ {row.purchases.toFixed(2)}</TableCell>
                  <TableCell>{row.onTimeDelivery}</TableCell>
                  <TableCell>{row.quality}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

