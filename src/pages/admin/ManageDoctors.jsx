import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
import api from "../../services/api";
import "../dashboard.css";

function ManageDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    dept: "General Medicine",
    email: "",
    phone: "",
    experience: "",
  });

  const [alertMsg, setAlertMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const res = await api.get("/doctors");
      setDoctors(res.data);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to load doctors from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const handleChange = (e) => {
    setNewDoctor({ ...newDoctor, [e.target.name]: e.target.value });
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    try {
      const created = {
        doctorId: "DOC-" + Math.floor(100 + Math.random() * 900),
        ...newDoctor,
      };
      await api.post("/doctors", created);
      setAlertMsg(`Doctor ${newDoctor.name} added successfully!`);
      setShowAddForm(false);
      setNewDoctor({
        name: "",
        dept: "General Medicine",
        email: "",
        phone: "",
        experience: "",
      });
      loadDoctors();
      setTimeout(() => setAlertMsg(""), 3000);
    } catch (err) {
      console.error(err);
      setErrorMsg("Error creating doctor. Please check details.");
      setTimeout(() => setErrorMsg(""), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this doctor from records?")) {
      try {
        await api.delete(`/doctors/${id}`);
        setAlertMsg("Doctor record removed from MySQL database.");
        loadDoctors();
        setTimeout(() => setAlertMsg(""), 3000);
      } catch (err) {
        console.error(err);
        setErrorMsg("Failed to delete doctor.");
        setTimeout(() => setErrorMsg(""), 3000);
      }
    }
  };

  return (
    <div className="app-layout">
      <Navbar role="admin" />
      <div className="main-body">
        <Sidebar role="admin" />
        <main className="content-area">
          <div className="page-header">
            <div>
              <h1>Manage Doctors</h1>
              <p>Add, view, and organize medical staff members (Live MySQL)</p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="btn btn-primary"
            >
              {showAddForm ? "Close Form" : "+ Add New Doctor"}
            </button>
          </div>

          {alertMsg && <div className="alert alert-success">{alertMsg}</div>}
          {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

          {/* Add Doctor Form (Toggleable) */}
          {showAddForm && (
            <div className="content-card">
              <div className="card-header">
                <h3>Add New Medical Officer</h3>
              </div>
              <div className="card-body">
                <form onSubmit={handleAddDoctor} className="dashboard-form">
                  <div className="form-row">
                    <div>
                      <label htmlFor="name">Doctor Name (with title)</label>
                      <input
                        id="name"
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="e.g. Dr. Ramesh Kumar"
                        value={newDoctor.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="dept">Department</label>
                      <select
                        id="dept"
                        name="dept"
                        className="form-control"
                        value={newDoctor.dept}
                        onChange={handleChange}
                      >
                        <option value="General Medicine">General Medicine</option>
                        <option value="Cardiology">Cardiology</option>
                        <option value="Dermatology">Dermatology</option>
                        <option value="Pediatrics">Pediatrics</option>
                        <option value="Orthopedics">Orthopedics</option>
                        <option value="Neurology">Neurology</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div>
                      <label htmlFor="email">Email</label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="doctor@hospital.com"
                        value={newDoctor.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="phone">Phone Number</label>
                      <input
                        id="phone"
                        type="tel"
                        name="phone"
                        className="form-control"
                        placeholder="9876543210"
                        value={newDoctor.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group-full">
                    <label htmlFor="experience">Years of Experience</label>
                    <input
                      id="experience"
                      type="text"
                      name="experience"
                      className="form-control"
                      placeholder="e.g. 5 Years"
                      value={newDoctor.experience}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn btn-success">
                      Save Doctor
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowAddForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Doctors Table */}
          <div className="content-card">
            <div className="card-header">
              <h3>Registered Doctors List ({doctors.length})</h3>
            </div>
            <div className="card-body">
              {loading ? (
                <p style={{ textAlign: "center", padding: "1rem" }}>Loading doctors from database...</p>
              ) : (
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Doctor ID</th>
                        <th>Name</th>
                        <th>Specialization</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Experience</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doctors.length === 0 ? (
                        <tr>
                          <td colSpan="7" style={{ textAlign: "center", padding: "1.5rem" }}>
                            No doctors registered yet.
                          </td>
                        </tr>
                      ) : (
                        doctors.map((doc) => (
                          <tr key={doc.id}>
                            <td><strong>{doc.doctorId || `DOC-${doc.id}`}</strong></td>
                            <td>{doc.name}</td>
                            <td>{doc.dept}</td>
                            <td>{doc.email}</td>
                            <td>{doc.phone}</td>
                            <td>{doc.experience}</td>
                            <td>
                              <button
                                onClick={() => handleDelete(doc.id)}
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

export default ManageDoctors;
