"use client"

export default function ExportSection({ data, filters, totalCases }) {
  const handleExport = (type) => {
    console.log(`Exporting ${type} with ${data.length} records`)
    // Implement actual export logic here
  }

  const criticalCases = data.filter((item) => item.severity === "critical").length
  const moderateCases = data.filter((item) => item.severity === "moderate").length
  const mildCases = data.filter((item) => item.severity === "mild").length

  return (
    <div className="export-section">
      <div className="export-header">
        <h3>📤 Export & Reports</h3>
        <p>Download comprehensive analytics reports</p>
      </div>

      <div className="report-summary">
        <h4>Report Summary</h4>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-label">Total Cases:</span>
            <span className="summary-value">{totalCases.toLocaleString()}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Critical:</span>
            <span className="summary-value critical">{criticalCases}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Moderate:</span>
            <span className="summary-value">{moderateCases}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Mild:</span>
            <span className="summary-value">{mildCases}</span>
          </div>
        </div>

        <div className="applied-filters">
          <h5>Applied Filters:</h5>
          <ul>
            <li>Region: {filters.region === "all" ? "All Regions" : filters.region}</li>
            <li>Disease: {filters.disease === "all" ? "All Diseases" : filters.disease}</li>
            <li>Age Group: {filters.ageGroup === "all" ? "All Ages" : filters.ageGroup}</li>
            <li>
              Date Range:{" "}
              {filters.dateRange.start && filters.dateRange.end
                ? `${filters.dateRange.start.toLocaleDateString()} - ${filters.dateRange.end.toLocaleDateString()}`
                : "All Dates"}
            </li>
          </ul>
        </div>
      </div>

      <div className="quick-stats">
        <div className="stat-item">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-number">{data.length}</div>
            <div className="stat-label">Filtered Records</div>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">🏥</div>
          <div className="stat-content">
            <div className="stat-number">{[...new Set(data.map((item) => item.region))].length}</div>
            <div className="stat-label">Active Regions</div>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">🦠</div>
          <div className="stat-content">
            <div className="stat-number">{[...new Set(data.map((item) => item.disease))].length}</div>
            <div className="stat-label">Disease Types</div>
          </div>
        </div>
      </div>

      <div className="export-options">
        <div className="export-card">
          <div className="export-icon">📄</div>
          <div className="export-info">
            <h4>PDF Report</h4>
            <p>Comprehensive analytics report</p>
          </div>
          <button className="export-btn pdf-btn" onClick={() => handleExport("pdf")}>
            Download
          </button>
        </div>

        <div className="export-card">
          <div className="export-icon">📊</div>
          <div className="export-info">
            <h4>CSV Data</h4>
            <p>Raw data for analysis</p>
          </div>
          <button className="export-btn csv-btn" onClick={() => handleExport("csv")}>
            Export
          </button>
        </div>

        <div className="export-card">
          <div className="export-icon">📈</div>
          <div className="export-info">
            <h4>Excel Report</h4>
            <p>Formatted spreadsheet</p>
          </div>
          <button className="export-btn excel-btn" onClick={() => handleExport("excel")}>
            Generate
          </button>
        </div>
      </div>
    </div>
  )
}
