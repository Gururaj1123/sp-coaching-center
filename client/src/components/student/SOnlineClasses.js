import React,{useEffect,useState} from 'react';
import axios from 'axios';
import {useAuth} from '../../context/AuthContext';

export default function SOnlineClasses(){
  const {user}=useAuth();
  const [classes,setClasses]=useState([]);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    axios.get('/api/student/online-classes').then(r=>{setClasses(r.data);setLoading(false);});
  },[]);

  if(loading) return <div className="loading-screen" style={{height:'60vh'}}><div className="spinner"/></div>;

  return(
    <div className="anim-fade-up">
      <div className="ph">
        <div>
          <div className="ph-title">Online Classes 🎥</div>
          <div className="ph-sub">Live class links for {user?.course}</div>
        </div>
      </div>

      {classes.length===0?(
        <div className="empty"><div className="ei">🎥</div><p>No online classes scheduled yet. Check back soon!</p></div>
      ):(
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          {classes.map((c,i)=>(
            <div key={c.id} className="ic anim-fade-up" style={{animationDelay:`${i*0.06}s`,borderLeft:'4px solid #0ea5e9'}}>
              <div style={{display:'flex',alignItems:'flex-start',gap:14}}>
                <div style={{fontSize:36,flexShrink:0}}>🎥</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:17,color:'var(--text)',marginBottom:6}}>{c.title}</div>
                  {c.description&&<p style={{fontSize:13,color:'var(--muted)',marginBottom:8,lineHeight:1.6}}>{c.description}</p>}
                  <div style={{fontSize:13,color:'var(--muted)',marginBottom:14}}>
                    📅 {new Date(c.scheduled_at).toLocaleString('en-IN',{dateStyle:'medium',timeStyle:'short'})}
                    &nbsp;·&nbsp; By {c.teacher_name}
                  </div>
                  <a href={c.link} target="_blank" rel="noreferrer"
                    style={{display:'inline-flex',alignItems:'center',gap:8,background:'var(--primary)',color:'#fff',padding:'12px 24px',borderRadius:10,fontWeight:700,fontSize:15,textDecoration:'none',boxShadow:'0 3px 12px rgba(27,79,206,.3)'}}>
                    🔗 Join Online Class
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}