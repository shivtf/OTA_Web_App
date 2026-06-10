import { Routes, Route, BrowserRouter } from "react-router-dom";
import Dashboard from "./component/Dashboard/dashboard";
import FlightResults from "./component/Flight/flightResult";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/flights/results" element={<FlightResults />} />
      </Routes>
    </BrowserRouter>
  );
}
