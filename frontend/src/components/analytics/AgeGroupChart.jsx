"use client"

import React from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

export default function AgeGroupChart({ data, loading }) {
  // Process data for age group distribution
  const processedData = React.useMemo(() => {
    if (!data || data.length === 0) return []

    const ageGroupCount = data.reduce((acc, item) => {
      acc[item.ageGroup] = (acc[item.ageGroup] || 0) + 1
      return acc
    }, {})

    const ageGroupOrder = ["0-12", "13-30", "31-50", "51+"]
    const total = data.length

    return ageGroupOrder
      .map((ageGroup) => ({
        ageGroup: `${ageGroup} years`,
        cases: ageGroupCount[ageGroup] || 0,
        percentage: (((ageGroupCount[ageGroup] || 0) / total) * 100).toFixed(1),
      }))
      .filter((item) => item.cases > 0)
  }, [data])

  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"]

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{data.ageGroup}</p>
          <p style={{ color: payload[0].color }}>Cases: {data.cases.toLocaleString()}</p>
          <p style={{ color: payload[0].color }}>Percentage: {data.percentage}%</p>
        </div>
      )
    }
    return null
  }

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${percentage}%`}
      </text>
    )
  }

  if (loading) {
    return (
      <div className="chart-loading">
        <div className="loading-skeleton pie-skeleton"></div>
      </div>
    )
  }

  return (
    <div className="age-group-chart">
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={processedData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
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

      {/* Age Group Stats */}
      <div className="age-stats">
        {processedData.map((group, index) => (
          <div key={group.ageGroup} className="age-stat-item">
            <div className="age-color" style={{ backgroundColor: colors[index] }}></div>
            <div className="age-info">
              <span className="age-group">{group.ageGroup}</span>
              <span className="age-cases">{group.cases} cases</span>
              <span className="age-percentage">{group.percentage}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Key Insights */}
      <div className="age-insights">
        <div className="insight-item">
          <span className="insight-label">Most Affected:</span>
          <span className="insight-value">{processedData.length > 0 ? processedData[0].ageGroup : "N/A"}</span>
        </div>
        <div className="insight-item">
          <span className="insight-label">Total Patients:</span>
          <span className="insight-value">
            {processedData.reduce((sum, item) => sum + item.cases, 0).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  )
}
