import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Footer from "./components/Footer.jsx";

function App() {
  return (
    <>
      <Navbar/>
      <main>
        <Home/>
      </main>
      <Footer/>
    </>
  );
}

export default App;