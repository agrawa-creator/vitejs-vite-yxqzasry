// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient('https://flvgydlrlobylaqvjxov.supabase.co', 'sb_publishable_Rmsl4na9CPs6Ih75XoJEtw_Kilj9JWn');

export default function App() {
  const [view, setView] = useState('user'); 
  const [pin, setPin] = useState('');
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [students, setStudents] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const SECRET_PIN = "987363"; 

  const fetchLiveNetwork = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('skills_exchange').select('*');
    if (!error) setStudents(data || []);
    setLoading(false);
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.target);
    const { error } = await supabase.from('skills_exchange').insert([{
      name: fd.get('name'), phone_no: fd.get('phone'), will_teach: fd.get('teach'), will_learn: fd.get('learn')
    }]);
    if (!error) setSubmitted(true);
    else alert("Database Error! Check your connection.");
    setLoading(false);
  };

  const handleAdminLogin = () => {
    if (pin === SECRET_PIN) {
      setIsAdminAuth(true);
      fetchLiveNetwork();
    } else {
      alert("Invalid Founder PIN!");
    }
  };

  if (submitted) return (
    <div style={st.centerLayout}>
      <div style={st.successCard}>
        <h2 style={st.heroTitle}>Success! ✅</h2>
        <p style={st.subtitle}>RKGIT Idea Factory is finding your partner. Check WhatsApp soon.</p>
        <button onClick={() => setSubmitted(false)} style={st.primaryBtn}>Add Another</button>
      </div>
    </div>
  );

  if (view === 'admin') {
    return (
      <div style={st.body}>
        <nav style={st.nav}>FOUNDER'S DASHBOARD</nav>
        {!isAdminAuth ? (
          <div style={st.centerLayout}>
            <div style={st.loginCard}>
              <h3 style={st.charcoalText}>Verify Identity</h3>
              <input type="password" value={pin} onChange={(e) => setPin(e.target.value)} style={st.input} placeholder="Founder PIN" />
              <button onClick={handleAdminLogin} style={st.primaryBtn}>Unlock Console</button>
              <p onClick={() => setView('user')} style={st.backLink}>← Back to Home</p>
            </div>
          </div>
        ) : (
          <div style={st.adminContainer}>
            <div style={st.adminHeader}>
               <div><h2 style={st.charcoalText}>Live Network</h2><p style={st.blueBold}>Total: {students.length}</p></div>
               <button onClick={() => {setIsAdminAuth(false); setView('user');}} style={st.logoutBtn}>Lock</button>
            </div>
            <div style={st.grid}>
              {students.map((s, i) => (
                <div key={i} style={st.dataCard}>
                  <h3 style={st.charcoalText}>👤 {s.name}</h3>
                  <div style={st.infoRow}><b style={st.blueText}>TEACH:</b> {s.will_teach}</div>
                  <div style={st.infoRow}><b style={{color: '#059669'}}>LEARN:</b> {s.will_learn}</div>
                  <div style={st.infoRow}><b style={{color: '#64748b'}}>WA:</b> {s.phone_no}</div>
                  <a href={`https://wa.me/${s.phone_no}`} target="_blank" style={st.connectLink}>Message</a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={st.body}>
      <style>{`
        @media (max-width: 600px) {
          .hero-title { font-size: 2rem !important; }
          .form-card { padding: 25px !important; margin-top: 20px !important; }
          .nav-text { font-size: 1.1rem !important; }
        }
      `}</style>
      <nav style={st.nav} className="nav-text" onDoubleClick={() => setView('admin')}>
        RKGIT <span style={st.blueText}>IDEA FACTORY</span>
      </nav>
      <div style={st.container}>
        <header style={{textAlign:'center', marginBottom:'30px'}}>
          <div style={st.pill}>SKILL EXCHANGE v2.0</div>
          <h1 className="hero-title" style={st.heroTitle}>Master New Skills</h1>
          <p style={st.subtitle}>Premium peer mentorship for RKGIT students.</p>
        </header>
        <div style={st.formWrapper}>
          <form onSubmit={handleJoin} className="form-card" style={st.glassForm}>
            <div style={st.inputGroup}><label style={st.label}>Full Name</label><input name="name" placeholder="Chirag Agrawal" required style={st.input} /></div>
            <div style={st.inputGroup}><label style={st.label}>WhatsApp Number</label><input name="phone" placeholder="91XXXXXXXXXX" required style={st.input} /></div>
            <div style={st.inputGroup}><label style={st.label}>Your Expertise</label><input name="teach" placeholder="e.g. Java, Python" required style={st.input} /></div>
            <div style={st.inputGroup}><label style={st.label}>Seeking Skill</label><input name="learn" placeholder="e.g. UI/UX, AI" required style={st.input} /></div>
            <button type="submit" style={st.primaryBtn}>{loading ? 'Syncing...' : 'Find My Match'}</button>
          </form>
        </div>
      </div>
      <footer style={st.footer}>
        <p>Curated by <b style={st.charcoalText}>Chirag Agrawal</b> | <span onClick={() => setView('admin')} style={{cursor:'pointer', fontWeight:'bold'}}>Admin</span></p>
      </footer>
    </div>
  );
}

const st = {
  body: { backgroundColor: '#fcfdfe', minHeight: '100vh', fontFamily: "sans-serif" },
  nav: { padding: '20px', background: '#fff', borderBottom: '1px solid #e2e8f0', textAlign: 'center', fontWeight: '900', fontSize:'1.3rem', color: '#0f172a' },
  container: { maxWidth: '1200px', margin: 'auto', padding: '40px 20px' },
  pill: { background: '#eff6ff', color: '#2563eb', padding: '6px 15px', borderRadius: '50px', fontSize: '11px', fontWeight: '900', display: 'inline-block', marginBottom: '15px', border:'1px solid #dbeafe' },
  heroTitle: { fontSize: '3.2rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-1.5px', margin: 0 },
  subtitle: { color: '#475569', fontSize: '1.1rem', marginTop: '10px' },
  formWrapper: { display: 'flex', justifyContent: 'center' },
  glassForm: { background: '#fff', padding: '45px', borderRadius: '30px', boxShadow: '0 20px 40px rgba(0,0,0,0.06)', width: '100%', maxWidth: '480px', display:'flex', flexDirection:'column', gap:'5px', border: '1px solid #f1f5f9' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' },
  label: { fontSize: '12px', fontWeight: '800', color: '#334155' },
  input: { padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1rem', color: '#0f172a', outline: 'none', backgroundColor: '#f8fafc' },
  primaryBtn: { padding: '16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '900', cursor: 'pointer', fontSize: '1rem', marginTop: '10px' },
  charcoalText: { color: '#0f172a' },
  blueText: { color: '#2563eb' },
  blueBold: { color: '#2563eb', fontWeight: 'bold' },
  centerLayout: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', textAlign: 'center', padding: '20px' },
  successCard: { background: '#fff', padding: '40px', borderRadius: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', maxWidth: '400px' },
  loginCard: { background: '#fff', padding: '35px', borderRadius: '25px', border: '1px solid #e2e8f0', width: '300px', display:'flex', flexDirection:'column', gap:'15px' },
  adminContainer: { maxWidth: '1200px', margin: 'auto', padding: '30px 20px' },
  adminHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  logoutBtn: { padding: '10px 18px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '10px', fontWeight: '800' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' },
  dataCard: { background: '#fff', padding: '25px', borderRadius: '20px', border: '1px solid #f1f5f9' },
  infoRow: { marginBottom: '8px', fontSize: '14px', color: '#334155' },
  connectLink: { display: 'block', marginTop: '15px', padding: '12px', background: '#22c55e', color: '#fff', textAlign: 'center', borderRadius: '10px', textDecoration: 'none', fontWeight: '900' },
  footer: { textAlign: 'center', padding: '40px 20px', color: '#94a3b8', fontSize: '13px' },
  backLink: { fontWeight: '700', color: '#2563eb', cursor: 'pointer', marginTop: '10px' }
};