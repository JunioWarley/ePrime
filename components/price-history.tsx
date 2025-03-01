import type React from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

interface PriceHistoryProps {
  productId: string
}

export const PriceHistory: React.FC<PriceHistoryProps> = ({ productId }) => {
  // Mock data - replace with actual API call in production
  const data = [
    { date: "2023-01-01", price: 100 },
    { date: "2023-02-01", price: 110 },
    { date: "2023-03-01", price: 105 },
    { date: "2023-04-01", price: 120 },
    { date: "2023-05-01", price: 115 },
  ]

  return (
    <LineChart width={500} height={300} data={data}>
      <XAxis dataKey="date" />
      <YAxis />
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="price" stroke="#8884d8" />
    </LineChart>
  )
}

