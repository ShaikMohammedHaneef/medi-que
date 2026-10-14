import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import { Route, Routes } from "react-router";

function App() {
  return (
    <>
      <Navbar/>
      <main>
        <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/about" element={<About/>}/>
        </Routes>
      </main>
      <Footer/>
    </>
  );
}

export default App;