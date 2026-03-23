import React,{useEffect,useState} from 'react';
import axios from 'axios';
import {useAuth} from '../../context/AuthContext';
import {fmtTime,CC} from '../helpers';

export default function SAnnouncements(){
  const {user}=useAuth();
  const [anns,setAnns]=useState([]);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    axios.get('/api/student/announcements').then(r=>{setAnns(r.data);setLoading(false);});
  },[]);

  if(loading) return <div className="loading-screen" style={{height:'60vh'}}><div className="spinner"/></div>;

  return(
    <div className="anim-fade-up">
      <div className="ph">
        <div>
          <div className="ph-title">Announcements 📢</div>
          <div className="ph-sub">Updates from your teachers for {user?.course}</div>
        </div>
      </div>

      {anns.length===0?(
        <div className="empty"><div className="ei">📭</div><p>No announcements for your course yet</p></div>
      ):(
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          {anns.map((a,i)=>(
            <div key={a.id} className={`an-card ${a.priority==='high'?'an-high':''} anim-fade-up`} style={{animationDelay:`${i*0.05}s`}}>
              <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:12}}>
                <div style={{flex:1}}>
                  <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8,flexWrap:'wrap'}}>
                    <span style={{fontSize:22}}>{a.priority==='high'?'🔴':'🔵'}</span>
                    <strong style={{fontSize:17,color:'var(--text)'}}>{a.title}</strong>
                    {a.priority==='high'&&<span className="badge p-high">Urgent</span>}
                  </div>
                  <p style={{fontSize:15,color:'var(--text2)',lineHeight:1.75}}>{a.message}</p>
                  <div className="ic-meta" style={{marginTop:10}}>
                    📌 Posted by {a.poster} · {fmtTime(a.created_at)}
                  </div>
                </div>
                <span className={`badge c-${CC[a.course]||'all'}`}>{a.course}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
