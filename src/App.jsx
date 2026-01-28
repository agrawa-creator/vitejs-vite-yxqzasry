import React, { useState, useEffect } from 'react';
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient('https://flvgydlrlobylaqvjxov.supabase.co', 'sb_publishable_Rmsl4na9CPs6Ih75XoJEtw_Kilj9JWn');

export default function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: '', teach: '', learn: '', phone: '' });

  const loadData = async () => {
    // Hum created_at ke hisaab se latest entries upar dikhayenge
    const { data, error } = await supabase.from('skills_exchange').select('*').order('created_at', { ascending: false });
    if (error) console.error("Data Fetch Error:", error.message);
    else setStudents(data || []);
  };

  useEffect(() => { loadData(); }, []);

  const sendData = async (e) => {
    e.preventDefault();
    if(!form.name || !form.phone || !form.teach || !form.learn) return alert("Bhai, saari details bharna zaroori hai!");
    
    const { error } = await supabase.from('skills_exchange').insert([
      { name: form.name, will_teach: form.teach, will_learn: form.learn, phone_no: form.phone }
    ]);
    
    if (error) alert("Error: " + error.message);
    else {
      alert("Mubarak ho! Registration ho gaya.");
      setForm({ name: '', teach: '', learn: '', phone: '' });
      loadData();
    }
  };

  return (
    <div style={s.body}>
      {/* Dynamic Navbar */}
      <nav style={s.nav}>
        <div style={s.logo}>RKGIT <span style={s.factoryText}>IDEA FACTORY</span></div>
      </nav>

      <div style={s.main}>
        <header style={{textAlign:'center', marginBottom: '40px'}}>
          <h1 style={s.heroTitle}>Skill Exchange Hub</h1>
          <p style={{color: '#64748b'}}>Collaborate. Learn. Build together.</p>
        </header>

        {/* Registration Card */}
        <div style={s.formCard}>
          <h3 style={{textAlign:'center', marginBottom:'20px'}}>Create Profile</h3>
          <form onSubmit={sendData} style={s.form}>
            <input placeholder="Apna Naam" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={s.input} />
            <input placeholder="WhatsApp Number" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} style={s.input} />
            <input placeholder="Main kya sikha sakta hoon?" value={form.teach} onChange={e => setForm({...form, teach: e.target.value})} style={s.input} />
            <input placeholder="Mujhe kya seekhna hai?" value={form.learn} onChange={e => setForm({...form, learn: e.target.value})} style={s.input} />
            <button type="submit" style={s.submitBtn}>Join Community</button>
          </form>
        </div>

        {/* Community Board - Yahan sabki entries dikhengi */}
        <h2 style={s.boardHeader}>Community Board ({students.length})</h2>
        <div style={s.grid}>
          {students.length > 0 ? students.map((std, i) => (
            <div key={i} style={s.card}>
              <div style={s.cardUser}>👤 {std.name}</div>
              <div style={s.infoRow}>
                <span style={s.labelGreen}>CAN TEACH</span>
                <p style={s.skillVal}>{std.will_teach}</p>
              </div>
              <div style={s.infoRow}>
                <span style={s.labelBlue}>WANTS TO LEARN</span>
                <p style={s.skillVal}>{std.will_learn}</p>
              </div>
              <a href={`https://wa.me/${std.phone_no}`} target="_blank" style={s.waBtn}>Connect on WhatsApp</a>
            </div>
          )) : (
            <div style={{gridColumn: '1/-1', textAlign:'center', padding:'50px', background:'#fff', borderRadius:'20px'}}>
              <p>Abhi tak koi entry nahi hai. Pehle bande bano!</p>
            </div>
          )}
        </div>
      </div>

      <footer style={s.footer}>
        <p>Developed & Founded by <b>Chirag Agrawal</b></p>
      </footer>
    </div>
  );
}

const s = {
  body: { backgroundColor: '#f0f4f8', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
  nav: { background: '#fff', padding: '15px 30px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'center' },
  logo: { fontSize: '1.5rem', fontWeight: '900', color: '#1e293b' },
  factoryText: { color: '#2563eb' }, // Yahan IDEA FACTORY alag color mein hai
  main: { maxWidth: '1100px', margin: 'auto', padding: '40px 20px' },
  heroTitle: { fontSize: '2.5rem', fontWeight: '800', margin: 0, color: '#0f172a' },
  formCard: { background: '#fff', padding: '30px', borderRadius: '24px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', maxWidth: '450px', margin: '0 auto 60px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none' },
  submitBtn: { padding: '16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' },
  boardHeader: { textAlign: 'center', marginBottom: '30px', fontSize: '1.8rem', fontWeight: '800' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' },
  card: { background: '#fff', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' },
  cardUser: { fontSize: '1.2rem', fontWeight: '700', marginBottom: '15px', color: '#1e293b' },
  infoRow: { background: '#f8fafc', padding: '12px', borderRadius: '12px', marginBottom: '10px' },
  labelGreen: { fontSize: '0.7rem', fontWeight: '800', color: '#059669' },
  labelBlue: { fontSize: '0.7rem', fontWeight: '800', color: '#2563eb' },
  skillVal: { margin: '5px 0 0', fontWeight: '600', fontSize: '1rem' },
  waBtn: { display: 'block', marginTop: '15px', padding: '12px', background: '#22c55e', color: '#fff', textAlign: 'center', borderRadius: '12px', textDecoration: 'none', fontWeight: '700' },
  footer: { textAlign: 'center', padding: '50px 20px', color: '#64748b' }
};