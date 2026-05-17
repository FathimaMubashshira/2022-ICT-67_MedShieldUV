import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Dashboard() {

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const goToSubmitPage = () => {
        navigate("/submit");
    };

    const viewHistory = () => {
        alert("Scroll down to view leave history");
    };

    const editProfile = () => {
        alert("Edit Profile feature coming soon");
    };

  const [leaves, setLeaves] = useState([]);

  const fetchLeaves = async () => {

  try {

    const response = await API.get("/leaves");

    const user = JSON.parse(
      localStorage.getItem("user")
    ) || {};

    // FILTER ONLY CURRENT STUDENT
    const filteredLeaves = response.data.filter(
      (leave) =>
        leave.registrationNumber ===
        user.registrationNumber
    );

    setLeaves(filteredLeaves);

  } catch (error) {

    console.log(error);

  }
};
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

  // NOT STUDENT
  if (user.role !== "student") {

    alert("Access denied");

    navigate("/");

    return;

  }

  fetchLeaves();

}, []);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleLogout = () => {

  localStorage.removeItem("user");
  localStorage.removeItem("token");

  alert("Logged out successfully");

  navigate("/");

};

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

      <h1>Student Dashboard</h1>

    <div>
        <button onClick={goToSubmitPage}>
            Submit Medical Leave
        </button>

        <button onClick={viewHistory}>
            View Leave History
        </button>

        <button onClick={editProfile}>
            Edit Profile
        </button>

    </div>

      {
        leaves.map((leave) => (

          <div key={leave._id}>

            <h3>{leave.studentName}</h3>

            <p>
              Registration Number: {leave.registrationNumber}
            </p>

            <p>
              Reason: {leave.reason}
            </p>

            <p>
              From: {new Date(leave.fromDate).toLocaleDateString()}
            </p>

            <p>
              To: {new Date(leave.toDate).toLocaleDateString()}
            </p>

            <p>

  <strong>Status :</strong>

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

          </div>
        ))
      }

    <button onClick={handleLogout}>
        Logout
    </button>

    </div>
  );
}