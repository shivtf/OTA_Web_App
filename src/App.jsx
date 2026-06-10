import { Routes, Route } from "react-router-dom";
import Dashboard from "./component/Dashboard/dashboard";
import FlightsPage from "./component/Flight/flightPage";
import FlightResults from "./component/Flight/flightResult";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/flights" element={<FlightsPage />} />
      <Route path="/flights/results" element={<FlightResults />} />
    </Routes>
  );
}
