import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SubmitLeave from "./pages/SubmitLeave";
import AdminDashboard from "./pages/AdminDashboard";
import MedicalCouncilDashboard from "./pages/MedicalCouncilDashboard";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/submit"
          element={<SubmitLeave />}
        />

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

        <Route
          path="/medical"
          element={<MedicalCouncilDashboard />}
        />

      </Routes>

    </BrowserRouter>

  );
}

export default App;