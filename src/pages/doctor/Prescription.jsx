import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
import api from "../../services/api";
import "../dashboard.css";

function Prescription() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [patientList, setPatientList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    patient: "",
    diagnosis: "",
    medicine: "",
    duration: "7 Days",
    notes: "",
  });

  const [feedback, setFeedback] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const [rxRes, patRes] = await Promise.all([
        api.get("/prescriptions"),
        api.get("/patients"),
      ]);
      setPrescriptions(rxRes.data);
      setPatientList(patRes.data);
      if (patRes.data.length > 0 && !form.patient) {
        setForm((prev) => ({ ...prev, patient: patRes.data[0].name }));
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to load prescription data from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleIssue = async (e) => {
    e.preventDefault();

    if (!form.diagnosis || !form.medicine) {
      alert("Please fill in diagnosis and prescribed medicines.");
      return;
    }

    try {
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const doctorName = userData.name ? (userData.name.startsWith("Dr.") ? userData.name : `Dr. ${userData.name}`) : "Dr. Rajesh Sharma";

      const newRx = {
        prescriptionId: "RX-" + Math.floor(500 + Math.random() * 500),
        patient: form.patient || (patientList[0] ? patientList[0].name : "Rahul Verma"),
        doctor: doctorName,
        diagnosis: form.diagnosis,
        medicine: form.medicine,
        duration: form.duration,
        notes: form.notes,
        date: new Date().toISOString().split("T")[0],
      };

      await api.post("/prescriptions", newRx);
      setFeedback("Prescription created and saved to MySQL database successfully!");
      setForm({
        patient: patientList[0] ? patientList[0].name : "",
        diagnosis: "",
        medicine: "",
        duration: "7 Days",
        notes: "",
      });
      loadData();
      setTimeout(() => setFeedback(""), 3000);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to issue prescription.");
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
              <h1>Doctor Prescriptions</h1>
              <p>Create and record medical prescriptions for patients (Live MySQL)</p>
            </div>
          </div>

          {feedback && <div className="alert alert-success">{feedback}</div>}
          {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

          {/* Issue Prescription Form */}
          <div className="content-card">
            <div className="card-header">
              <h3>Create New Prescription</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleIssue} className="dashboard-form">
                <div className="form-row">
                  <div>
                    <label htmlFor="patient">Select Patient</label>
                    <select
                      id="patient"
                      name="patient"
                      className="form-control"
                      value={form.patient}
                      onChange={handleChange}
                    >
                      {patientList.map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.name} ({p.patientId || `PAT-${p.id}`})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="duration">Treatment Duration</label>
                    <select
                      id="duration"
                      name="duration"
                      className="form-control"
                      value={form.duration}
                      onChange={handleChange}
                    >
                      <option value="3 Days">3 Days</option>
                      <option value="5 Days">5 Days</option>
                      <option value="7 Days">7 Days</option>
                      <option value="15 Days">15 Days</option>
                      <option value="30 Days">30 Days</option>
                    </select>
                  </div>
                </div>

                <div className="form-group-full">
                  <label htmlFor="diagnosis">Diagnosis</label>
                  <input
                    id="diagnosis"
                    type="text"
                    name="diagnosis"
                    className="form-control"
                    placeholder="e.g. Acute Bronchitis, Hypertension"
                    value={form.diagnosis}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group-full">
                  <label htmlFor="medicine">Medicines & Dosage</label>
                  <textarea
                    id="medicine"
                    name="medicine"
                    className="form-control"
                    placeholder="e.g. 1. Tab Azithromycin 500mg - 1 OD&#10;2. Tab Paracetamol 650mg - 1 TDS"
                    value={form.medicine}
                    onChange={handleChange}
                    rows="3"
                    required
                  ></textarea>
                </div>

                <div className="form-group-full">
                  <label htmlFor="notes">Doctor's Advice / Diet Instructions</label>
                  <input
                    id="notes"
                    type="text"
                    name="notes"
                    className="form-control"
                    placeholder="e.g. Drink plenty of warm water, avoid oily food"
                    value={form.notes}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    Save & Issue Prescription
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* History of Prescriptions Table */}
          <div className="content-card">
            <div className="card-header">
              <h3>Recently Issued Prescriptions ({prescriptions.length})</h3>
            </div>
            <div className="card-body">
              {loading ? (
                <p style={{ textAlign: "center", padding: "1.5rem" }}>Loading prescriptions from database...</p>
              ) : (
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Rx ID</th>
                        <th>Patient Name</th>
                        <th>Doctor</th>
                        <th>Diagnosis</th>
                        <th>Medicines</th>
                        <th>Duration</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prescriptions.length === 0 ? (
                        <tr>
                          <td colSpan="7" style={{ textAlign: "center", padding: "1.5rem" }}>
                            No prescriptions issued yet.
                          </td>
                        </tr>
                      ) : (
                        prescriptions.map((rx) => (
                          <tr key={rx.id}>
                            <td><strong>{rx.prescriptionId || `RX-${rx.id}`}</strong></td>
                            <td>{rx.patient}</td>
                            <td>{rx.doctor || "Medical Officer"}</td>
                            <td>{rx.diagnosis}</td>
                            <td>{rx.medicine}</td>
                            <td>{rx.duration}</td>
                            <td>{rx.date}</td>
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

export default Prescription;
