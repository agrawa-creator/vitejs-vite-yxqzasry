// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient('https://flvgydlrlobylaqvjxov.supabase.co', 'sb_publishable_Rmsl4na9CPs6Ih75XoJEtw_Kilj9JWn');

export default function App() {
  const [view, setView] = useState('user'); // 'user' or 'admin'
  const [pin, setPin] = useState('');
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [students, setStudents] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  // Secret PIN: Tum ise yahan badal sakte ho
  const SECRET_PIN = "1234"; 

  const loadData = async () => {
    const { data } = await supabase.from('skills_exchange').select('*').order('created_at', { ascending: false });
    if (data) setStudents(data);
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const { error } = await supabase.from('skills_exchange').insert([{
      name: fd.get('name'), phone_no: fd.get('phone'), will_teach: fd.get('teach'), will_learn: fd.get('learn')
    }]);
    if (!error) setSubmitted(true);
  };

  const handleAdminLogin = () => {
    if (pin === 987363) {
      setIsAdminAuth(true);
      loadData();
    } else {
      alert("Wrong PIN, Chirag!");
    }
  };

  // --- UI Screens ---

  if (submitted) return (
    <div style={st.center}>
      <h1>🚀 Profile Sent!</h1>
      <p>RKGIT Idea Factory is finding your match. Check WhatsApp soon.</p>
      <button onClick={() => setSubmitted(false)} style={st.btn}>Back</button>
    </div>
  );

  if (view === 'admin') {
    return (
      <div style={st.body}>
        <nav style={st.nav}>ADMIN PANEL - RKGIT IDEA FACTORY</nav>
        {!isAdminAuth ? (
          <div style={st.center}>
            <h3>Enter Secret PIN</h3>
            <input type="password" value={pin} onChange={(e) => setPin(e.target.value)} style={st.in} />
            <button onClick={handleAdminLogin} style={st.btn}>Unlock Data</button>
            <p onClick={() => setView('user')} style={{cursor:'pointer', marginTop:'20px'}}>Back to Website</p>
          </div>
        ) : (
          <div style={{padding:'20px'}}>
            <button onClick={() => setView('user')} style={{marginBottom:'20px'}}>Logout</button>
            <h2>Total Registrations: {students.length}</h2>
            <div style={st.grid}>
              {students.map((s, i) => (
                <div key={i} style={st.card}>
                  <h4>👤 {s.name}</h4>
                  <p><b>WhatsApp:</b> {s.phone_no}</p>
                  <p><b>Teaches:</b> {s.will_teach}</p>
                  <p><b>Wants:</b> {s.will_learn}</p>
                  <a href={`https://wa.me/${s.phone_no}`} target="_blank" style={st.wa}>Message Now</a>
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
        RKGIT <span style={{color:'#2563eb'}}>IDEA FACTORY</span>
      </nav>
      <div style={st.container}>
        <h1 style={{textAlign:'center', fontWeight:'900'}}>The Skill Exchange</h1>
        <p style={{textAlign:'center', color:'#64748b'}}>Register to find your professional peer match.</p>
        <div style={st.formCard}>
          <form onSubmit={handleJoin} style={{display:'flex', flexDirection:'column', gap:'15px'}}>
            <input name="name" placeholder="Full Name" required style={st.in} />
            <input name="phone" placeholder="WhatsApp (91...)" required style={st.in} />
            <input name="teach" placeholder="Skills you can teach" required style={st.in} />
            <input name="learn" placeholder="Skills you want to learn" required style={st.in} />
            <button type="submit" style={st.btn}>Find My Match</button>
          </form>
        </div>
      </div>
      <footer style={{textAlign:'center', padding:'20px', fontSize:'12px', color:'#94a3b8'}}>
        Developed by Chirag Agrawal | <span onClick={() => setView('admin')} style={{cursor:'pointer'}}>Admin</span>
      </footer>
    </div>
  );
}

const st = {
  body: { backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' },
  nav: { padding: '20px', background: '#fff', borderBottom: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 'bold' },
  container: { maxWidth: '500px', margin: 'auto', padding: '40px 20px' },
  formCard: { background: '#fff', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 15px rgba(0,0,0,0.05)', marginTop: '30px' },
  in: { padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none' },
  btn: { padding: '14px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' },
  center: { textAlign: 'center', padding: '100px 20px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' },
  card: { background: '#fff', padding: '20px', borderRadius: '15px', border: '1px solid #e2e8f0' },
  wa: { display: 'block', marginTop: '10px', color: '#22c55e', textDecoration: 'none', fontWeight: 'bold' }
};