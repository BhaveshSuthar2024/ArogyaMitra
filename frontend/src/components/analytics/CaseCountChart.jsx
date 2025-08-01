import React, { useState } from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function CaseCountChart({ data, loading }) {
  const [viewType, setViewType] = useState("weekly")

  // Process data for case count over time
  const processedData = React.useMemo(() => {
    if (!data || data.length === 0) return []

    // Group data by date
    const grouped = data.reduce((acc, item) => {
      const date = new Date(item.date)
      let key

      if (viewType === "weekly") {
        // Get week start date
        const weekStart = new Date(date)
        weekStart.setDate(date.getDate() - date.getDay())
        key = weekStart.toISOString().split("T")[0]
      } else {
        // Monthly grouping
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      }

      if (!acc[key]) {
        acc[key] = { date: key, cases: 0, critical: 0 }
      }
      acc[key].cases++
      if (item.severity === "critical") {
        acc[key].critical++
      }
      return acc
    }, {})

    return Object.values(grouped)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-12) // Last 12 periods
  }, [data, viewType])

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const formatDate = (dateStr) => {
        if (viewType === "weekly") {
          return `Week of ${new Date(dateStr).toLocaleDateString()}`
        } else {
          const [year, month] = dateStr.split("-")
          return new Date(year, month - 1).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
          })
        }
      }

      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{formatDate(label)}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey === "cases" ? "Total Cases" : "Critical Cases"}: {entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  // Calculate trend
  const trend = React.useMemo(() => {
    if (processedData.length < 2) return 0
    const recent = processedData.slice(-2)
    const change = recent[1].cases - recent[0].cases
    const percentage = ((change / recent[0].cases) * 100).toFixed(1)
    return { change, percentage }
  }, [processedData])

  if (loading) {
    return (
      <div className="chart-loading">
        <div className="loading-skeleton area-skeleton"></div>
      </div>
    )
  }

  return (
    <div className="case-count-chart">
      <div className="chart-controls">
        <div className="view-selector">
          <button className={`view-btn ${viewType === "weekly" ? "active" : ""}`} onClick={() => setViewType("weekly")}>
            📅 Weekly
          </button>
          <button
            className={`view-btn ${viewType === "monthly" ? "active" : ""}`}
            onClick={() => setViewType("monthly")}
          >
            📆 Monthly
          </button>
        </div>

        {/* Trend Indicator */}
        <div className="trend-indicator">
          <span className="trend-label">Trend:</span>
          <span className={`trend-value ${trend.change >= 0 ? "positive" : "negative"}`}>
            {trend.change >= 0 ? "↗️" : "↘️"} {Math.abs(trend.percentage)}%
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={processedData}>
          <defs>
            <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorCritical" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            stroke="#6b7280"
            fontSize={12}
            tickFormatter={(value) => {
              if (viewType === "weekly") {
                return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
              } else {
                const [year, month] = value.split("-")
                return new Date(year, month - 1).toLocaleDateString("en-US", { month: "short" })
              }
            }}
          />
          <YAxis stroke="#6b7280" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="cases"
            stroke="#3b82f6"
            fillOpacity={1}
            fill="url(#colorCases)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="critical"
            stroke="#ef4444"
            fillOpacity={1}
            fill="url(#colorCritical)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Summary Stats */}
      <div className="case-summary">
        <div className="summary-stat">
          <span className="stat-value">
            {processedData.reduce((sum, item) => sum + item.cases, 0).toLocaleString()}
          </span>
          <span className="stat-label">Total Cases</span>
        </div>
        <div className="summary-stat">
          <span className="stat-value">
            {processedData.reduce((sum, item) => sum + item.critical, 0).toLocaleString()}
          </span>
          <span className="stat-label">Critical Cases</span>
        </div>
        <div className="summary-stat">
          <span className="stat-value">
            {processedData.length > 0
              ? Math.round(processedData.reduce((sum, item) => sum + item.cases, 0) / processedData.length)
              : 0}
          </span>
          <span className="stat-label">Avg per Period</span>
        </div>
      </div>
    </div>
  )
}
