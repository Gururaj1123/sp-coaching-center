import React,{useEffect,useState} from 'react';
import axios from 'axios';
import {useAuth} from '../../context/AuthContext';
import {fmt,SUBJECTS} from '../helpers';

export default function SHomework(){
  const {user}=useAuth();
  const [hw,setHw]=useState([]);
  const [filter,setFilter]=useState('All');
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    axios.get('/api/student/homework').then(r=>{setHw(r.data);setLoading(false);});
  },[]);

  if(loading) return <div className="loading-screen" style={{height:'60vh'}}><div className="spinner"/></div>;

  const subjects=SUBJECTS[user?.course]||[];
  const filtered=hw.filter(h=>filter==='All'||h.subject===filter);
  const isOverdue=d=>new Date(d)<new Date();
  const isDueToday=d=>new Date().toDateString()===new Date(d).toDateString();

  return(
    <div className="anim-fade-up">
      <div className="ph">
        <div>
          <div className="ph-title">Homework 📝</div>
          <div className="ph-sub">{hw.filter(h=>!isOverdue(h.due_date)).length} pending · {hw.filter(h=>isOverdue(h.due_date)).length} overdue</div>
        </div>
      </div>

      {subjects.length>0&&(
        <div style={{display:'flex',gap:8,marginBottom:20,flexWrap:'wrap'}}>
          <button className={`btn btn-sm ${filter==='All'?'btn-primary':'btn-ghost'}`} onClick={()=>setFilter('All')}>All</button>
          {subjects.map(s=><button key={s} className={`btn btn-sm ${filter===s?'btn-primary':'btn-ghost'}`} onClick={()=>setFilter(s)}>{s}</button>)}
        </div>
      )}

      {filtered.length===0?(
        <div className="empty"><div className="ei">📝</div><p>No homework assigned yet!</p></div>
      ):(
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          {filtered.map((h,i)=>{
            const over=isOverdue(h.due_date);
            const today=isDueToday(h.due_date);
            return(
              <div key={h.id} className="ic anim-fade-up" style={{animationDelay:`${i*0.05}s`,borderLeft:`4px solid ${over?'var(--red)':today?'var(--amber)':'var(--green)'}`}}>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8,flexWrap:'wrap'}}>
                  <span style={{fontSize:20}}>📝</span>
                  <strong style={{fontSize:15,color:'var(--text)'}}>{h.title}</strong>
                  <span style={{fontSize:11,background:'var(--surface2)',padding:'2px 8px',borderRadius:100,fontWeight:700,color:'var(--muted)'}}>{h.subject}</span>
                  {today&&!over&&<span style={{fontSize:11,background:'rgba(245,158,11,.1)',color:'var(--amber)',padding:'2px 8px',borderRadius:100,fontWeight:700,border:'1px solid rgba(245,158,11,.3)'}}>DUE TODAY</span>}
                  {over&&<span style={{fontSize:11,background:'rgba(239,68,68,.1)',color:'var(--red)',padding:'2px 8px',borderRadius:100,fontWeight:700,border:'1px solid rgba(239,68,68,.3)'}}>OVERDUE</span>}
                </div>
                <p style={{fontSize:14,color:'var(--text2)',lineHeight:1.7,marginBottom:10,background:'var(--bg)',padding:'12px 14px',borderRadius:10,border:'1px solid var(--border)'}}>{h.description}</p>
                <div style={{fontSize:13,color:'var(--muted)'}}>
                  <span style={{fontWeight:700,color:over?'var(--red)':today?'var(--amber)':'var(--green)'}}>📅 Due: {fmt(h.due_date)}</span>
                  &nbsp;· Assigned by {h.teacher_name}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}