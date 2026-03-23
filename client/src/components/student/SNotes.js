import React,{useEffect,useState} from 'react';
import axios from 'axios';
import {useAuth} from '../../context/AuthContext';
import {fmt,SUBJECTS} from '../helpers';

const API = process.env.REACT_APP_API_URL || '';

export default function SNotes(){
  const {user}=useAuth();
  const [notes,setNotes]=useState([]);
  const [search,setSearch]=useState('');
  const [filterSubject,setFilterSubject]=useState('All');
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    axios.get('/api/student/notes').then(r=>{setNotes(r.data);setLoading(false);});
  },[]);

  if(loading) return <div className="loading-screen" style={{height:'60vh'}}><div className="spinner"/></div>;

  const subjects=SUBJECTS[user?.course]||[];
  const filtered=notes.filter(n=>{
    const ms=filterSubject==='All'||n.subject===filterSubject;
    const mt=n.title.toLowerCase().includes(search.toLowerCase());
    return ms&&mt;
  });

  const grouped={};
  filtered.forEach(n=>{
    const s=n.subject||'General';
    if(!grouped[s]) grouped[s]=[];
    grouped[s].push(n);
  });

  return(
    <div className="anim-fade-up">
      <div className="ph">
        <div>
          <div className="ph-title">Study Notes 📄</div>
          <div className="ph-sub">Subject-wise materials for {user?.course}</div>
        </div>
      </div>

      <div style={{display:'flex',gap:10,marginBottom:22,flexWrap:'wrap'}}>
        <input style={{maxWidth:260}} placeholder="🔍 Search notes…" value={search} onChange={e=>setSearch(e.target.value)}/>
        {subjects.length>0&&(
          <select style={{maxWidth:200}} value={filterSubject} onChange={e=>setFilterSubject(e.target.value)}>
            <option value="All">All Subjects</option>
            {subjects.map(s=><option key={s}>{s}</option>)}
          </select>
        )}
      </div>

      {filtered.length===0?(
        <div className="empty"><div className="ei">📭</div><p>No notes available yet. Check back soon!</p></div>
      ):(
        Object.entries(grouped).map(([subject,items])=>(
          <div key={subject} style={{marginBottom:30}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}}>
              <div style={{background:'var(--primary)',color:'#fff',padding:'5px 16px',borderRadius:100,fontSize:12,fontWeight:700}}>{subject}</div>
              <div style={{fontSize:12,color:'var(--muted)'}}>{items.length} file{items.length!==1?'s':''}</div>
            </div>
            <div className="items-grid">
              {items.map((n,i)=>(
                <div key={n.id} className="ic anim-fade-up" style={{animationDelay:`${i*0.06}s`}}>
                  <div style={{fontSize:44,marginBottom:12}}>📄</div>
                  <div style={{fontWeight:700,fontSize:15,color:'var(--text)',marginBottom:5}}>{n.title}</div>
                  {n.description&&<p style={{fontSize:13,color:'var(--muted)',lineHeight:1.6,marginBottom:10}}>{n.description}</p>}
                  <div className="ic-meta" style={{marginBottom:14}}>By {n.teacher_name} · {fmt(n.created_at)}</div>
                  <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                    <a href={`${API}/uploads/${n.filename}`} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">👁 View PDF</a>
                    <a href={`${API}/uploads/${n.filename}`} download={n.title+'.pdf'} className="btn btn-primary btn-sm">⬇ Download</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}