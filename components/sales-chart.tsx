"use client"

import { useEffect, useRef, useCallback } from "react"
import { Chart, registerables } from "chart.js"

// Registrar todos os componentes necessários do Chart.js
Chart.register(...registerables)

interface SalesChartProps {
  period: "day" | "week" | "month" | "year"
}

export function SalesChart({ period }: SalesChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  // Dados para simular vendas
  const generateSalesData = useCallback(() => {
    let labels: string[] = []
    let salesData: number[] = []

    if (period === "day") {
      labels = [
        "00:00",
        "02:00",
        "04:00",
        "06:00",
        "08:00",
        "10:00",
        "12:00",
        "14:00",
        "16:00",
        "18:00",
        "20:00",
        "22:00",
      ]
      salesData = [5, 2, 1, 3, 15, 22, 30, 42, 35, 28, 25, 18]
    } else if (period === "week") {
      labels = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"]
      salesData = [48, 52, 45, 65, 85, 95, 60]
    } else if (period === "month") {
      labels = Array.from({ length: 30 }, (_, i) => `${i + 1}`)
      salesData = Array.from({ length: 30 }, () => Math.floor(Math.random() * 50) + 30)
    } else if (period === "year") {
      labels = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
      salesData = [450, 420, 480, 520, 550, 570, 600, 620, 580, 610, 640, 680]
    }

    return {
      labels,
      salesData,
    }
  }, [period])

  useEffect(() => {
    if (chartRef.current) {
      // Destruir o gráfico anterior se existir
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }

      const { labels, salesData } = generateSalesData()

      const ctx = chartRef.current.getContext("2d")
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: "line",
          data: {
            labels,
            datasets: [
              {
                label: "Vendas",
                data: salesData,
                borderColor: "rgb(59, 130, 246)",
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                borderWidth: 2,
                tension: 0.3,
                fill: true,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                mode: "index",
                intersect: false,
              },
            },
            scales: {
              x: {
                grid: {
                  display: false,
                },
              },
              y: {
                beginAtZero: true,
                grid: {
                  color: "rgba(0, 0, 0, 0.05)",
                },
              },
            },
          },
        })
      }
    }

    // Limpeza quando o componente é desmontado
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [generateSalesData])

  return <canvas ref={chartRef}></canvas>
}

