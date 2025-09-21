import { useState } from "react";
import CandidatesContent from "../components/CandidatesContent";
import Dashboard from "../components/Dashboard";
import JobsContent from "../components/JobsContent";
import "../styles/HRDashboard.css";

function HRDashboard({ onBack }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  //  Jobs state add kiya
  const [jobs, setJobs] = useState([]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const handleContentClick = () => isMobileMenuOpen && closeMobileMenu();

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "jobs", label: "Job Section", icon: "💼" },
    { id: "candidates", label: "Candidate Section", icon: "👥" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard hrName="John Smith" />;
      case "jobs":
        //  Props pass kiye
        return <JobsContent jobs={jobs} setJobs={setJobs} />;
      case "candidates":
        return <CandidatesContent />;
      default:
        return <div className="content">Select a menu item</div>;
    }
  };

  return (
    <div className="hr-dashboard">
      <div className="dashboard-layout">
        <div className={`sidebar ${isMobileMenuOpen ? "mobile-open" : ""}`}>
          <div className="sidebar-header">
            <button
              className={`hamburger-btn ${isMobileMenuOpen ? "hidden" : ""}`}
              onClick={toggleMobileMenu}
            >
              ☰
            </button>
            <div className="logo">
              <div className="logo-icon">TF</div>
              <h1>TalentFlow</h1>
            </div>
          </div>

          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`nav-item ${activeTab === item.id ? "active" : ""}`}
                onClick={() => {
                  setActiveTab(item.id);
                  closeMobileMenu();
                }}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="sidebar-footer">
            <div className="hr-profile">
              <div className="profile-image">
                <div className="profile-circle">H</div>
              </div>
              <div className="profile-info">
                <h4>John Smith</h4>
                <p>HR Manager</p>
              </div>
            </div>
          </div>
        </div>

        <div className="main-content" onClick={handleContentClick}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default HRDashboard;
