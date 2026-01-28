// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient('https://flvgydlrlobylaqvjxov.supabase.co', 'sb_publishable_Rmsl4na9CPs6Ih75XoJEtw_Kilj9JWn');

export default function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: '', teach: '', learn: '', phone: '' });

  // Ye function data load karta hai
  const loadData = async () => {
    const { data, error } = await supabase
      .from('skills_exchange')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) console.log("Fetch Error:", error.message);
    else setStudents(data || []);
  };

  useEffect(() => { loadData(); }, []);

  const sendData = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('skills_exchange').insert([
      { name: form.name, will_teach: form.teach, will_learn: form.learn, phone_no: form.phone }
    ]);
    
    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Success! Profile added to the network.");
      setForm({ name: '', teach: '', learn: '', phone: '' });
      loadData(); // Data add hote hi wapas load karega
    }
  };

  return (
    <div style={{ backgroundColor: '#f1f5f9', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <nav style={{ padding: '20px', backgroundColor: '#fff', textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>
        <h2 style={{ margin: 0, fontWeight: '900' }}>RKGIT <span style={{color:'#2563eb'}}>IDEA FACTORY</span></h2>
      </nav>

      <div style={{ maxWidth: '1000px', margin: 'auto', padding: '40px 20px' }}>
        <div style={{ background: '#fff', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', maxWidth: '450px', margin: '0 auto 50px' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Professional Profile Registration</h3>
          <form onSubmit={sendData} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={st.in} />
            <input placeholder="WhatsApp (91...)" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} style={st.in} />
            <input placeholder="Expertise to Teach" value={form.teach} onChange={e => setForm({...form, teach: e.target.value})} style={st.in} />
            <input placeholder="Skills to Learn" value={form.learn} onChange={e => setForm({...form, learn: e.target.value})} style={st.in} />
            <button type="submit" style={st.btn}>Publish My Skills</button>
          </form>
        </div>

        <h2 style={{ textAlign: 'center', marginBottom: '30px', fontWeight: '800' }}>Live Skill Exchange Board</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {students.length > 0 ? students.map((s, i) => (
            <div key={i} style={{ background: '#fff', padding: '20px', borderRadius: '15px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ margin: '0 0 15px' }}>👤 {s.name}</h4>
              <div style={st.box}><small style={{color:'#059669', fontWeight:'bold'}}>TEACHING</small><p style={{margin:0, fontWeight:'bold'}}>{s.will_teach}</p></div>
              <div style={st.box}><small style={{color:'#2563eb', fontWeight:'bold'}}>LEARNING</small><p style={{margin:0, fontWeight:'bold'}}>{s.will_learn}</p></div>
              <a href={`https://wa.me/${s.phone_no}`} target="_blank" style={st.wa}>Connect Now</a>
            </div>
          )) : <p style={{textAlign:'center', gridColumn:'1/-1'}}>Waiting for members... (Check Supabase Policy if data exists)</p>}
        </div>
      </div>
      <footer style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
        Developed & Founded by <b>Chirag Agrawal</b>
      </footer>
    </div>
  );
}

const st = {
  in: { padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e0', outline: 'none' },
  btn: { padding: '14px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
  box: { background: '#f8fafc', padding: '10px', borderRadius: '8px', marginBottom: '10px' },
  wa: { display: 'block', marginTop: '15px', padding: '10px', background: '#22c55e', color: '#fff', textAlign: 'center', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }
};