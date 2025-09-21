import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";

// Pages
import AssignmentPage from "./pages/AssignmentPage";
import CandidateDashboard from "./pages/CandidateDashboard";
import HRDashboard from "./pages/HRDashboard";
import JobDetail from "./pages/JobDetail";
import JobsContent from "./components/JobsContent";
import LandingPage from "./pages/LandingPage";

function App() {
  // State to track the type of logged-in user: "hr" | "candidate" | null
  const [userType, setUserType] = useState(null);

  // Handlers to set user type and reset to landing page
  const handleUserTypeSelect = (type) => setUserType(type);
  const goBack = () => setUserType(null);

  return (
    <Routes>
      {/* ------------------------- LANDING PAGE ------------------------- */}
      <Route
        path="/"
        element={
          userType === null ? (
            <LandingPage onUserTypeSelect={handleUserTypeSelect} />
          ) : userType === "hr" ? (
            <Navigate to="/hr" replace />
          ) : (
            <Navigate to="/candidate" replace />
          )
        }
      />

      {/* ------------------------- HR DASHBOARD ------------------------- */}
      <Route
        path="/hr"
        element={
          userType === "hr" ? (
            <HRDashboard onBack={goBack} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* New route for JobsContent */}
      <Route
        path="/JobsContent"
        element={
          userType === "hr" ? <JobsContent /> : <Navigate to="/" replace />
        }
      />

      {/* ------------------------- CANDIDATE DASHBOARD ------------------------- */}
      <Route
        path="/candidate"
        element={
          userType === "candidate" ? (
            <CandidateDashboard onBack={goBack} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* ------------------------- ASSIGNMENT PAGE ------------------------- */}
      <Route
        path="/candidate/assignment/:jobId"
        element={
          userType === "candidate" ? (
            <AssignmentPage />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* ------------------------- JOB DETAIL PAGE (HR View) ------------------------- */}
      <Route path="/jobs/:slug" element={<JobDetail />} />

      {/* ------------------------- CATCH-ALL REDIRECT ------------------------- */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
