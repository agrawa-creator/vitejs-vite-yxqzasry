// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient('https://flvgydlrlobylaqvjxov.supabase.co', 'sb_publishable_Rmsl4na9CPs6Ih75XoJEtw_Kilj9JWn');

export default function App() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      const { count } = await supabase.from('skills_exchange').select('*', { count: 'exact', head: true });
      setCount(count || 0);
    };
    fetchCount();
  }, []);

  const handleJoin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const { error } = await supabase.from('skills_exchange').insert([{
      name: formData.get('name'),
      phone_no: formData.get('phone'),
      will_teach: formData.get('teach'),
      will_learn: formData.get('learn')
    }]);
    
    if (!error) setSubmitted(true);
    else alert("Network Busy! Try again.");
    setLoading(false);
  };

  if (submitted) {
    return (
      <div style={st.success}>
        <h2 style={{fontSize:'3rem'}}>🚀</h2>
        <h2 style={st.heroTitle}>Application Received!</h2>
        <p style={st.subtitle}>Our matching engine is now scanning the RKGIT Talent Database to find your perfect skill partner.</p>
        <div style={st.statusBox}>
          <p><strong>Status:</strong> <span style={{color:'#2563eb'}}>Matching in Progress...</span></p>
          <p>Check your WhatsApp for a notification within 24 hours.</p>
        </div>
        <button onClick={() => window.open(`https://wa.me/?text=I just joined the RKGIT Skill Exchange! Join me to swap skills: ${window.location.href}`)} style={st.waBtn}>
          Share on WhatsApp Status
        </button>
      </div>
    );
  }

  return (
    <div style={st.body}>
      <nav style={st.nav}>RKGIT <span style={{color:'#2563eb'}}>IDEA FACTORY</span></nav>
      <div style={st.container}>
        <header style={st.header}>
          <h1 style={st.heroTitle}>The Skill Exchange</h1>
          <p style={st.subtitle}>Join {count + 42} students swapping knowledge today.</p>
        </header>

        <div style={st.card}>
          <form onSubmit={handleJoin} style={st.form}>
            <input name="name" placeholder="Full Name" required style={st.in} />
            <input name="phone" placeholder="WhatsApp Number" required style={st.in} />
            <input name="teach" placeholder="I am an expert in (e.g. Python)" required style={st.in} />
            <input name="learn" placeholder="I want to learn (e.g. UI/UX)" required style={st.in} />
            <button type="submit" disabled={loading} style={st.btn}>
              {loading ? 'Submitting...' : 'Find My Match'}
            </button>
          </form>
        </div>
      </div>
      <footer style={st.footer}>Founded by <b>Chirag Agrawal</b></footer>
    </div>
  );
}

const st = {
  body: { backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
  nav: { padding: '20px', textAlign: 'center', fontWeight: '900', background: '#fff', borderBottom: '1px solid #e2e8f0' },
  container: { maxWidth: '500px', margin: 'auto', padding: '60px 20px' },
  header: { textAlign: 'center', marginBottom: '40px' },
  heroTitle: { fontSize: '2.2rem', fontWeight: '900', color: '#0f172a' },
  subtitle: { color: '#64748b', marginTop: '10px' },
  card: { background: '#fff', padding: '30px', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  in: { padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none' },
  btn: { padding: '16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer' },
  success: { textAlign: 'center', padding: '100px 20px', fontFamily: 'sans-serif' },
  statusBox: { background: '#f1f5f9', padding: '20px', borderRadius: '15px', margin: '30px 0' },
  waBtn: { padding: '15px 30px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', textDecoration: 'none' },
  footer: { textAlign: 'center', padding: '40px', color: '#94a3b8', fontSize: '14px' }
};