import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import DomainOverviewModal from "./DomainOverviewModal";

const sessions = [
  { sno: 1, domain: "Java", status: "Completed" },
  { sno: 2, domain: "Python", status: "Completed" },
  { sno: 3, domain: "Machine Learning", status: "Completed" },
  { sno: 4, domain: "SQL Zero to Hero", status: "Ongoing" },
];

const Traings = ({ data }) => {
  const [activeTab, setActiveTab] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  const filteredSessions = sessions.filter((session) => {
    if (activeTab === "All") return true;
    if (activeTab === "Completed") return session.status === "Completed";
    if (activeTab === "Upcoming") return session.status !== "Completed";
    return true;
  });

  const openModal = (session) => {
    setSelectedSession(session);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedSession(null);
  };

  return (
    <div className="container mt-5" style={{ minHeight: "90vh" }}>
      <h3 className="mb-4 text-center">Training Sessions</h3>

      <style>{`
        .custom-tabs .nav-link {
          border: none;
          color: #495057;
          font-weight: 500;
          background-color: transparent;
        }
        .custom-tabs .nav-link.active {
          font-weight: 700;
          background-color: #e9f5ff;
          border-bottom: 3px solid #0d6efd;
          color: #0d6efd;
          border-radius: 0;
        }
      `}</style>

      <ul className="nav nav-tabs custom-tabs justify-content-center mb-4">
        {["All", "Completed", "Upcoming"].map((tab) => (
          <li className="nav-item" key={tab}>
            <button
              className={`nav-link ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          </li>
        ))}
      </ul>

      <div className="table-responsive">
        <table className="table table-bordered table-hover text-center">
          <thead className="table-primary">
            <tr>
              <th>S.No</th>
              <th>Domain</th>
              <th>Status</th>
              <th>View Result</th>
            </tr>
          </thead>
          <tbody>
            {filteredSessions.length === 0 ? (
              <tr>
                <td colSpan="4">No data available</td>
              </tr>
            ) : (
              filteredSessions.map(({ sno, domain, status }) => (
                <tr key={sno}>
                  <td>{sno}</td>
                  <td>{domain}</td>
                  <td>
                    <span
                      className={`badge ${
                        status === "Completed" ? "bg-success" : "bg-warning"
                      }`}
                    >
                      {status}
                    </span>
                  </td>
                  <td>
                    {status === "Completed" ? (
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => openModal({ sno, domain })}
                      >
                        <FaEye />
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <DomainOverviewModal
        show={modalOpen}
        handleClose={closeModal}
        selectedSession={selectedSession}
        data={data}
      />
    </div>
  );
};

export default Traings;
