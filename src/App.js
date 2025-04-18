import './App.css';
import Footer from './components/Footer/Footer';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from './components/Home/Home';
import Dashboard from '../src/components/Dashboard/Dashboard'; // Create this file as discussed
import AuthPopup from './components/Auth/AuthPopup'; // Optional: if you want to open login/register directly via route

function App() {
  // Optional: auth check function
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Homepage */}
          <Route path="/" element={<Home />} />

          {/* Dashboard - Protected Route (optional check) */}
          <Route
            path="/dashboard"
            element={isAuthenticated() ? <Dashboard /> : <Navigate to="/" />}
          />

          {/* Optional: open login/register popup directly */}
          {/* <Route path="/auth" element={<AuthPopup show={true} />} /> */}
        </Routes>

        {/* <Footer /> */}
      </div>
    </Router>
  );
}

export default App;
