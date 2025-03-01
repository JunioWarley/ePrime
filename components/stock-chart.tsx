"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

// Registrar todos os componentes necessários do Chart.js
Chart.register(...registerables)

export function StockChart() {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  // Dados para simular evolução do estoque
  const generateStockData = () => {
    const labels = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]

    const addedItems = [120, 150, 180, 140, 160, 210, 190, 220, 200, 180, 240, 210]
    const removedItems = [100, 130, 150, 135, 155, 185, 180, 190, 210, 170, 205, 180]

    return {
      labels,
      addedItems,
      removedItems,
    }
  }

  useEffect(() => {
    if (chartRef.current) {
      // Destruir o gráfico anterior se existir
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }

      const { labels, addedItems, removedItems } = generateStockData()

      const ctx = chartRef.current.getContext("2d")
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: "bar",
          data: {
            labels,
            datasets: [
              {
                label: "Entradas",
                data: addedItems,
                backgroundColor: "rgba(34, 197, 94, 0.7)",
                borderColor: "rgb(34, 197, 94)",
                borderWidth: 1,
              },
              {
                label: "Saídas",
                data: removedItems,
                backgroundColor: "rgba(239, 68, 68, 0.7)",
                borderColor: "rgb(239, 68, 68)",
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "top",
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
  }, [])

  return <canvas ref={chartRef}></canvas>
}

