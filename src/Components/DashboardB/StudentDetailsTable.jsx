import './StudentDetailsTable.css';

const StudentDetailsTable = ({ data, activeStudent }) => {
  if (!activeStudent) return null;

  const student = data.find(student => student.USN === activeStudent);
  if (!student) return null;

  const getFeedback = (status) => {
    switch (status?.toLowerCase()) {
      case 'good':
        return 'Excellent performance! Keep up the strong work and continue to deepen your understanding.';
      case 'average':
        return 'Good effort, but there’s room for improvement. Focus on revising key concepts and practice regularly.';
      case 'poor':
        return 'More effort is needed. Consider seeking help, practicing consistently, and reviewing core topics.';
      default:
        return 'No feedback available.';
    }
  };

  // Validate Machine Learning marks
  const mlMarks = typeof student["Machine Learning-30m"] === 'number' && !isNaN(student["Machine Learning-30m"])
    ? student["Machine Learning-30m"]
    : 0;
  if (mlMarks === 0) {
    console.warn(`Invalid Machine Learning-30m for ${student.USN}: ${student["Machine Learning-30m"]}`);
  }

  const tableData = [{
    Name: student["First Name"] || "Unknown",
    "Roll Number": student.USN || "N/A",
    Java: typeof student["Java-35m"] === 'number' && !isNaN(student["Java-35m"]) ? student["Java-35m"] : 0,
    Python: typeof student["Python-35m"] === 'number' && !isNaN(student["Python-35m"]) ? student["Python-35m"] : 0,
    "Machine Learning": mlMarks,
    Total: typeof student.Total === 'number' && !isNaN(student.Total) ? student.Total : 0,
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
                  <td>{(row.Total)-(row.Java+row.Python)}</td>
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