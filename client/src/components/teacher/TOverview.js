import React,{useEffect,useState} from 'react';
import axios from 'axios';
import {useAuth} from '../../context/AuthContext';
import {fmt,CC} from '../helpers';

export default function TOverview({setActive}){
  const {user}=useAuth();
  const [stats,setStats]=useState({students:0,notes:0,announcements:0,suggestions:0});
  const [recentAnn,setRecentAnn]=useState([]);
  const [recentSug,setRecentSug]=useState([]);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    Promise.all([
      axios.get('/api/teacher/students'),
      axios.get('/api/teacher/notes'),
      axios.get('/api/teacher/announcements'),
      axios.get('/api/teacher/suggestions'),
    ]).then(([s,n,a,sg])=>{
      setStats({students:s.data.length,notes:n.data.length,announcements:a.data.length,suggestions:sg.data.filter(x=>x.status==='pending').length});
      setRecentAnn(a.data.slice(0,3));
      setRecentSug(sg.data.filter(x=>x.status==='pending').slice(0,3));
      setLoading(false);
    });
  },[]);

  if(loading) return <div className="loading-screen" style={{height:'60vh'}}><div className="spinner"/></div>;

  const greet=()=>{
    const h=new Date().getHours();
    if(h<12) return 'Good Morning';
    if(h<17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return(
    <div className="anim-fade-up">
      <div className="ph">
        <div>
          <div className="ph-title">{greet()}, {user?.name?.split(' ')[0]} 👋</div>
          <div className="ph-sub">Here is what is happening in your classes today</div>
        </div>
        <div className="ov-date">{new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</div>
      </div>

      <div className="stats-row">
        {[
          {icon:'👥',val:stats.students,lbl:'Students',id:'students',col:'#1b4fce'},
          {icon:'📄',val:stats.notes,   lbl:'Notes Uploaded',id:'notes',col:'#0ea5e9'},
          {icon:'📢',val:stats.announcements,lbl:'Announcements',id:'announcements',col:'#10b981'},
          {icon:'💬',val:stats.suggestions,  lbl:'Pending Suggestions',id:'suggestions',col:stats.suggestions>0?'#ef4444':'#8b5cf6'},
        ].map((s,i)=>(
          <div key={i} className="sc anim-fade-up" style={{animationDelay:`${i*0.08}s`}} onClick={()=>setActive(s.id)}>
            <div className="sc-icon">{s.icon}</div>
            <div className="sc-val" style={{color:s.col}}>{s.val}</div>
            <div className="sc-lbl">{s.lbl}</div>
          </div>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:22}}>
        <div>
          <div className="sec-title">📢 Recent Announcements</div>
          {recentAnn.length===0?(
            <div className="empty"><div className="ei">📭</div><p>No announcements yet</p></div>
          ):recentAnn.map(a=>(
            <div key={a.id} className={`an-card ${a.priority==='high'?'an-high':''} anim-fade-up`}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                <span>{a.priority==='high'?'🔴':'🔵'}</span>
                <strong style={{fontSize:15}}>{a.title}</strong>
                <span className={`badge c-${CC[a.course]||'all'}`} style={{marginLeft:'auto'}}>{a.course}</span>
              </div>
              <div style={{fontSize:13,color:'var(--muted)'}}>{fmt(a.created_at)}</div>
            </div>
          ))}
          <button className="btn btn-ghost btn-sm" style={{marginTop:8}} onClick={()=>setActive('announcements')}>View All →</button>
        </div>

        <div>
          <div className="sec-title">💬 Pending Student Suggestions</div>
          {recentSug.length===0?(
            <div className="empty"><div className="ei">✅</div><p>No pending suggestions</p></div>
          ):recentSug.map(s=>(
            <div key={s.id} className="an-card an-student anim-fade-up">
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                <span>💬</span>
                <strong style={{fontSize:14}}>{s.student_name}</strong>
                <span className="badge s-pend" style={{marginLeft:'auto'}}>Pending</span>
              </div>
              <div style={{fontSize:13,color:'var(--text2)',marginBottom:4}}><strong>{s.type}:</strong> {s.message.substring(0,70)}…</div>
              <div style={{fontSize:12,color:'var(--muted)'}}>{fmt(s.created_at)}</div>
            </div>
          ))}
          <button className="btn btn-ghost btn-sm" style={{marginTop:8}} onClick={()=>setActive('suggestions')}>Reply to Suggestions →</button>
        </div>
      </div>
    </div>
  );
}
