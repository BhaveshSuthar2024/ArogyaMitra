import React from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function CommonDiseasesChart({ data, loading }) {
  // Process data to get disease frequency
  const processedData = React.useMemo(() => {
    if (!data || data.length === 0) return []

    const diseaseCount = data.reduce((acc, item) => {
      acc[item.disease] = (acc[item.disease] || 0) + 1
      return acc
    }, {})

    const total = data.length

    return Object.entries(diseaseCount)
      .map(([disease, count]) => ({
        disease,
        cases: count,
        percentage: ((count / total) * 100).toFixed(1),
      }))
      .sort((a, b) => b.cases - a.cases)
      .slice(0, 10) // Top 10 diseases
  }, [data]);


  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{label}</p>
          <p style={{ color: payload[0].color }}>Cases: {data.cases.toLocaleString()}</p>
          <p style={{ color: payload[0].color }}>Percentage: {data.percentage}%</p>
        </div>
      )
    }
    return null
  }

  if (loading) {
    return (
      <div className="chart-loading">
        <div className="loading-skeleton bar-skeleton"></div>
      </div>
    )
  }

  return (
    <div className="common-diseases-chart">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={processedData} layout="horizontal" margin={{ top: 20, right: 30, left: 100, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis type="number" stroke="#6b7280" fontSize={12} />
          <YAxis type="category" dataKey="disease" stroke="#6b7280" fontSize={12} width={90} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="cases" fill="#3b82f6" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>

      {/* Summary Stats */}
      <div className="chart-summary">
        <div className="summary-item">
          <span className="summary-value">{processedData.length}</span>
          <span className="summary-label">Diseases Tracked</span>
        </div>
        <div className="summary-item">
          <span className="summary-value">{processedData[0]?.disease || "N/A"}</span>
          <span className="summary-label">Most Common</span>
        </div>
        <div className="summary-item">
          <span className="summary-value">{processedData[0]?.percentage || "0"}%</span>
          <span className="summary-label">Top Disease Share</span>
        </div>
      </div>
    </div>
  )
}
