"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"

const mockData = [
  { name: "Jan", entrada: 400, saida: 240 },
  { name: "Fev", entrada: 300, saida: 139 },
  { name: "Mar", entrada: 200, saida: 980 },
  { name: "Abr", entrada: 278, saida: 390 },
  { name: "Mai", entrada: 189, saida: 480 },
  { name: "Jun", entrada: 239, saida: 380 },
]

const stockLevels = [
  { name: "Produto A", atual: 100, minimo: 20 },
  { name: "Produto B", atual: 150, minimo: 30 },
  { name: "Produto C", atual: 80, minimo: 25 },
  { name: "Produto D", atual: 200, minimo: 50 },
  { name: "Produto E", atual: 120, minimo: 40 },
]

export function InventoryReport() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>()
  const [reportType, setReportType] = useState("movement")
  const [chartType, setChartType] = useState<"bar" | "line">("bar")

  const renderChart = () => {
    const data = reportType === "movement" ? mockData : stockLevels

    if (chartType === "bar") {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {reportType === "movement" ? (
              <>
                <Bar dataKey="entrada" fill="#4CAF50" name="Entrada" />
                <Bar dataKey="saida" fill="#F44336" name="Saída" />
              </>
            ) : (
              <>
                <Bar dataKey="atual" fill="#2196F3" name="Estoque Atual" />
                <Bar dataKey="minimo" fill="#FF9800" name="Estoque Mínimo" />
              </>
            )}
          </BarChart>
        </ResponsiveContainer>
      )
    }

    return (
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {reportType === "movement" ? (
            <>
              <Line type="monotone" dataKey="entrada" stroke="#4CAF50" name="Entrada" />
              <Line type="monotone" dataKey="saida" stroke="#F44336" name="Saída" />
            </>
          ) : (
            <>
              <Line type="monotone" dataKey="atual" stroke="#2196F3" name="Estoque Atual" />
              <Line type="monotone" dataKey="minimo" stroke="#FF9800" name="Estoque Mínimo" />
            </>
          )}
        </LineChart>
      </ResponsiveContainer>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Relatório de Estoque</CardTitle>
        <CardDescription>Análise detalhada do estoque</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          </div>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo de relatório" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="movement">Movimentações</SelectItem>
              <SelectItem value="levels">Níveis de Estoque</SelectItem>
            </SelectContent>
          </Select>
          <Select value={chartType} onValueChange={setChartType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo de gráfico" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bar">Barra</SelectItem>
              <SelectItem value="line">Linha</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mt-4">{renderChart()}</div>
      </CardContent>
    </Card>
  )
}

