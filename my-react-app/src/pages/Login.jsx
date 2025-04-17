import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useAuthContext } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isValid, setIsValid] = useState(true); // To track overall form validity
  const navigate = useNavigate();
  const { handleLogin } = useAuthContext();

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all required fields are filled in
    const form = e.target;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setIsValid(false); // This will trigger invalid form styling
    } else {
      setIsValid(true); // If form is valid, allow submission

      try {
        console.log("Form Submitted", formData);

        // Make the login API request
        const response = await axios.post("/api/auth/login", formData, {
          withCredentials: true,
        });

        // If successful, navigate to home
        if (response.status === 200) {
          const token = response.data.accessToken;
          console.log("Token:", token);
          handleLogin(token); // Call the login function from AuthContext
          navigate("/");
        } else {
          alert("Login failed: " + response.data.message); // Show error message to user
        }
      } catch (error) {
        console.error("Error logging in:", error);
        alert("An error occurred during login. Please try again.");
      }
    }

    // Mark form as touched
    form.classList.add("was-validated");
  };

  return (
    <>
      <Navbar />
      <div className="container d-flex justify-content-center align-items-center min-vh-90">
        <div
          className="card p-4"
          style={{ maxWidth: "500px", width: "100%", borderRadius: "10px" }}
        >
          <h2 className="text-center mb-4">Login</h2>
          <form
            className="row g-3 needs-validation"
            noValidate
            onSubmit={handleSubmit}
          >
            <div className="col-md-12">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className={`form-control ${
                  !isValid && !formData.email ? "is-invalid" : ""
                }`}
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
              />
              <div className="invalid-feedback">
                Please provide a valid email.
              </div>
            </div>

            <div className="col-md-12">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className={`form-control ${
                  !isValid && !formData.password ? "is-invalid" : ""
                }`}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                minLength={5}
                required
              />
              <div className="invalid-feedback">Password invalid!</div>
            </div>

            <div className="col-12">
              <button className="btn btn-primary" type="submit">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
