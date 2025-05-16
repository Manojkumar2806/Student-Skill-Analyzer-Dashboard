import { useState } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line
} from "recharts";
import StudentDetailsTable from './StudentDetailsTable';

// Calculate overall metrics
const calculateOverallMetrics = (data) => {
  const totalStudents = data.length;
  const totalGood = data.filter(student => student.Status === "Good").length;
  const totalAverage = data.filter(student => student.Status === "Average").length;
  const totalPoor = data.filter(student => student.Status === "poor").length;
  
  return {
    totalStudents,
    totalGood,
    totalAverage,
    totalPoor,
  };
};

// Preprocess data to ensure status columns
const preprocessData = (data) => {
  return data.map(student => {
    const getStatus = (marks, maxMarks) => {
      if (typeof marks !== "number" || isNaN(marks) || marks < 0) return "Poor";
      const percent = (marks / maxMarks) * 100;
      return percent >= 80 ? "Good" : percent >= 60 ? "Average" : "Poor";
    };

    return {
      ...student,
      "Java Status": student["Java Status"]?.trim() || getStatus(student["Java-35m"], 35),
      "Python Status": student["Python Status"]?.trim() || getStatus(student["Python-35m"], 35),
      "ML Status": student["ML Status"]?.trim() || getStatus(student["Machine Learning-30m"], 30)
    };
  });
};

// Prepare data for bar chart
const prepareSubjectPerformanceData = (data) => {
  const subjects = [
    { name: "Java", key: "Java Status" },
    { name: "Python", key: "Python Status" },
    { name: "Machine Learning", key: "ML Status" },
  ];

  return subjects.map(({ name, key }) => {
    const counts = { Good: 0, Average: 0, Poor: 0 };
    
    data.forEach(student => {
      const status = (student[key] || "").toLowerCase().trim();
      if (status === "good") counts.Good += 1;
      else if (status === "average") counts.Average += 1;
      else counts.Poor += 1;
    });

    return {
      subject: name,
      Good: counts.Good,
      Average: counts.Average,
      Poor: counts.Poor,
    };
  });
};

// Prepare data for line chart
const prepareLineChartData = (data, activeStudent) => {
  let filteredData = activeStudent
    ? data.filter(student => student.USN === activeStudent)
    : data.sort((a, b) => b.Total - a.Total).slice(0, 20); // Top 20 if no filter

  return filteredData.map(student => {
    const pythonMark = typeof student["Python-35m"] === "number" ? student["Python-35m"] : 0;
    const mlMark = typeof student["Machine Learning-30m"] === "number" ? student["Machine Learning-30m"] : 0;
    const totalMark = typeof student.Total === "number" ? student.Total : 0;

    const javaMark = Math.max(totalMark - (pythonMark + mlMark), 0); // Safe fallback

    return {
      name: (student["First Name"] || "Unknown").substring(0, 10),
      Java: javaMark,
      Python: pythonMark,
      "Machine Learning": mlMark,
      Total: totalMark,
      USN: student.USN || "N/A"
    };
  });
};

// Prepare data for student donut chart
const prepareStudentDonutChartData = (data, activeStudent) => {
  if (!activeStudent) return [];

  const student = data.find(student => student.USN === activeStudent);
  if (!student) return [];

  const python = typeof student["Python-35m"] === "number" ? student["Python-35m"] : 0;
  const ml = typeof student["Machine Learning-30m"] === "number" ? student["Machine Learning-30m"] : 0;
  const total = typeof student.Total === "number" ? student.Total : 0;

  const java = Math.max(total - (python + ml), 0);

  return [
    { name: "Java", value: parseFloat(((java / 35) * 100).toFixed(1)) },
    { name: "Python", value: parseFloat(((python / 35) * 100).toFixed(1)) },
    { name: "Machine Learning", value: parseFloat(((ml / 30) * 100).toFixed(1)) },
  ].filter(item => !isNaN(item.value) && item.value >= 0);
};

// Student Filter Component
const StudentFilter = ({ students, activeStudent, setActiveStudent }) => (
  <div className="w-100 mx-auto">
    <select
      className="form-select shadow-sm w-100 p-2 rounded"
      value={activeStudent || ""}
      onChange={(e) => setActiveStudent(e.target.value || null)}
    >
      <option value="">All Students</option>
      {students.map((student) => (
        <option key={student.USN} value={student.USN}>
          {student["First Name"]} ({student.USN})
        </option>
      ))}
    </select>
  </div>
);

// KPI Card Component
const KpiCard = ({ title, value, color, totalStudents }) => {
  const [isHovered, setIsHovered] = useState(false);

  const donutValue = title === "Total Students" ? 100 : (value / totalStudents * 100).toFixed(1);
  const donutData = [{ value: parseFloat(donutValue) }, { value: Math.max(0, 100 - parseFloat(donutValue)) }];

  const getDonutColor = () => {
    if (title.includes("Good")) return "#198754";
    if (title.includes("Average")) return "#0d6efd";
    if (title.includes("Poor")) return "#dc3545";
    return "#0d6efd";
  };

  return (
    <div
      className={`card shadow border-0 transition ${isHovered ? "transform translate-y--5px" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="card-body d-flex align-items-center justify-content-between p-3">
        <div className="d-flex align-items-start gap-2">
          <div>
            <h6 className="card-subtitle mb-1 text-muted">{title}</h6>
            <h4 className={`card-title fw-bold ${color}`}>{value}</h4>
          </div>
        </div>
        <div style={{ minWidth: "45px" }}>
          <ResponsiveContainer width={45} height={45}>
            <PieChart>
              <Pie
                data={donutData}
                innerRadius={14}
                outerRadius={18}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {donutData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? getDonutColor() : "#e9ecef"} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Top 5 Students Table Component
const TopStudentsTable = ({ data }) => {
  const topStudents = [...data]
    .sort((a, b) => b.Total - a.Total)
    .slice(0, 5);

  return (
    <div className="card shadow border-0">
      <div className="card-header bg-white border-0 pt-3 px-3">
        <h5 className="card-title mb-0">Top 5 Students by Total Marks</h5>
      </div>
      <div className="card-body p-3">
        <div className="table-responsive" style={{ maxHeight: "300px", overflowY: "auto" }}>
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Roll Number</th>
                <th scope="col">Total Marks</th>
              </tr>
            </thead>
            <tbody>
              {topStudents.map((student) => (
                <tr key={student.USN}>
                  <td>{student["First Name"]}</td>
                  <td>{student.USN}</td>
                  <td>{student.Total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// KPI Donut Chart
const KpiDonutChart = ({ totalGood, totalAverage, totalPoor }) => {
  const chartData = [
    { name: "Good", value: totalGood },
    { name: "Average", value: totalAverage },
    { name: "Poor", value: totalPoor },
  ].filter(item => item.value > 0);

  const COLORS = ["#198754", "#0d6efd", "#dc3545"];

  return (
    <div className="card shadow border-0">
      <div className="card-header bg-white border-0 pt-3 px-3">
        <h5 className="card-title mb-0">Student Performance Distribution</h5>
      </div>
      <div className="card-body p-3">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => [`${value} students`, name]} />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Student Donut Chart
const StudentDonutChart = ({ data, activeStudent }) => {
  const chartData = prepareStudentDonutChartData(data, activeStudent);
  const COLORS = ["#2E7D32", "#0288D1", "#F57C00"]; // Green, Blue, Orange
  const student = activeStudent ? data.find(student => student.USN === activeStudent) : null;
  const title = student ? `${student["First Name"]}'s Subject Percentages` : "Select a Student";

  return (
    <div className="card shadow border-0">
      <div className="card-header bg-white border-0 pt-3 px-3">
        <h5 className="card-title mb-0">{title}</h5>
      </div>
      <div className="card-body p-3">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
                labelLine={true}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value}%`, name]} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="d-flex align-items-center justify-content-center h-100 text-muted">
            Please select a student to view their subject percentages
          </div>
        )}
      </div>
    </div>
  );
};

// Line Chart
const StudentMarksLineChart = ({ data, activeStudent }) => {
  const chartData = prepareLineChartData(data, activeStudent);
  const COLORS = ["#2E7D32", "#0288D1", "#F57C00"]; // Green, Blue, Orange

  return (
    <div className="card shadow border-0">
      <div className="card-header bg-white border-0 pt-3 px-3">
        <h5 className="card-title mb-0">Student Marks Across Subjects</h5>
      </div>
      <div className="card-body p-3">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, angle: -45, textAnchor: "end" }}
                height={80}
                interval={0}
              />
              <YAxis
                label={{ value: "Marks", angle: -90, position: "insideLeft", offset: -10 }}
                domain={[0, 100]}
              />
              <Tooltip
                formatter={(value, name) => [`${value}`, name]}
                labelFormatter={(label, payload) => {
                  if (!payload[0]) return label;
                  const { USN} = payload[0].payload;
                  return `${label} (USN: ${USN})`;
                }}
                contentStyle={{ fontSize: 12, backgroundColor: "#fff", border: "1px solid #ccc" }}
              />
              <Legend verticalAlign="top" height={36} />
              {["Java", "Python", "Machine Learning"].map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={COLORS[index]}
                  strokeWidth={activeStudent ? 3 : 2}
                  activeDot={{ r: 8 }}
                />
              ))}
              <Line
                type="monotone"
                dataKey="Total"
                stroke="#616161" // Gray
                strokeWidth={activeStudent ? 3 : 2}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="d-flex align-items-center justify-content-center h-100 text-muted">
            No data available
          </div>
        )}
      </div>
    </div>
  );
};

// Bar Chart
const SubjectPerformanceBarChart = ({ data }) => {
  const chartData = prepareSubjectPerformanceData(data);

  return (
    <div className="card shadow border-0">
      <div className="card-header bg-white border-0 pt-3 px-3">
        <h5 className="card-title mb-0">Student Performance by Subject</h5>
      </div>
      <div className="card-body p-3">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="subject" tick={{ fontSize: 12 }} />
            <YAxis label={{ value: "Number of Students", angle: -90, position: "insideLeft" }} />
            <Tooltip formatter={(value, name) => [`${value} students`, name]} />
            <Legend verticalAlign="top" height={36} />
            <Bar dataKey="Good" fill="#198754" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Average" fill="#0d6efd" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Poor" fill="#dc3545" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Main Dashboard Component
const DSAdashboard = ({ data }) => {
  const [activeStudent, setActiveStudent] = useState(null);
  const preprocessedData = preprocessData(data);
  const overallMetrics = calculateOverallMetrics(preprocessedData);

  return (
    <div className="container-fluid p-3">
      <div className="row align-items-center mb-4">
        <div className="col-md-6 mb-3">
          <h2 className="text-primary text-center fw-bold fs-3">Student Performance Dashboard</h2>
        </div>
        <div className="col-md-6">
          <StudentFilter
            students={preprocessedData}
            activeStudent={activeStudent}
            setActiveStudent={setActiveStudent}
          />
        </div>
      </div>

      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-3 mb-4">
        {[
          { title: "Total Students", value: overallMetrics.totalStudents, color: "text-primary" },
          { title: "No. of Good", value: overallMetrics.totalGood, color: "text-success" },
          { title: "No. of Average", value: overallMetrics.totalAverage, color: "text-primary" },
          { title: "No. of Poor", value: overallMetrics.totalPoor, color: "text-danger" },
        ].map((kpi) => (
          <div key={kpi.title} className="col">
            <KpiCard
              {...kpi}
              totalStudents={overallMetrics.totalStudents}
            />
          </div>
        ))}
      </div>

      <div className="row row-cols-1 row-cols-md-2 g-3 mb-4">
        <div className="col">
          <SubjectPerformanceBarChart data={preprocessedData} />
        </div>
        <div className="col">
          <KpiDonutChart
            totalGood={overallMetrics.totalGood}
            totalAverage={overallMetrics.totalAverage}
            totalPoor={overallMetrics.totalPoor}
          />
        </div>
      </div>

      <div className="row row-cols-1 row-cols-md-2 g-3 mb-4">
        <div className="col">
          <StudentMarksLineChart data={preprocessedData} activeStudent={activeStudent} />
        </div>
        <div className="col">
          <StudentDonutChart data={preprocessedData} activeStudent={activeStudent} />
        </div>
      </div>

      <div className="row row-cols-1 g-3 mb-4">
        <div className="col">
          <StudentDetailsTable data={preprocessedData} activeStudent={activeStudent} />
        </div>
      </div>

      <div className="row row-cols-1 g-3">
        <div className="col">
          <TopStudentsTable data={preprocessedData} />
        </div>
      </div>
    </div>
  );
};

export default DSAdashboard;