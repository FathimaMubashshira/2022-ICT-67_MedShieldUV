import { useState } from "react";
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
    <div>
      <h1>Register</h1>

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
            egister
        </button>

      </form>
    </div>
  );
}