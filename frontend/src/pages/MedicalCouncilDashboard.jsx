import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function MedicalCouncilDashboard() {

  const navigate = useNavigate();

  const [leaves, setLeaves] = useState([]);

  useEffect(() => {

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (!user) {

      navigate("/");

      return;

    }

    if (user.role !== "medicalCouncil") {

      alert("Access denied");

      navigate("/");

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

            <h3>
              {leave.studentName}
            </h3>

            <p>
              {leave.registrationNumber}
            </p>

            <p>
              {leave.reason}
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