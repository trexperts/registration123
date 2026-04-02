// src/pages/CommitteeAdmin.jsx
// Route: /committee-match/admin

import { useState, useEffect, useCallback } from 'react';

const API = import.meta.env.VITE_API_URL;

const TASK_OPTIONS = [
  { key: 'media',           label: 'Talk with the media / be interviewed' },
  { key: 'present',         label: 'Present topics' },
  { key: 'review_articles', label: 'Review academic articles' },
  { key: 'event_planning',  label: 'Meeting / event planning' },
  { key: 'financials',      label: 'Financials and budgets' },
  { key: 'mentor',          label: 'Mentor others' },
  { key: 'ideation',        label: 'Generate ideas' },
  { key: 'governance',      label: 'Understand how groups work (governance)' },
  { key: 'opinions',        label: 'Provide opinions' },
  { key: 'research',        label: 'Do research' },
  { key: 'teamwork',        label: 'Work within a team' },
  { key: 'solo_work',       label: 'Work by themselves or in a small group' },
  { key: 'outreach',        label: 'Public outreach' },
  { key: 'recruit',         label: 'Recruit people' },
];

const TRAIT_OPTIONS = [
  { key: 'teamwork',     label: 'Team oriented' },
  { key: 'independent',  label: 'Independent worker' },
  { key: 'creative',     label: 'Creative' },
  { key: 'analytical',   label: 'Numbers / data oriented' },
  { key: 'financial_bg', label: 'Financial background' },
  { key: 'presenter',    label: 'Presentation experience' },
  { key: 'governance',   label: 'Governance knowledge / experience' },
  { key: 'event_exp',    label: 'Event planning experience' },
];

const MONTHLY_HOURS = [
  '1 - 2.5 hours per month', '2.5 - 5 hours per month',
  '5 - 8 hours per month', '8 - 12 hours per month', '12+ hours per month',
];
const SERVICE_LENGTHS = [
  '1-2 months', '3-4 months', '5-6 months',
  '1 year', '2 years', '3 years', '3+ years',
];

const TIER_COLORS = {
  'Ideal Match':    { bg: '#dcfce7', text: '#166534', border: '#86efac' },
  'Quality Match':  { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' },
  'Adequate Match': { bg: '#fef9c3', text: '#854d0e', border: '#fde047' },
  'No Match':       { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' },
};

const emptyCommittee = {
  name: '', description: '', seats_available: 1,
  required_traits: [], required_tasks: [], deal_breakers: [],
  required_member_type: '', min_years_as_member: 0,
  requires_prior_committee: '', open_to_nonmembers: false,
  monthly_hours_needed: '', service_length_needed: '',
};

export default function CommitteeAdmin() {
  const [code, setCode]         = useState('');
  const [authed, setAuthed]     = useState(false);
  const [codeError, setCodeError] = useState('');
  const [tab, setTab]           = useState('setup');

  // Committee setup state
  const [committees, setCommittees] = useState([]);
  const [editingCommittee, setEditingCommittee] = useState({ ...emptyCommittee });
  const [savingCommittee, setSavingCommittee]   = useState(false);
  const [committeeMsg, setCommitteeMsg]         = useState('');

  // Match state
  const [matching, setMatching] = useState(false);
  const [matchMsg, setMatchMsg] = useState('');

  // Results state
  const [matches, setMatches]             = useState([]);
  const [filterCommittee, setFilterCommittee] = useState('');
  const [filterTier, setFilterTier]           = useState('');
  const [loadingMatches, setLoadingMatches]   = useState(false);

  const headers = { 'x-committee-code': code };

  const fetchCommittees = useCallback(async () => {
    const res = await fetch(`${API}/api/committee/committees`, { headers });
    if (res.ok) setCommittees(await res.json());
  }, [code]);

  const fetchMatches = useCallback(async () => {
    setLoadingMatches(true);
    const params = new URLSearchParams();
    if (filterCommittee) params.set('committee_id', filterCommittee);
    if (filterTier)      params.set('tier', filterTier);
    const res = await fetch(`${API}/api/committee/matches?${params}`, { headers });
    if (res.ok) setMatches(await res.json());
    setLoadingMatches(false);
  }, [code, filterCommittee, filterTier]);

  useEffect(() => {
    if (authed && tab === 'setup')    fetchCommittees();
    if (authed && tab === 'results')  fetchMatches();
  }, [authed, tab]);

  useEffect(() => {
    if (authed && tab === 'results') fetchMatches();
  }, [filterCommittee, filterTier]);

  // Verify code
  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setCodeError('');
    const res = await fetch(`${API}/api/committee/verify-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    const data = await res.json();
    if (data.valid && data.role === 'admin') {
      setAuthed(true);
    } else {
      setCodeError('Invalid admin code.');
    }
  };

  // Save committee
  const handleSaveCommittee = async () => {
    setSavingCommittee(true);
    setCommitteeMsg('');
    const res = await fetch(`${API}/api/committee/committees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(editingCommittee),
    });
    const data = await res.json();
    if (data.success) {
      setCommitteeMsg('Committee saved successfully.');
      setEditingCommittee({ ...emptyCommittee });
      fetchCommittees();
    } else {
      setCommitteeMsg('Error: ' + (data.error || 'Unknown'));
    }
    setSavingCommittee(false);
  };

  const toggleArr = (field, key) => {
    setEditingCommittee(c => ({
      ...c,
      [field]: c[field].includes(key)
        ? c[field].filter(k => k !== key)
        : [...c[field], key],
    }));
  };

  // Run match
  const handleRunMatch = async () => {
    setMatching(true);
    setMatchMsg('Running AI matching — this may take a minute...');
    const res = await fetch(`${API}/api/committee/run-match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify({}),
    });
    const data = await res.json();
    if (data.success) {
      setMatchMsg(`✅ Matching complete! ${data.matched} matches scored. Switch to the Results tab.`);
    } else {
      setMatchMsg('❌ Error: ' + (data.error || 'Unknown'));
    }
    setMatching(false);
  };

  // Export CSV
  const handleExport = () => {
    const params = filterCommittee ? `?committee_id=${filterCommittee}` : '';
    const url = `${API}/api/committee/export${params}`;
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', 'committee-matches.csv');
    // Pass code via query param for CSV since we can't set headers on anchor
    a.href = `${url}${params ? '&' : '?'}admin_code=${encodeURIComponent(code)}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Group matches by committee
  const matchesByCommittee = matches.reduce((acc, m) => {
    const key = m.committee_name;
    if (!acc[key]) acc[key] = [];
    acc[key].push(m);
    return acc;
  }, {});

  if (!authed) {
    return (
      <div className="ca-wrap">
        <h1 className="ca-title">Admin Dashboard</h1>
        <form onSubmit={handleCodeSubmit} className="code-form">
          <h2>Enter Admin Code</h2>
          <input
            type="text" placeholder="Admin access code"
            value={code} onChange={e => setCode(e.target.value)}
            className="text-input" required
          />
          {codeError && <p className="error">{codeError}</p>}
          <button type="submit" className="btn-primary">Access Dashboard →</button>
        </form>
        <Styles />
      </div>
    );
  }

  return (
    <div className="ca-wrap">
      <h1 className="ca-title">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="tabs">
        {['setup', 'match', 'results'].map(t => (
          <button
            key={t}
            className={`tab-btn ${tab === t ? 'active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t === 'setup' ? '⚙️ Committee Setup'
              : t === 'match' ? '🤖 Run Matching'
              : '📊 Results'}
          </button>
        ))}
      </div>

      {/* ── TAB 1: Committee Setup ── */}
      {tab === 'setup' && (
        <div className="tab-content">
          <div className="two-col-layout">
            {/* Form */}
            <div className="panel">
              <h2 className="panel-title">
                {editingCommittee.id ? 'Edit Committee' : 'Add New Committee'}
              </h2>

              <Field label="Committee Name *">
                <input className="text-input" value={editingCommittee.name}
                  onChange={e => setEditingCommittee(c => ({ ...c, name: e.target.value }))} />
              </Field>
              <Field label="Description">
                <textarea className="text-input" rows={3} value={editingCommittee.description}
                  onChange={e => setEditingCommittee(c => ({ ...c, description: e.target.value }))} />
              </Field>
              <Field label="Seats Available">
                <input type="number" min={1} className="text-input" value={editingCommittee.seats_available}
                  onChange={e => setEditingCommittee(c => ({ ...c, seats_available: parseInt(e.target.value) }))} />
              </Field>

              <h3 className="subsection">Monthly Hours Needed *</h3>
              <div className="radio-group">
                {MONTHLY_HOURS.map(h => (
                  <label key={h} className="radio-label">
                    <input type="radio" name="chours" value={h}
                      checked={editingCommittee.monthly_hours_needed === h}
                      onChange={() => setEditingCommittee(c => ({ ...c, monthly_hours_needed: h }))} />
                    {h}
                  </label>
                ))}
              </div>

              <h3 className="subsection">Service Length Needed *</h3>
              <div className="radio-group">
                {SERVICE_LENGTHS.map(s => (
                  <label key={s} className="radio-label">
                    <input type="radio" name="cservice" value={s}
                      checked={editingCommittee.service_length_needed === s}
                      onChange={() => setEditingCommittee(c => ({ ...c, service_length_needed: s }))} />
                    {s}
                  </label>
                ))}
              </div>

              <h3 className="subsection">Required Traits</h3>
              <div className="checkbox-grid">
                {TRAIT_OPTIONS.map(t => (
                  <label key={t.key} className="checkbox-label">
                    <input type="checkbox"
                      checked={editingCommittee.required_traits.includes(t.key)}
                      onChange={() => toggleArr('required_traits', t.key)} />
                    {t.label}
                  </label>
                ))}
              </div>

              <h3 className="subsection">Required Tasks</h3>
              <div className="checkbox-grid">
                {TASK_OPTIONS.map(t => (
                  <label key={t.key} className="checkbox-label">
                    <input type="checkbox"
                      checked={editingCommittee.required_tasks.includes(t.key)}
                      onChange={() => toggleArr('required_tasks', t.key)} />
                    {t.label}
                  </label>
                ))}
              </div>

              <h3 className="subsection">Deal-Breaker Requirements (Must-Haves)</h3>
              <div className="checkbox-grid">
                {TASK_OPTIONS.map(t => (
                  <label key={t.key} className="checkbox-label">
                    <input type="checkbox"
                      checked={editingCommittee.deal_breakers.includes(t.key)}
                      onChange={() => toggleArr('deal_breakers', t.key)} />
                    {t.label}
                  </label>
                ))}
              </div>

              <h3 className="subsection">Eligibility Rules</h3>
              <Field label="Required Member Type (leave blank for any)">
                <input className="text-input" value={editingCommittee.required_member_type}
                  placeholder="e.g. Full Member"
                  onChange={e => setEditingCommittee(c => ({ ...c, required_member_type: e.target.value }))} />
              </Field>
              <Field label="Minimum Years as Member">
                <input type="number" min={0} className="text-input" value={editingCommittee.min_years_as_member}
                  onChange={e => setEditingCommittee(c => ({ ...c, min_years_as_member: parseInt(e.target.value) }))} />
              </Field>
              <label className="checkbox-label" style={{ marginBottom: 20 }}>
                <input type="checkbox"
                  checked={editingCommittee.open_to_nonmembers}
                  onChange={e => setEditingCommittee(c => ({ ...c, open_to_nonmembers: e.target.checked }))} />
                Open to non-members
              </label>

              {committeeMsg && <p className={committeeMsg.startsWith('Error') ? 'error' : 'success-msg'}>{committeeMsg}</p>}

              <div className="btn-row">
                <button className="btn-primary" onClick={handleSaveCommittee} disabled={savingCommittee || !editingCommittee.name}>
                  {savingCommittee ? 'Saving...' : editingCommittee.id ? 'Update Committee' : 'Save Committee'}
                </button>
                {editingCommittee.id && (
                  <button className="btn-back" onClick={() => setEditingCommittee({ ...emptyCommittee })}>
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {/* Committee list */}
            <div className="panel">
              <h2 className="panel-title">Existing Committees ({committees.length})</h2>
              {committees.length === 0
                ? <p className="empty-state">No committees yet. Add one using the form.</p>
                : committees.map(c => (
                  <div key={c.id} className="committee-list-item">
                    <div>
                      <strong>{c.name}</strong>
                      <span className="badge">{c.seats_available} seat{c.seats_available !== 1 ? 's' : ''}</span>
                    </div>
                    <p className="small-text">{c.monthly_hours_needed} · {c.service_length_needed}</p>
                    <button className="btn-edit" onClick={() => setEditingCommittee(c)}>Edit</button>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: Run Matching ── */}
      {tab === 'match' && (
        <div className="tab-content center-content">
          <div className="match-panel">
            <div className="match-icon">🤖</div>
            <h2>Run AI Committee Matching</h2>
            <p>
              This will score every individual in the system against every active committee
              using Claude AI. Scores are saved and viewable in the Results tab.
              Running again will update all scores.
            </p>
            <button className="btn-primary btn-large" onClick={handleRunMatch} disabled={matching}>
              {matching ? 'Matching in progress...' : 'Run Matching Now'}
            </button>
            {matching && <div className="spinner" />}
            {matchMsg && <p className={matchMsg.startsWith('❌') ? 'error' : 'success-msg'}>{matchMsg}</p>}
          </div>
        </div>
      )}

      {/* ── TAB 3: Results ── */}
      {tab === 'results' && (
        <div className="tab-content">
          <div className="results-toolbar">
            <div className="filter-group">
              <label className="filter-label">Filter by Committee</label>
              <select className="select-input" value={filterCommittee}
                onChange={e => setFilterCommittee(e.target.value)}>
                <option value="">All Committees</option>
                {committees.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <label className="filter-label">Filter by Tier</label>
              <select className="select-input" value={filterTier}
                onChange={e => setFilterTier(e.target.value)}>
                <option value="">All Tiers</option>
                <option>Ideal Match</option>
                <option>Quality Match</option>
                <option>Adequate Match</option>
              </select>
            </div>
            <button className="btn-export" onClick={handleExport}>⬇ Export CSV</button>
          </div>

          {loadingMatches
            ? <p className="loading">Loading results...</p>
            : matches.length === 0
            ? <p className="empty-state">No matches found. Run matching first, or adjust filters.</p>
            : Object.entries(matchesByCommittee).map(([committeeName, rows]) => (
              <div key={committeeName} className="committee-results-block">
                <h2 className="committee-results-title">{committeeName}</h2>
                <div className="match-cards">
                  {rows.map(m => {
                    const colors = TIER_COLORS[m.tier] || TIER_COLORS['No Match'];
                    return (
                      <div key={m.id} className="match-card"
                        style={{ borderColor: colors.border }}>
                        <div className="match-card-header">
                          <div>
                            <strong className="match-name">{m.first_name} {m.last_name}</strong>
                            <p className="match-email">{m.email}</p>
                          </div>
                          <div className="score-badge"
                            style={{ background: colors.bg, color: colors.text }}>
                            <span className="score-pct">{Number(m.overall_score).toFixed(0)}%</span>
                            <span className="score-tier">{m.tier}</span>
                          </div>
                        </div>

                        <div className="score-breakdown">
                          <ScoreBar label="Traits" value={m.trait_score} />
                          <ScoreBar label="Tasks"  value={m.task_score} />
                          <ScoreBar label="Time"   value={m.time_score} />
                          <ScoreBar label="Length" value={m.length_score} />
                        </div>

                        {m.summary && <p className="match-summary">{m.summary}</p>}
                        {m.flags?.length > 0 && (
                          <div className="flags">
                            {m.flags.map((f, i) => <span key={i} className="flag">⚠ {f}</span>)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          }
        </div>
      )}

      <Styles />
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Field({ label, children }) {
  return (
    <div className="field">
      <label className="field-label">{label}</label>
      {children}
    </div>
  );
}

function ScoreBar({ label, value }) {
  if (value == null) return null;
  const pct = Number(value).toFixed(0);
  const color = pct >= 90 ? '#22c55e' : pct >= 75 ? '#3b82f6' : pct >= 60 ? '#eab308' : '#ef4444';
  return (
    <div className="score-bar-row">
      <span className="score-bar-label">{label}</span>
      <div className="score-bar-track">
        <div className="score-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="score-bar-pct">{pct}%</span>
    </div>
  );
}

function Styles() {
  return (
    <style>{`
      .ca-wrap { max-width: 1100px; margin: 0 auto; padding: 40px 24px; font-family: inherit; }
      .ca-title { font-size: 1.8rem; font-weight: 700; color: #1e293b; margin-bottom: 32px; }
      .code-form { display: flex; flex-direction: column; gap: 16px; max-width: 400px; }
      .code-form h2 { font-size: 1.4rem; font-weight: 700; color: #1e293b; }
      .text-input { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 1rem; box-sizing: border-box; }
      .text-input:focus { outline: 2px solid #2563eb; border-color: transparent; }
      textarea.text-input { resize: vertical; }
      .select-input { padding: 9px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.95rem; background: #fff; }
      .error { color: #dc2626; font-size: 0.9rem; }
      .success-msg { color: #166534; font-size: 0.9rem; }
      .btn-primary { padding: 11px 24px; background: #2563eb; color: #fff; border: none; border-radius: 8px; font-size: 0.97rem; font-weight: 600; cursor: pointer; }
      .btn-primary:hover { background: #1d4ed8; }
      .btn-primary:disabled { background: #93c5fd; cursor: not-allowed; }
      .btn-back { padding: 11px 24px; background: #f1f5f9; color: #475569; border: none; border-radius: 8px; font-size: 0.97rem; font-weight: 600; cursor: pointer; }
      .btn-edit { padding: 6px 14px; background: #f1f5f9; color: #374151; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 0.85rem; cursor: pointer; }
      .btn-edit:hover { background: #e2e8f0; }
      .btn-large { padding: 16px 40px; font-size: 1.05rem; }
      .btn-export { padding: 9px 18px; background: #0f172a; color: #fff; border: none; border-radius: 8px; font-size: 0.9rem; font-weight: 600; cursor: pointer; white-space: nowrap; }
      .btn-export:hover { background: #1e293b; }
      .btn-row { display: flex; gap: 12px; margin-top: 16px; }
      .tabs { display: flex; gap: 4px; border-bottom: 2px solid #e2e8f0; margin-bottom: 32px; }
      .tab-btn { padding: 10px 20px; background: none; border: none; border-bottom: 3px solid transparent; margin-bottom: -2px; font-size: 0.95rem; font-weight: 600; color: #94a3b8; cursor: pointer; transition: all 0.2s; }
      .tab-btn.active { color: #2563eb; border-bottom-color: #2563eb; }
      .tab-btn:hover:not(.active) { color: #374151; }
      .tab-content { }
      .two-col-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; align-items: start; }
      .panel { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 28px; }
      .panel-title { font-size: 1.2rem; font-weight: 700; color: #1e293b; margin-bottom: 20px; }
      .subsection { font-size: 0.95rem; font-weight: 700; color: #374151; margin: 20px 0 10px; }
      .field { margin-bottom: 16px; }
      .field-label { display: block; font-size: 0.88rem; font-weight: 600; color: #374151; margin-bottom: 6px; }
      .radio-group { display: flex; flex-direction: column; gap: 8px; margin-bottom: 4px; }
      .radio-label { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; color: #374151; cursor: pointer; }
      .checkbox-grid { display: flex; flex-direction: column; gap: 8px; }
      .checkbox-label { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; color: #374151; cursor: pointer; }
      .committee-list-item { padding: 14px; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 10px; }
      .committee-list-item strong { font-size: 0.97rem; color: #1e293b; }
      .badge { display: inline-block; margin-left: 8px; padding: 2px 8px; background: #dbeafe; color: #1e40af; border-radius: 99px; font-size: 0.78rem; font-weight: 600; }
      .small-text { font-size: 0.83rem; color: #94a3b8; margin: 4px 0 8px; }
      .empty-state { color: #94a3b8; font-size: 0.95rem; text-align: center; padding: 40px 0; }
      .center-content { display: flex; justify-content: center; }
      .match-panel { text-align: center; max-width: 540px; padding: 48px 32px; background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; }
      .match-icon { font-size: 3rem; margin-bottom: 16px; }
      .match-panel h2 { font-size: 1.4rem; font-weight: 700; color: #1e293b; margin-bottom: 12px; }
      .match-panel p { color: #64748b; line-height: 1.6; margin-bottom: 28px; }
      .spinner { width: 32px; height: 32px; border: 3px solid #e2e8f0; border-top-color: #2563eb; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 16px auto 0; }
      @keyframes spin { to { transform: rotate(360deg); } }
      .results-toolbar { display: flex; align-items: flex-end; gap: 16px; flex-wrap: wrap; margin-bottom: 28px; padding: 16px 20px; background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; }
      .filter-group { display: flex; flex-direction: column; gap: 6px; }
      .filter-label { font-size: 0.82rem; font-weight: 600; color: #374151; }
      .committee-results-block { margin-bottom: 48px; }
      .committee-results-title { font-size: 1.3rem; font-weight: 700; color: #1e293b; margin-bottom: 16px; padding-bottom: 10px; border-bottom: 2px solid #e2e8f0; }
      .match-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 16px; }
      .match-card { background: #fff; border: 1px solid #e2e8f0; border-left: 4px solid; border-radius: 10px; padding: 20px; }
      .match-card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; gap: 12px; }
      .match-name { font-size: 1rem; font-weight: 700; color: #1e293b; }
      .match-email { font-size: 0.82rem; color: #94a3b8; margin-top: 2px; }
      .score-badge { display: flex; flex-direction: column; align-items: center; padding: 8px 14px; border-radius: 8px; flex-shrink: 0; }
      .score-pct { font-size: 1.3rem; font-weight: 800; line-height: 1; }
      .score-tier { font-size: 0.72rem; font-weight: 600; text-align: center; margin-top: 2px; }
      .score-breakdown { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
      .score-bar-row { display: flex; align-items: center; gap: 8px; }
      .score-bar-label { font-size: 0.78rem; color: #64748b; width: 44px; flex-shrink: 0; }
      .score-bar-track { flex: 1; height: 6px; background: #f1f5f9; border-radius: 4px; overflow: hidden; }
      .score-bar-fill { height: 100%; border-radius: 4px; transition: width 0.4s; }
      .score-bar-pct { font-size: 0.78rem; color: #374151; width: 30px; text-align: right; flex-shrink: 0; }
      .match-summary { font-size: 0.85rem; color: #64748b; line-height: 1.5; margin-top: 10px; }
      .flags { margin-top: 10px; display: flex; flex-wrap: wrap; gap: 6px; }
      .flag { display: inline-block; padding: 3px 8px; background: #fef9c3; color: #854d0e; border-radius: 6px; font-size: 0.78rem; }
      .loading { color: #94a3b8; text-align: center; padding: 40px; }
      @media (max-width: 768px) {
        .two-col-layout { grid-template-columns: 1fr; }
        .match-cards { grid-template-columns: 1fr; }
      }
    `}</style>
  );
}
