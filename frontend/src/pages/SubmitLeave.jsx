import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function SubmitLeave() {

  const navigate = useNavigate();
    
    // GET LOGGED USER
    const user = JSON.parse(
      localStorage.getItem("user")
    ) || {};

  const [formData, setFormData] = useState({
    studentName: user.name,
    registrationNumber: user.registrationNumber,
    reason: "",
    fromDate: "",
    toDate: "",
    medicalProof: null
  });

  const handleChange = (e) => {

  if (e.target.name === "medicalProof") {

    setFormData({
      ...formData,
      medicalProof: e.target.files[0]
    });

  }

  else {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  }
};

  const handleSubmit = async (e) => {

  e.preventDefault();

  try {

    const data = new FormData();

    data.append(
      "studentName",
      formData.studentName
    );

    data.append(
      "registrationNumber",
      formData.registrationNumber
    );

    data.append(
      "reason",
      formData.reason
    );

    data.append(
      "fromDate",
      formData.fromDate
    );

    data.append(
      "toDate",
      formData.toDate
    );

    data.append(
      "medicalProof",
      formData.medicalProof
    );

    await API.post(
      "/leaves",
      data
    );

    alert("Leave Request Submitted Successfully");

    navigate("/dashboard");

  } catch (error) {

    console.log(error);

  }
};

useEffect(() => {

  const token = localStorage.getItem("token");

  if (!token) {

    alert("Please login first");

    navigate("/");

  }

}, []);

  return (
    <div>

        <div style={{ textAlign: "left" }}>

            <h3>
                Hello, {user.name}
            </h3>

            <p>
                {user.registrationNumber}
            </p>

    </div>

      <h1>Submit Medical Leave</h1>

      <form onSubmit={handleSubmit}>

        <textarea
          name="reason"
          placeholder="Reason"
          onChange={handleChange}
        ></textarea>

        <input
          type="date"
          name="fromDate"
          onChange={handleChange}
        />

        <input
          type="date"
          name="toDate"
          onChange={handleChange}
        />

        <input
            type="file"
            name="medicalProof"
            onChange={handleChange}
        />

        <button type="submit">
          Submit Leave
        </button>

      </form>
    </div>
  );
}