"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import FilterBar from "./analytics/FilterBar"
import DiseaseTrendChart from "./analytics/DiseaseTrendChart"
import CommonDiseasesChart from "./analytics/CommonDiseasesChart"
import RegionDistributionChart from "./analytics/RegionDistributionChart"
import AgeGroupChart from "./analytics/AgeGroupChart"
import CaseCountChart from "./analytics/CaseCountChart"
import ExportSection from "./analytics/ExportSection"
import DetailedTable from "./analytics/DetailedTable"
import { mockDiseaseData, mockRegionalData, mockTrendData } from "../data/mockAnalyticsData"
import "./AdminDiseaseAnalytics.css"

export default function AdminDiseaseAnalytics() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState({
    dateRange: { start: null, end: null },
    region: "all",
    disease: "all",
    ageGroup: "all",
  })

  const [filteredData, setFilteredData] = useState(mockDiseaseData)
  const [selectedRegion, setSelectedRegion] = useState(null)
  const [loading, setLoading] = useState(false)
  const [realTimeUpdates, setRealTimeUpdates] = useState(0)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeUpdates((prev) => prev + Math.floor(Math.random() * 5))
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  // Filter data based on current filters
  useEffect(() => {
    let filtered = mockDiseaseData

    if (filters.region !== "all") {
      filtered = filtered.filter((item) => item.region === filters.region)
    }

    if (filters.disease !== "all") {
      filtered = filtered.filter((item) => item.disease === filters.disease)
    }

    if (filters.ageGroup !== "all") {
      filtered = filtered.filter((item) => item.ageGroup === filters.ageGroup)
    }

    if (filters.dateRange.start && filters.dateRange.end) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.date)
        return itemDate >= filters.dateRange.start && itemDate <= filters.dateRange.end
      })
    }

    setFilteredData(filtered)
  }, [filters])

  const handleFilterChange = (newFilters) => {
    setLoading(true)
    setFilters(newFilters)

    setTimeout(() => {
      setLoading(false)
    }, 500)
  }

  const handleRegionClick = (regionData) => {
    setSelectedRegion(regionData)
    setFilters((prev) => ({ ...prev, region: regionData.name }))
  }

  const resetFilters = () => {
    setFilters({
      dateRange: { start: null, end: null },
      region: "all",
      disease: "all",
      ageGroup: "all",
    })
    setSelectedRegion(null)
  }

  // Calculate summary statistics
  const totalCases = filteredData.length
  const uniqueDiseases = [...new Set(filteredData.map((item) => item.disease))].length
  const affectedRegions = [...new Set(filteredData.map((item) => item.region))].length
  const criticalCases = filteredData.filter((item) => item.severity === "critical").length

  return (
    <div className="admin-disease-analytics">
      {/* Header */}
      <div className="analytics-header">
        <div className="header-content">
          <div className="header-stats">
            <div className="stat-card">
              <div className="stat-value">{totalCases.toLocaleString()}</div>
              <div className="stat-label">Total Cases</div>
              {realTimeUpdates > 0 && <div className="real-time-badge">+{realTimeUpdates}</div>}
            </div>
            <div className="stat-card">
              <div className="stat-value">{uniqueDiseases}</div>
              <div className="stat-label">Diseases</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{affectedRegions}</div>
              <div className="stat-label">Regions</div>
            </div>
            <div className="stat-card critical">
              <div className="stat-value">{criticalCases}</div>
              <div className="stat-label">Critical</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar filters={filters} onFilterChange={handleFilterChange} onReset={resetFilters} loading={loading} />

      {/* Dashboard Content */}
      <div className="dashboard-grid">
        {/* Row 1: Heatmap + Export */}
        <div className="dashboard-row">
          <div className="chart-container two-thirds heatmap-container">
            <div className="chart-header">
              <h3>🗺️ Regional Disease Heatmap</h3>
              <div className="chart-subtitle">Click states to filter • Hover for details</div>
            </div>
            <div className="chart-content">
             
            </div>
          </div>

          <div className="chart-container one-third export-container">
            <ExportSection data={filteredData} filters={filters} totalCases={totalCases} />
          </div>
        </div>

        {/* Row 2: Disease Trend */}
        <div className="dashboard-row">
          <div className="chart-container full-width trend-container">
            <div className="chart-header">
              <h3>📈 Disease Trend Over Time</h3>
              <div className="chart-subtitle">Daily case progression for tracked diseases</div>
            </div>
            <div className="chart-content">
              <DiseaseTrendChart data={mockTrendData} loading={loading} />
            </div>
          </div>
        </div>

        {/* Row 3: Common Diseases + Region Distribution */}
        <div className="dashboard-row">
          <div className="chart-container half-width">
            <div className="chart-header">
              <h3>📊 Most Common Diseases</h3>
              <div className="chart-subtitle">Top diseases by frequency</div>
            </div>
            <div className="chart-content">
              <CommonDiseasesChart data={filteredData} loading={loading} />
            </div>
          </div>

          <div className="chart-container half-width">
            <div className="chart-header">
              <h3>📍 Region Distribution</h3>
              <div className="chart-subtitle">Cases across top regions</div>
            </div>
            <div className="chart-content">
              <RegionDistributionChart data={filteredData} loading={loading} />
            </div>
          </div>
        </div>

        {/* Row 4: Age Group + Case Count */}
        <div className="dashboard-row">
          <div className="chart-container half-width">
            <div className="chart-header">
              <h3>🧓 Age Distribution</h3>
              <div className="chart-subtitle">Patient age breakdown</div>
            </div>
            <div className="chart-content">
              <AgeGroupChart data={filteredData} loading={loading} />
            </div>
          </div>

          <div className="chart-container half-width">
            <div className="chart-header">
              <h3>📆 Case Trends</h3>
              <div className="chart-subtitle">Weekly case analysis</div>
            </div>
            <div className="chart-content">
              <CaseCountChart data={filteredData} loading={loading} />
            </div>
          </div>
        </div>

        {/* Row 5: Detailed Table */}
        <div className="dashboard-row">
          <div className="chart-container full-width table-container">
            <div className="chart-header">
              <h3>📝 Recent Diagnoses</h3>
              <div className="chart-subtitle">Latest patient records from kiosks</div>
            </div>
            <div className="chart-content">
              <DetailedTable data={filteredData} loading={loading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

