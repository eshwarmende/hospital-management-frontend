import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
import api from "../../services/api";
import "../dashboard.css";

function ManageAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/appointments");
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to load appointments from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/appointments/${id}/status`, { status: newStatus });
      setMessage(`Appointment status updated to ${newStatus}!`);
      loadAppointments();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to update appointment status.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const filtered =
    filterStatus === "All"
      ? appointments
      : appointments.filter((a) => a.status === filterStatus);

  return (
    <div className="app-layout">
      <Navbar role="admin" />
      <div className="main-body">
        <Sidebar role="admin" />
        <main className="content-area">
          <div className="page-header">
            <div>
              <h1>Manage Appointments</h1>
              <p>Monitor, approve, and organize all hospital consultations (Live MySQL)</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <label style={{ fontSize: "14px", fontWeight: "600" }}>Filter Status:</label>
              <select
                className="form-control"
                style={{ width: "150px" }}
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {message && <div className="alert alert-success">{message}</div>}
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

          <div className="content-card">
            <div className="card-header">
              <h3>All Hospital Appointments ({filtered.length})</h3>
            </div>
            <div className="card-body">
              {loading ? (
                <p style={{ textAlign: "center", padding: "1rem" }}>Loading appointments from database...</p>
              ) : (
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Appt ID</th>
                        <th>Patient</th>
                        <th>Doctor</th>
                        <th>Department</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.length === 0 ? (
                        <tr>
                          <td colSpan="8" style={{ textAlign: "center", padding: "1.5rem" }}>
                            No appointments found for this filter.
                          </td>
                        </tr>
                      ) : (
                        filtered.map((appt) => (
                          <tr key={appt.id}>
                            <td><strong>{appt.appointmentId || `APT-${appt.id}`}</strong></td>
                            <td>{appt.patient}</td>
                            <td>{appt.doctor}</td>
                            <td>{appt.department}</td>
                            <td>{appt.date}</td>
                            <td>{appt.time}</td>
                            <td>
                              <span className={`badge badge-${appt.status.toLowerCase()}`}>
                                {appt.status}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: "flex", gap: "6px" }}>
                                {appt.status === "Pending" && (
                                  <button
                                    onClick={() => handleStatusChange(appt.id, "Confirmed")}
                                    className="btn btn-primary btn-sm"
                                  >
                                    Approve
                                  </button>
                                )}
                                {appt.status !== "Completed" && appt.status !== "Cancelled" && (
                                  <button
                                    onClick={() => handleStatusChange(appt.id, "Completed")}
                                    className="btn btn-success btn-sm"
                                  >
                                    Complete
                                  </button>
                                )}
                                {appt.status !== "Cancelled" && (
                                  <button
                                    onClick={() => handleStatusChange(appt.id, "Cancelled")}
                                    className="btn btn-danger btn-sm"
                                  >
                                    Cancel
                                  </button>
                                )}
                              </div>
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

export default ManageAppointments;
