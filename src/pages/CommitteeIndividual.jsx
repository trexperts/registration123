// src/pages/CommitteeIndividual.jsx
// Route: /committee-match/individual

import { useState } from 'react';

const API = import.meta.env.VITE_API_URL; // e.g. https://your-railway-app.up.railway.app

const TASK_OPTIONS = [
  { key: 'media',       label: 'Talk with the media / be interviewed' },
  { key: 'present',     label: 'Present topics' },
  { key: 'review_articles', label: 'Review academic articles' },
  { key: 'event_planning',  label: 'Meeting / event planning' },
  { key: 'financials',  label: 'Financials and budgets' },
  { key: 'mentor',      label: 'Mentor others' },
  { key: 'ideation',    label: 'Generate ideas' },
  { key: 'governance',  label: 'Understand how groups work (governance)' },
  { key: 'opinions',    label: 'Provide opinions' },
  { key: 'research',    label: 'Do research' },
  { key: 'teamwork',    label: 'Work within a team' },
  { key: 'solo_work',   label: 'Work by themselves or in a small group' },
  { key: 'outreach',    label: 'Public outreach' },
  { key: 'recruit',     label: 'Recruit people' },
];

const MONTHLY_HOURS = [
  '1 - 2.5 hours per month',
  '2.5 - 5 hours per month',
  '5 - 8 hours per month',
  '8 - 12 hours per month',
  '12+ hours per month',
];

const SERVICE_LENGTHS = [
  '1-2 months', '3-4 months', '5-6 months',
  '1 year', '2 years', '3 years', '3+ years',
];

const PRIOR_COMMITTEE_OPTIONS = [
  { key: 'board',       label: 'Board of Directors' },
  { key: 'finance',     label: 'Finance Committee' },
  { key: 'events',      label: 'Events Committee' },
  { key: 'scientific',  label: 'Scientific Committee' },
  { key: 'research',    label: 'Research Committee' },
  { key: 'mentoring',   label: 'Mentoring Program' },
  { key: 'governance',  label: 'Governance Committee' },
];

const TOTAL_STEPS = 5;

export default function CommitteeIndividual() {
  const [step, setStep] = useState(0); // 0 = code entry
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '',
    member_type: '', years_as_member: '',
    strengths_finder: '', myers_briggs: '', disc: '', enneagram: '',
    tasks_liked: [], tasks_disliked: [],
    monthly_hours: '', service_length: '',
    prior_committees: [],
  });

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const toggleArray = (field, key) => {
    setForm(f => ({
      ...f,
      [field]: f[field].includes(key)
        ? f[field].filter(k => k !== key)
        : [...f[field], key],
    }));
  };

  // Step 0: verify code
  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setCodeError('');
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/api/committee/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (data.valid && data.role === 'individual') {
        setStep(1);
      } else {
        setCodeError('Invalid code. Please check with your association admin.');
      }
    } catch {
      setCodeError('Connection error. Please try again.');
    }
    setSubmitting(false);
  };

  // Final submit
  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/api/committee/individual`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, code }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        alert('Submission failed: ' + (data.error || 'Unknown error'));
      }
    } catch {
      alert('Connection error. Please try again.');
    }
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <Layout>
        <div className="success-box">
          <div className="success-icon">✅</div>
          <h2>Assessment Submitted!</h2>
          <p>
            Thank you, {form.first_name}! Your profile has been saved.
            The association will review committee matches and may reach out to you.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {step === 0 && (
        <form onSubmit={handleCodeSubmit} className="code-form">
          <h2>Enter Your Access Code</h2>
          <p>Your association provided you with an individual access code.</p>
          <input
            type="text"
            placeholder="e.g. MEMBER2026"
            value={code}
            onChange={e => setCode(e.target.value)}
            className="text-input"
            required
          />
          {codeError && <p className="error">{codeError}</p>}
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Verifying...' : 'Continue →'}
          </button>
        </form>
      )}

      {step >= 1 && (
        <>
          <ProgressBar current={step} total={TOTAL_STEPS} />

          {step === 1 && (
            <FormStep title="Basic Information">
              <div className="field-row">
                <Field label="First Name *">
                  <input className="text-input" value={form.first_name}
                    onChange={e => update('first_name', e.target.value)} required />
                </Field>
                <Field label="Last Name *">
                  <input className="text-input" value={form.last_name}
                    onChange={e => update('last_name', e.target.value)} required />
                </Field>
              </div>
              <Field label="Email Address *">
                <input type="email" className="text-input" value={form.email}
                  onChange={e => update('email', e.target.value)} required />
              </Field>
              <Field label="Member Type (e.g. Full Member, Associate, Student)">
                <input className="text-input" value={form.member_type}
                  onChange={e => update('member_type', e.target.value)} />
              </Field>
              <Field label="Years as a Member">
                <input type="number" min="0" className="text-input" value={form.years_as_member}
                  onChange={e => update('years_as_member', e.target.value)} />
              </Field>
            </FormStep>
          )}

          {step === 2 && (
            <FormStep title="Personality Assessments (Optional)">
              <p className="step-desc">
                If you've completed any of these, enter your result type. Leave blank if not applicable.
              </p>
              <Field label="StrengthsFinder (e.g. Achiever, Learner, Relator, ...)">
                <input className="text-input" value={form.strengths_finder}
                  placeholder="Top 5 strengths"
                  onChange={e => update('strengths_finder', e.target.value)} />
              </Field>
              <Field label="Myers-Briggs (e.g. INTJ, ENFP)">
                <input className="text-input" value={form.myers_briggs}
                  placeholder="4-letter type"
                  onChange={e => update('myers_briggs', e.target.value)} />
              </Field>
              <Field label="DiSC (e.g. D, Di, IS, SC)">
                <input className="text-input" value={form.disc}
                  placeholder="Your DiSC style"
                  onChange={e => update('disc', e.target.value)} />
              </Field>
              <Field label="Enneagram (e.g. 3w4, 7w8)">
                <input className="text-input" value={form.enneagram}
                  placeholder="Your type"
                  onChange={e => update('enneagram', e.target.value)} />
              </Field>
            </FormStep>
          )}

          {step === 3 && (
            <FormStep title="Task Preferences">
              <p className="step-desc">Select all that apply.</p>
              <div className="two-col-tasks">
                <div>
                  <h3 className="task-section-title">✅ Tasks I Enjoy</h3>
                  <div className="checkbox-grid">
                    {TASK_OPTIONS.map(t => (
                      <label key={t.key} className="checkbox-label">
                        <input type="checkbox"
                          checked={form.tasks_liked.includes(t.key)}
                          onChange={() => toggleArray('tasks_liked', t.key)} />
                        {t.label}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="task-section-title">❌ Tasks I'd Rather Avoid</h3>
                  <div className="checkbox-grid">
                    {TASK_OPTIONS.map(t => (
                      <label key={t.key} className="checkbox-label">
                        <input type="checkbox"
                          checked={form.tasks_disliked.includes(t.key)}
                          onChange={() => toggleArray('tasks_disliked', t.key)} />
                        {t.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </FormStep>
          )}

          {step === 4 && (
            <FormStep title="Availability">
              <Field label="How many hours per month can you commit? *">
                <div className="radio-group">
                  {MONTHLY_HOURS.map(h => (
                    <label key={h} className="radio-label">
                      <input type="radio" name="monthly_hours" value={h}
                        checked={form.monthly_hours === h}
                        onChange={() => update('monthly_hours', h)} />
                      {h}
                    </label>
                  ))}
                </div>
              </Field>
              <Field label="How long are you willing to serve? *">
                <div className="radio-group">
                  {SERVICE_LENGTHS.map(s => (
                    <label key={s} className="radio-label">
                      <input type="radio" name="service_length" value={s}
                        checked={form.service_length === s}
                        onChange={() => update('service_length', s)} />
                      {s}
                    </label>
                  ))}
                </div>
              </Field>
            </FormStep>
          )}

          {step === 5 && (
            <FormStep title="Previous Committee Experience">
              <p className="step-desc">Select any committees you've served on previously.</p>
              <div className="checkbox-grid">
                {PRIOR_COMMITTEE_OPTIONS.map(c => (
                  <label key={c.key} className="checkbox-label">
                    <input type="checkbox"
                      checked={form.prior_committees.includes(c.key)}
                      onChange={() => toggleArray('prior_committees', c.key)} />
                    {c.label}
                  </label>
                ))}
              </div>
              <div className="review-box">
                <h4>Review Your Submission</h4>
                <p><strong>Name:</strong> {form.first_name} {form.last_name}</p>
                <p><strong>Email:</strong> {form.email}</p>
                <p><strong>Monthly availability:</strong> {form.monthly_hours}</p>
                <p><strong>Willing to serve:</strong> {form.service_length}</p>
                <p><strong>Tasks I enjoy:</strong> {form.tasks_liked.length > 0
                  ? form.tasks_liked.map(k => TASK_OPTIONS.find(t => t.key === k)?.label).join(', ')
                  : 'None selected'}</p>
              </div>
            </FormStep>
          )}

          {/* Navigation */}
          <div className="nav-buttons">
            {step > 1 && (
              <button className="btn-back" onClick={() => setStep(s => s - 1)}>
                ← Back
              </button>
            )}
            {step < TOTAL_STEPS ? (
              <button
                className="btn-primary"
                onClick={() => setStep(s => s + 1)}
                disabled={
                  (step === 1 && (!form.first_name || !form.last_name || !form.email)) ||
                  (step === 4 && (!form.monthly_hours || !form.service_length))
                }
              >
                Next →
              </button>
            ) : (
              <button className="btn-primary" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Assessment ✓'}
              </button>
            )}
          </div>
        </>
      )}
    </Layout>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Layout({ children }) {
  return (
    <div className="ci-wrap">
      <h1 className="ci-title">Individual Assessment</h1>
      {children}
      <Styles />
    </div>
  );
}

function ProgressBar({ current, total }) {
  return (
    <div className="progress-wrap">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${(current / total) * 100}%` }} />
      </div>
      <span className="progress-label">Step {current} of {total}</span>
    </div>
  );
}

function FormStep({ title, children }) {
  return (
    <div className="form-step">
      <h2 className="step-title">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="field">
      <label className="field-label">{label}</label>
      {children}
    </div>
  );
}

function Styles() {
  return (
    <style>{`
      .ci-wrap { max-width: 760px; margin: 0 auto; padding: 40px 24px; font-family: inherit; }
      .ci-title { font-size: 1.8rem; font-weight: 700; color: #1e293b; margin-bottom: 32px; }
      .code-form { display: flex; flex-direction: column; gap: 16px; max-width: 400px; }
      .code-form h2 { font-size: 1.4rem; font-weight: 700; color: #1e293b; }
      .code-form p { color: #64748b; }
      .text-input { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 1rem; box-sizing: border-box; }
      .text-input:focus { outline: 2px solid #2563eb; border-color: transparent; }
      .error { color: #dc2626; font-size: 0.9rem; }
      .btn-primary { padding: 12px 28px; background: #2563eb; color: #fff; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; }
      .btn-primary:hover { background: #1d4ed8; }
      .btn-primary:disabled { background: #93c5fd; cursor: not-allowed; }
      .btn-back { padding: 12px 28px; background: #f1f5f9; color: #475569; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; }
      .btn-back:hover { background: #e2e8f0; }
      .progress-wrap { margin-bottom: 32px; }
      .progress-bar { height: 6px; background: #e2e8f0; border-radius: 4px; margin-bottom: 8px; }
      .progress-fill { height: 100%; background: #2563eb; border-radius: 4px; transition: width 0.3s; }
      .progress-label { font-size: 0.85rem; color: #94a3b8; }
      .form-step { margin-bottom: 32px; }
      .step-title { font-size: 1.4rem; font-weight: 700; color: #1e293b; margin-bottom: 24px; }
      .step-desc { color: #64748b; margin-bottom: 20px; }
      .field { margin-bottom: 20px; }
      .field-label { display: block; font-size: 0.9rem; font-weight: 600; color: #374151; margin-bottom: 8px; }
      .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
      .radio-group { display: flex; flex-direction: column; gap: 10px; }
      .radio-label { display: flex; align-items: center; gap: 10px; font-size: 0.97rem; color: #374151; cursor: pointer; }
      .checkbox-grid { display: flex; flex-direction: column; gap: 10px; }
      .checkbox-label { display: flex; align-items: center; gap: 10px; font-size: 0.95rem; color: #374151; cursor: pointer; }
      .two-col-tasks { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
      .task-section-title { font-size: 1rem; font-weight: 700; color: #374151; margin-bottom: 12px; }
      .nav-buttons { display: flex; gap: 12px; justify-content: flex-end; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e2e8f0; }
      .review-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; margin-top: 24px; }
      .review-box h4 { font-size: 1rem; font-weight: 700; color: #1e293b; margin-bottom: 12px; }
      .review-box p { font-size: 0.95rem; color: #374151; margin: 6px 0; }
      .success-box { text-align: center; padding: 60px 24px; }
      .success-icon { font-size: 3rem; margin-bottom: 16px; }
      .success-box h2 { font-size: 1.8rem; font-weight: 700; color: #1e293b; margin-bottom: 12px; }
      .success-box p { color: #64748b; font-size: 1rem; max-width: 480px; margin: 0 auto; line-height: 1.6; }
      @media (max-width: 600px) {
        .field-row { grid-template-columns: 1fr; }
        .two-col-tasks { grid-template-columns: 1fr; }
      }
    `}</style>
  );
}
