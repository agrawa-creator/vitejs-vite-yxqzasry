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

  // DATA FETCH LOGIC - Jo live network dikhayega
  const loadData = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('skills_exchange').select('*').order('created_at', { ascending: false });
    if (!error) {
      setStudents(data || []);
    } else {
      console.error("Error fetching data:", error);
    }
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
    else alert("Database Error! Check Supabase Policies.");
    setLoading(false);
  };

  const handleAdminLogin = () => {
    if (pin === SECRET_PIN) {
      setIsAdminAuth(true);
      loadData();
    } else {
      alert("Invalid Founder PIN!");
    }
  };

  if (submitted) return (
    <div style={st.centerLayout}>
      <div style={st.successCard}>
        <h1 style={{fontSize:'4rem', margin:0}}>✅</h1>
        <h2 style={{color: '#0f172a', fontWeight: '900'}}>Registration Success!</h2>
        <p style={{color: '#475569'}}>RKGIT Idea Factory is finding your partner. Check WhatsApp soon.</p>
        <button onClick={() => setSubmitted(false)} style={st.primaryBtn}>Add Another Profile</button>
      </div>
    </div>
  );

  if (view === 'admin') {
    return (
      <div style={st.body}>
        <nav style={st.nav}>FOUNDER'S COMMAND CENTER</nav>
        {!isAdminAuth ? (
          <div style={st.centerLayout}>
            <div style={st.loginCard}>
              <h3 style={{color: '#1e293b'}}>Verify Identity</h3>
              <input type="password" value={pin} onChange={(e) => setPin(e.target.value)} style={st.input} placeholder="Founder PIN" />
              <button onClick={handleAdminLogin} style={st.primaryBtn}>Unlock Console</button>
              <p onClick={() => setView('user')} style={st.backLink}>← Back to Home</p>
            </div>
          </div>
        ) : (
          <div style={st.adminContainer}>
            <div style={st.adminHeader}>
               <div>
                 <h2 style={{color: '#0f172a', margin:0}}>Live Network Intelligence</h2>
                 <p style={{color:'#2563eb', fontWeight:'bold'}}>Total Registrations: {students.length}</p>
               </div>
               <button onClick={() => {setIsAdminAuth(false); setView('user');}} style={st.logoutBtn}>Lock Console</button>
            </div>
            <div style={st.grid}>
              {students.length === 0 ? <p style={{color:'#64748b'}}>No data found in database.</p> : 
                students.map((s, i) => (
                <div key={i} style={st.dataCard}>
                  <div style={st.cardBadge}>MEMBER #{i+1}</div>
                  <h3 style={{color: '#1e293b', margin:'10px 0'}}>👤 {s.name}</h3>
                  <div style={st.infoRow}><b style={{color: '#2563eb'}}>TEACH:</b> <span style={{color:'#334155'}}>{s.will_teach}</span></div>
                  <div style={st.infoRow}><b style={{color: '#059669'}}>LEARN:</b> <span style={{color:'#334155'}}>{s.will_learn}</span></div>
                  <div style={st.infoRow}><b style={{color: '#64748b'}}>CONTACT:</b> <span style={{color:'#334155'}}>{s.phone_no}</span></div>
                  <a href={`https://wa.me/${s.phone_no}`} target="_blank" style={st.connectLink}>Match via WhatsApp</a>
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
      <nav style={st.nav} onDoubleClick={() => setView('admin')}>
        RKGIT <span style={{color: '#2563eb'}}>IDEA FACTORY</span>
      </nav>
      <div style={st.container}>
        <header style={{textAlign:'center', marginBottom:'40px'}}>
          <div style={st.pill}>SKILL EXCHANGE v2.0</div>
          <h1 style={{fontSize: '3.2rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-2px'}}>Master New Skills</h1>
          <p style={{color: '#475569', fontSize: '1.2rem'}}>Premium peer mentorship for RKGIT students.</p>
        </header>
        <div style={st.formWrapper}>
          <form onSubmit={handleJoin} style={st.glassForm}>
            <div style={st.inputGroup}><label style={st.label}>Full Name</label><input name="name" placeholder="Chirag Agrawal" required style={st.input} /></div>
            <div style={st.inputGroup}><label style={st.label}>WhatsApp Identity</label><input name="phone" placeholder="91XXXXXXXXXX" required style={st.input} /></div>
            <div style={st.inputGroup}><label style={st.label}>Expertise (To Teach)</label><input name="teach" placeholder="e.g. Java, Python" required style={st.input} /></div>
            <div style={st.inputGroup}><label style={st.label}>Target Skill (To Learn)</label><input name="learn" placeholder="e.g. UI/UX, AI" required style={st.input} /></div>
            <button type="submit" style={st.primaryBtn}>{loading ? 'Syncing...' : 'Find My Match'}</button>
          </form>
        </div>
      </div>
      <footer style={st.footer}>
        <p style={{color:'#64748b'}}>Curated by <b style={{color:'#1e293b'}}>Chirag Agrawal</b> | <span onClick={() => setView('admin')} style={{cursor:'pointer', fontWeight:'bold'}}>Admin Console</span></p>
      </footer>
    </div>
  );
}

const st = {
  body: { backgroundColor: '#fcfdfe', minHeight: '100vh', fontFamily: "sans-serif" },
  nav: { padding: '25px', background: '#fff', borderBottom: '1px solid #e2e8f0', textAlign: 'center', fontWeight: '900', fontSize:'1.4rem', color: '#0f172a' },
  container: { maxWidth: '1200px', margin: 'auto', padding: '60px 20px' },
  pill: { background: '#eff6ff', color: '#2563eb', padding: '8px 18px', borderRadius: '50px', fontSize: '12px', fontWeight: '900', display: 'inline-block', marginBottom: '20px', border:'1px solid #dbeafe' },
  formWrapper: { display: 'flex', justifyContent: 'center' },
  glassForm: { background: '#fff', padding: '45px', borderRadius: '35px', boxShadow: '0 30px 60px -12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '500px', display:'flex', flexDirection:'column', gap:'5px', border: '1px solid #f1f5f9' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '15px' },
  label: { fontSize: '13px', fontWeight: '800', color: '#334155' },
  input: { padding: '16px', borderRadius: '15px', border: '1px solid #e2e8f0', fontSize: '1rem', color: '#0f172a', outline: 'none', backgroundColor: '#f8fafc' },
  primaryBtn: { padding: '18px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '15px', fontWeight: '900', cursor: 'pointer', fontSize: '1rem', marginTop: '10px' },
  centerLayout: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', textAlign: 'center' },
  successCard: { background: '#fff', padding: '60px', borderRadius: '40px', maxWidth: '450px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' },
  loginCard: { background: '#fff', padding: '45px', borderRadius: '35px', border: '1px solid #e2e8f0', width: '340px', display:'flex', flexDirection:'column', gap:'15px' },
  adminContainer: { maxWidth: '1200px', margin: 'auto', padding: '40px 20px' },
  adminHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '2px solid #f1f5f9', paddingBottom:'20px' },
  logoutBtn: { padding: '10px 22px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' },
  dataCard: { background: '#fff', padding: '30px', borderRadius: '25px', border: '1px solid #f1f5f9', boxShadow: '0 10px 15px rgba(0,0,0,0.02)' },
  cardBadge: { fontSize: '10px', fontWeight: '900', color: '#94a3b8', letterSpacing: '1px' },
  infoRow: { marginBottom: '10px', fontSize: '15px', color: '#334155' },
  connectLink: { display: 'block', marginTop: '20px', padding: '14px', background: '#22c55e', color: '#fff', textAlign: 'center', borderRadius: '15px', textDecoration: 'none', fontWeight: '900' },
  footer: { textAlign: 'center', padding: '60px 20px' },
  backLink: { fontWeight: '700', color: '#2563eb', cursor: 'pointer', marginTop: '10px' }
};