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

    if (!token) {

      alert("Please login first");

      navigate("/login");

      return;

    }

    if (
      user.role !== "medicalCouncil"
    ) {

      alert("Access denied");

      navigate("/login");

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

      await API.put(
        `/leaves/delete/${id}`,
        {
          role: "medicalCouncil"
        }
      );

      fetchLeaves();

    } catch (error) {

      console.log(error);

    }

  };

  const handleLogout = () => {

    localStorage.removeItem("user");

    localStorage.removeItem("token");

    alert("Logged out successfully");

    navigate("/login");

  };

  return (

    <div className="page-container">

      <h1 className="page-title">
        Medical Council Dashboard
      </h1>

      {

        leaves.map((leave) => (

          <div className="card" key={leave._id}>

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
              {new Date(
                leave.fromDate
              ).toLocaleDateString()}
            </p>

            <p>
              <strong>To Date :</strong>
              {" "}
              {new Date(
                leave.toDate
              ).toLocaleDateString()}
            </p>

            <p>

              <strong>Medical Proof :</strong>

              {" "}

              <a
                href={`http://localhost:5000/uploads/${leave.medicalProof}`}
                target="_blank"
              >
                View File
              </a>

            </p>

            <p>

              <strong>Medical Council Status :</strong>

              {" "}

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

              className="approve-btn"

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

              className="reject-btn"

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
              className="delete-btn"
              onClick={() =>
                deleteLeave(leave._id)
              }
            >

              Delete

            </button>

          </div>

        ))

      }

      <button
        className="logout-btn"
        onClick={handleLogout}
      >

        Logout

      </button>

    </div>

  );

}