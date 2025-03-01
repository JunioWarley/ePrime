"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

export function SalesReport() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>()
  const [reportType, setReportType] = useState("sales")
  const [viewType, setViewType] = useState<"chart" | "table">("chart")
  const [chartType, setChartType] = useState<"line" | "bar" | "pie">("line")

  // Mock data
  const salesData = [
    { date: "2023-01", sales: 4000, revenue: 24000, profit: 9600 },
    { date: "2023-02", sales: 3000, revenue: 18000, profit: 7200 },
    { date: "2023-03", sales: 2000, revenue: 12000, profit: 4800 },
    { date: "2023-04", sales: 2780, revenue: 16680, profit: 6672 },
    { date: "2023-05", sales: 1890, revenue: 11340, profit: 4536 },
    { date: "2023-06", sales: 2390, revenue: 14340, profit: 5736 },
  ]

  const pieData = [
    { name: "Eletrônicos", value: 400 },
    { name: "Roupas", value: 300 },
    { name: "Acessórios", value: 300 },
    { name: "Livros", value: 200 },
    { name: "Outros", value: 100 },
  ]

  const renderChart = () => {
    switch (chartType) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#8884d8" />
              <Line type="monotone" dataKey="revenue" stroke="#82ca9d" />
              <Line type="monotone" dataKey="profit" stroke="#ffc658" />
            </LineChart>
          </ResponsiveContainer>
        )
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#8884d8" />
              <Bar dataKey="revenue" fill="#82ca9d" />
              <Bar dataKey="profit" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        )
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Relatório de Vendas</CardTitle>
        <CardDescription>Análise detalhada das vendas</CardDescription>
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
              <SelectItem value="sales">Vendas</SelectItem>
              <SelectItem value="revenue">Receita</SelectItem>
              <SelectItem value="profit">Lucro</SelectItem>
            </SelectContent>
          </Select>
          <Select value={chartType} onValueChange={setChartType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo de gráfico" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="line">Linha</SelectItem>
              <SelectItem value="bar">Barra</SelectItem>
              <SelectItem value="pie">Pizza</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button variant={viewType === "chart" ? "default" : "outline"} onClick={() => setViewType("chart")}>
              Gráfico
            </Button>
            <Button variant={viewType === "table" ? "default" : "outline"} onClick={() => setViewType("table")}>
              Tabela
            </Button>
          </div>
        </div>

        <div className="mt-4">
          {viewType === "chart" ? (
            renderChart()
          ) : (
            <div className="rounded-md border">
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="px-4 py-2 text-left">Data</th>
                    <th className="px-4 py-2 text-left">Vendas</th>
                    <th className="px-4 py-2 text-left">Receita</th>
                    <th className="px-4 py-2 text-left">Lucro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {salesData.map((row, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2">{row.date}</td>
                      <td className="px-4 py-2">{row.sales}</td>
                      <td className="px-4 py-2">R$ {row.revenue}</td>
                      <td className="px-4 py-2">R$ {row.profit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

