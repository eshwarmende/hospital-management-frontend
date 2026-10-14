import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
import api from "../../services/api";
import "../dashboard.css";

function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/appointments");
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to load appointments from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      await api.put(`/appointments/${id}/status`, { status: newStatus });
      setMessage(`Appointment status updated to ${newStatus}!`);
      loadAppointments();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to update status.");
      setTimeout(() => setErrorMsg(""), 3000);
    }
  };

  return (
    <div className="app-layout">
      <Navbar role="doctor" />
      <div className="main-body">
        <Sidebar role="doctor" />
        <main className="content-area">
          <div className="page-header">
            <div>
              <h1>Doctor Appointments</h1>
              <p>Review and update status for all assigned patient appointments (Live MySQL)</p>
            </div>
          </div>

          {message && <div className="alert alert-success">{message}</div>}
          {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

          <div className="content-card">
            <div className="card-header">
              <h3>Appointment List ({appointments.length})</h3>
            </div>
            <div className="card-body">
              {loading ? (
                <p style={{ textAlign: "center", padding: "1.5rem" }}>Loading appointments...</p>
              ) : (
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Appt ID</th>
                        <th>Patient Name</th>
                        <th>Doctor</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Symptoms</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.length === 0 ? (
                        <tr>
                          <td colSpan="8" style={{ textAlign: "center", padding: "1.5rem" }}>
                            No appointments found in database.
                          </td>
                        </tr>
                      ) : (
                        appointments.map((appt) => (
                          <tr key={appt.id}>
                            <td><strong>{appt.appointmentId || `APT-${appt.id}`}</strong></td>
                            <td>{appt.patient}</td>
                            <td>{appt.doctor}</td>
                            <td>{appt.date}</td>
                            <td>{appt.time}</td>
                            <td>{appt.symptoms || "General Checkup"}</td>
                            <td>
                              <span className={`badge badge-${appt.status.toLowerCase()}`}>
                                {appt.status}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: "flex", gap: "6px" }}>
                                {appt.status !== "Confirmed" && appt.status !== "Completed" && (
                                  <button
                                    onClick={() => updateStatus(appt.id, "Confirmed")}
                                    className="btn btn-primary btn-sm"
                                  >
                                    Confirm
                                  </button>
                                )}
                                {appt.status !== "Completed" && (
                                  <button
                                    onClick={() => updateStatus(appt.id, "Completed")}
                                    className="btn btn-success btn-sm"
                                  >
                                    Complete
                                  </button>
                                )}
                                {appt.status !== "Cancelled" && (
                                  <button
                                    onClick={() => updateStatus(appt.id, "Cancelled")}
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

export default DoctorAppointments;
