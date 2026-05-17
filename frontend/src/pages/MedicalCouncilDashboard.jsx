import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function MedicalCouncilDashboard() {

  const navigate = useNavigate();

  const [leaves, setLeaves] = useState([]);

  useEffect(() => {

  const token = localStorage.getItem("token");

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // NO TOKEN
  if (!token) {

    alert("Please login first");

    navigate("/");

    return;

  }

  // NOT MEDICAL COUNCIL
  if (
    user.role !== "medicalCouncil"
  ) {

    alert("Access denied");

    navigate("/");

    return;

  }

  fetchLeaves();

}, []);

  const fetchLeaves = async () => {

    try {

      const response = await API.get("/leaves");

      setLeaves(response.data);

    } catch (error) {

      console.log(error);

    }

  };

  const updateMedicalStatus = async (
    id,
    status
  ) => {

    try {

      await API.put(`/leaves/${id}`, {
        medicalCouncilStatus: status
      });

      fetchLeaves();

    } catch (error) {

      console.log(error);

    }

  };

  const deleteLeave = async (id) => {

  try {

    await API.delete(`/leaves/${id}`);

    fetchLeaves();

  } catch (error) {

    console.log(error);

  }

};

const handleLogout = () => {

  localStorage.removeItem("user");

  localStorage.removeItem("token");

  alert("Logged out successfully");

  navigate("/");

};

  return (

    <div>

      <h1>Medical Council Dashboard</h1>

      {

        leaves.map((leave) => (

          <div
            key={leave._id}
            style={{
              border: "1px solid gray",
              marginBottom: "15px",
              padding: "15px"
            }}
          >

            <p>
  <strong>Student Name :</strong>
  {" "}
  {leave.studentName}
</p>

<p>
  <strong>Registration Number :</strong>
  {" "}
  {leave.registrationNumber}
</p>

<p>
  <strong>Medical Reason :</strong>
  {" "}
  {leave.reason}
</p>

<p>
  <strong>From Date :</strong>
  {" "}
  {new Date(leave.fromDate).toLocaleDateString()}
</p>

<p>
  <strong>To Date :</strong>
   {" "}
  {new Date(leave.toDate).toLocaleDateString()}
</p>

  <p>

  <strong>Medical Proof :</strong>

  <a
    href={`http://localhost:5000/uploads/${leave.medicalProof}`}
    target="_blank"
  >
    View File
  </a>

</p>

            <p>

  <strong>Medical Council Status :</strong>

  <span
    style={{

      color:
        leave.medicalCouncilStatus === "Approved"
          ? "green"
          : leave.medicalCouncilStatus === "Rejected"
          ? "red"
          : "orange",

      fontWeight: "bold"

    }}
  >

    {leave.medicalCouncilStatus}

  </span>

</p>

            <button
  disabled={
    leave.medicalCouncilStatus !==
    "Pending"
  }
  onClick={() =>
    updateMedicalStatus(
      leave._id,
      "Approved"
    )
  }
>
  Approve
</button>

            <button
  disabled={
    leave.medicalCouncilStatus !==
    "Pending"
  }
  onClick={() =>
    updateMedicalStatus(
      leave._id,
      "Rejected"
    )
  }
>
              Reject
            </button>

            <button
                onClick={() =>
                    deleteLeave(leave._id)
                }
            >
                Delete
            </button>

          </div>

        ))

      }

      <button onClick={handleLogout}>
        Logout
    </button>

    </div>

  );

}