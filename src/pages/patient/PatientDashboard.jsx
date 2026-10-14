import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
import api from "../../services/api";
import "../dashboard.css";

function PatientDashboard() {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const patientName = userData.name ? userData.name.toUpperCase() : "PATIENT";

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const url = userData.name ? `/appointments?patient=${encodeURIComponent(userData.name)}` : "/appointments";
        const res = await api.get(url);
        setAppointments(res.data);
      } catch (err) {
        console.error("Failed to load patient dashboard appointments", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [userData.name]);

  const total = appointments.length;
  const upcoming = appointments.filter((a) => a.status === "Pending" || a.status === "Confirmed").length;
  const completed = appointments.filter((a) => a.status === "Completed").length;

  return (
    <div className="app-layout">
      <Navbar role="patient" />
      <div className="main-body">
        <Sidebar role="patient" />
        <main className="content-area">
          <div className="page-header">
            <div>
              <h1>Welcome, {patientName}</h1>
              <p>Manage your appointments and medical records (Live MySQL)</p>
            </div>
            <Link to="/patient/book-appointment" className="btn btn-primary">
              + Book New Appointment
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-title">Total Appointments</div>
              <div className="stat-value">{total}</div>
            </div>

            <div className="stat-card stat-green">
              <div className="stat-title">Upcoming Appointments</div>
              <div className="stat-value">{upcoming}</div>
            </div>

            <div className="stat-card stat-purple">
              <div className="stat-title">Completed Consultations</div>
              <div className="stat-value">{completed}</div>
            </div>
          </div>

          {/* Recent Appointments Table */}
          <div className="content-card">
            <div className="card-header">
              <h3>Recent Appointments</h3>
              <Link to="/patient/appointments" className="btn btn-secondary btn-sm">
                View All
              </Link>
            </div>
            <div className="card-body">
              {loading ? (
                <p style={{ textAlign: "center", padding: "1rem" }}>Loading your appointments...</p>
              ) : (
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Appt ID</th>
                        <th>Doctor Name</th>
                        <th>Department</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.length === 0 ? (
                        <tr>
                          <td colSpan="6" style={{ textAlign: "center", padding: "1.5rem" }}>
                            No scheduled appointments found. Click "+ Book New Appointment" to get started.
                          </td>
                        </tr>
                      ) : (
                        appointments.slice(0, 5).map((appt) => (
                          <tr key={appt.id}>
                            <td><strong>{appt.appointmentId || `APT-${appt.id}`}</strong></td>
                            <td>{appt.doctor}</td>
                            <td>{appt.department}</td>
                            <td>{appt.date}</td>
                            <td>{appt.time}</td>
                            <td>
                              <span
                                className={`badge badge-${appt.status.toLowerCase()}`}
                              >
                                {appt.status}
                              </span>
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

export default PatientDashboard;
