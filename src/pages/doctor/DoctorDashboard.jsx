import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
import api from "../../services/api";
import "../dashboard.css";

function DoctorDashboard() {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const doctorName = userData.name ? (userData.name.startsWith("Dr.") ? userData.name : `Dr. ${userData.name}`) : "Dr. Sharma";

  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    todayAppointments: 0,
    totalPatients: 0,
    pendingPrescriptions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [apptsRes, statsRes] = await Promise.all([
          api.get("/appointments"),
          api.get("/dashboard/stats"),
        ]);
        setAppointments(apptsRes.data);
        setStats({
          todayAppointments: apptsRes.data.length,
          totalPatients: statsRes.data.totalPatients || 0,
          pendingPrescriptions: statsRes.data.pendingAppointments || 0,
        });
      } catch (err) {
        console.error("Failed to load doctor dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="app-layout">
      <Navbar role="doctor" />
      <div className="main-body">
        <Sidebar role="doctor" />
        <main className="content-area">
          <div className="page-header">
            <div>
              <h1>Welcome, {doctorName}</h1>
              <p>Hospital Clinical Staff Dashboard | Live MySQL Database</p>
            </div>
            <Link to="/doctor/prescription" className="btn btn-primary">
              + Issue Prescription
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-title">Assigned Appointments</div>
              <div className="stat-value">{stats.todayAppointments}</div>
            </div>

            <div className="stat-card stat-green">
              <div className="stat-title">Hospital Patients</div>
              <div className="stat-value">{stats.totalPatients}</div>
            </div>

            <div className="stat-card stat-orange">
              <div className="stat-title">Pending Consultations</div>
              <div className="stat-value">{stats.pendingPrescriptions}</div>
            </div>
          </div>

          {/* Today's Schedule Table */}
          <div className="content-card">
            <div className="card-header">
              <h3>Today's Patient Schedule</h3>
              <Link to="/doctor/appointments" className="btn btn-secondary btn-sm">
                Manage All
              </Link>
            </div>
            <div className="card-body">
              {loading ? (
                <p style={{ textAlign: "center", padding: "1.5rem" }}>Loading consultations...</p>
              ) : (
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Appt ID</th>
                        <th>Patient Name</th>
                        <th>Department</th>
                        <th>Time Slot</th>
                        <th>Symptoms / Reason</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.length === 0 ? (
                        <tr>
                          <td colSpan="6" style={{ textAlign: "center", padding: "1.5rem" }}>
                            No appointments assigned today.
                          </td>
                        </tr>
                      ) : (
                        appointments.slice(0, 6).map((item) => (
                          <tr key={item.id}>
                            <td><strong>{item.appointmentId || `APT-${item.id}`}</strong></td>
                            <td>{item.patient}</td>
                            <td>{item.department}</td>
                            <td>{item.time}</td>
                            <td>{item.symptoms || "General Consultation"}</td>
                            <td>
                              <span className={`badge badge-${item.status.toLowerCase()}`}>
                                {item.status}
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

export default DoctorDashboard;
