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

const VOLUNTEER_HOURS = [
  '1 - 2.5 hours per month', '2.5 - 5 hours per month',
  '5 - 8 hours per month', '8 - 12 hours per month', '12+ hours per month',
];
const SERVICE_LENGTHS = [
  '1-2 months', '3-4 months', '5-6 months',
  '1 year', '2 years', '3 years', '3+ years',
];
const MEETING_FREQUENCIES = [
  'Weekly', 'Bi-Weekly', 'Monthly', 'Every other month', 'Quarterly', 'As needed',
];
const IN_PERSON_COUNTS = ['1','2','3','4','5','6','7','8','9','10','11','12','12+'];

const COUNTRY_CODES = [
  { code: '+1', label: 'USA (+1)' },
  { code: '+1CA', label: 'Canada (+1)' },
  { code: '+7', label: 'Russia (+7)' },
  { code: '+20', label: 'Egypt (+20)' },
  { code: '+27', label: 'South Africa (+27)' },
  { code: '+30', label: 'Greece (+30)' },
  { code: '+31', label: 'Netherlands (+31)' },
  { code: '+32', label: 'Belgium (+32)' },
  { code: '+33', label: 'France (+33)' },
  { code: '+34', label: 'Spain (+34)' },
  { code: '+36', label: 'Hungary (+36)' },
  { code: '+39', label: 'Italy (+39)' },
  { code: '+40', label: 'Romania (+40)' },
  { code: '+41', label: 'Switzerland (+41)' },
  { code: '+43', label: 'Austria (+43)' },
  { code: '+44', label: 'United Kingdom (+44)' },
  { code: '+45', label: 'Denmark (+45)' },
  { code: '+46', label: 'Sweden (+46)' },
  { code: '+47', label: 'Norway (+47)' },
  { code: '+48', label: 'Poland (+48)' },
  { code: '+49', label: 'Germany (+49)' },
  { code: '+51', label: 'Peru (+51)' },
  { code: '+52', label: 'Mexico (+52)' },
  { code: '+53', label: 'Cuba (+53)' },
  { code: '+54', label: 'Argentina (+54)' },
  { code: '+55', label: 'Brazil (+55)' },
  { code: '+56', label: 'Chile (+56)' },
  { code: '+57', label: 'Colombia (+57)' },
  { code: '+58', label: 'Venezuela (+58)' },
  { code: '+60', label: 'Malaysia (+60)' },
  { code: '+61', label: 'Australia (+61)' },
  { code: '+62', label: 'Indonesia (+62)' },
  { code: '+63', label: 'Philippines (+63)' },
  { code: '+64', label: 'New Zealand (+64)' },
  { code: '+65', label: 'Singapore (+65)' },
  { code: '+66', label: 'Thailand (+66)' },
  { code: '+81', label: 'Japan (+81)' },
  { code: '+82', label: 'South Korea (+82)' },
  { code: '+84', label: 'Vietnam (+84)' },
  { code: '+86', label: 'China (+86)' },
  { code: '+90', label: 'Turkey (+90)' },
  { code: '+91', label: 'India (+91)' },
  { code: '+92', label: 'Pakistan (+92)' },
  { code: '+93', label: 'Afghanistan (+93)' },
  { code: '+94', label: 'Sri Lanka (+94)' },
  { code: '+95', label: 'Myanmar (+95)' },
  { code: '+98', label: 'Iran (+98)' },
  { code: '+212', label: 'Morocco (+212)' },
  { code: '+213', label: 'Algeria (+213)' },
  { code: '+216', label: 'Tunisia (+216)' },
  { code: '+218', label: 'Libya (+218)' },
  { code: '+220', label: 'Gambia (+220)' },
  { code: '+221', label: 'Senegal (+221)' },
  { code: '+234', label: 'Nigeria (+234)' },
  { code: '+254', label: 'Kenya (+254)' },
  { code: '+256', label: 'Uganda (+256)' },
  { code: '+260', label: 'Zambia (+260)' },
  { code: '+263', label: 'Zimbabwe (+263)' },
  { code: '+351', label: 'Portugal (+351)' },
  { code: '+352', label: 'Luxembourg (+352)' },
  { code: '+353', label: 'Ireland (+353)' },
  { code: '+354', label: 'Iceland (+354)' },
  { code: '+358', label: 'Finland (+358)' },
  { code: '+380', label: 'Ukraine (+380)' },
  { code: '+420', label: 'Czech Republic (+420)' },
  { code: '+421', label: 'Slovakia (+421)' },
  { code: '+886', label: 'Taiwan (+886)' },
  { code: '+966', label: 'Saudi Arabia (+966)' },
  { code: '+971', label: 'UAE (+971)' },
  { code: '+972', label: 'Israel (+972)' },
  { code: '+974', label: 'Qatar (+974)' },
  { code: '+977', label: 'Nepal (+977)' },
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
  name: '', description: '', strategic_plan_items: '', seats_available: 1,
  reports_to: '', meeting_frequency: '', meeting_type: '', inperson_count: '',
  monthly_hours_needed: '', service_length_needed: '', key_deliverables: '',
  required_traits: [], required_tasks: [], deal_breakers: [],
  required_member_type: '', min_years_as_member: 0,
  requires_prior_committee: '', open_to_nonmembers: false,
};

// ─── Editable checkbox list helper ────────────────────────────────────────────
function EditableCheckList({ allOptions, selectedKeys, onToggle, onUpdateLabel, onRemove, customInput, setCustomInput, onAdd, addPlaceholder, addHint }) {
  const [editingKey, setEditingKey] = useState(null);
  const [editValue, setEditValue] = useState('');

  const startEdit = (opt) => { setEditingKey(opt.key); setEditValue(opt.label); };
  const commitEdit = () => { if (editValue.trim()) onUpdateLabel(editingKey, editValue.trim()); setEditingKey(null); };

  return (
    <div>
      <div className="checkbox-grid">
        {allOptions.map(opt => (
          <div key={opt.key} className="editable-checkbox-row">
            {editingKey === opt.key ? (
              <div className="inline-edit-row">
                <input className="text-input inline-edit-input" value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') setEditingKey(null); }}
                  autoFocus />
                <button className="btn-inline-save" onClick={commitEdit}>✓</button>
                <button className="btn-inline-cancel" onClick={() => setEditingKey(null)}>✕</button>
              </div>
            ) : (
              <label className="checkbox-label" style={{ flex: 1 }}>
                <input type="checkbox"
                  checked={selectedKeys.includes(opt.key)}
                  onChange={() => onToggle(opt.key)} />
                {opt.label}
              </label>
            )}
            {editingKey !== opt.key && (
              <div className="item-actions">
                <button className="btn-item-action" onClick={() => startEdit(opt)} title="Edit">✏</button>
                <button className="btn-item-action btn-item-remove" onClick={() => onRemove(opt.key)} title="Remove">✕</button>
              </div>
            )}
          </div>
        ))}
      </div>
      {addHint && <p className="add-hint">{addHint}</p>}
      <div className="add-custom-row">
        <input className="text-input add-custom-input" placeholder={addPlaceholder}
          value={customInput} onChange={e => setCustomInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onAdd()} />
        <button className="btn-add-custom" onClick={onAdd}>+ Add</button>
      </div>
    </div>
  );
}

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

  // Built-in options state (allows edit/remove of built-ins too)
  const [builtinTraits, setBuiltinTraits]     = useState([...TRAIT_OPTIONS]);
  const [builtinTasks, setBuiltinTasks]       = useState([...TASK_OPTIONS]);
  const [builtinDealers, setBuiltinDealers]   = useState([...DEAL_BREAKER_OPTIONS]);
  const [builtinMemberTypes, setBuiltinMemberTypes] = useState([...MEMBER_TYPE_OPTIONS.map(l => ({ key: l, label: l }))]);

  // Custom add-your-own state
  const [customTrait, setCustomTrait]           = useState('');
  const [extraTraits, setExtraTraits]           = useState([]);
  const [customTask, setCustomTask]             = useState('');
  const [extraTasks, setExtraTasks]             = useState([]);
  const [customDealer, setCustomDealer]         = useState('');
  const [extraDealers, setExtraDealers]         = useState([]);
  const [customMemberType, setCustomMemberType] = useState('');
  const [extraMemberTypes, setExtraMemberTypes] = useState([]);

  // Combined lists
  const allTraits  = [...builtinTraits,  ...extraTraits.map(l => ({ key: `custom_t_${l}`, label: l }))];
  const allTasks   = [...builtinTasks,   ...extraTasks.map(l => ({ key: `custom_tk_${l}`, label: l }))];
  const allDealers = [...builtinDealers, ...extraDealers.map(l => ({ key: `custom_d_${l}`, label: l }))];
  const allMemberTypeObjs = [...builtinMemberTypes, ...extraMemberTypes.map(l => ({ key: `custom_m_${l}`, label: l }))];

  // Generic update/remove helpers
  const updateLabel = (setter, key, newLabel) =>
    setter(prev => prev.map(o => o.key === key ? { ...o, label: newLabel } : o));
  const removeOption = (setter, extraSetter, key) => {
    setter(prev => prev.filter(o => o.key !== key));
    extraSetter && extraSetter(prev => prev.filter(l => `custom_t_${l}` !== key && `custom_tk_${l}` !== key && `custom_d_${l}` !== key && `custom_m_${l}` !== key));
  };

  const addCustomItems = (raw, setter, extraSetter) => {
    const items = raw.split(',').map(s => s.trim()).filter(Boolean);
    items.forEach(item => {
      extraSetter(prev => prev.includes(item) ? prev : [...prev, item]);
    });
    setter('');
  };

  // Match state
  const [matching, setMatching]     = useState(false);
  const [matchMsg, setMatchMsg]     = useState('');
  const [matchTimer, setMatchTimer] = useState(null);

  // Org settings state — expanded with address + phone fields
  const emptyOrg = {
    org_name: '', org_website: '', org_password: '',
    org_address1: '', org_address2: '', org_city: '', org_state: '', org_country: '', org_zip: '',
    org_phone_code: '+1', org_phone: '',
    org_cell_code: '+1', org_cell: '',
    org_email: '', org_logo_url: '', membership_types: [],
  };
  const [orgSettings, setOrgSettings]     = useState(emptyOrg);
  const [orgSaving, setOrgSaving]         = useState(false);
  const [orgMsg, setOrgMsg]               = useState('');
  const [orgLoaded, setOrgLoaded]         = useState(false);
  const [newMemberType, setNewMemberType] = useState('');
  const [bulkMemberTypes, setBulkMemberTypes] = useState('');
  const [showBulkAdd, setShowBulkAdd]     = useState(false);
  const [editingMemberTypeIdx, setEditingMemberTypeIdx] = useState(null);
  const [editMemberTypeVal, setEditMemberTypeVal]       = useState('');
  // drag state for membership types
  const [dragMTIdx, setDragMTIdx] = useState(null);

  const fetchOrgSettings = useCallback(async () => {
    const res = await fetch(`${API}/api/committee/org-settings`, { headers });
    if (res.ok) {
      const data = await res.json();
      // Merge with emptyOrg so new fields default cleanly
      setOrgSettings({ ...emptyOrg, ...data });
      setOrgLoaded(true);
    }
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

  const addBulkMemberTypes = () => {
    const raw = bulkMemberTypes;
    const items = raw.includes(',')
      ? raw.split(',').map(s => s.trim()).filter(Boolean)
      : raw.split('\n').map(s => s.trim()).filter(Boolean);
    setOrgSettings(s => {
      const existing = new Set(s.membership_types);
      const toAdd = items.filter(i => !existing.has(i));
      return { ...s, membership_types: [...s.membership_types, ...toAdd] };
    });
    setBulkMemberTypes('');
    setShowBulkAdd(false);
  };

  const startEditMemberType = (idx) => {
    setEditingMemberTypeIdx(idx);
    setEditMemberTypeVal(orgSettings.membership_types[idx]);
  };
  const commitEditMemberType = () => {
    if (!editMemberTypeVal.trim()) return;
    setOrgSettings(s => {
      const updated = [...s.membership_types];
      updated[editingMemberTypeIdx] = editMemberTypeVal.trim();
      return { ...s, membership_types: updated };
    });
    setEditingMemberTypeIdx(null);
  };

  // Drag-and-drop for membership types
  const handleMTDragStart = (idx) => setDragMTIdx(idx);
  const handleMTDragOver  = (e, idx) => {
    e.preventDefault();
    if (dragMTIdx === null || dragMTIdx === idx) return;
    setOrgSettings(s => {
      const arr = [...s.membership_types];
      const [moved] = arr.splice(dragMTIdx, 1);
      arr.splice(idx, 0, moved);
      setDragMTIdx(idx);
      return { ...s, membership_types: arr };
    });
  };
  const handleMTDragEnd = () => setDragMTIdx(null);

  // Results state
  const [matches, setMatches]                         = useState([]);
  const [filterCommittees, setFilterCommittees]       = useState([]);
  const [filterTiers, setFilterTiers]                 = useState([]);
  const [showCommitteeFilter, setShowCommitteeFilter] = useState(false);
  const [loadingMatches, setLoadingMatches]           = useState(false);
  const resultsRef = useRef(null);

  // Charter state — now checkbox-based
  const [charterCommittee, setCharterCommittee] = useState(null);
  const [charterSelections, setCharterSelections] = useState({});

  const CHARTER_ITEMS = [
    { key: 'description',      label: 'Committee Purpose/Description Statement' },
    { key: 'seats_available',  label: 'Seats Currently Available' },
    { key: 'monthly_hours_needed', label: 'Estimated Volunteer Hours' },
    { key: 'meeting_type',     label: 'Meeting Type' },
    { key: 'inperson_count',   label: 'Number of In-Person Meetings' },
    { key: 'service_length_needed', label: 'Committee Term Duration' },
    { key: 'key_deliverables', label: 'Key Committee Deliverables' },
    { key: 'required_tasks',   label: 'Key Committee Tasks' },
    { key: 'required_traits',  label: 'Ideal Committee Member Traits' },
    { key: 'deal_breakers',    label: 'Essential Qualifications' },
    { key: 'required_member_type', label: 'Required Member Type' },
    { key: 'min_years_as_member',  label: 'Minimum Membership Requirement (Years)' },
    { key: 'reports_to',       label: 'Committee Reports To' },
  ];

  const headers = { 'x-committee-code': code };

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
      setMatchMsg(`Still running… ☕\n${quotes[Math.floor(Math.random() * quotes.length)]}`);
    }, 5 * 60 * 1000);

    const tenMin = setTimeout(() => {
      setMatchMsg('Still working… this is a large dataset. Hang tight!');
    }, 10 * 60 * 1000);

    const res  = await fetch(`${API}/api/committee/run-match`, { method: 'POST', headers });
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

  // Open charter popup — pre-select all items, ensure org settings are loaded
  const openCharter = async (committee) => {
    if (!orgLoaded) await fetchOrgSettings();
    setCharterCommittee(committee);
    const sel = {};
    CHARTER_ITEMS.forEach(item => { sel[item.key] = true; });
    setCharterSelections(sel);
  };

  const toggleCharterItem = (key) => setCharterSelections(s => ({ ...s, [key]: !s[key] }));

  // Generate and print charter PDF — matches template layout
  const generateCharter = () => {
    const c = charterCommittee;
    const sel = charterSelections;
    const org = orgSettings;

    const traitLabels = (c.required_traits || []).map(key => {
      const found = allTraits.find(t => t.key === key);
      return found ? found.label : key;
    });
    const taskLabels = (c.required_tasks || []).map(key => {
      const found = allTasks.find(t => t.key === key);
      return found ? found.label : key;
    });
    const dealLabels = (c.deal_breakers || []).map(key => {
      const found = allDealers.find(t => t.key === key);
      return found ? found.label : key;
    });

    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const bulletList = (items) =>
      items.length === 0
        ? '<li><em style="color:#94a3b8">None specified</em></li>'
        : items.map(i => `<li>${i}</li>`).join('');

    const logoHtml = org.org_logo_url
      ? `<img src="${org.org_logo_url}" alt="Logo" style="max-height:56px;max-width:160px;object-fit:contain;" />`
      : `<span style="font-size:0.85rem;color:#94a3b8;font-style:italic;">LOGO HERE</span>`;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${c.name} — Committee Charter</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: Arial, Helvetica, sans-serif; color: #1e293b; padding: 48px 56px; max-width: 820px; margin: 0 auto; font-size: 10pt; }

            /* ── Page header ── */
            .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; padding-bottom: 16px; border-bottom: 2px solid #135e76; }
            .page-header-left h1 { font-size: 15pt; font-weight: 700; color: #135e76; }
            .page-header-right { text-align: right; }

            /* ── Section headings ── */
            .section-heading {
              font-size: 9pt;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.08em;
              color: #fff;
              background: #135e76;
              padding: 5px 10px;
              margin: 24px 0 0;
            }

            /* ── Purpose block ── */
            .purpose-block { border: 1px solid #cbd5e1; border-top: none; padding: 14px; margin-bottom: 0; }
            .purpose-block p { font-size: 10pt; line-height: 1.65; color: #374151; }

            /* ── Composition table ── */
            .composition-table { width: 100%; border-collapse: collapse; border: 1px solid #cbd5e1; border-top: none; table-layout: fixed; }
            .composition-table td { padding: 9px 12px; border-bottom: 1px solid #e2e8f0; font-size: 10pt; vertical-align: middle; }
            .composition-table tr:last-child td { border-bottom: none; }
            .composition-table .col-label { width: 42%; font-weight: 600; color: #374151; background: #f8fafc; }
            .composition-table .col-value { color: #1e293b; }

            /* ── Bullet sections ── */
            .bullet-block { border: 1px solid #cbd5e1; border-top: none; padding: 12px 14px; }
            .bullet-block ul { margin: 0; padding-left: 18px; }
            .bullet-block li { font-size: 10pt; line-height: 1.7; color: #374151; }

            /* ── Footer ── */
            .page-footer { margin-top: 40px; padding-top: 10px; border-top: 1px solid #cbd5e1; display: flex; justify-content: space-between; font-size: 8pt; color: #94a3b8; }

            @media print {
              @page { margin: 0.75in; }
              body { padding: 0; }
              .section-heading { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: #135e76 !important; }
            }
          </style>
        </head>
        <body>

          <!-- Page header -->
          <div class="page-header">
            <div class="page-header-left">
              <h1>${c.name} Charter</h1>
            </div>
            <div class="page-header-right">
              ${logoHtml}
            </div>
          </div>

          <!-- Purpose / Description -->
          ${sel.description && c.description ? `
          <div class="section-heading">Committee Purpose / Description</div>
          <div class="purpose-block">
            <p>${c.description}</p>
          </div>` : ''}

          <!-- Composition & Logistics -->
          ${(sel.seats_available || sel.monthly_hours_needed || sel.service_length_needed || sel.required_member_type || sel.min_years_as_member || sel.meeting_type || (sel.inperson_count && c.meeting_type === 'In-person') || (sel.reports_to && c.reports_to)) ? `
          <div class="section-heading">Composition &amp; Logistics</div>
          <table class="composition-table">
            ${sel.seats_available && c.seats_available ? `<tr><td class="col-label">Seats Currently Available</td><td class="col-value">${c.seats_available}</td></tr>` : ''}
            ${sel.monthly_hours_needed && c.monthly_hours_needed ? `<tr><td class="col-label">Estimated Volunteer Hours</td><td class="col-value">${c.monthly_hours_needed}</td></tr>` : ''}
            ${sel.service_length_needed && c.service_length_needed ? `<tr><td class="col-label">Committee Term Duration</td><td class="col-value">${c.service_length_needed}</td></tr>` : ''}
            ${sel.meeting_type && c.meeting_type ? `<tr><td class="col-label">Meeting Type</td><td class="col-value">${c.meeting_type}</td></tr>` : ''}
            ${sel.inperson_count && c.meeting_type === 'In-person' && c.inperson_count ? `<tr><td class="col-label">In-Person Meetings per Year</td><td class="col-value">${c.inperson_count}</td></tr>` : ''}
            ${sel.required_member_type ? `<tr><td class="col-label">Required Member Type</td><td class="col-value">${c.required_member_type || 'Any member type'}</td></tr>` : ''}
            ${sel.min_years_as_member ? `<tr><td class="col-label">Minimum Membership Requirement</td><td class="col-value">${c.min_years_as_member > 0 ? c.min_years_as_member + ' year(s)' : 'None'}</td></tr>` : ''}
            ${sel.reports_to && c.reports_to ? `<tr><td class="col-label">Committee Reports To</td><td class="col-value">${c.reports_to}</td></tr>` : ''}
          </table>` : ''}

          <!-- Ideal Committee Member Traits -->
          ${sel.required_traits && traitLabels.length > 0 ? `
          <div class="section-heading">Ideal Committee Member Traits</div>
          <div class="bullet-block">
            <ul>${bulletList(traitLabels)}</ul>
          </div>` : ''}

          <!-- Essential Qualifications -->
          ${sel.deal_breakers && dealLabels.length > 0 ? `
          <div class="section-heading">Essential Qualifications</div>
          <div class="bullet-block">
            <ul>${bulletList(dealLabels)}</ul>
          </div>` : ''}

          <!-- Key Committee Tasks -->
          ${sel.required_tasks && taskLabels.length > 0 ? `
          <div class="section-heading">Key Committee Tasks</div>
          <div class="bullet-block">
            <ul>${bulletList(taskLabels)}</ul>
          </div>` : ''}

          <!-- Key Committee Deliverables -->
          ${sel.key_deliverables && c.key_deliverables ? `
          <div class="section-heading">Key Committee Deliverables</div>
          <div class="bullet-block">
            <ul>${c.key_deliverables.split('\n').filter(l => l.trim()).map(l => `<li>${l.trim()}</li>`).join('') || `<li>${c.key_deliverables}</li>`}</ul>
          </div>` : ''}

          <!-- Footer -->
          <div class="page-footer">
            <span>${org.org_name || 'Organization'} &nbsp;|&nbsp; ${c.name} Charter &nbsp;|&nbsp; ${today}</span>
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
            <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: 16 }}>
              <strong>{charterCommittee.name}</strong> — Check each item you want included in the charter.
            </p>

            <div className="charter-checklist">
              {CHARTER_ITEMS.map(item => (
                <label key={item.key} className="charter-check-row">
                  <input type="checkbox"
                    checked={!!charterSelections[item.key]}
                    onChange={() => toggleCharterItem(item.key)} />
                  {item.label}
                </label>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 16, marginTop: 12 }}>
              <button className="btn-back" style={{ fontSize: '0.82rem', padding: '5px 12px' }}
                onClick={() => { const s = {}; CHARTER_ITEMS.forEach(i => s[i.key] = true); setCharterSelections(s); }}>
                Select All
              </button>
              <button className="btn-back" style={{ fontSize: '0.82rem', padding: '5px 12px' }}
                onClick={() => setCharterSelections({})}>
                Clear All
              </button>
            </div>

            <div className="popup-actions" style={{ marginTop: 8 }}>
              <button className="btn-primary" onClick={generateCharter}>
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

              <Field label="Committee Purpose/Description">
                <textarea className="text-input" rows={3} value={editingCommittee.description}
                  onChange={e => setEditingCommittee(c => ({ ...c, description: e.target.value }))} />
              </Field>

              <Field label="Relevant Strategic Plan Items">
                <textarea className="text-input" rows={3}
                  placeholder="e.g. Goal 2: Strengthen member engagement; Strategy 3.1: Expand committee participation"
                  value={editingCommittee.strategic_plan_items || ''}
                  onChange={e => setEditingCommittee(c => ({ ...c, strategic_plan_items: e.target.value }))} />
              </Field>

              <Field label="Seats Available">
                <input type="number" min={1} className="text-input" value={editingCommittee.seats_available}
                  onChange={e => setEditingCommittee(c => ({ ...c, seats_available: parseInt(e.target.value) }))} />
              </Field>

              <Field label="Reports To (e.g. Board of Directors)">
                <input className="text-input" placeholder="Who does this committee report to?"
                  value={editingCommittee.reports_to || ''}
                  onChange={e => setEditingCommittee(c => ({ ...c, reports_to: e.target.value }))} />
              </Field>

              <h3 className="subsection">Meeting Frequency *</h3>
              <div className="radio-group">
                {MEETING_FREQUENCIES.map(freq => (
                  <label key={freq} className="radio-label">
                    <input type="radio" name="cfreq" value={freq}
                      checked={editingCommittee.meeting_frequency === freq}
                      onChange={() => setEditingCommittee(c => ({ ...c, meeting_frequency: freq }))} />
                    {freq}
                  </label>
                ))}
              </div>

              <h3 className="subsection" style={{ marginTop: 20 }}>Meeting Type *</h3>
              <div className="radio-group">
                {['Virtual', 'In-person'].map(mt => (
                  <label key={mt} className="radio-label">
                    <input type="radio" name="cmtype" value={mt}
                      checked={editingCommittee.meeting_type === mt}
                      onChange={() => setEditingCommittee(c => ({ ...c, meeting_type: mt, inperson_count: mt === 'Virtual' ? '' : c.inperson_count }))} />
                    {mt}
                  </label>
                ))}
              </div>

              {editingCommittee.meeting_type === 'In-person' && (
                <Field label="How many in-person meetings are required per year?">
                  <select className="text-input"
                    value={editingCommittee.inperson_count || ''}
                    onChange={e => setEditingCommittee(c => ({ ...c, inperson_count: e.target.value }))}>
                    <option value="">Select…</option>
                    {IN_PERSON_COUNTS.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </Field>
              )}

              <h3 className="subsection">Estimated Volunteer Hours *</h3>
              <div className="radio-group">
                {VOLUNTEER_HOURS.map(h => (
                  <label key={h} className="radio-label">
                    <input type="radio" name="chours" value={h}
                      checked={editingCommittee.monthly_hours_needed === h}
                      onChange={() => setEditingCommittee(c => ({ ...c, monthly_hours_needed: h }))} />
                    {h}
                  </label>
                ))}
              </div>

              <h3 className="subsection">Term Duration *</h3>
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

              <Field label="Key Deliverables">
                <textarea className="text-input" rows={3}
                  placeholder="e.g. Annual report, quarterly recommendations, event planning..."
                  value={editingCommittee.key_deliverables || ''}
                  onChange={e => setEditingCommittee(c => ({ ...c, key_deliverables: e.target.value }))} />
              </Field>

              {/* ── Ideal Traits ── */}
              <h3 className="subsection">Ideal Traits</h3>
              <p className="section-subtitle">List the key desirable traits for potential committee members.</p>
              <EditableCheckList
                allOptions={allTraits}
                selectedKeys={editingCommittee.required_traits}
                onToggle={key => toggleArr('required_traits', key)}
                onUpdateLabel={(key, newLabel) => {
                  setBuiltinTraits(prev => prev.map(o => o.key === key ? { ...o, label: newLabel } : o));
                  setExtraTraits(prev => prev.map(l => `custom_t_${l}` === key ? newLabel : l));
                }}
                onRemove={key => {
                  setBuiltinTraits(prev => prev.filter(o => o.key !== key));
                  setExtraTraits(prev => prev.filter(l => `custom_t_${l}` !== key));
                  setEditingCommittee(c => ({ ...c, required_traits: c.required_traits.filter(k => k !== key) }));
                }}
                customInput={customTrait}
                setCustomInput={setCustomTrait}
                onAdd={() => addCustomItems(customTrait, setCustomTrait, setExtraTraits)}
                addPlaceholder="Add your own trait… (separate multiple with commas)"
                addHint="Enter one at a time or separate multiple with commas."
              />

              {/* ── Key Tasks ── */}
              <h3 className="subsection" style={{ marginTop: 24 }}>Key Tasks</h3>
              <p className="section-subtitle">List the key tasks and deliverables for this committee position.</p>
              <EditableCheckList
                allOptions={allTasks}
                selectedKeys={editingCommittee.required_tasks}
                onToggle={key => toggleArr('required_tasks', key)}
                onUpdateLabel={(key, newLabel) => {
                  setBuiltinTasks(prev => prev.map(o => o.key === key ? { ...o, label: newLabel } : o));
                  setExtraTasks(prev => prev.map(l => `custom_tk_${l}` === key ? newLabel : l));
                }}
                onRemove={key => {
                  setBuiltinTasks(prev => prev.filter(o => o.key !== key));
                  setExtraTasks(prev => prev.filter(l => `custom_tk_${l}` !== key));
                  setEditingCommittee(c => ({ ...c, required_tasks: c.required_tasks.filter(k => k !== key) }));
                }}
                customInput={customTask}
                setCustomInput={setCustomTask}
                onAdd={() => addCustomItems(customTask, setCustomTask, setExtraTasks)}
                addPlaceholder="Add your own task… (separate multiple with commas)"
                addHint="Enter one at a time or separate multiple with commas."
              />

              {/* ── Essential Qualifications ── */}
              <h3 className="subsection" style={{ marginTop: 24 }}>Essential Qualifications</h3>
              <p className="section-subtitle">List the essential qualifications for the committee position. This could include items like: Experience drafting budgets, Experience drafting policies, or general skills like the Ability to read financial statements, etc.</p>
              <EditableCheckList
                allOptions={allDealers}
                selectedKeys={editingCommittee.deal_breakers}
                onToggle={key => toggleArr('deal_breakers', key)}
                onUpdateLabel={(key, newLabel) => {
                  setBuiltinDealers(prev => prev.map(o => o.key === key ? { ...o, label: newLabel } : o));
                  setExtraDealers(prev => prev.map(l => `custom_d_${l}` === key ? newLabel : l));
                }}
                onRemove={key => {
                  setBuiltinDealers(prev => prev.filter(o => o.key !== key));
                  setExtraDealers(prev => prev.filter(l => `custom_d_${l}` !== key));
                  setEditingCommittee(c => ({ ...c, deal_breakers: c.deal_breakers.filter(k => k !== key) }));
                }}
                customInput={customDealer}
                setCustomInput={setCustomDealer}
                onAdd={() => addCustomItems(customDealer, setCustomDealer, setExtraDealers)}
                addPlaceholder="Add your own qualification… (separate multiple with commas)"
                addHint="Enter one at a time or separate multiple with commas."
              />

              {/* ── Eligibility Rules ── */}
              <h3 className="subsection" style={{ marginTop: 24 }}>Eligibility Rules</h3>

              <div className="field">
                <label className="field-label">Required Member Type (check all that apply; leave blank for any)</label>
                <p className="add-hint" style={{ marginTop: 2, marginBottom: 8 }}>Enter one at a time or separate multiple with commas.</p>
                <div className="checkbox-grid" style={{ marginBottom: 8 }}>
                  {allMemberTypeObjs.map(opt => (
                    <div key={opt.key} className="editable-checkbox-row">
                      <label className="checkbox-label" style={{ flex: 1 }}>
                        <input type="checkbox"
                          checked={selectedMemberTypes.includes(opt.label)}
                          onChange={() => toggleMemberType(opt.label)} />
                        {opt.label}
                      </label>
                      <div className="item-actions">
                        <button className="btn-item-action btn-item-remove"
                          onClick={() => {
                            setBuiltinMemberTypes(prev => prev.filter(o => o.key !== opt.key));
                            setExtraMemberTypes(prev => prev.filter(l => `custom_m_${l}` !== opt.key));
                          }} title="Remove">✕</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="add-custom-row">
                  <input className="text-input add-custom-input" placeholder="Add member type… (separate multiple with commas)"
                    value={customMemberType} onChange={e => setCustomMemberType(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addCustomItems(customMemberType, setCustomMemberType, setExtraMemberTypes)} />
                  <button className="btn-add-custom" onClick={() => addCustomItems(customMemberType, setCustomMemberType, setExtraMemberTypes)}>+ Add</button>
                </div>
              </div>

              <div className="field">
                <label className="field-label">Minimum Membership Requirement</label>
                <p className="add-hint" style={{ marginTop: 2, marginBottom: 6, fontStyle: 'italic' }}>
                  Enter years required. Manual verification necessary for individuals' data entered in their profile. Leave blank for no requirement.
                </p>
                <input type="number" min={0} className="text-input" value={editingCommittee.min_years_as_member}
                  onChange={e => setEditingCommittee(c => ({ ...c, min_years_as_member: parseInt(e.target.value) }))} />
              </div>

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

          {/* Results grid — compact member cards */}
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
                      const pct       = Number(m.overall_score).toFixed(0);
                      return (
                        <div key={m.id} className="match-card" style={{ borderLeftColor: colors.border }}>
                          {/* Header row: name + score badge */}
                          <div className="mc-header">
                            <div className="mc-name-block">
                              <strong className="mc-name">{m.first_name} {m.last_name}</strong>
                              <span className="mc-email">{m.email}</span>
                            </div>
                            <div className="mc-score-badge" style={{ background: colors.bg, color: colors.text, borderColor: colors.border }}>
                              <span className="mc-pct">{pct}%</span>
                              <span className="mc-tier">{tierLabel}</span>
                            </div>
                          </div>

                          {/* Score bars */}
                          <div className="mc-bars">
                            <ScoreBar label="Traits" value={m.trait_score}  tiers={tiers} />
                            <ScoreBar label="Tasks"  value={m.task_score}   tiers={tiers} />
                            <ScoreBar label="Time"   value={m.time_score}   tiers={tiers} />
                            <ScoreBar label="Length" value={m.length_score} tiers={tiers} />
                          </div>

                          {/* Summary + flags */}
                          {m.summary && <p className="mc-summary">{m.summary}</p>}
                          {m.flags?.length > 0 && (
                            <div className="mc-flags">
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

              {/* Name + Website on same line */}
              <div className="field-row-2">
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
              </div>

              <Field label="Logo URL">
                <input className="text-input" placeholder="https://yourorg.org/logo.png"
                  value={orgSettings.org_logo_url}
                  onChange={e => setOrgSettings(s => ({ ...s, org_logo_url: e.target.value }))} />
                <p className="field-hint">Paste a direct link to your logo image. It will appear on generated charters.</p>
              </Field>

              <Field label="Password">
                <input type="password" className="text-input" placeholder="Set an account password"
                  value={orgSettings.org_password || ''}
                  onChange={e => setOrgSettings(s => ({ ...s, org_password: e.target.value }))} />
              </Field>

              {/* Address fields */}
              <div className="subsection-label">Address</div>
              <Field label="Address Line 1">
                <input className="text-input" placeholder="123 Main Street"
                  value={orgSettings.org_address1 || ''}
                  onChange={e => setOrgSettings(s => ({ ...s, org_address1: e.target.value }))} />
              </Field>
              <Field label="Address Line 2">
                <input className="text-input" placeholder="Suite 100, Floor 3, etc."
                  value={orgSettings.org_address2 || ''}
                  onChange={e => setOrgSettings(s => ({ ...s, org_address2: e.target.value }))} />
              </Field>
              <div className="field-row-3">
                <Field label="City">
                  <input className="text-input" placeholder="City"
                    value={orgSettings.org_city || ''}
                    onChange={e => setOrgSettings(s => ({ ...s, org_city: e.target.value }))} />
                </Field>
                <Field label="State / Province">
                  <input className="text-input" placeholder="State / Province"
                    value={orgSettings.org_state || ''}
                    onChange={e => setOrgSettings(s => ({ ...s, org_state: e.target.value }))} />
                </Field>
                <Field label="Zip / Postal Code">
                  <input className="text-input" placeholder="Zip / Postal Code"
                    value={orgSettings.org_zip || ''}
                    onChange={e => setOrgSettings(s => ({ ...s, org_zip: e.target.value }))} />
                </Field>
              </div>
              <Field label="Country">
                <input className="text-input" placeholder="Country"
                  value={orgSettings.org_country || ''}
                  onChange={e => setOrgSettings(s => ({ ...s, org_country: e.target.value }))} />
              </Field>

              {/* Phone */}
              <div className="field">
                <label className="field-label">Phone Number</label>
                <div className="phone-row">
                  <select className="text-input phone-code-select"
                    value={orgSettings.org_phone_code || '+1'}
                    onChange={e => setOrgSettings(s => ({ ...s, org_phone_code: e.target.value }))}>
                    {COUNTRY_CODES.map(cc => <option key={cc.code} value={cc.code}>{cc.label}</option>)}
                  </select>
                  <input className="text-input phone-number-input" placeholder="(555) 555-5555"
                    value={orgSettings.org_phone}
                    onChange={e => setOrgSettings(s => ({ ...s, org_phone: e.target.value }))} />
                </div>
              </div>

              {/* Cell Phone */}
              <div className="field">
                <label className="field-label">Cell Phone</label>
                <div className="phone-row">
                  <select className="text-input phone-code-select"
                    value={orgSettings.org_cell_code || '+1'}
                    onChange={e => setOrgSettings(s => ({ ...s, org_cell_code: e.target.value }))}>
                    {COUNTRY_CODES.map(cc => <option key={cc.code} value={cc.code}>{cc.label}</option>)}
                  </select>
                  <input className="text-input phone-number-input" placeholder="(555) 555-5555"
                    value={orgSettings.org_cell || ''}
                    onChange={e => setOrgSettings(s => ({ ...s, org_cell: e.target.value }))} />
                </div>
              </div>

              <Field label="Email Address">
                <input type="email" className="text-input" placeholder="admin@yourorg.org"
                  value={orgSettings.org_email}
                  onChange={e => setOrgSettings(s => ({ ...s, org_email: e.target.value }))} />
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
                  Define the membership types for your organization. Drag to reorder.
                </p>

                {orgSettings.membership_types.length === 0
                  ? <p className="empty-state" style={{ padding: '16px 0' }}>No membership types added yet.</p>
                  : (
                    <div className="member-type-list">
                      {orgSettings.membership_types.map((type, idx) => (
                        <div key={type + idx}
                          className={`member-type-item${dragMTIdx === idx ? ' dragging' : ''}`}
                          draggable
                          onDragStart={() => handleMTDragStart(idx)}
                          onDragOver={e => handleMTDragOver(e, idx)}
                          onDragEnd={handleMTDragEnd}
                        >
                          <span className="drag-handle" title="Drag to reorder">⠿</span>
                          {editingMemberTypeIdx === idx ? (
                            <input className="text-input inline-edit-input" style={{ flex: 1 }}
                              value={editMemberTypeVal}
                              onChange={e => setEditMemberTypeVal(e.target.value)}
                              onKeyDown={e => { if (e.key === 'Enter') commitEditMemberType(); if (e.key === 'Escape') setEditingMemberTypeIdx(null); }}
                              autoFocus />
                          ) : (
                            <span style={{ flex: 1 }}>{type}</span>
                          )}
                          <div style={{ display: 'flex', gap: 4 }}>
                            {editingMemberTypeIdx === idx ? (
                              <>
                                <button className="btn-inline-save" onClick={commitEditMemberType}>✓</button>
                                <button className="btn-inline-cancel" onClick={() => setEditingMemberTypeIdx(null)}>✕</button>
                              </>
                            ) : (
                              <>
                                <button className="btn-item-action" onClick={() => startEditMemberType(idx)} title="Edit">✏</button>
                                <button className="btn-remove" onClick={() => removeMemberType(type)}>✕</button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                }

                <div className="add-custom-row" style={{ marginTop: 12 }}>
                  <input className="text-input add-custom-input" placeholder="Add membership type…"
                    value={newMemberType}
                    onChange={e => setNewMemberType(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addMemberType()} />
                  <button className="btn-add-custom" onClick={addMemberType}>+ Add</button>
                </div>

                <button className="btn-back" style={{ marginTop: 8, fontSize: '0.85rem' }}
                  onClick={() => setShowBulkAdd(s => !s)}>
                  {showBulkAdd ? '▲ Hide Bulk Add' : '▼ Bulk Add'}
                </button>

                {showBulkAdd && (
                  <div style={{ marginTop: 10 }}>
                    <p className="add-hint">Paste a list separated by commas or new lines.</p>
                    <textarea className="text-input" rows={4}
                      placeholder={"Full Member\nAssociate Member\nStudent Member"}
                      value={bulkMemberTypes}
                      onChange={e => setBulkMemberTypes(e.target.value)}
                      style={{ marginTop: 6 }} />
                    <button className="btn-primary" style={{ marginTop: 8 }} onClick={addBulkMemberTypes}>
                      Add Items
                    </button>
                  </div>
                )}

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
      .add-hint { font-size: 0.8rem; color: #94a3b8; margin: 4px 0 6px; font-style: italic; }
      .tabs { display: flex; gap: 4px; border-bottom: 2px solid #e2e8f0; margin-bottom: 32px; }
      .tab-btn { padding: 10px 20px; background: none; border: none; border-bottom: 3px solid transparent; margin-bottom: -2px; font-size: 0.95rem; font-weight: 600; color: #94a3b8; cursor: pointer; transition: all 0.2s; }
      .tab-btn.active { color: #2563eb; border-bottom-color: #2563eb; }
      .tab-btn:hover:not(.active) { color: #374151; }
      .two-col-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; align-items: start; }
      .panel { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 28px; }
      .panel-title { font-size: 1.2rem; font-weight: 700; color: #1e293b; margin-bottom: 20px; }
      .subsection { font-size: 0.95rem; font-weight: 700; color: #374151; margin: 20px 0 6px; }
      .section-subtitle { font-size: 0.82rem; color: #64748b; font-style: italic; margin: 0 0 10px; }
      .subsection-label { font-size: 0.88rem; font-weight: 700; color: #374151; margin: 16px 0 8px; padding-bottom: 4px; border-bottom: 1px solid #e2e8f0; }
      .field { margin-bottom: 16px; }
      .field-label { display: block; font-size: 0.88rem; font-weight: 600; color: #374151; margin-bottom: 6px; }
      .field-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
      .field-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
      .radio-group { display: flex; flex-direction: column; gap: 8px; margin-bottom: 4px; }
      .radio-label { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; color: #374151; cursor: pointer; }
      .checkbox-grid { display: flex; flex-direction: column; gap: 4px; }
      .checkbox-label { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; color: #374151; cursor: pointer; }
      .editable-checkbox-row { display: flex; align-items: center; gap: 6px; padding: 3px 4px; border-radius: 6px; }
      .editable-checkbox-row:hover { background: #f8fafc; }
      .item-actions { display: flex; gap: 2px; opacity: 0; transition: opacity 0.15s; flex-shrink: 0; }
      .editable-checkbox-row:hover .item-actions { opacity: 1; }
      .btn-item-action { background: none; border: none; cursor: pointer; font-size: 0.78rem; padding: 2px 5px; border-radius: 4px; color: #94a3b8; }
      .btn-item-action:hover { background: #e2e8f0; color: #374151; }
      .btn-item-remove:hover { background: #fee2e2 !important; color: #dc2626 !important; }
      .inline-edit-row { display: flex; align-items: center; gap: 6px; flex: 1; }
      .inline-edit-input { flex: 1 !important; padding: 5px 8px !important; font-size: 0.88rem !important; }
      .btn-inline-save { background: #dcfce7; color: #166534; border: 1px solid #86efac; border-radius: 4px; padding: 3px 8px; font-size: 0.82rem; cursor: pointer; }
      .btn-inline-cancel { background: #fee2e2; color: #dc2626; border: 1px solid #fca5a5; border-radius: 4px; padding: 3px 8px; font-size: 0.82rem; cursor: pointer; }
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
      /* ── Compact member cards ── */
      .match-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px; }
      .match-card { background: #fff; border: 1px solid #e2e8f0; border-left: 4px solid; border-radius: 8px; padding: 14px 16px; }
      .mc-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; gap: 10px; }
      .mc-name-block { min-width: 0; }
      .mc-name { font-size: 0.92rem; font-weight: 700; color: #1e293b; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .mc-email { font-size: 0.76rem; color: #94a3b8; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 1px; }
      .mc-score-badge { display: flex; flex-direction: column; align-items: center; padding: 5px 10px; border-radius: 6px; border: 1px solid; flex-shrink: 0; }
      .mc-pct { font-size: 1.1rem; font-weight: 800; line-height: 1; }
      .mc-tier { font-size: 0.65rem; font-weight: 600; text-align: center; margin-top: 1px; white-space: nowrap; }
      .mc-bars { display: flex; flex-direction: column; gap: 5px; margin-bottom: 8px; }
      .mc-summary { font-size: 0.78rem; color: #64748b; line-height: 1.45; margin-top: 6px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
      .mc-flags { margin-top: 8px; display: flex; flex-wrap: wrap; gap: 4px; }
      .score-bar-row { display: flex; align-items: center; gap: 8px; }
      .score-bar-label { font-size: 0.75rem; color: #64748b; width: 52px; flex-shrink: 0; display: flex; align-items: center; gap: 3px; }
      .score-bar-icon { font-size: 0.75rem; }
      .score-bar-track { flex: 1; height: 6px; background: #f1f5f9; border-radius: 4px; overflow: hidden; }
      .score-bar-fill { height: 100%; border-radius: 4px; transition: width 0.4s; }
      .score-bar-pct { font-size: 0.75rem; width: 28px; text-align: right; flex-shrink: 0; font-weight: 600; }
      .flags { margin-top: 10px; display: flex; flex-wrap: wrap; gap: 6px; }
      .flag { display: inline-block; padding: 2px 7px; background: #fef9c3; color: #854d0e; border-radius: 6px; font-size: 0.74rem; }
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
      .charter-checklist { display: flex; flex-direction: column; gap: 8px; }
      .charter-check-row { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; color: #374151; cursor: pointer; padding: 5px 6px; border-radius: 6px; }
      .charter-check-row:hover { background: #f8fafc; }
      .committee-results-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; padding-bottom: 10px; border-bottom: 2px solid #e2e8f0; }
      .committee-results-header .committee-results-title { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }
      .logo-preview { margin-bottom: 20px; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; background: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 80px; }
      .logo-preview img { max-height: 80px; max-width: 100%; object-fit: contain; }
      .field-hint { font-size: 0.78rem; color: #94a3b8; margin-top: 4px; }
      .phone-row { display: flex; gap: 8px; }
      .phone-code-select { width: 160px !important; flex-shrink: 0; }
      .phone-number-input { flex: 1; }
      .member-type-list { display: flex; flex-direction: column; gap: 6px; margin-bottom: 4px; }
      .member-type-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 0.9rem; color: #374151; gap: 8px; cursor: grab; }
      .member-type-item.dragging { opacity: 0.5; background: #eff6ff; border-color: #93c5fd; }
      .drag-handle { color: #94a3b8; font-size: 1rem; cursor: grab; flex-shrink: 0; }
      .btn-remove { background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 0.85rem; padding: 2px 6px; border-radius: 4px; }
      .btn-remove:hover { background: #fee2e2; color: #dc2626; }
      @media (max-width: 768px) {
        .two-col-layout { grid-template-columns: 1fr; }
        .match-cards { grid-template-columns: 1fr; }
        .results-toolbar { flex-direction: column; }
        .field-row-2 { grid-template-columns: 1fr; }
        .field-row-3 { grid-template-columns: 1fr; }
        .phone-row { flex-direction: column; }
        .phone-code-select { width: 100% !important; }
      }
    `}</style>
  );
}
