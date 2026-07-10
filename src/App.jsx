import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";

;
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import CustomerDashboard from "./pages/customer/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";

function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* Authentication Pages */}
      
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Dashboards */}
      <Route
        path="/customer/dashboard"
        element={<CustomerDashboard />}
      />
      <Route
        path="/admin/dashboard"
        element={<AdminDashboard />}
      />
    </Routes>
  );
}

export default App;