import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function AdminDashboard() {

  const navigate = useNavigate();

  const [leaves, setLeaves] = useState([]);
  const [search, setSearch] = useState("");

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

    if (user.role !== "admin") {

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

  const filteredLeaves = leaves.filter((leave) => {

    return (

      leave.studentName
        .toLowerCase()
        .includes(search.toLowerCase())

      ||

      leave.registrationNumber
        .toLowerCase()
        .includes(search.toLowerCase())

    );

  });

  const updateStatus = async (
    id,
    status,
    medicalStatus
  ) => {

    // APPROVE ONLY AFTER MEDICAL APPROVAL
    if (
      status === "Approved" &&
      medicalStatus !== "Approved"
    ) {

      return alert(
        "Medical Council has not approved this request"
      );

    }

    // REJECT ONLY AFTER MEDICAL REJECTION
    if (
      status === "Rejected" &&
      medicalStatus !== "Rejected"
    ) {

      return alert(
        "Admin can reject only after Medical Council rejection"
      );

    }

    try {

      await API.put(`/leaves/${id}`, {
        adminStatus: status
      });

      fetchLeaves();

    } catch (error) {

      console.log(error);

    }

  };

  const handleLogout = () => {

    localStorage.removeItem("user");

    localStorage.removeItem("token");

    alert("Admin logged out");

    navigate("/login");

  };

  return (

    <div className="page-container">

      <h1 className="page-title">
        Admin Dashboard
      </h1>

      <input
        className="search-box"
        type="text"
        placeholder="Search by Name or Registration Number"
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      {

        filteredLeaves.map((leave) => (

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

            <p>

              <strong>Admin Status :</strong>

              {" "}

              <span
                style={{
                  color:
                    leave.adminStatus === "Approved"
                      ? "green"
                      : leave.adminStatus === "Rejected"
                      ? "red"
                      : "orange",
                  fontWeight: "bold"
                }}
              >

                {leave.adminStatus}

              </span>

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

            <button

              className="approve-btn"

              disabled={
                leave.medicalCouncilStatus !==
                "Approved"
              }

              onClick={() =>
                updateStatus(
                  leave._id,
                  "Approved",
                  leave.medicalCouncilStatus
                )
              }
            >

              Approve

            </button>

            <button

              className="reject-btn"

              disabled={
                leave.medicalCouncilStatus !==
                "Rejected"
              }

              onClick={() =>
                updateStatus(
                  leave._id,
                  "Rejected",
                  leave.medicalCouncilStatus
                )
              }
            >

              Reject

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