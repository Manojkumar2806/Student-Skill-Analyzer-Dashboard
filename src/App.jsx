import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Heading from "./Components/Heading/heading";
import DashboardA from "./Components/DashboardA/dashboardA";
import DashboardB from "./Components/DashboardB/dashboardB";
import Dashboard from "./Components/Dashboard/dashboard";
import 'bootstrap/dist/css/bootstrap.min.css';



function App() {
  return (
    <BrowserRouter>
      <Heading />
      <Routes>
        <Route path="/" element={<Dashboard />} />               
        <Route path="/overalDashboard" element={<Dashboard />} />
        <Route path="/DSA" element={<DashboardA />} />
        <Route path="/DSB" element={<DashboardB />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
