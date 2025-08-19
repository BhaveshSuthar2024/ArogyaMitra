"use client"

import React, { useState } from "react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"

export default function RegionDistributionChart({ data, loading }) {
  const [chartType, setChartType] = useState("pie")

  // Process data for region distribution
  const processedData = React.useMemo(() => {
    if (!data || data.length === 0) return []

    const regionCount = data.reduce((acc, item) => {
      acc[item.region] = (acc[item.region] || 0) + 1
      return acc
    }, {})

    return Object.entries(regionCount)
      .map(([region, cases]) => ({
        region,
        cases,
        percentage: ((cases / data.length) * 100).toFixed(1),
      }))
      .sort((a, b) => b.cases - a.cases)
      .slice(0, 5) // Top 5 regions
  }, [data])

  const colors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"]

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{data.region}</p>
          <p style={{ color: payload[0].color }}>Cases: {data.cases.toLocaleString()}</p>
          <p style={{ color: payload[0].color }}>Share: {data.percentage}%</p>
        </div>
      )
    }
    return null
  }

  if (loading) {
    return (
      <div className="chart-loading">
        <div className="loading-skeleton pie-skeleton"></div>
      </div>
    )
  }

  return (
    <div className="region-distribution-chart">
      <div className="chart-controls">
        <div className="chart-type-selector">
          <button
            className={`chart-type-btn ${chartType === "pie" ? "active" : ""}`}
            onClick={() => setChartType("pie")}
          >
            🥧 Pie Chart
          </button>
          <button
            className={`chart-type-btn ${chartType === "bar" ? "active" : ""}`}
            onClick={() => setChartType("bar")}
          >
            📊 Bar Chart
          </button>
        </div>
      </div>

      {chartType === "pie" ? (
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={processedData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ region, percentage }) => `${region}: ${percentage}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="cases"
            >
              {processedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="region" stroke="#6b7280" fontSize={12} angle={-45} textAnchor="end" height={80} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="cases" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}

      {/* Region Summary */}
      <div className="region-summary">
        {processedData.slice(0, 3).map((region, index) => (
          <div key={region.region} className="region-item">
            <div className="region-color" style={{ backgroundColor: colors[index] }}></div>
            <div className="region-info">
              <span className="region-name">{region.region}</span>
              <span className="region-cases">{region.cases} cases</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
