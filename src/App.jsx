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

  const loadData = async () => {
    setLoading(true);
    const { data } = await supabase.from('skills_exchange').select('*').order('created_at', { ascending: false });
    if (data) setStudents(data);
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
    else alert("Database connection error!");
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
        <button onClick={() => setSubmitted(false)} style={st.primaryBtn}>Register Another</button>
      </div>
    </div>
  );

  if (view === 'admin') {
    return (
      <div style={st.body}>
        <nav style={st.nav}>FOUNDER'S CONTROL PANEL</nav>
        {!isAdminAuth ? (
          <div style={st.centerLayout}>
            <div style={st.loginCard}>
              <h3 style={{color: '#1e293b'}}>Founder Identity</h3>
              <input type="password" value={pin} onChange={(e) => setPin(e.target.value)} style={st.in} placeholder="Enter PIN" />
              <button onClick={handleAdminLogin} style={st.primaryBtn}>Unlock Console</button>
              <p onClick={() => setView('user')} style={{cursor:'pointer', color:'#2563eb', marginTop:'20px'}}>← Back to Home</p>
            </div>
          </div>
        ) : (
          <div style={{padding:'20px', maxWidth:'1200px', margin:'auto'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'30px'}}>
               <h2 style={{color: '#0f172a'}}>Live Network ({students.length})</h2>
               <button onClick={() => {setIsAdminAuth(false); setView('user');}} style={st.logoutBtn}>Lock Console</button>
            </div>
            <div style={st.grid}>
              {students.map((s, i) => (
                <div key={i} style={st.dataCard}>
                  <div style={{fontSize:'10px', color:'#94a3b8'}}>MEMBER #{i+1}</div>
                  <h3 style={{color:'#1e293b', margin:'10px 0'}}>👤 {s.name}</h3>
                  <p style={{color:'#334155', fontSize:'14px'}}><b>Teach:</b> {s.will_teach}</p>
                  <p style={{color:'#334155', fontSize:'14px'}}><b>Learn:</b> {s.will_learn}</p>
                  <p style={{color:'#334155', fontSize:'14px'}}><b>Phone:</b> {s.phone_no}</p>
                  <a href={`https://wa.me/${s.phone_no}`} target="_blank" style={st.wa}>Match on WhatsApp</a>
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
          <h1 style={{fontSize:'3rem', fontWeight:'900', color:'#0f172a', letterSpacing:'-2px'}}>Master New Skills</h1>
          <p style={{color:'#475569', fontSize:'1.1rem'}}>Connect with peers at RKGIT and grow together.</p>
        </header>
        <div style={{display:'flex', justifyContent:'center'}}>
          <form onSubmit={handleJoin} style={st.glassForm}>
            <input name="name" placeholder="Full Name" required style={st.in} />
            <input name="phone" placeholder="WhatsApp (91...)" required style={st.in} />
            <input name="teach" placeholder="I can teach..." required style={st.in} />
            <input name="learn" placeholder="I want to learn..." required style={st.in} />
            <button type="submit" style={st.primaryBtn}>{loading ? 'Processing...' : 'Find My Match'}</button>
          </form>
        </div>
      </div>
      <footer style={{textAlign:'center', padding:'60px 20px', color:'#94a3b8'}}>
        Curated by <b style={{color:'#1e293b'}}>Chirag Agrawal</b> | <span onClick={() => setView('admin')} style={{cursor:'pointer'}}>Admin</span>
      </footer>
    </div>
  );
}

const st = {
  body: { backgroundColor: '#fcfdfe', minHeight: '100vh', fontFamily: 'sans-serif' },
  nav: { padding: '25px', background: '#fff', borderBottom: '1px solid #e2e8f0', textAlign: 'center', fontWeight: '900', fontSize:'1.4rem', color:'#0f172a' },
  container: { maxWidth: '1200px', margin: 'auto', padding: '60px 20px' },
  pill: { background: '#eff6ff', color: '#2563eb', padding: '8px 18px', borderRadius: '50px', fontSize: '12px', fontWeight: '900', display: 'inline-block', marginBottom: '20px' },
  glassForm: { background: '#fff', padding: '40px', borderRadius: '30px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', width: '100%', maxWidth: '450px', display:'flex', flexDirection:'column', gap:'15px', border: '1px solid #f1f5f9' },
  in: { padding: '16px', borderRadius: '15px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none', backgroundColor: '#f8fafc', color:'#0f172a' },
  primaryBtn: { padding: '18px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '15px', fontWeight: '900', cursor: 'pointer' },
  centerLayout: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', textAlign: 'center' },
  successCard: { background: '#fff', padding: '50px', borderRadius: '35px', maxWidth: '400px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' },
  loginCard: { background: '#fff', padding: '40px', borderRadius: '30px', width: '320px', display:'flex', flexDirection:'column', gap:'15px', border: '1px solid #e2e8f0' },
  logoutBtn: { padding: '10px 20px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '12px', fontWeight: '800' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' },
  dataCard: { background: '#fff', padding: '25px', borderRadius: '25px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' },
  wa: { display: 'block', marginTop: '15px', padding: '12px', background: '#22c55e', color: '#fff', textAlign: 'center', borderRadius: '12px', textDecoration: 'none', fontWeight: '800' }
};