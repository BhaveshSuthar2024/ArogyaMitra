import React, { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export default function DiseaseTrendChart({ data, loading }) {
  const [timeframe, setTimeframe] = useState("daily")

  // Process data for trend chart
  const processedData = React.useMemo(() => {
    if (!data || data.length === 0) return []

    // Group data by date and disease
    const grouped = data.reduce((acc, item) => {
      const date = new Date(item.date).toISOString().split("T")[0]
      if (!acc[date]) {
        acc[date] = {}
      }
      if (!acc[date][item.disease]) {
        acc[date][item.disease] = 0
      }
      acc[date][item.disease]++
      return acc
    }, {})

    // Convert to chart format
    const chartData = Object.keys(grouped)
      .map((date) => {
        const entry = { date }
        Object.keys(grouped[date]).forEach((disease) => {
          entry[disease] = grouped[date][disease]
        })
        return entry
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date))

    return chartData.slice(-30) // Last 30 days
  }, [data])

  const diseases = React.useMemo(() => {
    if (!data || data.length === 0) return []
    return [...new Set(data.map((item) => item.disease))]
  }, [data])

  const colors = [
    "#3b82f6",
    "#ef4444",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#06b6d4",
    "#84cc16",
    "#f97316",
    "#ec4899",
    "#6366f1",
  ]

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{`Date: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value} cases`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  if (loading) {
    return (
      <div className="chart-loading">
        <div className="loading-skeleton trend-skeleton"></div>
      </div>
    )
  }

  return (
    <div className="trend-chart-container">
      <div className="chart-controls">
        <div className="timeframe-selector">
          <button
            className={`timeframe-btn ${timeframe === "daily" ? "active" : ""}`}
            onClick={() => setTimeframe("daily")}
          >
            Daily
          </button>
          <button
            className={`timeframe-btn ${timeframe === "weekly" ? "active" : ""}`}
            onClick={() => setTimeframe("weekly")}
          >
            Weekly
          </button>
          <button
            className={`timeframe-btn ${timeframe === "monthly" ? "active" : ""}`}
            onClick={() => setTimeframe("monthly")}
          >
            Monthly
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={processedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            stroke="#6b7280"
            fontSize={12}
            tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          />
          <YAxis stroke="#6b7280" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {diseases.slice(0, 5).map((disease, index) => (
            <Line
              key={disease}
              type="monotone"
              dataKey={disease}
              stroke={colors[index]}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
