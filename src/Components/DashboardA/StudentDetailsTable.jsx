import './StudentDetailsTable.css';

const StudentDetailsTable = ({ data, activeStudent }) => {
  if (!activeStudent) return null;

  const student = data.find(student => student.USN === activeStudent);
  if (!student) return null;

  const getFeedback = (status) => {
    switch (status?.toLowerCase()) {
      case 'good':
        return 'Excellent performance! Continue to excel and explore advanced topics.';
      case 'average':
        return 'Solid effort. Focus on consistent practice to boost your scores.';
      case 'poor':
        return 'More effort needed. Seek guidance and review foundational concepts.';
      default:
        return 'No feedback available.';
    }
  };

  const pythonMark = typeof student["Python-35m"] === 'number' && !isNaN(student["Python-35m"])
    ? student["Python-35m"]
    : 0;
  const mlMark = typeof student["Machine Learning-30m"] === 'number' && !isNaN(student["Machine Learning-30m"])
    ? student["Machine Learning-30m"]
    : 0;
  const totalMark = typeof student.Total === 'number' && !isNaN(student.Total)
    ? student.Total
    : 0;

  // Calculate Java marks as (Total - (Python + ML))
  let javaMark = totalMark - (pythonMark + mlMark);
  if (javaMark < 0) {
    console.warn(`Java mark negative for ${student.USN}, setting to 0. Total: ${totalMark}, Python: ${pythonMark}, ML: ${mlMark}`);
    javaMark = 0;
  }

  // Log warnings
  if (pythonMark === 0) console.warn(`Invalid Python-35m for ${student.USN}: ${student["Python-35m"]}`);
  if (mlMark === 0) console.warn(`Invalid Machine Learning-30m for ${student.USN}: ${student["Machine Learning-30m"]}`);
  if (totalMark === 0) console.warn(`Invalid Total for ${student.USN}: ${student.Total}`);

  const tableData = [{
    Name: student["First Name"] || "Unknown",
    "Roll Number": student.USN || "N/A",
    Java: javaMark,
    Python: pythonMark,
    "Machine Learning": mlMark,
    Total: totalMark,
    Feedback: getFeedback(student.Status || "Poor")
  }];

  return (
    <div className="card shadow border-0 custom-card">
      <div className="card-header bg-transparent border-0 pt-3 px-3">
        <h5 className="card-title mb-0 text-dark">{student["First Name"]}'s Performance Details</h5>
      </div>
      <div className="card-body p-3">
        <div className="table-responsive">
          <table className="table table-striped table-hover custom-table">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Roll Number</th>
                <th scope="col">Java (35)</th>
                <th scope="col">Python (35)</th>
                <th scope="col">Machine Learning (30)</th>
                <th scope="col">Total (100)</th>
                <th scope="col">Feedback</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.Name}</td>
                  <td>{row["Roll Number"]}</td>
                  <td>{row.Java}</td>
                  <td>{row.Python}</td>
                  <td>{row["Machine Learning"]}</td>
                  <td>{row.Total}</td>
                  <td className="feedback-cell">{row.Feedback}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailsTable;
