import React,{useEffect,useState} from 'react';
import axios from 'axios';
import {useAuth} from '../../context/AuthContext';
import {fmt} from '../helpers';

export default function SNotes(){
  const {user}=useAuth();
  const [notes,setNotes]=useState([]);
  const [search,setSearch]=useState('');
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    axios.get('/api/student/notes').then(r=>{setNotes(r.data);setLoading(false);});
  },[]);

  if(loading) return <div className="loading-screen" style={{height:'60vh'}}><div className="spinner"/></div>;

  const filtered=notes.filter(n=>n.title.toLowerCase().includes(search.toLowerCase()));

  return(
    <div className="anim-fade-up">
      <div className="ph">
        <div>
          <div className="ph-title">Study Notes 📄</div>
          <div className="ph-sub">All materials for {user?.course}</div>
        </div>
      </div>

      <div style={{marginBottom:22}}>
        <input style={{maxWidth:320}} placeholder="🔍 Search notes by title…" value={search} onChange={e=>setSearch(e.target.value)}/>
      </div>

      {filtered.length===0?(
        <div className="empty"><div className="ei">📭</div><p>No notes available yet. Check back soon!</p></div>
      ):(
        <div className="items-grid">
          {filtered.map((n,i)=>(
            <div key={n.id} className="ic anim-fade-up" style={{animationDelay:`${i*0.07}s`}}>
              <div style={{fontSize:44,marginBottom:12}}>📄</div>
              <div style={{fontWeight:700,fontSize:16,color:'var(--text)',marginBottom:5}}>{n.title}</div>
              {n.description&&<p style={{fontSize:13,color:'var(--muted)',lineHeight:1.6,marginBottom:10}}>{n.description}</p>}
              <div className="ic-meta" style={{marginBottom:16}}>By {n.teacher_name} · {fmt(n.created_at)}</div>
              <div style={{display:'flex',gap:8}}>
                <a href={`/uploads/${n.filename}`} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">👁 View PDF</a>
                <a href={`/uploads/${n.filename}`} download className="btn btn-primary btn-sm">⬇ Download</a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
