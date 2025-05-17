import { useState } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";


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
      "Machine Learning Status": student["Machine Learning Status"]?.trim() || getStatus(student["Machine Learning-30m"], 30)
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
      else counts.Poor += 1;  // default fallback
    });

    return {
      subject: name,
      Good: counts.Good,
      Average: counts.Average,
      Poor: counts.Poor,
    };
  });
};


// Student Filter Component
const StudentFilter = ({ students, activeStudent, setActiveStudent }) => (
  <div className="filter-dropdown w-100 w-md-100 mx-auto">
    <select
      className="form-select shadow-sm"
      value={activeStudent || ""}
      onChange={(e) => setActiveStudent(e.target.value || null)}
    >
      <option value="">All Students</option>
      {students.map((student) => (
        <option key={student.USN} value={student.USN}>{student["First Name"]} ({student.USN})</option>
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
      className="card shadow border-0 container kpi-card transition-all"
      style={{ transform: isHovered ? "translateY(-5px)" : "none" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="card-body d-flex align-items-center justify-content-between p-3 p-md-4">
        <div className="d-flex align-items-start gap-2">
          <div className="kpi-icon-container" style={{ transform: isHovered ? "scale(1.1)" : "none" }}>
            
          </div>
          <div className="kpi-text">
            <h6 className="card-subtitle mb-1 text-muted">{title}</h6>
            <h4 className={`card-title fw-bold ${color}`}>{value}</h4>
          </div>
        </div>
        <div className="kpi-chart" style={{ minWidth: "45px" }}>
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

// Top 7 Students Table Component
const TopStudentsTable = ({ data }) => {
  const topStudents = [...data]
    .sort((a, b) => b.Total - a.Total)
    .slice(0, 15);

  return (
    <div className="card shadow border-0">
      <div className="card-header bg-white border-0 pt-3 px-3">
        <h5 className="card-title mb-0">Top 15 Students by Total Marks</h5>
      </div>
      <div className="card-body p-3">
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Roll Number</th>
                <th scope="col">Total Marks</th>
                <th scope="col">Class Name</th>
              </tr>
            </thead>
            <tbody>
              {topStudents.map((student) => (
                <tr key={student.USN}>
                  <td>{student["First Name"]}</td>
                  <td>{student.USN}</td>
                  <td>{student.Total}</td>
                  <td>{student["ClassName"]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// KPI Donut Chart Component
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
              fill="#8884d8"
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

// Bar Chart
const SubjectPerformanceBarChart = ({ data }) => {
  const chartData = prepareSubjectPerformanceData(data);

  return (
    <div className="card shadow border-0">
      <div className="card-header bg-white border-0 pt-3 px-3">
        <h5 className="card-title mb-0">Student Performance by Subject (Bar)</h5>
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


// Main Alldashboard Component
const Alldashboard = ({ data }) => {
  const [activeStudent, setActiveStudent] = useState(null);
  const preprocessedData = preprocessData(data);
  const overallMetrics = calculateOverallMetrics(preprocessedData);

  return (
    <div className="container-fluid p-3 p-md-4 dashboard-container">
      <div className="row align-items-center mb-4">
        <div className="col-12 col-md-6 mb-3 mb-md-0">
          <h2 className="text-primary text-center fw-bold">Student Performance Dashboard</h2>
        </div>
        <div className="col-12 col-md-6">
          <StudentFilter students={preprocessedData} activeStudent={activeStudent} setActiveStudent={setActiveStudent} />
        </div>
      </div>

      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-3 mb-4">
        {[
          { title: "Total Students", value: overallMetrics.totalStudents, color: "text-primary" },
          { title: "No. of Good", value: overallMetrics.totalGood, color: "text-success" },
          { title: "No. of Average", value: overallMetrics.totalAverage, color: "text-primary" },
          { title: "No. of Poor", value: overallMetrics.totalPoor, color: "text-danger" },
        ].map((kpi) => (
          <div className="col" key={kpi.title}>
            <KpiCard
              {...kpi}
              totalStudents={overallMetrics.totalStudents}
            />
          </div>
        ))}
      </div>

      <div className="row">
        
        <div className="col-12 col-md-6">
            <SubjectPerformanceBarChart data={preprocessedData} />
        </div>
             
        <div className="col-12 col-md-6 mb-3">
            <KpiDonutChart
                totalGood={overallMetrics.totalGood}
                totalAverage={overallMetrics.totalAverage}
                totalPoor={overallMetrics.totalPoor}
            />
        </div>   
      </div>

      <div className="row"> 
         <div className="col-12  mb-4 mb-md-0">
           <TopStudentsTable data={preprocessedData} />
          </div>
      </div>

      
    </div>
  );
};

export default Alldashboard;