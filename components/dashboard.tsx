"use client"

import { useState } from "react"
import { AlertCircle, ArrowDownIcon, ArrowUpIcon, BarChart3, DollarSign, Package, ShoppingBag } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SalesChart } from "@/components/sales-chart"
import { StockChart } from "@/components/stock-chart"

export function Dashboard() {
  const [period, setPeriod] = useState<"day" | "week" | "month" | "year">("month")

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">R$ 45.231,89</div>
          <p className="text-xs text-muted-foreground">+20,1% em relação ao mês anterior</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Vendas</CardTitle>
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+573</div>
          <p className="text-xs text-muted-foreground">+12,5% em relação ao mês anterior</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Margem Média</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">32,5%</div>
          <p className="text-xs text-muted-foreground">+2,1% em relação ao mês anterior</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Produtos em Estoque</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1.203</div>
          <p className="text-xs text-muted-foreground">+49 produtos adicionados hoje</p>
        </CardContent>
      </Card>
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Visão Geral de Vendas</CardTitle>
          <div className="flex space-x-2">
            <Button variant={period === "day" ? "default" : "outline"} size="sm" onClick={() => setPeriod("day")}>
              Dia
            </Button>
            <Button variant={period === "week" ? "default" : "outline"} size="sm" onClick={() => setPeriod("week")}>
              Semana
            </Button>
            <Button variant={period === "month" ? "default" : "outline"} size="sm" onClick={() => setPeriod("month")}>
              Mês
            </Button>
            <Button variant={period === "year" ? "default" : "outline"} size="sm" onClick={() => setPeriod("year")}>
              Ano
            </Button>
          </div>
        </CardHeader>
        <CardContent className="h-[300px]">
          <SalesChart period={period} />
        </CardContent>
      </Card>
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Produtos Mais Vendidos</CardTitle>
          <CardDescription>Os 5 produtos mais vendidos no período atual</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: "Smartphone XYZ Pro", sales: 124, growth: 12 },
              { name: "Tablet Ultra 10", sales: 98, growth: 4 },
              { name: "Headphone Bluetooth G7", sales: 87, growth: -2 },
              { name: "Smartwatch Series 4", sales: 65, growth: 15 },
              { name: "Power Bank 20000mAh", sales: 63, growth: 3 },
            ].map((product) => (
              <div key={product.name} className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">{product.name}</p>
                  <p className="text-sm text-muted-foreground">{product.sales} vendas</p>
                </div>
                <div
                  className={cn(
                    "flex items-center",
                    product.growth > 0 ? "text-green-600" : product.growth < 0 ? "text-red-600" : "text-yellow-600",
                  )}
                >
                  {product.growth > 0 ? (
                    <ArrowUpIcon className="mr-1 h-4 w-4" />
                  ) : product.growth < 0 ? (
                    <ArrowDownIcon className="mr-1 h-4 w-4" />
                  ) : null}
                  <span className="text-sm font-medium">
                    {product.growth > 0 ? "+" : ""}
                    {product.growth}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Evolução do Estoque</CardTitle>
          <CardDescription>Estoque ao longo do tempo</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <StockChart />
        </CardContent>
      </Card>
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Alertas de Estoque</CardTitle>
          <CardDescription>Produtos que estão com estoque em níveis críticos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Headphone Bluetooth G7",
                stock: 3,
                min: 10,
                supplier: "Eletrônicos Brasil",
              },
              {
                name: "Power Bank 20000mAh",
                stock: 5,
                min: 15,
                supplier: "Tech Imports",
              },
              {
                name: "Mouse Gamer LED RGB",
                stock: 2,
                min: 8,
                supplier: "Gaming World",
              },
            ].map((item) => (
              <div key={item.name} className="flex items-start space-x-2 rounded-md border p-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Estoque atual: {item.stock} ({item.min} mínimo)
                  </p>
                  <p className="text-sm text-muted-foreground">Fornecedor: {item.supplier}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button size="sm" variant="outline" className="ml-auto">
            Ver todos os alertas
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

