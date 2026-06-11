import { Routes, Route, BrowserRouter } from "react-router-dom";
import Dashboard from "./component/Dashboard/dashboard";
import FlightResults from "./component/Flight/flightResult";
import Login from "./component/Auth/login";
import Register from "./component/Auth/register";
import HotelsPage from "./component/Hotel/HotelsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/flights/results" element={<FlightResults />} />
        <Route path="/hotelsPage" element={<HotelsPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}
