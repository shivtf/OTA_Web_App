import { Routes, Route, BrowserRouter } from "react-router-dom";
import Dashboard from "./component/Dashboard/dashboard";
import FlightResults from "./component/Flight/flightResult";
import LoginPage from "./component/pages/LoginPage";
import RegisterPage from "./component/pages/RegisterPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/flights/results" element={<FlightResults />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}
