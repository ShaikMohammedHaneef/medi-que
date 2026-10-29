import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import { Route, Routes } from "react-router";
import TrackQueue from "./pages/TrackQueue.jsx";
import RegisterPatient from "./pages/RegisterPatient.jsx";
import Login from "./pages/Login.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import DoctorDashboard from "./pages/DoctorDashboard.jsx";
import ReceptionistDashboard from "./pages/ReceptionistDashboard.jsx";

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/track-queue" element={<TrackQueue />} />
          <Route path="/register-patient" element={<RegisterPatient />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/receptionist/dashboard" element={<ReceptionistDashboard />}/>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
