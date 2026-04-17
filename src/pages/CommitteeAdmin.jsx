// src/pages/CommitteeAdmin.jsx
// Route: /committee-match/admin

import { useState, useEffect, useCallback, useRef } from 'react';

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

const DEAL_BREAKER_OPTIONS = [
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

const MEMBER_TYPE_OPTIONS = [
  'Full Member',
  'Associate Member',
  'Student Member',
  'Honorary Member',
  'Life Member',
  'Affiliate Member',
];

const MONTHLY_HOURS = [
  '1 - 2.5 hours per month', '2.5 - 5 hours per month',
  '5 - 8 hours per month', '8 - 12 hours per month', '12+ hours per month',
];
const SERVICE_LENGTHS = [
  '1-2 months', '3-4 months', '5-6 months',
  '1 year', '2 years', '3 years', '3+ years',
];

const DEFAULT_TIERS = {
  ideal:    { label: 'Ideal Match',    min: 90 },
  quality:  { label: 'Quality Match',  min: 75 },
  adequate: { label: 'Adequate Match', min: 60 },
};

const BAR_ICONS = {
  Traits: '★',
  Tasks:  '✔',
  Time:   '◷',
  Length: '↕',
};

const emptyCommittee = {
  name: '', description: '', seats_available: 1,
  required_traits: [], required_tasks: [], deal_breakers: [],
  required_member_type: '', min_years_as_member: 0,
  requires_prior_committee: '', open_to_nonmembers: false,
  monthly_hours_needed: '', service_length_needed: '',
};

export default function CommitteeAdmin() {
  const [code, setCode]           = useState('');
  const [authed, setAuthed]       = useState(false);
  const [codeError, setCodeError] = useState('');
  const [tab, setTab]             = useState('setup');

  // Tier thresholds (admin-configurable)
  const [tiers, setTiers] = useState(() => {
    try {
      const saved = localStorage.getItem('cm_tiers');
      return saved ? JSON.parse(saved) : DEFAULT_TIERS;
    } catch { return DEFAULT_TIERS; }
  });
  const [showTierSettings, setShowTierSettings] = useState(false);

  const saveTiers = (updated) => {
    setTiers(updated);
    localStorage.setItem('cm_tiers', JSON.stringify(updated));
  };

  const tierColors = {
    [tiers.ideal.label]:    { bg: '#dcfce7', text: '#166534', border: '#86efac' },
    [tiers.quality.label]:  { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' },
    [tiers.adequate.label]: { bg: '#fef9c3', text: '#854d0e', border: '#fde047' },
    'No Match':             { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' },
  };

  // Committee setup state
  const [committees, setCommittees]             = useState([]);
  const [editingCommittee, setEditingCommittee] = useState({ ...emptyCommittee });
  const [savingCommittee, setSavingCommittee]   = useState(false);
  const [committeeMsg, setCommitteeMsg]         = useState('');
  const [successPopup, setSuccessPopup]         = useState(null);

  // Custom add-your-own state
  const [customTrait, setCustomTrait]           = useState('');
  const [extraTraits, setExtraTraits]           = useState([]);
  const [customTask, setCustomTask]             = useState('');
  const [extraTasks, setExtraTasks]             = useState([]);
  const [customDealer, setCustomDealer]         = useState('');
  const [extraDealers, setExtraDealers]         = useState([]);
  const [customMemberType, setCustomMemberType] = useState('');
  const [extraMemberTypes, setExtraMemberTypes] = useState([]);

  // Match state
  const [matching, setMatching]     = useState(false);
  const [matchMsg, setMatchMsg]     = useState('');
  const [matchTimer, setMatchTimer] = useState(null);

  // Org settings state
  const emptyOrg = { org_name: '', org_website: '', org_address: '', org_phone: '', org_email: '', org_logo_url: '', membership_types: [] };
  const [orgSettings, setOrgSettings]     = useState(emptyOrg);
  const [orgSaving, setOrgSaving]         = useState(false);
  const [orgMsg, setOrgMsg]               = useState('');
  const [orgLoaded, setOrgLoaded]         = useState(false);
  const [newMemberType, setNewMemberType] = useState('');

  const fetchOrgSettings = useCallback(async () => {
    const res = await fetch(`${API}/api/committee/org-settings`, { headers });
    if (res.ok) { setOrgSettings(await res.json()); setOrgLoaded(true); }
  }, [code]);

  const handleSaveOrg = async () => {
    setOrgSaving(true);
    setOrgMsg('');
    const res = await fetch(`${API}/api/committee/org-settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(orgSettings),
    });
    const data = await res.json();
    setOrgMsg(data.success ? 'Settings saved successfully.' : 'Error: ' + (data.error || 'Unknown'));
    setOrgSaving(false);
  };

  const addMemberType = () => {
    const trimmed = newMemberType.trim();
    if (!trimmed) return;
    if (orgSettings.membership_types.includes(trimmed)) return;
    setOrgSettings(s => ({ ...s, membership_types: [...s.membership_types, trimmed] }));
    setNewMemberType('');
  };

  const removeMemberType = (type) => {
    setOrgSettings(s => ({ ...s, membership_types: s.membership_types.filter(t => t !== type) }));
  };

  // Results state
  const [matches, setMatches]                         = useState([]);
  const [filterCommittees, setFilterCommittees]       = useState([]);
  const [filterTiers, setFilterTiers]                 = useState([]);
  const [showCommitteeFilter, setShowCommitteeFilter] = useState(false);
  const [loadingMatches, setLoadingMatches]           = useState(false);
  const resultsRef = useRef(null);

  // Charter state
  const [charterCommittee, setCharterCommittee] = useState(null); // committee object
  const [charterFields, setCharterFields] = useState({
    mission: '', meeting_frequency: '', reporting_to: '', deliverables: '',
  });
  const MEETING_FREQUENCIES = [
    'Weekly', 'Bi-weekly', 'Monthly', 'Bi-monthly', 'Quarterly', 'As needed',
  ];

  const headers = { 'x-committee-code': code };

  const allTraits      = [...TRAIT_OPTIONS,       ...extraTraits.map(l => ({ key: `custom_${l}`, label: l }))];
  const allTasks       = [...TASK_OPTIONS,         ...extraTasks.map(l => ({ key: `custom_${l}`, label: l }))];
  const allDealers     = [...DEAL_BREAKER_OPTIONS, ...extraDealers.map(l => ({ key: `custom_${l}`, label: l }))];
  const allMemberTypes = [...MEMBER_TYPE_OPTIONS,  ...extraMemberTypes];

  const fetchCommittees = useCallback(async () => {
    const res = await fetch(`${API}/api/committee/committees`, { headers });
    if (res.ok) setCommittees(await res.json());
  }, [code]);

  const fetchMatches = useCallback(async () => {
    setLoadingMatches(true);
    const res = await fetch(`${API}/api/committee/matches`, { headers });
    if (res.ok) setMatches(await res.json());
    setLoadingMatches(false);
  }, [code]);

  useEffect(() => {
    if (authed && tab === 'setup')    fetchCommittees();
    if (authed && tab === 'results')  { fetchCommittees(); fetchMatches(); }
    if (authed && tab === 'account' && !orgLoaded) fetchOrgSettings();
  }, [authed, tab]);

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
      setSuccessPopup({ name: editingCommittee.name });
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

  const toggleMemberType = (type) => {
    const current = editingCommittee.required_member_type
      ? editingCommittee.required_member_type.split(',').map(s => s.trim()).filter(Boolean)
      : [];
    const updated = current.includes(type)
      ? current.filter(t => t !== type)
      : [...current, type];
    setEditingCommittee(c => ({ ...c, required_member_type: updated.join(', ') }));
  };

  const selectedMemberTypes = editingCommittee.required_member_type
    ? editingCommittee.required_member_type.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  const addCustomOption = (value, setter, extraSetter) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    extraSetter(prev => [...prev, trimmed]);
    setter('');
  };

  // Run match
  const handleRunMatch = async () => {
    setMatching(true);
    setMatchMsg('Running matches now. This will take a few minutes. Please do not hit the back or refresh buttons.');

    const fiveMin = setTimeout(() => {
      const quotes = [
        '"Time is the most valuable thing a man can spend." — Theophrastus',
        '"The two most powerful warriors are patience and time." — Leo Tolstoy',
        '"Lost time is never found again." — Benjamin Franklin',
        '"Time flies over us, but leaves its shadow behind." — Nathaniel Hawthorne',
      ];
      const q = quotes[Math.floor(Math.random() * quotes.length)];
      setMatchMsg(`${q}\n\nWe know you are excited. We are too! There are a lot of moving zeros and ones in the background. Stay with us, we will complete the matching process soon!`);
    }, 5 * 60 * 1000);

    const tenMin = setTimeout(() => {
      setMatchMsg("Holy cow, that's a lot of data! We are still working hard to get you the best matches.");
    }, 10 * 60 * 1000);

    setMatchTimer({ fiveMin, tenMin });

    const res = await fetch(`${API}/api/committee/run-match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify({}),
    });
    const data = await res.json();

    clearTimeout(fiveMin);
    clearTimeout(tenMin);

    if (data.success) {
      setMatchMsg(`✅ Matching complete! ${data.matched} matches scored. Switch to the Results tab.`);
    } else {
      setMatchMsg('❌ Error: ' + (data.error || 'Unknown'));
    }
    setMatching(false);
  };

  // Export CSV
  const handleExportCSV = () => {
    const committeeParam = filterCommittees.length === 1 ? `?committee_id=${filterCommittees[0]}` : '';
    const url = `${API}/api/committee/export${committeeParam}`;
    const a = document.createElement('a');
    a.href = `${url}${committeeParam ? '&' : '?'}admin_code=${encodeURIComponent(code)}`;
    a.setAttribute('download', 'committee-matches.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Export PDF via browser print
  const handleExportPDF = () => {
    const content = resultsRef.current;
    if (!content) return;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Committee Match Results</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #1e293b; }
            h1 { font-size: 1.4rem; margin-bottom: 24px; }
            h2 { font-size: 1.1rem; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin: 24px 0 12px; }
            .match-cards { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
            .match-card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; break-inside: avoid; }
            .match-card-header { display: flex; justify-content: space-between; margin-bottom: 10px; }
            .match-name { font-weight: 700; font-size: 0.95rem; }
            .match-email { font-size: 0.78rem; color: #94a3b8; }
            .score-badge { padding: 6px 10px; border-radius: 6px; text-align: center; }
            .score-pct { font-size: 1.1rem; font-weight: 800; display: block; }
            .score-tier { font-size: 0.68rem; font-weight: 600; }
            .score-bar-row { display: flex; align-items: center; gap: 6px; margin-bottom: 4px; }
            .score-bar-label { font-size: 0.75rem; color: #64748b; width: 50px; }
            .score-bar-track { flex: 1; height: 6px; background: #f1f5f9; border-radius: 4px; }
            .score-bar-fill { height: 6px; border-radius: 4px; }
            .score-bar-pct { font-size: 0.75rem; width: 28px; text-align: right; font-weight: 600; }
            .match-summary { font-size: 0.8rem; color: #64748b; margin-top: 8px; line-height: 1.4; }
            .flags { margin-top: 8px; display: flex; flex-wrap: wrap; gap: 4px; }
            .flag { padding: 2px 6px; background: #fef9c3; color: #854d0e; border-radius: 4px; font-size: 0.72rem; }
            .committee-results-block { margin-bottom: 32px; }
            .committee-results-title { font-size: 1.1rem; font-weight: 700; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 12px; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <h1>Committee Match Results</h1>
          ${content.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
  };

  // Open charter popup
  const openCharter = (committee) => {
    setCharterCommittee(committee);
    setCharterFields({ mission: '', meeting_frequency: '', reporting_to: '', deliverables: '' });
  };

  // Generate and print charter PDF
  const generateCharter = () => {
    const c = charterCommittee;
    const f = charterFields;

    const traitLabels = (c.required_traits || []).map(key => {
      const found = TRAIT_OPTIONS.find(t => t.key === key);
      return found ? found.label : key;
    });
    const taskLabels = (c.required_tasks || []).map(key => {
      const found = TASK_OPTIONS.find(t => t.key === key);
      return found ? found.label : key;
    });
    const dealLabels = (c.deal_breakers || []).map(key => {
      const found = DEAL_BREAKER_OPTIONS.find(t => t.key === key);
      return found ? found.label : key;
    });

    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const row = (label, value) => value ? `
      <tr>
        <td class="label">${label}</td>
        <td class="value">${value}</td>
      </tr>` : '';

    const list = (items) => items.length === 0 ? '<em style="color:#94a3b8">None specified</em>'
      : `<ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>`;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${c.name} — Committee Charter</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: Georgia, serif; color: #1e293b; padding: 48px; max-width: 780px; margin: 0 auto; }
            .header { border-bottom: 3px solid #1e293b; padding-bottom: 16px; margin-bottom: 32px; }
            .header h1 { font-size: 1.8rem; font-weight: 700; margin-bottom: 4px; }
            .header .subtitle { font-size: 0.95rem; color: #64748b; }
            .section { margin-bottom: 28px; }
            .section h2 { font-size: 1rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #374151; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 12px; }
            .section p { font-size: 0.95rem; line-height: 1.7; color: #374151; }
            table { width: 100%; border-collapse: collapse; font-size: 0.92rem; }
            td { padding: 7px 0; vertical-align: top; }
            td.label { width: 200px; color: #64748b; font-style: italic; padding-right: 16px; }
            td.value { color: #1e293b; font-weight: 500; }
            ul { margin: 0; padding-left: 18px; }
            li { margin-bottom: 4px; font-size: 0.92rem; line-height: 1.5; }
            .footer { margin-top: 48px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 0.8rem; color: #94a3b8; display: flex; justify-content: space-between; }
            .sig-block { margin-top: 48px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
            .sig-line { border-top: 1px solid #1e293b; padding-top: 6px; font-size: 0.85rem; color: #64748b; }
            @media print { body { padding: 24px; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${c.name}</h1>
            <div class="subtitle">Committee Charter &nbsp;·&nbsp; Effective ${today}</div>
          </div>

          ${f.mission || c.description ? `
          <div class="section">
            <h2>Purpose & Mission</h2>
            <p>${f.mission || c.description}</p>
          </div>` : ''}

          <div class="section">
            <h2>Committee Structure</h2>
            <table>
              ${row('Number of seats', c.seats_available)}
              ${row('Meeting frequency', f.meeting_frequency)}
              ${row('Reports to', f.reporting_to)}
              ${row('Monthly time commitment', c.monthly_hours_needed)}
              ${row('Length of service', c.service_length_needed)}
            </table>
          </div>

          <div class="section">
            <h2>Membership Eligibility</h2>
            <table>
              ${row('Required member type', c.required_member_type || 'Any member type')}
              ${row('Minimum years as member', c.min_years_as_member > 0 ? c.min_years_as_member + ' year(s)' : 'None')}
              ${row('Open to non-members', c.open_to_nonmembers ? 'Yes' : 'No')}
            </table>
          </div>

          <div class="section">
            <h2>Required Skills & Traits</h2>
            ${list(traitLabels)}
          </div>

          <div class="section">
            <h2>Key Responsibilities & Tasks</h2>
            ${list(taskLabels)}
          </div>

          ${f.deliverables ? `
          <div class="section">
            <h2>Key Deliverables</h2>
            <p>${f.deliverables}</p>
          </div>` : ''}

          ${dealLabels.length > 0 ? `
          <div class="section">
            <h2>Required Qualifications (Must-Haves)</h2>
            ${list(dealLabels)}
          </div>` : ''}

          <div class="sig-block">
            <div>
              <div class="sig-line">Committee Chair Signature &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Date</div>
            </div>
            <div>
              <div class="sig-line">Authorized Approver Signature &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Date</div>
            </div>
          </div>

          <div class="footer">
            <span>${c.name} Committee Charter</span>
            <span>Generated ${today}</span>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
    setCharterCommittee(null);
  };

  // Tier label for a score
  const getTierLabel = (score) => {
    const pct = Number(score);
    if (pct >= tiers.ideal.min)    return tiers.ideal.label;
    if (pct >= tiers.quality.min)  return tiers.quality.label;
    if (pct >= tiers.adequate.min) return tiers.adequate.label;
    return 'No Match';
  };

  const toggleCommitteeFilter = (id) => {
    setFilterCommittees(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const toggleTierFilter = (label) => {
    setFilterTiers(prev =>
      prev.includes(label) ? prev.filter(t => t !== label) : [...prev, label]
    );
  };

  // Client-side filtering
  const filteredMatches = matches.filter(m => {
    const tierLabel   = getTierLabel(m.overall_score);
    const committeeOk = filterCommittees.length === 0 || filterCommittees.includes(String(m.committee_id));
    const tierOk      = filterTiers.length === 0      || filterTiers.includes(tierLabel);
    return committeeOk && tierOk;
  });

  const matchesByCommittee = filteredMatches.reduce((acc, m) => {
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

      {/* Success Popup */}
      {successPopup && (
        <div className="popup-overlay" onClick={() => setSuccessPopup(null)}>
          <div className="popup-box" onClick={e => e.stopPropagation()}>
            <div className="popup-icon">🎉</div>
            <h2 className="popup-title">Congratulations!</h2>
            <p className="popup-body">
              You successfully added the <strong>{successPopup.name}</strong> committee.
            </p>
            <div className="popup-actions">
              <button className="btn-primary" onClick={() => { setSuccessPopup(null); setTab('setup'); }}>
                Add Another Committee
              </button>
              <button className="btn-back" onClick={() => setSuccessPopup(null)}>Done</button>
            </div>
          </div>
        </div>
      )}

      {/* Charter Popup */}
      {charterCommittee && (
        <div className="popup-overlay" onClick={() => setCharterCommittee(null)}>
          <div className="popup-box charter-popup" onClick={e => e.stopPropagation()}>
            <h2 className="popup-title" style={{ fontSize: '1.2rem', marginBottom: 4 }}>
              Download Committee Charter
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: 20 }}>
              {charterCommittee.name} — fill in a few extra details for the charter.
            </p>

            <div className="field">
              <label className="field-label">Purpose / Mission Statement</label>
              <textarea className="text-input" rows={3}
                placeholder={charterCommittee.description || 'Describe the committee\'s purpose...'}
                value={charterFields.mission}
                onChange={e => setCharterFields(f => ({ ...f, mission: e.target.value }))} />
            </div>

            <div className="field">
              <label className="field-label">Meeting Frequency *</label>
              <div className="radio-group">
                {MEETING_FREQUENCIES.map(freq => (
                  <label key={freq} className="radio-label">
                    <input type="radio" name="charter_freq" value={freq}
                      checked={charterFields.meeting_frequency === freq}
                      onChange={() => setCharterFields(f => ({ ...f, meeting_frequency: freq }))} />
                    {freq}
                  </label>
                ))}
              </div>
            </div>

            <div className="field">
              <label className="field-label">Reports To (e.g. Board of Directors)</label>
              <input className="text-input" placeholder="Who does this committee report to?"
                value={charterFields.reporting_to}
                onChange={e => setCharterFields(f => ({ ...f, reporting_to: e.target.value }))} />
            </div>

            <div className="field">
              <label className="field-label">Key Deliverables</label>
              <textarea className="text-input" rows={3}
                placeholder="e.g. Annual report, quarterly recommendations, event planning..."
                value={charterFields.deliverables}
                onChange={e => setCharterFields(f => ({ ...f, deliverables: e.target.value }))} />
            </div>

            <div className="popup-actions" style={{ marginTop: 24 }}>
              <button className="btn-primary" onClick={generateCharter}
                disabled={!charterFields.meeting_frequency}>
                ⬇ Generate Charter PDF
              </button>
              <button className="btn-back" onClick={() => setCharterCommittee(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}


      <div className="tabs">
        {['setup', 'match', 'results', 'account'].map(t => (
          <button
            key={t}
            className={`tab-btn ${tab === t ? 'active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t === 'setup'    ? '⚙️ Committee Setup'
              : t === 'match'   ? '▶ Run Matching'
              : t === 'results' ? '📊 Results'
              : '🏢 Account'}
          </button>
        ))}
      </div>

      {/* ── TAB 1: Committee Setup ── */}
      {tab === 'setup' && (
        <div className="tab-content">
          <div className="two-col-layout">
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
                {allTraits.map(t => (
                  <label key={t.key} className="checkbox-label">
                    <input type="checkbox"
                      checked={editingCommittee.required_traits.includes(t.key)}
                      onChange={() => toggleArr('required_traits', t.key)} />
                    {t.label}
                  </label>
                ))}
              </div>
              <div className="add-custom-row">
                <input className="text-input add-custom-input" placeholder="Add your own trait..."
                  value={customTrait} onChange={e => setCustomTrait(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addCustomOption(customTrait, setCustomTrait, setExtraTraits)} />
                <button className="btn-add-custom" onClick={() => addCustomOption(customTrait, setCustomTrait, setExtraTraits)}>+ Add</button>
              </div>

              <h3 className="subsection">Required Tasks</h3>
              <div className="checkbox-grid">
                {allTasks.map(t => (
                  <label key={t.key} className="checkbox-label">
                    <input type="checkbox"
                      checked={editingCommittee.required_tasks.includes(t.key)}
                      onChange={() => toggleArr('required_tasks', t.key)} />
                    {t.label}
                  </label>
                ))}
              </div>
              <div className="add-custom-row">
                <input className="text-input add-custom-input" placeholder="Add your own task..."
                  value={customTask} onChange={e => setCustomTask(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addCustomOption(customTask, setCustomTask, setExtraTasks)} />
                <button className="btn-add-custom" onClick={() => addCustomOption(customTask, setCustomTask, setExtraTasks)}>+ Add</button>
              </div>

              <h3 className="subsection">Deal-Breaker Requirements (Must-Haves)</h3>
              <div className="checkbox-grid">
                {allDealers.map(t => (
                  <label key={t.key} className="checkbox-label">
                    <input type="checkbox"
                      checked={editingCommittee.deal_breakers.includes(t.key)}
                      onChange={() => toggleArr('deal_breakers', t.key)} />
                    {t.label}
                  </label>
                ))}
              </div>
              <div className="add-custom-row">
                <input className="text-input add-custom-input" placeholder="Add your own deal-breaker..."
                  value={customDealer} onChange={e => setCustomDealer(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addCustomOption(customDealer, setCustomDealer, setExtraDealers)} />
                <button className="btn-add-custom" onClick={() => addCustomOption(customDealer, setCustomDealer, setExtraDealers)}>+ Add</button>
              </div>

              <h3 className="subsection">Eligibility Rules</h3>
              <Field label="Required Member Type (check all that apply; leave blank for any)">
                <div className="checkbox-grid" style={{ marginBottom: 8 }}>
                  {allMemberTypes.map(type => (
                    <label key={type} className="checkbox-label">
                      <input type="checkbox"
                        checked={selectedMemberTypes.includes(type)}
                        onChange={() => toggleMemberType(type)} />
                      {type}
                    </label>
                  ))}
                </div>
                <div className="add-custom-row">
                  <input className="text-input add-custom-input" placeholder="Add member type..."
                    value={customMemberType} onChange={e => setCustomMemberType(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addCustomOption(customMemberType, setCustomMemberType, setExtraMemberTypes)} />
                  <button className="btn-add-custom" onClick={() => addCustomOption(customMemberType, setCustomMemberType, setExtraMemberTypes)}>+ Add</button>
                </div>
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
                  <button className="btn-back" onClick={() => setEditingCommittee({ ...emptyCommittee })}>Cancel</button>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
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
                      <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                        <button className="btn-edit" onClick={() => setEditingCommittee(c)}>Edit</button>
                        <button className="btn-charter" onClick={() => openCharter(c)}>⬇ Charter</button>
                      </div>
                    </div>
                  ))
                }
              </div>

              <div className="panel">
                <div className="tier-settings-header" onClick={() => setShowTierSettings(s => !s)}>
                  <h2 className="panel-title" style={{ marginBottom: 0 }}>⚙ Match Tier Settings</h2>
                  <span className="chevron-btn">{showTierSettings ? '▲' : '▼'}</span>
                </div>
                <p className="small-text" style={{ marginTop: 6 }}>
                  Customize the percentage thresholds for each match tier.
                </p>
                {showTierSettings && (
                  <div className="tier-settings-body">
                    {['ideal', 'quality', 'adequate'].map(key => (
                      <div key={key} className="tier-row">
                        <div className="tier-swatch" style={{ background: tierColors[tiers[key].label]?.bg, border: `1px solid ${tierColors[tiers[key].label]?.border}`, color: tierColors[tiers[key].label]?.text }}>
                          {tiers[key].label}
                        </div>
                        <div className="tier-input-group">
                          <label className="field-label">Min %</label>
                          <input type="number" min={0} max={100} className="text-input tier-pct-input"
                            value={tiers[key].min}
                            onChange={e => saveTiers({ ...tiers, [key]: { ...tiers[key], min: parseInt(e.target.value) || 0 } })} />
                        </div>
                        <div className="tier-input-group">
                          <label className="field-label">Label</label>
                          <input type="text" className="text-input tier-label-input"
                            value={tiers[key].label}
                            onChange={e => saveTiers({ ...tiers, [key]: { ...tiers[key], label: e.target.value } })} />
                        </div>
                      </div>
                    ))}
                    <button className="btn-back" style={{ marginTop: 8 }} onClick={() => saveTiers(DEFAULT_TIERS)}>
                      Reset to defaults
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: Run Matching ── */}
      {tab === 'match' && (
        <div className="tab-content center-content">
          <div className="match-panel">
            <div className="match-icon">▶</div>
            <h2>Run Committee Matching</h2>
            <p>
              This will score every individual in the system against every active committee.
              Scores are saved and viewable in the Results tab.
              Running again will update all scores.
            </p>
            <button className="btn-primary btn-large" onClick={handleRunMatch} disabled={matching}>
              {matching ? 'Matching in progress...' : 'Run Matching Now'}
            </button>
            {matching && <div className="spinner" />}
            {matchMsg && (
              <p className={matchMsg.startsWith('❌') ? 'error' : 'success-msg'} style={{ whiteSpace: 'pre-line', marginTop: 16 }}>
                {matchMsg}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 3: Results ── */}
      {tab === 'results' && (
        <div className="tab-content">

          {/* Toolbar */}
          <div className="results-toolbar">

            {/* Committee multi-select */}
            <div className="filter-group">
              <label className="filter-label">Committees</label>
              <div className="multiselect-wrapper">
                <button className="multiselect-trigger" onClick={() => setShowCommitteeFilter(s => !s)}>
                  {filterCommittees.length === 0 ? 'All Committees' : `${filterCommittees.length} selected`}
                  <span style={{ marginLeft: 6 }}>{showCommitteeFilter ? '▲' : '▼'}</span>
                </button>
                {showCommitteeFilter && (
                  <div className="multiselect-dropdown">
                    <label className="multiselect-item">
                      <input type="checkbox"
                        checked={filterCommittees.length === 0}
                        onChange={() => setFilterCommittees([])} />
                      All Committees
                    </label>
                    {committees.map(c => (
                      <label key={c.id} className="multiselect-item">
                        <input type="checkbox"
                          checked={filterCommittees.includes(String(c.id))}
                          onChange={() => toggleCommitteeFilter(String(c.id))} />
                        {c.name}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Tier filter pills */}
            <div className="filter-group">
              <label className="filter-label">Show Tiers</label>
              <div className="tier-checkbox-row">
                {[tiers.ideal, tiers.quality, tiers.adequate].map(t => {
                  const active = filterTiers.length === 0 || filterTiers.includes(t.label);
                  return (
                    <label key={t.label} className="tier-filter-pill"
                      style={{
                        background: active ? tierColors[t.label]?.bg : '#f1f5f9',
                        color:      active ? tierColors[t.label]?.text : '#94a3b8',
                        border:     `1px solid ${active ? tierColors[t.label]?.border : '#e2e8f0'}`,
                      }}>
                      <input type="checkbox" style={{ display: 'none' }}
                        checked={active}
                        onChange={() => toggleTierFilter(t.label)} />
                      {t.label} ({t.min}%+)
                    </label>
                  );
                })}
                {filterTiers.length > 0 && (
                  <button className="btn-clear-tiers" onClick={() => setFilterTiers([])}>Clear</button>
                )}
              </div>
            </div>

            {/* Export buttons */}
            <div className="filter-group">
              <label className="filter-label">Export</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn-export" onClick={handleExportCSV}>⬇ CSV</button>
                <button className="btn-export btn-export-pdf" onClick={handleExportPDF}>⬇ PDF</button>
              </div>
            </div>
          </div>

          {/* Match count */}
          {!loadingMatches && matches.length > 0 && (
            <p className="results-count">
              Showing <strong>{filteredMatches.length}</strong> of <strong>{matches.length}</strong> matches
            </p>
          )}

          {/* Results grid */}
          <div ref={resultsRef}>
            {loadingMatches
              ? <p className="loading">Loading results...</p>
              : matches.length === 0
              ? <p className="empty-state">No matches found. Run matching first.</p>
              : filteredMatches.length === 0
              ? <p className="empty-state">No matches for the selected filters.</p>
              : Object.entries(matchesByCommittee).map(([committeeName, rows]) => (
                <div key={committeeName} className="committee-results-block">
                  <div className="committee-results-header">
                    <h2 className="committee-results-title">{committeeName}</h2>
                    <button className="btn-charter" onClick={() => {
                      const match = committees.find(c => c.name === committeeName);
                      if (match) openCharter(match);
                    }}>⬇ Charter</button>
                  </div>
                  <div className="match-cards">
                    {rows.map(m => {
                      const tierLabel = getTierLabel(m.overall_score);
                      const colors    = tierColors[tierLabel] || tierColors['No Match'];
                      return (
                        <div key={m.id} className="match-card" style={{ borderColor: colors.border }}>
                          <div className="match-card-header">
                            <div>
                              <strong className="match-name">{m.first_name} {m.last_name}</strong>
                              <p className="match-email">{m.email}</p>
                            </div>
                            <div className="score-badge" style={{ background: colors.bg, color: colors.text }}>
                              <span className="score-pct">{Number(m.overall_score).toFixed(0)}%</span>
                              <span className="score-tier">{tierLabel}</span>
                            </div>
                          </div>

                          <div className="score-breakdown">
                            <ScoreBar label="Traits" value={m.trait_score}  tiers={tiers} />
                            <ScoreBar label="Tasks"  value={m.task_score}   tiers={tiers} />
                            <ScoreBar label="Time"   value={m.time_score}   tiers={tiers} />
                            <ScoreBar label="Length" value={m.length_score} tiers={tiers} />
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
        </div>
      )}

      {/* ── TAB 4: Account ── */}
      {tab === 'account' && (
        <div className="tab-content">
          <div className="two-col-layout">

            {/* Org Info */}
            <div className="panel">
              <h2 className="panel-title">Organization Profile</h2>

              {orgSettings.org_logo_url && (
                <div className="logo-preview">
                  <img src={orgSettings.org_logo_url} alt="Org logo" onError={e => e.target.style.display='none'} />
                </div>
              )}

              <Field label="Organization Name">
                <input className="text-input" placeholder="e.g. Association of Professional Engineers"
                  value={orgSettings.org_name}
                  onChange={e => setOrgSettings(s => ({ ...s, org_name: e.target.value }))} />
              </Field>
              <Field label="Website">
                <input className="text-input" placeholder="https://www.yourorg.org"
                  value={orgSettings.org_website}
                  onChange={e => setOrgSettings(s => ({ ...s, org_website: e.target.value }))} />
              </Field>
              <Field label="Address">
                <textarea className="text-input" rows={3} placeholder="123 Main St, Suite 100&#10;City, State 00000"
                  value={orgSettings.org_address}
                  onChange={e => setOrgSettings(s => ({ ...s, org_address: e.target.value }))} />
              </Field>
              <Field label="Phone Number">
                <input className="text-input" placeholder="(555) 555-5555"
                  value={orgSettings.org_phone}
                  onChange={e => setOrgSettings(s => ({ ...s, org_phone: e.target.value }))} />
              </Field>
              <Field label="Email Address">
                <input type="email" className="text-input" placeholder="admin@yourorg.org"
                  value={orgSettings.org_email}
                  onChange={e => setOrgSettings(s => ({ ...s, org_email: e.target.value }))} />
              </Field>
              <Field label="Logo URL">
                <input className="text-input" placeholder="https://yourorg.org/logo.png"
                  value={orgSettings.org_logo_url}
                  onChange={e => setOrgSettings(s => ({ ...s, org_logo_url: e.target.value }))} />
                <p className="field-hint">Paste a direct link to your logo image. It will appear on generated charters.</p>
              </Field>

              {orgMsg && (
                <p className={orgMsg.startsWith('Error') ? 'error' : 'success-msg'} style={{ marginBottom: 12 }}>
                  {orgMsg}
                </p>
              )}
              <button className="btn-primary" onClick={handleSaveOrg} disabled={orgSaving}>
                {orgSaving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>

            {/* Right column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

              {/* Membership Types */}
              <div className="panel">
                <h2 className="panel-title">Membership Types</h2>
                <p className="small-text" style={{ marginBottom: 16 }}>
                  Define the membership types for your organization.
                </p>

                {orgSettings.membership_types.length === 0
                  ? <p className="empty-state" style={{ padding: '16px 0' }}>No membership types added yet.</p>
                  : (
                    <div className="member-type-list">
                      {orgSettings.membership_types.map(type => (
                        <div key={type} className="member-type-item">
                          <span>{type}</span>
                          <button className="btn-remove" onClick={() => removeMemberType(type)}>✕</button>
                        </div>
                      ))}
                    </div>
                  )
                }

                <div className="add-custom-row" style={{ marginTop: 12 }}>
                  <input className="text-input add-custom-input" placeholder="Add membership type..."
                    value={newMemberType}
                    onChange={e => setNewMemberType(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addMemberType()} />
                  <button className="btn-add-custom" onClick={addMemberType}>+ Add</button>
                </div>

                <button className="btn-primary" style={{ marginTop: 16 }} onClick={handleSaveOrg} disabled={orgSaving}>
                  {orgSaving ? 'Saving...' : 'Save Membership Types'}
                </button>
              </div>

              {/* Committee Quick Links */}
              <div className="panel">
                <h2 className="panel-title">Committees</h2>
                <p className="small-text" style={{ marginBottom: 16 }}>Quick links to edit each committee.</p>
                {committees.length === 0
                  ? <p className="empty-state" style={{ padding: '16px 0' }}>No committees yet.</p>
                  : committees.map(c => (
                    <div key={c.id} className="committee-list-item">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong>{c.name}</strong>
                          <span className="badge">{c.seats_available} seat{c.seats_available !== 1 ? 's' : ''}</span>
                          <p className="small-text" style={{ margin: '4px 0 0' }}>{c.monthly_hours_needed} · {c.service_length_needed}</p>
                        </div>
                        <button className="btn-edit" onClick={() => { setEditingCommittee(c); setTab('setup'); }}>
                          Edit →
                        </button>
                      </div>
                    </div>
                  ))
                }
              </div>

            </div>
          </div>
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

function ScoreBar({ label, value, tiers }) {
  if (value == null) return null;
  const pct   = Number(value).toFixed(0);
  const color = pct >= tiers.ideal.min    ? '#92cda3'
              : pct >= tiers.quality.min  ? '#c8c827'
              : pct >= tiers.adequate.min ? '#F1788B'
              : '#fca5a5';
  const icon  = BAR_ICONS[label] || '';
  return (
    <div className="score-bar-row">
      <span className="score-bar-label">
        <span className="score-bar-icon" style={{ color }}>{icon}</span>
        {label}
      </span>
      <div className="score-bar-track">
        <div className="score-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="score-bar-pct" style={{ color }}>{pct}%</span>
    </div>
  );
}

function Styles() {
  return (
    <style>{`
      .ca-wrap { max-width: 1200px; margin: 0 auto; padding: 40px 24px; font-family: inherit; }
      .ca-title { font-size: 1.8rem; font-weight: 700; color: #1e293b; margin-bottom: 32px; }
      .code-form { display: flex; flex-direction: column; gap: 16px; max-width: 400px; }
      .code-form h2 { font-size: 1.4rem; font-weight: 700; color: #1e293b; }
      .text-input { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 1rem; box-sizing: border-box; }
      .text-input:focus { outline: 2px solid #2563eb; border-color: transparent; }
      textarea.text-input { resize: vertical; }
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
      .btn-export-pdf { background: #7c3aed; }
      .btn-export-pdf:hover { background: #6d28d9; }
      .btn-row { display: flex; gap: 12px; margin-top: 16px; }
      .btn-add-custom { padding: 9px 16px; background: #f1f5f9; color: #374151; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.88rem; font-weight: 600; cursor: pointer; white-space: nowrap; }
      .btn-add-custom:hover { background: #e2e8f0; }
      .btn-clear-tiers { padding: 5px 12px; background: #f1f5f9; color: #64748b; border: 1px solid #e2e8f0; border-radius: 20px; font-size: 0.78rem; cursor: pointer; }
      .btn-clear-tiers:hover { background: #e2e8f0; }
      .add-custom-row { display: flex; gap: 8px; margin-top: 10px; align-items: center; }
      .add-custom-input { flex: 1; }
      .tabs { display: flex; gap: 4px; border-bottom: 2px solid #e2e8f0; margin-bottom: 32px; }
      .tab-btn { padding: 10px 20px; background: none; border: none; border-bottom: 3px solid transparent; margin-bottom: -2px; font-size: 0.95rem; font-weight: 600; color: #94a3b8; cursor: pointer; transition: all 0.2s; }
      .tab-btn.active { color: #2563eb; border-bottom-color: #2563eb; }
      .tab-btn:hover:not(.active) { color: #374151; }
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
      .match-icon { font-size: 2.5rem; margin-bottom: 16px; color: #2563eb; }
      .match-panel h2 { font-size: 1.4rem; font-weight: 700; color: #1e293b; margin-bottom: 12px; }
      .match-panel p { color: #64748b; line-height: 1.6; margin-bottom: 28px; }
      .spinner { width: 32px; height: 32px; border: 3px solid #e2e8f0; border-top-color: #2563eb; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 16px auto 0; }
      @keyframes spin { to { transform: rotate(360deg); } }
      .results-toolbar { display: flex; align-items: flex-start; gap: 24px; flex-wrap: wrap; margin-bottom: 20px; padding: 16px 20px; background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; }
      .filter-group { display: flex; flex-direction: column; gap: 6px; }
      .filter-label { font-size: 0.82rem; font-weight: 600; color: #374151; }
      .multiselect-wrapper { position: relative; }
      .multiselect-trigger { padding: 8px 14px; border: 1px solid #cbd5e1; border-radius: 8px; background: #fff; font-size: 0.9rem; cursor: pointer; min-width: 180px; text-align: left; display: flex; justify-content: space-between; align-items: center; }
      .multiselect-trigger:hover { border-color: #94a3b8; }
      .multiselect-dropdown { position: absolute; top: calc(100% + 4px); left: 0; background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px; min-width: 220px; z-index: 100; box-shadow: 0 4px 16px rgba(0,0,0,0.08); max-height: 240px; overflow-y: auto; }
      .multiselect-item { display: flex; align-items: center; gap: 8px; padding: 6px 8px; font-size: 0.88rem; color: #374151; cursor: pointer; border-radius: 4px; }
      .multiselect-item:hover { background: #f8fafc; }
      .tier-checkbox-row { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
      .tier-filter-pill { padding: 6px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: all 0.15s; white-space: nowrap; }
      .tier-filter-pill:hover { opacity: 0.85; }
      .results-count { font-size: 0.85rem; color: #94a3b8; margin-bottom: 20px; }
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
      .score-bar-label { font-size: 0.78rem; color: #64748b; width: 58px; flex-shrink: 0; display: flex; align-items: center; gap: 4px; }
      .score-bar-icon { font-size: 0.8rem; }
      .score-bar-track { flex: 1; height: 7px; background: #f1f5f9; border-radius: 4px; overflow: hidden; }
      .score-bar-fill { height: 100%; border-radius: 4px; transition: width 0.4s; }
      .score-bar-pct { font-size: 0.78rem; width: 30px; text-align: right; flex-shrink: 0; font-weight: 600; }
      .match-summary { font-size: 0.85rem; color: #64748b; line-height: 1.5; margin-top: 10px; }
      .flags { margin-top: 10px; display: flex; flex-wrap: wrap; gap: 6px; }
      .flag { display: inline-block; padding: 3px 8px; background: #fef9c3; color: #854d0e; border-radius: 6px; font-size: 0.78rem; }
      .loading { color: #94a3b8; text-align: center; padding: 40px; }
      .tier-settings-header { display: flex; align-items: center; justify-content: space-between; cursor: pointer; }
      .chevron-btn { font-size: 0.85rem; color: #94a3b8; }
      .tier-settings-body { margin-top: 16px; display: flex; flex-direction: column; gap: 12px; }
      .tier-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
      .tier-swatch { padding: 4px 10px; border-radius: 6px; font-size: 0.82rem; font-weight: 600; flex-shrink: 0; min-width: 120px; text-align: center; }
      .tier-input-group { display: flex; flex-direction: column; gap: 3px; }
      .tier-pct-input { width: 70px !important; }
      .tier-label-input { width: 160px !important; }
      .popup-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; }
      .popup-box { background: #fff; border-radius: 16px; padding: 40px 36px; max-width: 440px; width: 90%; text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,0.15); }
      .popup-icon { font-size: 3rem; margin-bottom: 12px; }
      .popup-title { font-size: 1.5rem; font-weight: 700; color: #1e293b; margin-bottom: 12px; }
      .popup-body { color: #64748b; line-height: 1.6; margin-bottom: 28px; }
      .popup-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
      .btn-charter { padding: 6px 14px; background: #f0fdf4; color: #166534; border: 1px solid #86efac; border-radius: 6px; font-size: 0.85rem; font-weight: 600; cursor: pointer; white-space: nowrap; }
      .btn-charter:hover { background: #dcfce7; }
      .charter-popup { max-width: 520px; text-align: left; max-height: 90vh; overflow-y: auto; }
      .committee-results-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; padding-bottom: 10px; border-bottom: 2px solid #e2e8f0; }
      .committee-results-header .committee-results-title { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }
      .logo-preview { margin-bottom: 20px; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; background: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 80px; }
      .logo-preview img { max-height: 80px; max-width: 100%; object-fit: contain; }
      .field-hint { font-size: 0.78rem; color: #94a3b8; margin-top: 4px; }
      .member-type-list { display: flex; flex-direction: column; gap: 6px; margin-bottom: 4px; }
      .member-type-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 0.9rem; color: #374151; }
      .btn-remove { background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 0.85rem; padding: 2px 6px; border-radius: 4px; }
      .btn-remove:hover { background: #fee2e2; color: #dc2626; }
        .two-col-layout { grid-template-columns: 1fr; }
        .match-cards { grid-template-columns: 1fr; }
        .results-toolbar { flex-direction: column; }
      }
    `}</style>
  );
}
