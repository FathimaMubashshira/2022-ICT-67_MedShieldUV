import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function AdminDashboard() {
    const navigate = useNavigate();

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

  // NOT ADMIN
  if (user.role !== "admin") {

    alert("Access denied");

    navigate("/");

    return;

  }

  fetchLeaves();

}, []);

  const [leaves, setLeaves] = useState([]);
  const [search, setSearch] = useState("");

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

  useEffect(() => {

  const token = localStorage.getItem("token");

  if (!token) {

    alert("Please login first");

    navigate("/");

  }

}, []);

useEffect(() => {
  fetchLeaves();
}, []);
  const updateStatus = async (
  id,
  status,
  medicalStatus
) => {

  // ADMIN CAN APPROVE ONLY
  // AFTER MEDICAL APPROVAL

  if (
    status === "Approved" &&
    medicalStatus !== "Approved"
  ) {

    return alert(
      "Medical Council has not approved this request"
    );

  }

  // ADMIN CAN REJECT ONLY
  // AFTER MEDICAL REJECTION

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

  alert("Admin logged out");

  navigate("/");

};

  return (
    <div>

      <h1>Admin Dashboard</h1>

      <input
        type="text"
        placeholder="Search by Name or Registration Number"
        value={search}
        onChange={(e) =>
        setSearch(e.target.value)
        }
      />

      {
        filteredLeaves.map((leave) => (

          <div key={leave._id}>

            <div
                key={leave._id}
                style={{
                    border: "1px solid gray",
                    padding: "15px",
                    marginBottom: "15px"
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
  <strong>Medical Council Status:</strong>
  {" "}
  {leave.medicalCouncilStatus}
</p>

<p>

  <strong>Admin Status :</strong>

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

  <a
    href={`http://localhost:5000/uploads/${leave.medicalProof}`}
    target="_blank"
  >
    View File
  </a>

  </p>

  <button

  style={{
    opacity:
      leave.medicalCouncilStatus !==
      "Approved"
        ? 0.5
        : 1
  }}

  disabled={
    leave.medicalCouncilStatus !==
    "Approved"
  }

  onClick={() =>
    updateStatus(
      leave._id,
      "Approved"
    )
  }

>

  Approve

</button>

  <button

  style={{
    opacity:
      leave.medicalCouncilStatus !==
      "Rejected"
        ? 0.5
        : 1
  }}

  disabled={
    leave.medicalCouncilStatus !==
    "Rejected"
  }

  onClick={() =>
    updateStatus(
      leave._id,
      "Rejected"
    )
  }

>

  Reject

</button>

    </div>
</div>
        ))
      }

    <button onClick={handleLogout}>
        Logout
    </button>

    </div>
  );
}