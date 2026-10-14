import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
import api from "../../services/api";
import "../dashboard.css";

function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const loadAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const patientName = userData.name;
      const url = patientName ? `/appointments?patient=${encodeURIComponent(patientName)}` : "/appointments";
      const res = await api.get(url);
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to load your appointments from database.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        await api.put(`/appointments/${id}/status`, { status: "Cancelled" });
        setMessage("Appointment cancelled successfully.");
        loadAppointments();
        setTimeout(() => setMessage(""), 3000);
      } catch (err) {
        console.error(err);
        setErrorMsg("Failed to cancel appointment.");
        setTimeout(() => setErrorMsg(""), 3000);
      }
    }
  };

  return (
    <div className="app-layout">
      <Navbar role="patient" />
      <div className="main-body">
        <Sidebar role="patient" />
        <main className="content-area">
          <div className="page-header">
            <div>
              <h1>My Appointments</h1>
              <p>View the history and current status of your consultations (Live MySQL)</p>
            </div>
            <Link to="/patient/book-appointment" className="btn btn-primary">
              + Book New Appointment
            </Link>
          </div>

          {message && <div className="alert alert-success">{message}</div>}
          {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

          <div className="content-card">
            <div className="card-header">
              <h3>Scheduled Consultations ({appointments.length})</h3>
            </div>
            <div className="card-body">
              {loading ? (
                <p style={{ textAlign: "center", padding: "1.5rem" }}>Loading appointments...</p>
              ) : (
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Appointment ID</th>
                        <th>Doctor</th>
                        <th>Department</th>
                        <th>Date</th>
                        <th>Time Slot</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.length === 0 ? (
                        <tr>
                          <td colSpan="7" style={{ textAlign: "center", padding: "2rem" }}>
                            You have no appointments scheduled. Click "Book New Appointment" to schedule one.
                          </td>
                        </tr>
                      ) : (
                        appointments.map((appt) => (
                          <tr key={appt.id}>
                            <td><strong>{appt.appointmentId || `APT-${appt.id}`}</strong></td>
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
                              {appt.status !== "Cancelled" && appt.status !== "Completed" ? (
                                <button
                                  onClick={() => handleCancel(appt.id)}
                                  className="btn btn-danger btn-sm"
                                >
                                  Cancel
                                </button>
                              ) : (
                                <span style={{ color: "#888", fontSize: "12px" }}>None</span>
                              )}
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

export default MyAppointments;
