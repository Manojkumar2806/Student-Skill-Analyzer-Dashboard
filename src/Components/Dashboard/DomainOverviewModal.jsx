import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const KpiCard = ({ title, value, color, totalStudents }) => {
  const [isHovered, setIsHovered] = useState(false);

  const donutValue =
    title === "Total Students" ? 100 : ((value / totalStudents) * 100).toFixed(1);

  const donutData = [
    { value: parseFloat(donutValue) },
    { value: Math.max(0, 100 - parseFloat(donutValue)) },
  ];

  const getDonutColor = () => {
    if (title.includes("Good")) return "#198754";      // Green
    if (title.includes("Average")) return "#ffc107";   // Yellow
    if (title.includes("Poor")) return "#dc3545";      // Red
    return "#0d6efd"; // Default Blue
  };

  return (
    <div
      className="card shadow-sm border-0 transition-all"
      style={{
        transform: isHovered ? "translateY(-5px)" : "none",
        flex: "1 1 220px",
        margin: "10px",
        cursor: "pointer",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="card-body d-flex align-items-center justify-content-between p-3 p-md-4">
        <div className="d-flex flex-column">
          <h6 className="text-muted mb-1">{title}</h6>
          <h4 className={`fw-bold ${color}`}>{value}</h4>
        </div>
        <div className="ms-3 position-relative" style={{ width: 70, height: 70 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={donutData}
                innerRadius={24}
                outerRadius={30}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {donutData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? getDonutColor() : "#e9ecef"}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div
            className="position-absolute top-50 start-50 translate-middle"
            style={{
              fontSize: "0.85rem",
              fontWeight: 700,
              color: getDonutColor(),
              whiteSpace: "nowrap",
            }}
          >
            {donutValue}%
          </div>
        </div>
      </div>
    </div>
  );
};

const domainKeyMap = {
  Java: { scoreKey: "Java-35m", statusKey: "Java Status" },
  Python: { scoreKey: "Python-35m", statusKey: "Python Status" },
  "Machine Learning": { scoreKey: "Machine Learning-30m", statusKey: "ML Status" },
};

const DomainOverviewModal = ({ show, handleClose, selectedSession, data }) => {
  if (!selectedSession || !selectedSession.domain || !data) return null;

  const { scoreKey, statusKey } = domainKeyMap[selectedSession.domain] || {};

  const filteredData = data.filter(
    (item) => item[scoreKey] !== undefined || item[statusKey] !== undefined
  );

  const total = filteredData.length;
  const goodCount = filteredData.filter(
    (item) => item[statusKey]?.toLowerCase() === "good"
  ).length;
  const averageCount = filteredData.filter(
    (item) => item[statusKey]?.toLowerCase() === "average"
  ).length;
  const poorCount = filteredData.filter(
    (item) => item[statusKey]?.toLowerCase() === "poor"
  ).length;

  // Sort descending by score for top 10
  const topStudents = [...filteredData]
    .filter((item) => item[scoreKey] !== undefined)
    .sort((a, b) => b[scoreKey] - a[scoreKey])
    .slice(0, 10);

  return (
    <Modal show={show} onHide={handleClose} size="xl" centered dialogClassName="w-90">
      <Modal.Header closeButton>
        <Modal.Title>{selectedSession.domain} - Overview</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-wrap justify-content-between mb-4">
          <KpiCard
            title="Total Students"
            value={total}
            color="text-primary"
            totalStudents={total}
          />
          <KpiCard
            title="Good Students"
            value={goodCount}
            color="text-success"
            totalStudents={total}
          />
          <KpiCard
            title="Average Students"
            value={averageCount}
            color="text-warning"
            totalStudents={total}
          />
          <KpiCard
            title="Poor Students"
            value={poorCount}
            color="text-danger"
            totalStudents={total}
          />
        </div>

        {/* Top 10 Students Table */}
        <div className="table-responsive">
          <h4 className="mb-4">Top 10 Students in {selectedSession.domain}</h4>
          <table className="table table-striped table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>USN</th>
                <th>First Name</th>                
                <th>{selectedSession.domain} Score</th>
                <th>ClassName</th>
              </tr>
            </thead>
            <tbody>
              {topStudents.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center">
                    No students data available
                  </td>
                </tr>
              ) : (
                topStudents.map((student, idx) => (
                  <tr key={idx}>
                    <td>{student.USN || "N/A"}</td>
                    <td>{student["First Name"] || "N/A"}</td>                    
                    <td>{student[scoreKey]}</td>
                    <td>{student.ClassName || "N/A"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>

      {/* Custom styling for professional look */}
      <style>{`
        .table-dark th {
          background-color:rgb(105, 155, 204) !important;
          color: #fff !important;
          font-weight: 600;
          letter-spacing: 0.05em;
        }
        .table-striped tbody tr:nth-of-type(odd) {
          background-color: #f8f9fa;
        }
        .table-hover tbody tr:hover {
          background-color: #e2e6ea;
          cursor: pointer;
        }
        .align-middle {
          vertical-align: middle !important;
        }
      `}</style>
    </Modal>
  );
};

export default DomainOverviewModal;
