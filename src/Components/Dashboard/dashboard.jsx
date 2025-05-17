import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import Alldashboard from './Alldashboard';
import Traings from './Traings';

const Dashboard = () => {
  const [combinedData, setCombinedData] = useState([]);
  const [activeTab, setActiveTab] = useState('table');
  const [error, setError] = useState(null);

  // Function to normalize column names
  const normalizeKey = (key) => key.trim().toLowerCase().replace(/\s+/g, ' ');

  // Function to fetch and process CSV data from a Google Sheet
  const fetchSheetData = async (url, className) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
      const text = await response.text();
      const workbook = XLSX.read(text, { type: 'string' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(sheet);
      // Normalize column names and add SNO and Class
      return data.map((row, index) => {
        const normalizedRow = { SNO: index + 1 }; // Temporary SNO
        Object.keys(row).forEach((key) => {
          normalizedRow[normalizeKey(key)] = row[key];
        });
        normalizedRow.class = className; // Use lowercase for consistency
        return normalizedRow;
      });
    } catch (err) {
      throw new Error(`Error processing ${url}: ${err.message}`);
    }
  };

  // Function to load and combine data from both sheets
  const loadAllData = async () => {
    setError(null); // Reset error state
    try {
      const [dsaData, dsbData] = await Promise.all([
        fetchSheetData(
          'https://docs.google.com/spreadsheets/d/1omNXBjDrGLcgXaYOsAmNzx66afgKieqyeDks2h5XV3A/gviz/tq?tqx=out:csv',
          'CSD-A'
        ),
        fetchSheetData(
          'https://docs.google.com/spreadsheets/d/1PNLmx98YVI4oJ9gBM_oagJatA4on8f4T_4bAJSxzy8E/gviz/tq?tqx=out:csv',
          'CSD-B'
        ),
      ]);

      // Collect all unique normalized columns (excluding SNO and class)
      const dsaKeys = dsaData[0] ? Object.keys(dsaData[0]).filter((k) => k !== 'SNO' && k !== 'class') : [];
      const dsbKeys = dsbData[0] ? Object.keys(dsbData[0]).filter((k) => k !== 'SNO' && k !== 'class') : [];
      const allKeys = Array.from(new Set([...dsaKeys, ...dsbKeys]));

      // Combine data, including all normalized columns
      const combined = [...dsaData, ...dsbData].map((row, index) => {
        const normalizedRow = { sno: index + 1 }; // Continuous SNO
        allKeys.forEach((key) => {
          normalizedRow[key] = row[key] ?? '-'; // Use "-" for missing values
        });
        normalizedRow.class = row.class;
        return normalizedRow;
      });

      // Rename keys for display to match expected format
      const displayData = combined.map((row) => ({
        SNO: row.sno,
        USN: row.usn,
        'First Name': row['first name'],
        'Java-35m': row['java-35m'] ?? row['java- 35m'] ?? '-', // Handle space in CSD-B
        'Python-35m': row['python-35m'],
        'Machine Learning-30m': row['machine learning-30m'],
        Total: row.total,
        Status: row.status,
        'Java Status': row['java status'],
        'Python Status': row['python status'],
        'ML Status': row['ml status'],
        ClassName: row.class,
      }));

      setCombinedData(displayData);
    } catch (err) {
      setError(err.message);
    }
  };

  // Load data on mount and refresh every 10 seconds
  useEffect(() => {
    loadAllData();
    const interval = setInterval(loadAllData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Handle error state with retry option
  if (error) {
    return (
      <div className="alert alert-danger text-center m-3" role="alert">
        <p>{error}</p>
        <button
          className="btn btn-primary"
          onClick={loadAllData}
          aria-label="Retry loading data"
        >
          Retry
        </button>
      </div>
    );
  }

  // Handle loading state
  if (combinedData.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <span className="ms-3 text-muted">Loading combined data...</span>
      </div>
    );
  }

  // Extract keys for table headers
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
      <h2 className="text-center mb-4">Combined Dashboard</h2>

      {/* Navigation tabs */}
      <ul className="nav nav-tabs" aria-label="Dashboard views">
        {['table', 'dashboard', 'Traings'].map((tab) => (
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
            <table className="table table-bordered table-striped" aria-label="Combined data table">
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
                {combinedData.map((row, idx) => (
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
        {activeTab === 'dashboard' && <Alldashboard data={combinedData} />}

        {/* Traings view */}
        {activeTab === 'Traings' && <Traings data={combinedData} />}
      </div>
    </div>
  );
};

export default Dashboard;