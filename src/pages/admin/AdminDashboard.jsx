import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
import api from "../../services/api";
import "../dashboard.css";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    totalDepartments: 6,
    pendingAppointments: 0,
  });

  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, apptsRes] = await Promise.all([
          api.get("/dashboard/stats"),
          api.get("/appointments"),
        ]);
        setStats(statsRes.data);
        setRecentAppointments(apptsRes.data.slice(0, 5));
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="app-layout">
      <Navbar role="admin" />
      <div className="main-body">
        <Sidebar role="admin" />
        <main className="content-area">
          <div className="page-header">
            <div>
              <h1>Hospital Administration Dashboard</h1>
              <p>System overview and statistics | Hospital Management System</p>
            </div>
            <Link to="/admin/doctors" className="btn btn-primary">
              + Add New Doctor
            </Link>
          </div>

          {loading ? (
            <div className="content-card" style={{ padding: "2rem", textAlign: "center" }}>
              <p>Loading dashboard metrics from database...</p>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-title">Total Doctors</div>
                  <div className="stat-value">{stats.totalDoctors}</div>
                </div>

                <div className="stat-card stat-green">
                  <div className="stat-title">Total Patients</div>
                  <div className="stat-value">{stats.totalPatients}</div>
                </div>

                <div className="stat-card stat-orange">
                  <div className="stat-title">Total Appointments</div>
                  <div className="stat-value">{stats.totalAppointments}</div>
                </div>

                <div className="stat-card stat-purple">
                  <div className="stat-title">Pending Approvals</div>
                  <div className="stat-value">{stats.pendingAppointments}</div>
                </div>
              </div>

              {/* Recent Hospital Appointments Table */}
              <div className="content-card">
                <div className="card-header">
                  <h3>Recent Hospital Appointments (Live MySQL Database)</h3>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Appointment ID</th>
                          <th>Patient Name</th>
                          <th>Doctor</th>
                          <th>Department</th>
                          <th>Date & Time</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentAppointments.length === 0 ? (
                          <tr>
                            <td colSpan="6" style={{ textAlign: "center", padding: "1.5rem" }}>
                              No appointments found in database.
                            </td>
                          </tr>
                        ) : (
                          recentAppointments.map((appt) => (
                            <tr key={appt.id}>
                              <td><strong>{appt.appointmentId || `APT-${appt.id}`}</strong></td>
                              <td>{appt.patient}</td>
                              <td>{appt.doctor}</td>
                              <td>{appt.department}</td>
                              <td>{appt.date} ({appt.time})</td>
                              <td>
                                <span className={`badge badge-${appt.status.toLowerCase()}`}>
                                  {appt.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default AdminDashboard;
