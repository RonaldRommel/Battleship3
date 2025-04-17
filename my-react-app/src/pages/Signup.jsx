import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [isValid, setIsValid] = useState(true); // To track overall form validity
  const navigate = useNavigate();

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
      setIsValid(false);
    } else {
      // Handle successful form submission
      setIsValid(true);
      console.log("Form data:", formData);
      try {
        await axios.post("/api/auth/signup", {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        });
      } catch (error) {
        console.error("Error during signup:", error);
        alert("Error during signup. Please try again.");
        return;
      }
      navigate("/login"); // Redirect to homepage
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
          <h2 className="text-center mb-4">Sign Up</h2>
          <form
            className="row g-3 needs-validation"
            noValidate
            onSubmit={handleSubmit}
          >
            <div className="col-md-6">
              <label htmlFor="first-name" className="form-label">
                First Name
              </label>
              <input
                type="text"
                className={`form-control ${
                  !isValid && !formData.firstName ? "is-invalid" : ""
                }`}
                id="first-name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Enter your first name"
                required
              />
              <div className="invalid-feedback">
                Please provide your first name.
              </div>
            </div>

            <div className="col-md-6">
              <label htmlFor="last-name" className="form-label">
                Last Name
              </label>
              <input
                type="text"
                className={`form-control ${
                  !isValid && !formData.lastName ? "is-invalid" : ""
                }`}
                id="last-name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Enter your last name"
                required
              />
              <div className="invalid-feedback">
                Please provide your last name.
              </div>
            </div>

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
              <div className="invalid-feedback">
                Minimum password length is 5 characters.
              </div>
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

export default SignUp;
