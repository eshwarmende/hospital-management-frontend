import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
import api from "../../services/api";
import "../dashboard.css";

function PatientProfile() {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const userEmail = userData.email || "rahul.verma@example.com";

  const [profile, setProfile] = useState({
    name: userData.name || "Rahul Verma",
    email: userEmail,
    phone: userData.phone || "9876543210",
    age: 24,
    gender: "Male",
    bloodGroup: "O+",
    address: "H.No 12/4, MG Road, Hyderabad",
  });

  const [savedMessage, setSavedMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/patients/by-email?email=${encodeURIComponent(userEmail)}`);
        if (res.data) {
          setProfile((prev) => ({
            ...prev,
            ...res.data,
          }));
        }
      } catch (err) {
        console.warn("Could not find existing patient record by email, using session data.", err);
      }
    };
    fetchProfile();
  }, [userEmail]);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      await api.put(`/patients/by-email?email=${encodeURIComponent(userEmail)}`, profile);
      setSavedMessage("Profile updated successfully in MySQL database!");
      setTimeout(() => setSavedMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to update profile.");
      setTimeout(() => setErrorMessage(""), 3000);
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
              <h1>Patient Profile</h1>
              <p>View and update your personal health profile details (Live MySQL)</p>
            </div>
          </div>

          {savedMessage && <div className="alert alert-success">{savedMessage}</div>}
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

          <div className="content-card">
            <div className="card-header">
              <h3>Personal Information</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit} className="dashboard-form">
                <div className="form-row">
                  <div>
                    <label htmlFor="name">Full Name</label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      className="form-control"
                      value={profile.name || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      className="form-control"
                      value={profile.email || ""}
                      onChange={handleChange}
                      disabled
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div>
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      className="form-control"
                      value={profile.phone || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="age">Age</label>
                    <input
                      id="age"
                      type="number"
                      name="age"
                      className="form-control"
                      value={profile.age || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div>
                    <label htmlFor="gender">Gender</label>
                    <select
                      id="gender"
                      name="gender"
                      className="form-control"
                      value={profile.gender || "Male"}
                      onChange={handleChange}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="bloodGroup">Blood Group</label>
                    <select
                      id="bloodGroup"
                      name="bloodGroup"
                      className="form-control"
                      value={profile.bloodGroup || "O+"}
                      onChange={handleChange}
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                </div>

                <div className="form-group-full">
                  <label htmlFor="address">Address</label>
                  <textarea
                    id="address"
                    name="address"
                    className="form-control"
                    rows="2"
                    value={profile.address || ""}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Saving..." : "Update Profile"}
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

export default PatientProfile;
