import React, { useState, useEffect } from 'react';
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient('https://flvgydlrlobylaqvjxov.supabase.co', 'sb_publishable_Rmsl4na9CPs6Ih75XoJEtw_Kilj9JWn');

export default function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: '', teach: '', learn: '', phone: '' });
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    const { data, error } = await supabase.from('skills_exchange').select('*').order('created_at', { ascending: false });
    if (error) console.error("Fetch Error:", error.message);
    else setStudents(data || []);
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!form.name || !form.phone || !form.teach || !form.learn) return alert("Please fill all details!");
    setLoading(true);
    const { error } = await supabase.from('skills_exchange').insert([{ 
      name: form.name, will_teach: form.teach, will_learn: form.learn, phone_no: form.phone 
    }]);
    if (error) alert(error.message);
    else {
      setForm({ name: '', teach: '', learn: '', phone: '' });
      loadData();
      alert("Profile Published Successfully!");
    }
    setLoading(false);
  };

  return (
    <div style={st.body}>
      <nav style={st.nav}><div style={st.logo}>RKGIT <span style={{color:'#2563eb'}}>IDEA FACTORY</span></div></nav>
      <div style={st.container}>
        <header style={st.header}>
          <h1 style={st.title}>Skill Exchange Network</h1>
          <p style={st.subtitle}>Premium peer-to-peer mentorship platform for RKGITians.</p>
        </header>

        <div style={st.formCard}>
          <h3 style={st.cardHeading}>Register Your Expertise</h3>
          <form onSubmit={handleSubmit} style={st.form}>
            <input placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={st.input} />
            <input placeholder="WhatsApp (e.g. 91...)" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} style={st.input} />
            <input placeholder="I can teach (e.g. Java, React)" value={form.teach} onChange={e => setForm({...form, teach: e.target.value})} style={st.input} />
            <input placeholder="I want to learn (e.g. AI, UI/UX)" value={form.learn} onChange={e => setForm({...form, learn: e.target.value})} style={st.input} />
            <button type="submit" style={st.btn} disabled={loading}>{loading ? 'Publishing...' : 'Publish Profile'}</button>
          </form>
        </div>

        <h2 style={st.boardTitle}>Live Talent Board</h2>
        <div style={st.grid}>
          {students.length > 0 ? students.map((std, i) => (
            <div key={i} style={st.skillCard}>
              <div style={st.studentName}>👤 {std.name}</div>
              <div style={st.tagBox}>
                <div style={st.tagRow}><span style={st.tagGreen}>OFFERING</span><p style={st.skillText}>{std.will_teach}</p></div>
                <div style={st.tagRow}><span style={st.tagBlue}>SEEKING</span><p style={st.skillText}>{std.will_learn}</p></div>
              </div>
              <a href={`https://wa.me/${std.phone_no}`} target="_blank" style={st.waBtn}>Connect via WhatsApp</a>
            </div>
          )) : <div style={st.empty}>No active members yet. Be the first!</div>}
        </div>
      </div>
      <footer style={st.footer}>Developed & Founded by <b>Chirag Agrawal</b></footer>
    </div>
  );
}

const st = {
  body: { backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif', color: '#1e293b' },
  nav: { padding: '20px', backgroundColor: '#fff', textAlign: 'center', borderBottom: '1px solid #e2e8f0' },
  logo: { fontWeight: '900', fontSize: '1.4rem', letterSpacing: '1px' },
  container: { maxWidth: '1000px', margin: 'auto', padding: '40px 20px' },
  header: { textAlign: 'center', marginBottom: '40px' },
  title: { fontSize: '2.5rem', fontWeight: '800', marginBottom: '10px' },
  subtitle: { color: '#64748b' },
  formCard: { background: '#fff', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 15px rgba(0,0,0,0.05)', maxWidth: '500px', margin: '0 auto 60px' },
  cardHeading: { textAlign: 'center', marginBottom: '20px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none' },
  btn: { padding: '14px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' },
  boardTitle: { textAlign: 'center', fontSize: '1.8rem', marginBottom: '30px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
  skillCard: { background: '#fff', padding: '20px', borderRadius: '15px', border: '1px solid #f1f5f9' },
  studentName: { fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '15px' },
  tagBox: { display: 'flex', flexDirection: 'column', gap: '10px' },
  tagRow: { background: '#f1f5f9', padding: '10px', borderRadius: '10px' },
  tagGreen: { fontSize: '10px', color: '#059669', fontWeight: '800' },
  tagBlue: { fontSize: '10px', color: '#2563eb', fontWeight: '800' },
  skillText: { margin: '5px 0 0', fontWeight: '600' },
  waBtn: { display: 'block', marginTop: '15px', padding: '10px', background: '#22c55e', color: '#fff', textAlign: 'center', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold' },
  empty: { gridColumn: '1/-1', textAlign: 'center', color: '#94a3b8' },
  footer: { textAlign: 'center', padding: '40px', color: '#64748b' }
};