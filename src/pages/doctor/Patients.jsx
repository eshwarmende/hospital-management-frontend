import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
import api from "../../services/api";
import "../dashboard.css";

function Patients() {
  const [patientList, setPatientList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const res = await api.get("/patients");
        setPatientList(res.data);
      } catch (err) {
        console.error(err);
        setErrorMsg("Failed to load patients list.");
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const filtered = patientList.filter((p) => {
    const term = searchTerm.toLowerCase();
    const pid = (p.patientId || `PAT-${p.id}`).toLowerCase();
    const name = (p.name || "").toLowerCase();
    return pid.includes(term) || name.includes(term);
  });

  return (
    <div className="app-layout">
      <Navbar role="doctor" />
      <div className="main-body">
        <Sidebar role="doctor" />
        <main className="content-area">
          <div className="page-header">
            <div>
              <h1>Patients Record</h1>
              <p>Directory of registered patients (Live MySQL Database)</p>
            </div>
            <div style={{ maxWidth: "260px", width: "100%" }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search patient name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

          <div className="content-card">
            <div className="card-header">
              <h3>Patient Directory ({filtered.length})</h3>
            </div>
            <div className="card-body">
              {loading ? (
                <p style={{ textAlign: "center", padding: "1.5rem" }}>Loading patients from database...</p>
              ) : (
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Patient ID</th>
                        <th>Name</th>
                        <th>Age / Gender</th>
                        <th>Phone</th>
                        <th>Blood Group</th>
                        <th>Registered Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.length === 0 ? (
                        <tr>
                          <td colSpan="7" style={{ textAlign: "center", padding: "1.5rem" }}>
                            No patient records found.
                          </td>
                        </tr>
                      ) : (
                        filtered.map((patient) => (
                          <tr key={patient.id}>
                            <td><strong>{patient.patientId || `PAT-${patient.id}`}</strong></td>
                            <td>{patient.name}</td>
                            <td>{patient.age} yrs / {patient.gender}</td>
                            <td>{patient.phone}</td>
                            <td>
                              <span className="badge badge-pending">
                                {patient.bloodGroup || "O+"}
                              </span>
                            </td>
                            <td>{patient.registeredDate}</td>
                            <td>
                              <button
                                onClick={() =>
                                  alert(`Patient: ${patient.name}\nEmail: ${patient.email}\nPhone: ${patient.phone}\nBlood Group: ${patient.bloodGroup}\nAddress: ${patient.address || 'N/A'}`)
                                }
                                className="btn btn-secondary btn-sm"
                              >
                                View Details
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

export default Patients;
