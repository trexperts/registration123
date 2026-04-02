// src/pages/CommitteeMatch.jsx
// Add to your React Router: <Route path="/committee-match" element={<CommitteeMatch />} />

import { useNavigate } from 'react-router-dom';

export default function CommitteeMatch() {
  const navigate = useNavigate();

  return (
    <div className="committee-landing">
      <div className="committee-hero">
        <h1>Committee Pairing Tool</h1>
        <p>
          Match your skills, interests, and availability with the right committee.
          Powered by AI to find your ideal fit.
        </p>
      </div>

      <div className="committee-cards">
        <div className="committee-card">
          <div className="card-icon">👤</div>
          <h2>I'm an Individual</h2>
          <p>
            Complete a short assessment about your skills, preferences, and
            availability. We'll match you with committees that fit.
          </p>
          <button
            className="btn-primary"
            onClick={() => navigate('/committee-match/individual')}
          >
            Start My Assessment
          </button>
        </div>

        <div className="committee-card">
          <div className="card-icon">🏛️</div>
          <h2>I'm an Association Admin</h2>
          <p>
            Define your committees, run the matching engine, and view ranked
            results for each committee with downloadable reports.
          </p>
          <button
            className="btn-secondary"
            onClick={() => navigate('/committee-match/admin')}
          >
            Admin Dashboard
          </button>
        </div>
      </div>

      <style>{`
        .committee-landing {
          min-height: 100vh;
          padding: 60px 24px;
          background: #f8fafc;
          font-family: inherit;
        }
        .committee-hero {
          text-align: center;
          max-width: 600px;
          margin: 0 auto 60px;
        }
        .committee-hero h1 {
          font-size: 2.4rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 16px;
        }
        .committee-hero p {
          font-size: 1.1rem;
          color: #64748b;
          line-height: 1.6;
        }
        .committee-cards {
          display: flex;
          gap: 32px;
          justify-content: center;
          flex-wrap: wrap;
          max-width: 900px;
          margin: 0 auto;
        }
        .committee-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 40px 32px;
          width: 360px;
          text-align: center;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
          transition: box-shadow 0.2s;
        }
        .committee-card:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.10);
        }
        .card-icon {
          font-size: 2.8rem;
          margin-bottom: 16px;
        }
        .committee-card h2 {
          font-size: 1.4rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 12px;
        }
        .committee-card p {
          font-size: 0.97rem;
          color: #64748b;
          line-height: 1.6;
          margin-bottom: 28px;
        }
        .btn-primary, .btn-secondary {
          padding: 12px 28px;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: background 0.2s;
          width: 100%;
        }
        .btn-primary {
          background: #2563eb;
          color: #fff;
        }
        .btn-primary:hover { background: #1d4ed8; }
        .btn-secondary {
          background: #0f172a;
          color: #fff;
        }
        .btn-secondary:hover { background: #1e293b; }
      `}</style>
    </div>
  );
}
