import "../styles/LandingPage.css";

function LandingPage({ onUserTypeSelect }) {
  return (
    <div className="landing-page">
      <div className="landing-container">
        <h1 className="landing-title">TalentFlow</h1>
        <p className="landing-subtitle">Your Mini Hiring Platform</p>
        <p className="landing-description">
          Please select your role to continue
        </p>

        <div className="user-type-selection">
          <div className="user-card" onClick={() => onUserTypeSelect("hr")}>
            <div className="user-icon">👔</div>
            <h3>HR Manager</h3>
            <p>Manage candidates, jobs, and interviews</p>
          </div>

          <div
            className="user-card"
            onClick={() => onUserTypeSelect("candidate")}
          >
            <div className="user-icon">👤</div>
            <h3>Candidate</h3>
            <p>Apply for jobs and track applications</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
