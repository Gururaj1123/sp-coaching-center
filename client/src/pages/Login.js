import React,{useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';
import './Login.css';

export default function Login(){
  const [role,setRole]   = useState('student');
  const [email,setEmail] = useState('');
  const [pass,setPass]   = useState('');
  const [err,setErr]     = useState('');
  const [busy,setBusy]   = useState(false);
  const {login} = useAuth();
  const navigate = useNavigate();

  const submit = async e=>{
    e.preventDefault(); setErr(''); setBusy(true);
    try {
      const u = await login(email,pass,role);
      navigate(u.role==='teacher'?'/teacher':'/student');
    } catch(e){ setErr(e.response?.data?.error||'Login failed. Check your credentials.'); }
    finally { setBusy(false); }
  };

  const fill=(e,em,pw)=>{ e.preventDefault(); setEmail(em); setPass(pw); };

  return(
    <div className="lp">
      {/* LEFT */}
      <div className="lp-left">
        <div className="lp-left-body">
          <div className="lp-logo">SP</div>
          <h1 className="lp-center-name">SP Coaching Center</h1>
          <p className="lp-center-loc">S.N Nagar, Sagara, Karnataka</p>
          <p className="lp-tagline">"Empowering students with knowledge, one lesson at a time."</p>
          <div className="lp-courses">
            {['📘 SSLC Kannada','📗 CBSE Kannada','🗣️ Spoken English','🏆 Competitive Prep'].map(c=>(
              <div key={c} className="lp-course-pill">{c}</div>
            ))}
          </div>
          <button className="lp-back" onClick={()=>navigate('/')}>← Back to Home</button>
        </div>
      </div>

      {/* RIGHT */}
      <div className="lp-right">
        <div className="lp-box anim-scale-in">
          <div className="lp-header">
            <div className="lp-header-icon">🎓</div>
            <h2 className="lp-title">Welcome Back</h2>
            <p className="lp-sub">Sign in to your SP Coaching portal</p>
          </div>

          <div className="lp-tabs">
            <button className={`lp-tab ${role==='student'?'lp-active':''}`} onClick={()=>{setRole('student');setErr('');}}>
              👨‍🎓 Student
            </button>
            <button className={`lp-tab ${role==='teacher'?'lp-active':''}`} onClick={()=>{setRole('teacher');setErr('');}}>
              👩‍🏫 Teacher
            </button>
          </div>

          <form onSubmit={submit}>
            {err&&<div className="lp-err">⚠️ {err}</div>}
            <div className="fg">
              <label>Email Address</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" required/>
            </div>
            <div className="fg">
              <label>Password</label>
              <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Enter password" required/>
            </div>
            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={busy} style={{marginTop:4}}>
              {busy?'Signing in…':`Sign In as ${role==='teacher'?'Teacher':'Student'} →`}
            </button>
          </form>

          {role==='teacher'&&(
            <div className="lp-demo">
              <div className="lp-demo-title">Quick Demo Access</div>
              <div className="lp-demo-grid">
                {[
                  ['Admin','admin@spcoaching.com','admin123'],
                  ['SSLC','sslc@spcoaching.com','sslc123'],
                  ['CBSE','cbse@spcoaching.com','cbse123'],
                  ['English','english@spcoaching.com','english123'],
                  ['Competitive','comp@spcoaching.com','comp123'],
                ].map(([l,em,pw])=>(
                  <button key={l} className="lp-demo-btn" onClick={e=>fill(e,em,pw)}>{l}</button>
                ))}
              </div>
            </div>
          )}

          <p className="lp-note">Students: contact your teacher for login credentials.</p>
        </div>
      </div>
    </div>
  );
}
