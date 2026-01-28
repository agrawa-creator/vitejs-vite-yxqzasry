import React, { useState, useEffect } from 'react';
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Professional Connection
const supabase = createClient('https://flvgydlrlobylaqvjxov.supabase.co', 'sb_publishable_Rmsl4na9CPs6Ih75XoJEtw_Kilj9JWn');

export default function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: '', teach: '', learn: '', phone: '' });

  const loadData = async () => {
    // Fetching with strict ordering for a professional feed
    const { data, error } = await supabase.from('skills_exchange').select('*').order('created_at', { ascending: false });
    if (error) console.error("Data Fetch Error:", error.message);
    else setStudents(data || []);
  };

  useEffect(() => { loadData(); }, []);

  const sendData = async (e) => {
    e.preventDefault();
    if(!form.name || !form.phone || !form.teach || !form.learn) return alert("Please fill all mandatory fields!");
    
    const { error } = await supabase.from('skills_exchange').insert([
      { name: form.name, will_teach: form.teach, will_learn: form.learn, phone_no: form.phone }
    ]);
    
    if (error) alert("Error: " + error.message);
    else {
      alert("Profile Successfully Published!");
      setForm({ name: '', teach: '', learn: '', phone: '' });
      loadData(); // Immediate Refresh
    }
  };

  return (
    <div style={st.body}>
      <nav style={st.nav}>
        <div style={st.logo}>RKGIT <span style={{color:'#2563eb'}}>IDEA FACTORY</span></div>
      </nav>

      <div style={st.container}>
        <header style={{textAlign:'center', marginBottom: '50px'}}>
          <h1 style={st.heroTitle}>Skill Exchange Network</h1>
          <p style={{color: '#64748b'}}>Empowering peers through shared expertise and collaboration.</p>
        </header>

        <div style={st.formCard}>
          <h3 style={{textAlign:'center', marginBottom:'25px', fontWeight:'800'}}>Create Your Profile</h3>
          <form onSubmit={sendData} style={{display:'flex', flexDirection:'column', gap:'15px'}}>
            <input placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={st.in} />
            <input placeholder="WhatsApp (e.g. 91...)" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} style={st.in} />
            <input placeholder="What can you teach?" value={form.teach} onChange={e => setForm({...form, teach: e.target.value})} style={st.in} />
            <input placeholder="What do you want to learn?" value={form.learn} onChange={e => setForm({...form, learn: e.target.value})} style={st.in} />
            <button type="submit" style={st.btn}>Publish Profile</button>
          </form>
        </div>

        <h2 style={st.boardHeader}>Community Talent Board</h2>
        <div style={st.grid}>
          {students.length > 0 ? students.map((std, i) => (
            <div key={i} style={st.card}>
              <div style={{fontSize:'1.2rem', fontWeight:'800', marginBottom:'15px'}}>👤 {std.name}</div>
              <div style={st.infoBox}>
                <small style={{color:'#059669', fontWeight:'900', letterSpacing:'1px'}}>EXPERTISE</small>
                <p style={{margin:'5px 0 0', fontWeight:'700'}}>{std.will_teach}</p>
              </div>
              <div style={st.infoBox}>
                <small style={{color:'#2563eb', fontWeight:'900', letterSpacing:'1px'}}>LEARNING GOAL</small>
                <p style={{margin:'5px 0 0', fontWeight:'700'}}>{std.will_learn}</p>
              </div>
              <a href={`https://wa.me/${std.phone_no}`} target="_blank" style={st.wa}>Connect via WhatsApp</a>
            </div>
          )) : <div style={{gridColumn:'1/-1', textAlign:'center', padding:'50px'}}>Initialising board... Please ensure Supabase policies are active.</div>}
        </div>
      </div>

      <footer style={st.footer}>
        <p>Developed & Founded by <b>Chirag Agrawal</b></p>
        <small style={{color:'#94a3b8'}}>AN RKGIT IDEA FACTORY INITIATIVE</small>
      </footer>
    </div>
  );
}

const st = {
  body: { backgroundColor: '#fdfdfd', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
  nav: { background: '#fff', padding: '20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'center' },
  logo: { fontSize: '1.4rem', fontWeight: '900', letterSpacing: '1px' },
  container: { maxWidth: '1100px', margin: 'auto', padding: '50px 20px' },
  heroTitle: { fontSize: '3rem', fontWeight: '900', color: '#0f172a', marginBottom: '10px' },
  formCard: { background: '#fff', padding: '40px', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', maxWidth: '500px', margin: '0 auto 80px' },
  in: { padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none' },
  btn: { padding: '16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', fontSize: '1rem' },
  boardHeader: { textAlign: 'center', marginBottom: '40px', fontSize: '2rem', fontWeight: '900' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' },
  card: { background: '#fff', padding: '25px', borderRadius: '20px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' },
  infoBox: { background: '#f8fafc', padding: '15px', borderRadius: '15px', marginBottom: '12px' },
  wa: { display: 'block', marginTop: '20px', padding: '12px', background: '#22c55e', color: '#fff', textAlign: 'center', borderRadius: '12px', textDecoration: 'none', fontWeight: '800' },
  footer: { textAlign: 'center', padding: '60px 20px', borderTop: '1px solid #f1f5f9', marginTop: '80px' }
};