"use client"

import { useState } from "react"
import { BarChart, LineChart, PieChart, Download, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

type ReportType = "sales" | "inventory" | "financial" | "supplier"

export function ReportsModule() {
  const [selectedReport, setSelectedReport] = useState<ReportType>("sales")
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>()
  const [filters, setFilters] = useState({
    sales: { product: "", customer: "" },
    inventory: { product: "", supplier: "" },
    financial: { category: "" },
    supplier: { supplier: "" },
  })

  const generateReport = () => {
    // Implementação futura: Gerar relatório baseado na seleção e filtros
    console.log(`Gerando relatório de ${selectedReport} para o período:`, dateRange)
    console.log("Filtros:", filters[selectedReport])
    toast({
      title: "Relatório gerado",
      description: `O relatório de ${selectedReport} foi gerado com sucesso.`,
    })
  }

  const exportReport = () => {
    // Implementação futura: Exportar relatório em PDF ou Excel
    console.log(`Exportando relatório de ${selectedReport}`)
    toast({
      title: "Relatório exportado",
      description: `O relatório de ${selectedReport} foi exportado com sucesso.`,
    })
  }

  const renderFilters = () => {
    switch (selectedReport) {
      case "sales":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="product">Produto</Label>
              <Input
                id="product"
                value={filters.sales.product}
                onChange={(e) => setFilters({ ...filters, sales: { ...filters.sales, product: e.target.value } })}
                placeholder="Filtrar por produto"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer">Cliente</Label>
              <Input
                id="customer"
                value={filters.sales.customer}
                onChange={(e) => setFilters({ ...filters, sales: { ...filters.sales, customer: e.target.value } })}
                placeholder="Filtrar por cliente"
              />
            </div>
          </>
        )
      case "inventory":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="product">Produto</Label>
              <Input
                id="product"
                value={filters.inventory.product}
                onChange={(e) =>
                  setFilters({ ...filters, inventory: { ...filters.inventory, product: e.target.value } })
                }
                placeholder="Filtrar por produto"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplier">Fornecedor</Label>
              <Input
                id="supplier"
                value={filters.inventory.supplier}
                onChange={(e) =>
                  setFilters({ ...filters, inventory: { ...filters.inventory, supplier: e.target.value } })
                }
                placeholder="Filtrar por fornecedor"
              />
            </div>
          </>
        )
      case "financial":
        return (
          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Input
              id="category"
              value={filters.financial.category}
              onChange={(e) =>
                setFilters({ ...filters, financial: { ...filters.financial, category: e.target.value } })
              }
              placeholder="Filtrar por categoria"
            />
          </div>
        )
      case "supplier":
        return (
          <div className="space-y-2">
            <Label htmlFor="supplier">Fornecedor</Label>
            <Input
              id="supplier"
              value={filters.supplier.supplier}
              onChange={(e) => setFilters({ ...filters, supplier: { ...filters.supplier, supplier: e.target.value } })}
              placeholder="Filtrar por fornecedor"
            />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Relatórios</CardTitle>
        <CardDescription>Gere relatórios detalhados para análise e tomada de decisões</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="report-type">Tipo de Relatório</Label>
            <Select value={selectedReport} onValueChange={(value: ReportType) => setSelectedReport(value)}>
              <SelectTrigger id="report-type">
                <SelectValue placeholder="Selecione um relatório" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sales">Relatório de Vendas</SelectItem>
                <SelectItem value="inventory">Relatório de Estoque</SelectItem>
                <SelectItem value="financial">Relatório Financeiro</SelectItem>
                <SelectItem value="supplier">Relatório de Fornecedores</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Período</Label>
            <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          </div>
        </div>
        {renderFilters()}
        <div className="flex justify-between items-center">
          <Button onClick={generateReport}>
            {selectedReport === "sales" && <BarChart className="mr-2 h-4 w-4" />}
            {selectedReport === "inventory" && <PieChart className="mr-2 h-4 w-4" />}
            {selectedReport === "financial" && <LineChart className="mr-2 h-4 w-4" />}
            {selectedReport === "supplier" && <Filter className="mr-2 h-4 w-4" />}
            Gerar Relatório
          </Button>
          <Button variant="outline" onClick={exportReport}>
            <Download className="mr-2 h-4 w-4" /> Exportar
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          Os relatórios gerados fornecem insights valiosos para melhorar a gestão do seu negócio.
        </p>
      </CardFooter>
    </Card>
  )
}

