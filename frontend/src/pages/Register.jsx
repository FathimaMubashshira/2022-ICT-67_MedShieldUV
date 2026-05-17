import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";

export default function Register() {

  const [formData, setFormData] = useState({
    name: "",
    registrationNumber: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await API.post("/auth/register", formData);

      alert("Registration Successful");

    } catch (error) {

      console.log(error);

      alert("Registration Failed");

    }
  };

  return (

    <div className="page-container">

      <h1 className="page-title">
        Student Registration
      </h1>

      <div className="form-container">

        <h2 className="form-title">
          Create Account
        </h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
          />
          
          <input
            type="text"
            name="registrationNumber"
            placeholder="Registration Number"
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />

          <button type="submit">
            Register
          </button>

        </form>

        <p>
          Already have account?
          <Link to="/login">
            Login
          </Link>
        </p>

      </div>

    </div>

  );
}