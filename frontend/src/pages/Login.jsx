import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

export default function Login() {

  const navigate = useNavigate();

  // STUDENT FORM
  const [studentData, setStudentData] = useState({
    registrationNumber: "",
    password: ""
  });

  // ADMIN FORM
  const [adminData, setAdminData] = useState({
    registrationNumber: "",
    password: ""
  });

  // MEDICALCOUNCIL FORM
  const [medicalData, setMedicalData] = useState({
    registrationNumber: "",
    password: ""
  });

  // STUDENT INPUT
  const handleStudentChange = (e) => {

    setStudentData({
      ...studentData,
      [e.target.name]: e.target.value
    });

  };

  // ADMIN INPUT
  const handleAdminChange = (e) => {

    setAdminData({
      ...adminData,
      [e.target.name]: e.target.value
    });

  };

  // MEDICALCOUNCIL INPUT
  const handleMedicalChange = (e) => {

    setMedicalData({
      ...medicalData,
      [e.target.name]: e.target.value
    });

  };

  // STUDENT LOGIN
  const handleStudentLogin = async (e) => {

    e.preventDefault();

    try {

      const response = await API.post(
        "/auth/login",
        studentData
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      alert("Student Login Successful");

      navigate("/dashboard");

    } catch (error) {

      console.log(error);

      alert("Student Login Failed");

    }
  };

  // ADMIN LOGIN
  const handleAdminLogin = async (e) => {

    e.preventDefault();

    try {

      const response = await API.post(
        "/auth/login",
        adminData
      );

      // CHECK ROLE
      if (response.data.user.role !== "admin") {

        return alert("Not an admin account");

      }

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      alert("Admin Login Successful");

      navigate("/admin");

    } catch (error) {

      console.log(error);

      alert("Admin Login Failed");

    }
  };

  //MEDICALCOUNCIL LOGIN
  const handleMedicalLogin = async (e) => {

  e.preventDefault();

  try {

    const response = await API.post(
      "/auth/login",
      medicalData
    );

    if (
      response.data.user.role !==
      "medicalCouncil"
    ) {

      return alert(
        "Not Medical Council"
      );

    }

    localStorage.setItem(
      "token",
      response.data.token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(response.data.user)
    );

    alert(
      "Medical Council Login Successful"
    );

    navigate("/medical");

  } catch (error) {

    console.log(error);

    alert(
      "Medical Council Login Failed"
    );

  }

};

  return (

    <div>

      <h1>MedShield UV Login Portal</h1>

      {/* STUDENT LOGIN */}

      <div>

        <h2>Student Login</h2>

        <form onSubmit={handleStudentLogin}>

          <input
            type="text"
            name="registrationNumber"
            placeholder="Student Registration Number"
            onChange={handleStudentChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleStudentChange}
          />

          <button type="submit">
            Student Login
          </button>

          <p>
            Don't have an account?
            <Link to="/register">
                Register Now
            </Link>
            </p>

        </form>

      </div>

      <hr />

      {/* ADMIN LOGIN */}

      <div>

        <h2>Admin Login</h2>

        <form onSubmit={handleAdminLogin}>

          <input
            type="text"
            name="registrationNumber"
            placeholder="Admin ID"
            onChange={handleAdminChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Admin Password"
            onChange={handleAdminChange}
          />

          <button type="submit">
            Admin Login
          </button>

        </form>

      </div>

      {/* MEDICALCOUNCIL LOGIN */}

      <hr />

<div>

  <h2>Medical Council Login</h2>

  <form onSubmit={handleMedicalLogin}>

    <input
      type="text"
      name="registrationNumber"
      placeholder="Medical Council ID"
      onChange={handleMedicalChange}
    />

    <input
      type="password"
      name="password"
      placeholder="Password"
      onChange={handleMedicalChange}
    />

    <button type="submit">
      Medical Council Login
    </button>

  </form>

</div>

    </div>
  );
}