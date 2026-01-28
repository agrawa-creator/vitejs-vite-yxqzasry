import React, { useState, useEffect } from 'react';
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Professional Client Setup
const supabase = createClient('https://flvgydlrlobylaqvjxov.supabase.co', 'sb_publishable_Rmsl4na9CPs6Ih75XoJEtw_Kilj9JWn');

export default function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: '', teach: '', learn: '', phone: '' });
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    const { data } = await supabase.from('skills_exchange').select('*').order('created_at', { ascending: false });
    if (data) setStudents(data);
  };

  useEffect(() => { loadData(); }, []);

  const sendData = async (e) => {
    e.preventDefault();
    if(!form.name || !form.phone || !form.teach || !form.learn) return alert("Bhai, saari fields bharo!");
    setLoading(true);
    const { error } = await supabase.from('skills_exchange').insert([
      { name: form.name, will_teach: form.teach, will_learn: form.learn, phone_no: form.phone }
    ]);
    if (error) alert(error.message);
    else {
      setForm({ name: '', teach: '', learn: '', phone: '' });
      loadData();
      alert("Registration Successful!");
    }
    setLoading(false);
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif', paddingBottom: '50px' }}>
      <nav style={{ padding: '20px', backgroundColor: '#fff', textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>
        <h2 style={{ margin: 0 }}>RKGIT <span style={{color:'#2563eb'}}>IDEA FACTORY</span></h2>
      </nav>

      <div style={{ maxWidth: '1000px', margin: 'auto', padding: '40px 20px' }}>
        <div style={{ background: '#fff', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', maxWidth: '500px', margin: '0 auto 50px' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Create Your Profile</h3>
          <form onSubmit={sendData} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={s.in} />
            <input placeholder="WhatsApp Number" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} style={s.in} />
            <input placeholder="I can teach" value={form.teach} onChange={e => setForm({...form, teach: e.target.value})} style={s.in} />
            <input placeholder="I want to learn" value={form.learn} onChange={e => setForm({...form, learn: e.target.value})} style={s.in} />
            <button type="submit" style={s.btn} disabled={loading}>{loading ? 'Registering...' : 'Publish My Skills'}</button>
          </form>
        </div>

        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Community Skill Board</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {students.map((std, i) => (
            <div key={i} style={{ background: '#fff', padding: '20px', borderRadius: '15px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ margin: '0 0 10px' }}>👤 {std.name}</h4>
              <div style={s.row}><small style={{color:'#059669', fontWeight:'bold'}}>TEACHING</small><p style={{margin:0, fontWeight:'bold'}}>{std.will_teach}</p></div>
              <div style={s.row}><small style={{color:'#2563eb', fontWeight:'bold'}}>LEARNING</small><p style={{margin:0, fontWeight:'bold'}}>{std.will_learn}</p></div>
              <a href={`https://wa.me/${std.phone_no}`} target="_blank" style={s.wa}>Connect on WhatsApp</a>
            </div>
          ))}
        </div>
      </div>
      <footer style={{ textAlign: 'center', marginTop: '50px' }}>
        <p>Developed & Founded by <b>Chirag Agrawal</b></p>
      </footer>
    </div>
  );
}

const s = {
  in: { padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e0' },
  btn: { padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
  row: { background: '#f1f5f9', padding: '10px', borderRadius: '8px', marginBottom: '10px' },
  wa: { display: 'block', marginTop: '15px', padding: '10px', background: '#22c55e', color: '#fff', textAlign: 'center', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }
};