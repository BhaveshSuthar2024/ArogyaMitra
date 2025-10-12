// "use client"

// import { useState } from "react"
// import { ComposableMap, Geographies, Geography } from "react-simple-maps"

// // Simplified India topology (you would use actual TopoJSON file)
// const indiaTopology = "https://raw.githubusercontent.com/markmarkoh/datamaps/master/src/js/data/ind.json"

export default function RegionalDiseaseHeatmap({ data, onRegionClick, selectedRegion }) {
  // const [tooltip, setTooltip] = useState({ show: false, content: null, x: 0, y: 0 })

  // // Calculate disease density for color coding
  // const getRegionIntensity = (regionName) => {
  //   const regionData = data.find((d) => d.name === regionName)
  //   if (!regionData) return 0

  //   const maxCases = Math.max(...data.map((d) => d.totalCases))
  //   return regionData.totalCases / maxCases
  // }

  // const getRegionColor = (regionName) => {
  //   const intensity = getRegionIntensity(regionName)
  //   if (intensity === 0) return "#f0f9ff"
  //   if (intensity < 0.3) return "#bfdbfe"
  //   if (intensity < 0.6) return "#60a5fa"
  //   if (intensity < 0.8) return "#3b82f6"
  //   return "#1d4ed8"
  // }

  // const handleMouseEnter = (event, geo) => {
  //   const regionName = geo.properties.NAME_1
  //   const regionData = data.find((d) => d.name === regionName)

  //   if (regionData) {
  //     setTooltip({
  //       show: true,
  //       content: {
  //         name: regionName,
  //         totalCases: regionData.totalCases,
  //         topDiseases: regionData.topDiseases,
  //       },
  //       x: event.clientX,
  //       y: event.clientY,
  //     })
  //   }
  // }

  // const handleMouseLeave = () => {
  //   setTooltip({ show: false, content: null, x: 0, y: 0 })
  // }

  // const handleClick = (geo) => {
  //   const regionName = geo.properties.NAME_1
  //   const regionData = data.find((d) => d.name === regionName)
  //   if (regionData && onRegionClick) {
  //     onRegionClick(regionData)
  //   }
  // }

  return (
  <div className="heatmap-container">
    
  //     <div className="map-wrapper">
  //       <ComposableMap
  //         projection="geoMercator"
  //         projectionConfig={{
  //           scale: 1000,
  //           center: [78.9629, 20.5937],
  //         }}
  //         width={800}
  //         height={600}
  //       >
  //         <Geographies geography={indiaTopology}>
  //           {({ geographies }) =>
  //             geographies.map((geo) => {
  //               const regionName = geo.properties.NAME_1
  //               const isSelected = selectedRegion?.name === regionName

  //               return (
  //                 <Geography
  //                   key={geo.rsmKey}
  //                   geography={geo}
  //                   fill={getRegionColor(regionName)}
  //                   stroke={isSelected ? "#ef4444" : "#ffffff"}
  //                   strokeWidth={isSelected ? 2 : 0.5}
  //                   style={{
  //                     default: { outline: "none" },
  //                     hover: {
  //                       fill: "#1e40af",
  //                       outline: "none",
  //                       cursor: "pointer",
  //                     },
  //                     pressed: { outline: "none" },
  //                   }}
  //                   onMouseEnter={(event) => handleMouseEnter(event, geo)}
  //                   onMouseLeave={handleMouseLeave}
  //                   onClick={() => handleClick(geo)}
  //                 />
  //               )
  //             })
  //           }
  //         </Geographies>
  //       </ComposableMap>

  //       {/* Tooltip */}
  //       {tooltip.show && tooltip.content && (
  //         <div
  //           className="map-tooltip"
  //           style={{
  //             left: tooltip.x + 10,
  //             top: tooltip.y - 10,
  //             position: "fixed",
  //             zIndex: 1000,
  //           }}
  //         >
  //           <div className="tooltip-header">
  //             <strong>{tooltip.content.name}</strong>
  //           </div>
  //           <div className="tooltip-body">
  //             <p>
  //               Total Cases: <strong>{tooltip.content.totalCases.toLocaleString()}</strong>
  //             </p>
  //             <div className="top-diseases">
  //               <p>Top Diseases:</p>
  //               <ul>
  //                 {tooltip.content.topDiseases.map((disease, index) => (
  //                   <li key={index}>{disease}</li>
  //                 ))}
  //               </ul>
  //             </div>
  //           </div>
  //         </div>
  //       )}
  //     </div>

  //     {/* Legend */}
  //     <div className="map-legend">
  //       <h4>Disease Density</h4>
  //       <div className="legend-scale">
  //         <div className="legend-item">
  //           <div className="legend-color" style={{ backgroundColor: "#f0f9ff" }}></div>
  //           <span>No cases</span>
  //         </div>
  //         <div className="legend-item">
  //           <div className="legend-color" style={{ backgroundColor: "#bfdbfe" }}></div>
  //           <span>Low</span>
  //         </div>
  //         <div className="legend-item">
  //           <div className="legend-color" style={{ backgroundColor: "#60a5fa" }}></div>
  //           <span>Medium</span>
  //         </div>
  //         <div className="legend-item">
  //           <div className="legend-color" style={{ backgroundColor: "#3b82f6" }}></div>
  //           <span>High</span>
  //         </div>
  //         <div className="legend-item">
  //           <div className="legend-color" style={{ backgroundColor: "#1d4ed8" }}></div>
  //           <span>Very High</span>
  //         </div>
  //       </div>
  //     </div>
    </div>
  )

}
