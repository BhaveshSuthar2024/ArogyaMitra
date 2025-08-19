"use client"

import React, { useState } from "react"

export default function DetailedTable({ data, loading }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" })
  const [itemsPerPage] = useState(10)

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!data || data.length === 0) return []

    const sorted = [...data].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (sortConfig.direction === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return sorted
  }, [data, sortConfig])

  // Paginate data
  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return sortedData.slice(startIndex, startIndex + itemsPerPage)
  }, [sortedData, currentPage, itemsPerPage])

  const totalPages = Math.ceil(sortedData.length / itemsPerPage)

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === "desc" ? "asc" : "desc",
    }))
  }

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return "↕️"
    return sortConfig.direction === "asc" ? "↑" : "↓"
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "critical":
        return "#ef4444"
      case "moderate":
        return "#f59e0b"
      case "mild":
        return "#10b981"
      default:
        return "#6b7280"
    }
  }

  const getSourceIcon = (source) => {
    switch (source) {
      case "ai":
        return "🤖"
      case "doctor":
        return "👨‍⚕️"
      case "kiosk":
        return "🏥"
      default:
        return "📋"
    }
  }

  if (loading) {
    return (
      <div className="table-loading">
        <div className="loading-skeleton table-skeleton"></div>
      </div>
    )
  }

  return (
    <div className="detailed-table">
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("patientId")} className="sortable">
                Patient ID {getSortIcon("patientId")}
              </th>
              <th onClick={() => handleSort("age")} className="sortable">
                Age {getSortIcon("age")}
              </th>
              <th onClick={() => handleSort("region")} className="sortable">
                Region {getSortIcon("region")}
              </th>
              <th onClick={() => handleSort("disease")} className="sortable">
                Disease {getSortIcon("disease")}
              </th>
              <th onClick={() => handleSort("severity")} className="sortable">
                Severity {getSortIcon("severity")}
              </th>
              <th onClick={() => handleSort("date")} className="sortable">
                Date {getSortIcon("date")}
              </th>
              <th onClick={() => handleSort("source")} className="sortable">
                Source {getSortIcon("source")}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <tr key={index} className="table-row">
                <td className="patient-id">
                  <span className="id-badge">{item.patientId}</span>
                </td>
                <td>{item.age}</td>
                <td>
                  <span className="region-tag">{item.region}</span>
                </td>
                <td className="disease-cell">
                  <span className="disease-name">{item.disease}</span>
                </td>
                <td>
                  <span
                    className="severity-badge"
                    style={{
                      backgroundColor: getSeverityColor(item.severity),
                      color: "white",
                    }}
                  >
                    {item.severity}
                  </span>
                </td>
                <td className="date-cell">{new Date(item.date).toLocaleDateString()}</td>
                <td className="source-cell">
                  <span className="source-badge">
                    {getSourceIcon(item.source)} {item.source}
                  </span>
                </td>
                <td className="actions-cell">
                  <button className="action-btn view-btn" title="View Details">
                    👁️
                  </button>
                  <button className="action-btn edit-btn" title="Edit Record">
                    ✏️
                  </button>
                  <button className="action-btn share-btn" title="Share">
                    📤
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="table-pagination">
        <div className="pagination-info">
          Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedData.length)} of{" "}
          {sortedData.length} entries
        </div>

        <div className="pagination-controls">
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            ← Previous
          </button>

          <div className="page-numbers">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, currentPage - 2) + i
              if (pageNum > totalPages) return null

              return (
                <button
                  key={pageNum}
                  className={`page-btn ${currentPage === pageNum ? "active" : ""}`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>

          <button
            className="pagination-btn"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}
