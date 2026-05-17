import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Dashboard() {

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [leaves, setLeaves] = useState([]);

  const [showHistory, setShowHistory] =
    useState(false);

  // GO TO SUBMIT PAGE
  const goToSubmitPage = () => {

    navigate("/submit");

  };

  // ACTIVATE HISTORY BUTTON
  const viewHistory = () => {

    setShowHistory(!showHistory);

  };

  // EDIT PROFILE
  const editProfile = () => {

    alert(
      "Edit Profile feature coming soon"
    );

  };

  // FETCH LEAVES
  const fetchLeaves = async () => {

    try {

      const response =
        await API.get("/leaves");

      const user = JSON.parse(
        localStorage.getItem("user")
      ) || {};

      // FILTER ONLY CURRENT STUDENT
      const filteredLeaves =
        response.data.filter(
          (leave) =>
            leave.registrationNumber ===
            user.registrationNumber
        );

      setLeaves(filteredLeaves);

    } catch (error) {

      console.log(error);

    }

  };

  // AUTH CHECK
  useEffect(() => {

    const token =
      localStorage.getItem("token");

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    // NO TOKEN
    if (!token) {

      alert("Please login first");

      navigate("/login");

      return;

    }

    // NOT STUDENT
    if (user.role !== "student") {

      alert("Access denied");

      navigate("/login");

      return;

    }

    fetchLeaves();

  }, []);

  // LOGOUT
  const handleLogout = () => {

    localStorage.removeItem("user");

    localStorage.removeItem("token");

    alert("Logged out successfully");

    navigate("/login");

  };

  return (

    <div className="page-container">

      {/* HEADER */}

      <div
        style={{
          textAlign: "left",
          marginBottom: "20px"
        }}
      >

        <h3>
          Hello, {user.name}
        </h3>

        <p>
          {user.registrationNumber}
        </p>

      </div>

      {/* TITLE */}

      <h1 className="page-title">
        Student Dashboard
      </h1>

      {/* BUTTONS */}

      <div
        style={{
          marginBottom: "25px"
        }}
      >

        <button
          className="approve-btn"
          onClick={goToSubmitPage}
        >

          Submit Medical Leave

        </button>

        <button
          className="reject-btn"
          onClick={viewHistory}
        >

          {
            showHistory
              ? "Hide Leave History"
              : "View Leave History"
          }

        </button>

        <button
          className="logout-btn"
          onClick={editProfile}
        >

          Edit Profile

        </button>

      </div>

      {/* HISTORY SECTION */}

      {

        showHistory && (

          <div>

            <h2
              style={{
                marginBottom: "20px",
                color: "#7b1d4e"
              }}
            >

              Leave Request History

            </h2>

            {

              leaves.length === 0 ? (

                <p>
                  No leave requests found
                </p>

              ) : (

                leaves.map((leave) => (

                  <div
                    className="card"
                    key={leave._id}
                  >

                    <h3>
                      {leave.studentName}
                    </h3>

                    <p>

                      <strong>
                        Registration Number :
                      </strong>

                      {" "}

                      {leave.registrationNumber}

                    </p>

                    <p>

                      <strong>
                        Medical Reason :
                      </strong>

                      {" "}

                      {leave.reason}

                    </p>

                    <p>

                      <strong>
                        From :
                      </strong>

                      {" "}

                      {
                        new Date(
                          leave.fromDate
                        ).toLocaleDateString()
                      }

                    </p>

                    <p>

                      <strong>
                        To :
                      </strong>

                      {" "}

                      {
                        new Date(
                          leave.toDate
                        ).toLocaleDateString()
                      }

                    </p>

                    <p>

                      <strong>
                        Medical Council Status :
                      </strong>

                      {" "}

                      <span
                        style={{
                          color:
                            leave.medicalCouncilStatus ===
                            "Approved"
                              ? "green"
                              : leave.medicalCouncilStatus ===
                                "Rejected"
                              ? "red"
                              : "orange",

                          fontWeight: "bold"
                        }}
                      >

                        {
                          leave.medicalCouncilStatus
                        }

                      </span>

                    </p>

                    <p>

                      <strong>
                        Admin Status :
                      </strong>

                      {" "}

                      <span
                        style={{
                          color:
                            leave.adminStatus ===
                            "Approved"
                              ? "green"
                              : leave.adminStatus ===
                                "Rejected"
                              ? "red"
                              : "orange",

                          fontWeight: "bold"
                        }}
                      >

                        {leave.adminStatus}

                      </span>

                    </p>

                    <p>

                      <strong>
                        Request Visibility :
                      </strong>

                      {" "}

                      <span
                        style={{
                          color:
                            leave.isDeleted
                              ? "red"
                              : "green",

                          fontWeight: "bold"
                        }}
                      >

                        {
                          leave.isDeleted
                            ? "Removed from Admin Panel"
                            : "Active"
                        }

                      </span>

                    </p>

                  </div>

                ))

              )

            }

          </div>

        )

      }

      {/* LOGOUT */}

      <button
        className="logout-btn"
        onClick={handleLogout}
      >

        Logout

      </button>

    </div>

  );

}