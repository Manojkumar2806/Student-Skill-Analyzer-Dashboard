import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import DSAdashboard from './DSAdashboard';

const DashboardA = () => {
  const [sheetData, setSheetData] = useState([]);
  const [activeTab, setActiveTab] = useState('table');
  const [error, setError] = useState(null);

  // Function to normalize column names
  const normalizeKey = (key) => key.trim().toLowerCase().replace(/\s+/g, ' ');

  // Function to fetch and process CSV data
  const fetchSheetData = async () => {
    setError(null); // Reset error state
    try {
      const response = await fetch(
        'https://docs.google.com/spreadsheets/d/1omNXBjDrGLcgXaYOsAmNzx66afgKieqyeDks2h5XV3A/gviz/tq?tqx=out:csv'
      );
      if (!response.ok) throw new Error(`Failed to fetch data: ${response.statusText}`);
      const text = await response.text();
      const workbook = XLSX.read(text, { type: 'string' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(sheet);

      // Normalize column names and add SNO and Class
      const normalizedData = data.map((row, index) => {
        const normalizedRow = { sno: index + 1 }; // Continuous SNO
        Object.keys(row).forEach((key) => {
          normalizedRow[normalizeKey(key)] = row[key] ?? '-'; // Use "-" for missing values
        });
        normalizedRow.class = 'CSD-A'; // Hardcode Class
        return normalizedRow;
      });

      // Map to display format
      const displayData = normalizedData.map((row) => ({
        SNO: row.sno,
        USN: row.usn,
        'First Name': row['first name'],
        'Java-35m': row['java-35m'] ?? row['java- 35m'] ?? '-',
        'Python-35m': row['python-35m'],
        'Machine Learning-30m': row['machine learning-30m'],
        Total: row.total,
        Status: row.status,
        'Java Status': row['java status'],
        'Python Status': row['python status'],
        'ML Status': row['ml status'],
        ClassName: row.class,
      }));

      setSheetData(displayData);
    } catch (err) {
      setError(err.message);
    }
  };

  // Load data on mount and refresh every 10 seconds
  useEffect(() => {
    fetchSheetData();
    const interval = setInterval(fetchSheetData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Handle error state with retry option
  if (error) {
    return (
      <div className="alert alert-danger text-center m-3" role="alert">
        <p>{error}</p>
        <button
          className="btn btn-primary"
          onClick={fetchSheetData}
          aria-label="Retry loading data"
        >
          Retry
        </button>
      </div>
    );
  }

  // Handle loading state
  if (sheetData.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <span className="ms-3 text-muted">Loading Excel Data...</span>
      </div>
    );
  }

  // Define table headers
  const keys = [
    'SNO',
    'USN',
    'First Name',
    'Java-35m',
    'Python-35m',
    'Machine Learning-30m',
    'Total',
    'Status',
    'Java Status',
    'Python Status',
    'ML Status',
    'ClassName',
  ];

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Section A</h2>

      {/* Navigation tabs */}
      <ul className="nav nav-tabs" aria-label="Dashboard views">
        {['table', 'dashboard'].map((tab) => (
          <li className="nav-item" key={tab}>
            <button
              className={`nav-link ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
              type="button"
              aria-current={activeTab === tab ? 'page' : undefined}
              aria-label={`Switch to ${tab} view`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-3">
        {/* Table view */}
        {activeTab === 'table' && (
          <div className="table-responsive">
            <table className="table table-bordered table-striped" aria-label="Section A data table">
              <thead>
                <tr>
                  {keys.map((key) => (
                    <th key={key} scope="col">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sheetData.map((row, idx) => (
                  <tr key={row.USN || idx}>
                    {keys.map((key) => (
                      <td key={key}>{row[key] ?? '-'}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Dashboard view */}
        {activeTab === 'dashboard' && <DSAdashboard data={sheetData} />}
      </div>
    </div>
  );
};

export default DashboardA;