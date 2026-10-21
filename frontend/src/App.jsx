import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import { Route, Routes } from "react-router";
import TrackQueue from "./pages/TrackQueue.jsx";
import RegisterPatient from "./pages/RegisterPatient.jsx"

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar/>
      <main className="flex-1">
        <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/track-queue" element={<TrackQueue/>}/>
        <Route path="/register-patient" element={<RegisterPatient/>}/>
        </Routes>
      </main>
      <Footer/>
    </div>
  );
}

export default App;