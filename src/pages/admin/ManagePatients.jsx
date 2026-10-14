import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
import api from "../../services/api";
import "../dashboard.css";

function ManagePatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [notice, setNotice] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const loadPatients = async () => {
    try {
      setLoading(true);
      const res = await api.get("/patients");
      setPatients(res.data);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to load patients from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this patient record?")) {
      try {
        await api.delete(`/patients/${id}`);
        setNotice("Patient record deleted from database.");
        loadPatients();
        setTimeout(() => setNotice(""), 3000);
      } catch (err) {
        console.error(err);
        setErrorMsg("Failed to delete patient.");
        setTimeout(() => setErrorMsg(""), 3000);
      }
    }
  };

  const filtered = patients.filter((p) => {
    const term = searchTerm.toLowerCase();
    const pid = (p.patientId || `PAT-${p.id}`).toLowerCase();
    const name = (p.name || "").toLowerCase();
    const email = (p.email || "").toLowerCase();
    return pid.includes(term) || name.includes(term) || email.includes(term);
  });

  return (
    <div className="app-layout">
      <Navbar role="admin" />
      <div className="main-body">
        <Sidebar role="admin" />
        <main className="content-area">
          <div className="page-header">
            <div>
              <h1>Manage Patients</h1>
              <p>View, search, and manage registered hospital patients (Live MySQL)</p>
            </div>
            <div style={{ maxWidth: "260px", width: "100%" }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search by name, ID or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {notice && <div className="alert alert-info">{notice}</div>}
          {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

          <div className="content-card">
            <div className="card-header">
              <h3>Registered Patients List ({filtered.length})</h3>
            </div>
            <div className="card-body">
              {loading ? (
                <p style={{ textAlign: "center", padding: "1rem" }}>Loading patients from database...</p>
              ) : (
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Patient ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Blood Group</th>
                        <th>Registered On</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.length === 0 ? (
                        <tr>
                          <td colSpan="7" style={{ textAlign: "center", padding: "1.5rem" }}>
                            No patients found matching your search.
                          </td>
                        </tr>
                      ) : (
                        filtered.map((patient) => (
                          <tr key={patient.id}>
                            <td><strong>{patient.patientId || `PAT-${patient.id}`}</strong></td>
                            <td>{patient.name}</td>
                            <td>{patient.email}</td>
                            <td>{patient.phone}</td>
                            <td>
                              <span className="badge badge-pending">
                                {patient.bloodGroup || "O+"}
                              </span>
                            </td>
                            <td>{patient.registeredDate || "Recent"}</td>
                            <td>
                              <button
                                onClick={() => handleDelete(patient.id)}
                                className="btn btn-danger btn-sm"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default ManagePatients;
