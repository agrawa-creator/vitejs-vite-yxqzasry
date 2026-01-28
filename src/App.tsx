import React, { useState, useEffect } from 'react';
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient('https://flvgydlrlobylaqvjxov.supabase.co', 'sb_publishable_Rmsl4na9CPs6Ih75XoJEtw_Kilj9JWn');

export default function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: '', teach: '', learn: '', phone: '' });
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    // Yahan hum database se data utha rahe hain
    const { data, error } = await supabase.from('skills_exchange').select('*');
    if (error) console.log("Fetch Error:", error.message);
    else setStudents(data || []);
  };

  useEffect(() => { loadData(); }, []);

  const sendData = async (e) => {
    e.preventDefault();
    if(!form.name || !form.phone || !form.teach || !form.learn) return alert("Bhai, saari fields bharna zaroori hai!");
    setLoading(true);
    
    // Yahan ensure karo ki ye names Supabase columns se match karte hain
    const { error } = await supabase.from('skills_exchange').insert([
      { name: form.name, will_teach: form.teach, will_learn: form.learn, phone_no: form.phone }
    ]);
    
    if (error) alert("Error: " + error.message);
    else {
      alert("Registration Successful!");
      setForm({ name: '', teach: '', learn: '', phone: '' });
      loadData();
    }
    setLoading(false);
  };

  return (
    <div style={st.body}>
      <nav style={st.nav}><div style={st.logo}>RKGIT <span style={{color:'#2563eb'}}>IDEA FACTORY</span></div></nav>
      <div style={st.container}>
        <div style={st.formCard}>
          <h3 style={st.formHeader}>Create Your Profile</h3>
          <form onSubmit={sendData} style={st.flexForm}>
            <input placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={st.input} />
            <input placeholder="WhatsApp Number (e.g. 91...)" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} style={st.input} />
            <input placeholder="I can teach (Expertise)" value={form.teach} onChange={e => setForm({...form, teach: e.target.value})} style={st.input} />
            <input placeholder="I want to learn" value={form.learn} onChange={e => setForm({...form, learn: e.target.value})} style={st.input} />
            <button type="submit" style={st.submitBtn} disabled={loading}>{loading ? 'Registering...' : 'Publish My Skills'}</button>
          </form>
        </div>

        <div style={st.boardHeader}><h2 style={st.boardTitle}>Community Skill Board</h2></div>
        <div style={st.grid}>
          {students.length > 0 ? students.map((std, i) => (
            <div key={i} style={st.skillCard}>
              <h4 style={st.userName}>👤 {std.name}</h4>
              <div style={st.infoRow}><span style={st.tagGreen}>TEACHING</span><p style={st.skillText}>{std.will_teach}</p></div>
              <div style={st.infoRow}><span style={st.tagBlue}>LEARNING</span><p style={st.skillText}>{std.will_learn}</p></div>
              <a href={`https://wa.me/${std.phone_no}`} target="_blank" style={st.waButton}>Connect on WhatsApp</a>
            </div>
          )) : <p style={{textAlign:'center'}}>Loading skills or Board is empty...</p>}
        </div>
      </div>
      <footer style={st.footer}><p>Developed & Founded by <b>Chirag Agrawal</b></p></footer>
    </div>
  );
}

const st = {
  body: { backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' },
  nav: { padding: '20px', backgroundColor: '#fff', textAlign: 'center', borderBottom: '1px solid #e2e8f0' },
  logo: { fontWeight: 'bold', fontSize: '1.2rem' },
  container: { maxWidth: '1000px', margin: 'auto', padding: '40px 20px' },
  formCard: { background: '#fff', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', maxWidth: '500px', margin: '0 auto 50px' },
  formHeader: { textAlign: 'center', marginBottom: '20px' },
  flexForm: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e0' },
  submitBtn: { padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
  boardTitle: { textAlign: 'center', marginBottom: '30px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' },
  skillCard: { background: '#fff', padding: '20px', borderRadius: '15px', border: '1px solid #e2e8f0' },
  userName: { margin: '0 0 15px' },
  infoRow: { background: '#f1f5f9', padding: '10px', borderRadius: '8px', marginBottom: '10px' },
  tagGreen: { fontSize: '10px', color: '#059669', fontWeight: 'bold' },
  tagBlue: { fontSize: '10px', color: '#2563eb', fontWeight: 'bold' },
  skillText: { margin: '5px 0 0', fontWeight: 'bold' },
  waButton: { display: 'block', marginTop: '15px', padding: '10px', background: '#22c55e', color: '#fff', textAlign: 'center', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' },
  footer: { textAlign: 'center', padding: '40px', color: '#64748b' }
};