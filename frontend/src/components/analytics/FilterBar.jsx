"use client"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

export default function FilterBar({ filters, onFilterChange, onReset, loading }) {
  const diseases = [
    "all",
    "Malaria",
    "Dengue",
    "Typhoid",
    "Diabetes",
    "Hypertension",
    "Respiratory Infection",
    "Skin Disease",
    "Gastroenteritis",
  ]

  const regions = [
    "all",
    "Maharashtra",
    "Delhi",
    "Karnataka",
    "Tamil Nadu",
    "Gujarat",
    "Rajasthan",
    "West Bengal",
    "Uttar Pradesh",
    "Punjab",
  ]

  const ageGroups = [
    { value: "all", label: "All Ages" },
    { value: "0-12", label: "0-12 years" },
    { value: "13-30", label: "13-30 years" },
    { value: "31-50", label: "31-50 years" },
    { value: "51+", label: "51+ years" },
  ]

  const handleFilterUpdate = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    onFilterChange(newFilters)
  }

  const handleDateRangeChange = (dates) => {
    const [start, end] = dates
    handleFilterUpdate("dateRange", { start, end })
  }

  return (
    <div className="filter-bar">
      <div className="filter-section">
        <div className="filter-group">
          <label className="filter-label">📅 Date Range</label>
          <DatePicker
            selectsRange={true}
            startDate={filters.dateRange.start}
            endDate={filters.dateRange.end}
            onChange={handleDateRangeChange}
            placeholderText="Select date range"
            className="filter-input date-picker"
            dateFormat="MMM dd, yyyy"
            maxDate={new Date()}
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">📍 Region</label>
          <select
            className="filter-select"
            value={filters.region}
            onChange={(e) => handleFilterUpdate("region", e.target.value)}
          >
            {regions.map((region) => (
              <option key={region} value={region}>
                {region === "all" ? "All Regions" : region}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">🦠 Disease</label>
          <select
            className="filter-select"
            value={filters.disease}
            onChange={(e) => handleFilterUpdate("disease", e.target.value)}
          >
            {diseases.map((disease) => (
              <option key={disease} value={disease}>
                {disease === "all" ? "All Diseases" : disease}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">👥 Age Group</label>
          <select
            className="filter-select"
            value={filters.ageGroup}
            onChange={(e) => handleFilterUpdate("ageGroup", e.target.value)}
          >
            {ageGroups.map((group) => (
              <option key={group.value} value={group.value}>
                {group.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-actions">
          <button className="btn btn-primary apply-btn" disabled={loading}>
            {loading ? "⏳ Applying..." : "✅ Apply Filters"}
          </button>
          <button className="btn btn-secondary reset-btn" onClick={onReset} disabled={loading}>
            🔄 Reset
          </button>
        </div>
      </div>
    </div>
  )
}
