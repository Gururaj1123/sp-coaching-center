import React,{useEffect,useState} from 'react';
import axios from 'axios';
import {useAuth} from '../../context/AuthContext';
import {fmtTime} from '../helpers';

export default function SOverview({setActive}){
  const {user}=useAuth();
  const [anns,setAnns]=useState([]);
  const [notes,setNotes]=useState([]);
  const [sugs,setSugs]=useState([]);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    Promise.all([
      axios.get('/api/student/announcements'),
      axios.get('/api/student/notes'),
      axios.get('/api/student/suggestions'),
    ]).then(([a,n,s])=>{
      setAnns(a.data); setNotes(n.data); setSugs(s.data);
      setLoading(false);
    });
  },[]);

  if(loading) return <div className="loading-screen" style={{height:'60vh'}}><div className="spinner"/></div>;

  const urgent=anns.filter(a=>a.priority==='high');
  const greet=()=>{const h=new Date().getHours();return h<12?'Good Morning':h<17?'Good Afternoon':'Good Evening';};

  return(
    <div className="anim-fade-up">
      <div className="ph">
        <div>
          <div className="ph-title">{greet()}, {user?.name?.split(' ')[0]} 👋</div>
          <div className="ph-sub">Your {user?.course} dashboard</div>
        </div>
        <div className="ov-date">{new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'})}</div>
      </div>

      {urgent.length>0&&(
        <div style={{background:'#fef2f2',border:'1.5px solid #fca5a5',borderRadius:'var(--r-lg)',padding:'16px 20px',marginBottom:22,display:'flex',gap:12,alignItems:'flex-start'}}>
          <span style={{fontSize:24}}>🔴</span>
          <div>
            <div style={{fontWeight:700,color:'var(--red)',marginBottom:4}}>Urgent Notice from Teacher</div>
            <div style={{fontSize:14,color:'#7f1d1d'}}>{urgent[0].title}: {urgent[0].message}</div>
          </div>
        </div>
      )}

      <div className="stats-row">
        {[
          {icon:'📢',val:anns.length,lbl:'Announcements',id:'announcements',col:'#1b4fce'},
          {icon:'📄',val:notes.length,lbl:'Study Materials',id:'notes',col:'#0ea5e9'},
          {icon:'💬',val:sugs.length,lbl:'My Suggestions',id:'suggestions',col:'#10b981'},
          {icon:'⏳',val:sugs.filter(s=>s.status==='pending').length,lbl:'Awaiting Reply',id:'suggestions',col:'#f59e0b'},
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
          <div className="sec-title">📢 Latest Announcements</div>
          {anns.slice(0,3).map(a=>(
            <div key={a.id} className={`an-card ${a.priority==='high'?'an-high':''} anim-fade-up`}>
              <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:6}}>
                <span>{a.priority==='high'?'🔴':'🔵'}</span>
                <strong style={{fontSize:14,color:'var(--text)'}}>{a.title}</strong>
              </div>
              <p style={{fontSize:13,color:'var(--text2)',lineHeight:1.6}}>{a.message.substring(0,80)}…</p>
              <div className="ic-meta" style={{marginTop:6}}>{fmtTime(a.created_at)}</div>
            </div>
          ))}
          <button className="btn btn-ghost btn-sm" style={{marginTop:8}} onClick={()=>setActive('announcements')}>View All →</button>
        </div>
        <div>
          <div className="sec-title">📄 Recent Study Notes</div>
          {notes.slice(0,3).map(n=>(
            <div key={n.id} className="ic anim-fade-up" style={{marginBottom:12}}>
              <div style={{display:'flex',gap:10,alignItems:'center'}}>
                <span style={{fontSize:28}}>📄</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:700,fontSize:14,color:'var(--text)',marginBottom:2}}>{n.title}</div>
                  <div className="ic-meta">By {n.teacher_name}</div>
                </div>
                <a href={`/uploads/${n.filename}`} download className="btn btn-primary btn-sm">⬇</a>
              </div>
            </div>
          ))}
          <button className="btn btn-ghost btn-sm" style={{marginTop:4}} onClick={()=>setActive('notes')}>View All Notes →</button>
        </div>
      </div>
    </div>
  );
}
