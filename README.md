# TalentFlow - A Mini Hiring Platform

TalentFlow is a comprehensive hiring platform that streamlines the recruitment process for both HR managers and candidates. Built with React and modern web technologies, it provides an intuitive interface for job management, candidate tracking, and assessment administration.

## Features

### For HR Managers

- **Dashboard Overview**: Real-time insights into job postings, candidate applications, and hiring metrics
- **Job Management**: Create, edit, and manage job postings with detailed requirements
- **Candidate Tracking**: Monitor candidates through different stages (Applied, Screening, Interview, Offer, Hired)
- **Assessment Builder**: Create custom assessments for different job positions
- **Drag & Drop Interface**: Intuitive candidate pipeline management

### For Candidates

- **Job Discovery**: Browse and search through available job opportunities
- **Application Tracking**: Monitor application status and progress
- **Online Assessments**: Complete job-specific assessments and tests
- **Profile Management**: Maintain personal information and application history

## Technology Stack

- **Frontend**: React 19.1.1 with React Router DOM
- **Database**: Dexie.js (IndexedDB wrapper) for client-side storage
- **API Mocking**: MirageJS for development API simulation
- **Styling**: Custom CSS with responsive design
- **Drag & Drop**: @hello-pangea/dnd for interactive candidate management
- **Testing**: React Testing Library with Jest

## Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (version 14 or higher)
- **npm** (version 6 or higher)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd talentflow-hiring-platform/talentflow
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
npm start
```

The application will open in your browser at `http://localhost:3000`.

### 4. Build for Production

```bash
npm run build
```

### 5. Run Tests

```bash
npm test
```

## Architecture Overview

### Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── AssessmentBuilder.js
│   ├── CandidatesContent.js
│   ├── Dashboard.js
│   └── JobsContent.js
├── pages/               # Main application pages
│   ├── candidate/       # Candidate-specific components
│   ├── AssignmentPage.js
│   ├── CandidateDashboard.js
│   ├── HRDashboard.js
│   ├── JobDetail.js
│   └── LandingPage.js
├── services/            # API and external services
│   └── mirageServer.js  # Mock API server
├── styles/              # CSS stylesheets
├── db.js               # Database configuration
├── seedData.js         # Initial data seeding
└── App.js              # Main application component
```

### Database Schema

The application uses Dexie.js (IndexedDB) with the following tables:

- **jobs**: Job postings with metadata
- **candidates**: Candidate applications and status
- **assessments**: Job-specific assessment configurations
- **candidateAnswers**: Assessment responses and scores

### API Endpoints (MirageJS)

- `GET /api/jobs` - Fetch all jobs (HR view)
- `GET /api/candidate/jobs` - Fetch active jobs (candidate view)
- `POST /api/jobs` - Create new job posting
- `POST /api/candidates` - Submit job application
- `GET /api/candidates/:email` - Get candidate applications
- `POST /api/candidate-answers` - Submit assessment answers
- `GET/PUT /api/assessments/:jobId` - Manage assessments

## Technical Decisions

### 1. Client-Side Database (Dexie.js)

**Decision**: Use IndexedDB via Dexie.js instead of a traditional backend database.

**Rationale**:

- Simplifies deployment and setup
- No server infrastructure required
- Data persists across browser sessions
- Suitable for demo/prototype purposes

**Trade-offs**:

- Data is browser-specific
- No multi-user synchronization
- Limited scalability for production use

### 2. API Mocking with MirageJS

**Decision**: Use MirageJS to simulate REST API endpoints.

**Rationale**:

- Enables frontend development without backend dependency
- Provides realistic API behavior
- Easy to modify and extend
- Maintains separation of concerns

### 3. React Router for Navigation

**Decision**: Implement client-side routing with React Router DOM.

**Rationale**:

- Single Page Application (SPA) architecture
- Better user experience with instant navigation
- SEO-friendly with proper route handling
- Supports protected routes for different user types

### 4. Component-Based Architecture

**Decision**: Organize code into reusable components and pages.

**Rationale**:

- Maintainable and scalable codebase
- Separation of concerns
- Reusable UI components
- Clear component hierarchy

### 5. CSS Modules Approach

**Decision**: Use separate CSS files for each component.

**Rationale**:

- Component-scoped styling
- Easy to maintain and debug
- No CSS conflicts
- Clear styling organization

## Known Issues

### 1. Data Persistence

- **Issue**: Data is stored in browser's IndexedDB, so it's not shared across different browsers or devices.
- **Impact**: Users need to use the same browser to access their data.
- **Workaround**: Consider implementing a backend database for production use.

### 2. Assessment Scoring

- **Issue**: Assessment scoring logic is basic and may not reflect real-world evaluation criteria.
- **Impact**: Scores may not accurately represent candidate performance.
- **Workaround**: Implement more sophisticated scoring algorithms based on job requirements.

### 3. File Upload Limitations

- **Issue**: No file upload functionality for resumes or documents.
- **Impact**: Candidates cannot attach supporting documents.
- **Workaround**: Add file upload capability with proper validation.

### 4. Email Validation

- **Issue**: Basic email validation without domain verification.
- **Impact**: Invalid email addresses may be accepted.
- **Workaround**: Implement comprehensive email validation and verification.

## Future Enhancements

### Short Term

- Implement proper authentication system
- Add file upload for resumes
- Enhance assessment scoring algorithms
- Improve mobile responsiveness
- Add email notifications

### Long Term

- Backend API integration
- Real-time collaboration features
- Advanced analytics and reporting
- Integration with external job boards
- Multi-language support
- Advanced search and filtering

## Support

For support and questions, please open an issue in the repository or contact the development team.

---

**Note**: This is a demo/prototype application. For production use, consider implementing proper backend infrastructure, authentication, and security measures.
