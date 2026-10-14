import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
import api from "../../services/api";
import "../dashboard.css";

function BookAppointment() {
  const navigate = useNavigate();

  const [doctorsList, setDoctorsList] = useState([]);
  const [formData, setFormData] = useState({
    department: "General Medicine",
    doctorId: "",
    doctorName: "",
    date: "",
    time: "10:00 AM",
    symptoms: "",
  });

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get("/doctors");
        setDoctorsList(res.data);
        if (res.data.length > 0) {
          setFormData((prev) => ({
            ...prev,
            doctorId: res.data[0].doctorId || `DOC-${res.data[0].id}`,
            doctorName: res.data[0].name,
            department: res.data[0].dept,
          }));
        }
      } catch (err) {
        console.error("Failed to fetch doctors", err);
      }
    };
    fetchDoctors();
  }, []);

  const handleDoctorChange = (e) => {
    const docId = e.target.value;
    const doc = doctorsList.find((d) => (d.doctorId || `DOC-${d.id}`) === docId);
    if (doc) {
      setFormData({
        ...formData,
        doctorId: doc.doctorId || `DOC-${doc.id}`,
        doctorName: doc.name,
        department: doc.dept,
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.date) {
      alert("Please select a date for the appointment.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const patientName = userData.name || "Rahul Verma";
      const patientEmail = userData.email || "rahul.verma@example.com";

      const newAppointment = {
        appointmentId: "APT-" + Math.floor(100 + Math.random() * 900),
        patient: patientName,
        patientEmail: patientEmail,
        doctor: formData.doctorName,
        department: formData.department,
        date: formData.date,
        time: formData.time,
        symptoms: formData.symptoms,
        status: "Pending",
      };

      await api.post("/appointments", newAppointment);

      setMessage("Appointment request submitted successfully to hospital database!");
      setTimeout(() => {
        navigate("/patient/appointments");
      }, 1200);
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to book appointment. Please try again.");
    } finally {
      setLoading(false);
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
              <h1>Book Appointment</h1>
              <p>Schedule a consultation with a hospital doctor (Persists in MySQL)</p>
            </div>
          </div>

          {message && <div className="alert alert-success">{message}</div>}
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

          <div className="content-card">
            <div className="card-header">
              <h3>Appointment Details</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit} className="dashboard-form">
                <div className="form-group-full">
                  <label htmlFor="doctorSelect">Select Doctor & Department</label>
                  <select
                    id="doctorSelect"
                    className="form-control"
                    value={formData.doctorId}
                    onChange={handleDoctorChange}
                  >
                    {doctorsList.map((doc) => {
                      const docCode = doc.doctorId || `DOC-${doc.id}`;
                      return (
                        <option key={doc.id} value={docCode}>
                          {doc.name} - ({doc.dept})
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="form-row">
                  <div>
                    <label htmlFor="date">Appointment Date</label>
                    <input
                      id="date"
                      type="date"
                      name="date"
                      className="form-control"
                      value={formData.date}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="time">Preferred Time Slot</label>
                    <select
                      id="time"
                      name="time"
                      className="form-control"
                      value={formData.time}
                      onChange={handleChange}
                    >
                      <option value="09:00 AM">09:00 AM - 10:00 AM</option>
                      <option value="10:00 AM">10:00 AM - 11:00 AM</option>
                      <option value="11:30 AM">11:30 AM - 12:30 PM</option>
                      <option value="02:00 PM">02:00 PM - 03:00 PM</option>
                      <option value="04:00 PM">04:00 PM - 05:00 PM</option>
                    </select>
                  </div>
                </div>

                <div className="form-group-full">
                  <label htmlFor="symptoms">Symptoms / Reason for Visit</label>
                  <textarea
                    id="symptoms"
                    name="symptoms"
                    className="form-control"
                    placeholder="Briefly describe your symptoms or health concern"
                    value={formData.symptoms}
                    onChange={handleChange}
                    rows="3"
                  ></textarea>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Booking..." : "Confirm Booking"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/patient/dashboard")}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default BookAppointment;
