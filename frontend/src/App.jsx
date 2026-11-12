import { Route, Routes } from "react-router";

import PublicLayout from "./layouts/PublicLayout.jsx";
import StaffLayout from "./layouts/StaffLayout.jsx";
import {
  doctorNavigation,
  adminNavigation,
  receptionistNavigation,
} from "./config/staffNavigation.js";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import TrackQueue from "./pages/TrackQueue.jsx";
import RegisterPatient from "./pages/RegisterPatient.jsx";
import Login from "./pages/Login.jsx";
import DoctorDashboard from "./pages/DoctorDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ReceptionistDashboard from "./pages/ReceptionistDashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminDepartments from "./pages/AdminDepartments.jsx";
import AdminDoctors from "./pages/AdminDoctors.jsx";

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/track-queue" element={<TrackQueue />} />
        <Route path="/register-patient" element={<RegisterPatient />} />
        <Route path="/auth/login" element={<Login />} />
      </Route>

      {/* ADMIN dashboards */}
      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route
          path="/admin"
          element={
            <StaffLayout
              portalLabel="Admin Portal"
              role="ADMIN"
              sidebarTitle="Administration"
              sidebarDescription="Manage your hospital"
              navigationItems={adminNavigation}
            />
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="departments" element={<AdminDepartments />} />
          <Route path="doctors" element={<AdminDoctors />} />
        </Route>
      </Route>
      {/* DOCTOR dashboards */}
      <Route element={<ProtectedRoute allowedRoles={["DOCTOR"]} />}>
        <Route
          path="/doctor"
          element={
            <StaffLayout
              portalLabel="Doctor Portal"
              role="DOCTOR"
              sidebarTitle="Doctor Workspace"
              sidebarDescription="Manage your Appointments"
              navigationItems={doctorNavigation}
            />
          }
        >
          <Route path="dashboard" element={<DoctorDashboard />} />
        </Route>
      </Route>
      {/* RECEPTIONIST dashboards */}
      <Route element={<ProtectedRoute allowedRoles={"RECEPTIONIST"} />}>
        <Route
          path="/receptionist"
          element={
            <StaffLayout
              portalLabel="Receptionist Portal"
              role="RECEPTIONIST"
              sidebarTitle="Receptionist Workspace"
              sidebarDescription="Manage Patient Service"
              navigationItems={receptionistNavigation}
            />
          }
        >
          <Route path="dashboard" element={<ReceptionistDashboard />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
