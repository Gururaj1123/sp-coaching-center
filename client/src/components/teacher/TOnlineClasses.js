import React,{useEffect,useState,useCallback} from 'react';
import axios from 'axios';
import {useAuth} from '../../context/AuthContext';
import {Toast,COURSES,CC} from '../helpers';

export default function TOnlineClasses(){
  const {user}=useAuth();
  const [classes,setClasses]=useState([]);
  const [show,setShow]=useState(false);
  const [form,setForm]=useState({title:'',course:user?.subject!=='All'?user?.subject:'',link:'',scheduled_at:'',description:''});
  const [toast,setToast]=useState(null);

  const load=useCallback(async()=>{
    const {data}=await axios.get('/api/teacher/online-classes');
    setClasses(data);
  },[]);
  useEffect(()=>{load();},[load]);

  const post=async e=>{
    e.preventDefault();
    try{
      await axios.post('/api/teacher/online-classes',form);
      setToast({msg:'✅ Online class posted!',type:'ok'});
      setShow(false);
      setForm({title:'',course:user?.subject!=='All'?user?.subject:'',link:'',scheduled_at:'',description:''});
      load();
    }catch(e){setToast({msg:e.response?.data?.error||'Failed',type:'err'});}
  };

  const del=async id=>{
    if(!window.confirm('Delete this class?')) return;
    await axios.delete(`/api/teacher/online-classes/${id}`);
    setToast({msg:'🗑️ Deleted',type:'ok'});load();
  };

  return(
    <div className="anim-fade-up">
      {toast&&<Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
      <div className="ph">
        <div>
          <div className="ph-title">Online Classes 🎥</div>
          <div className="ph-sub">Post Google Meet / Zoom links for students</div>
        </div>
        <button className="btn btn-primary" onClick={()=>setShow(true)}>+ Add Class Link</button>
      </div>

      {classes.length===0?(
        <div className="empty"><div className="ei">🎥</div><p>No online classes posted yet</p></div>
      ):(
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          {classes.map((c,i)=>(
            <div key={c.id} className="ic anim-fade-up" style={{animationDelay:`${i*0.05}s`,borderLeft:'4px solid #0ea5e9'}}>
              <div className="ic-head">
                <div style={{flex:1}}>
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6,flexWrap:'wrap'}}>
                    <span style={{fontSize:22}}>🎥</span>
                    <strong style={{fontSize:16,color:'var(--text)'}}>{c.title}</strong>
                    <span className={`badge c-${CC[c.course]||'all'}`}>{c.course}</span>
                  </div>
                  {c.description&&<p style={{fontSize:13,color:'var(--muted)',marginBottom:8}}>{c.description}</p>}
                  <div style={{fontSize:13,color:'var(--muted)',marginBottom:12}}>
                    📅 {new Date(c.scheduled_at).toLocaleString('en-IN',{dateStyle:'medium',timeStyle:'short'})} · By {c.teacher_name}
                  </div>
                  <a href={c.link} target="_blank" rel="noreferrer"
                    style={{display:'inline-flex',alignItems:'center',gap:6,background:'var(--primary)',color:'#fff',padding:'8px 16px',borderRadius:9,fontWeight:700,fontSize:13,textDecoration:'none'}}>
                    🔗 Join Class Now
                  </a>
                </div>
                <button className="btn btn-danger btn-sm" onClick={()=>del(c.id)}>🗑</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {show&&(
        <div className="overlay" onClick={e=>e.target===e.currentTarget&&setShow(false)}>
          <div className="modal">
            <div className="modal-title">Add Online Class Link 🎥</div>
            <form onSubmit={post}>
              <div className="fg"><label>Class Title</label><input required placeholder="e.g. Maths – Chapter 5 Live Class" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></div>
              <div className="fg-row">
                <div className="fg">
                  <label>Course</label>
                  <select required value={form.course} onChange={e=>setForm({...form,course:e.target.value})}>
                    <option value="">Select course…</option>
                    {COURSES.map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="fg">
                  <label>Date & Time</label>
                  <input type="datetime-local" required value={form.scheduled_at} onChange={e=>setForm({...form,scheduled_at:e.target.value})}/>
                </div>
              </div>
              <div className="fg">
                <label>Google Meet / Zoom / YouTube Link</label>
                <input required placeholder="https://meet.google.com/xxx-xxxx-xxx" value={form.link} onChange={e=>setForm({...form,link:e.target.value})}/>
              </div>
              <div className="fg"><label>Description (optional)</label><textarea rows={2} placeholder="Additional instructions…" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></div>
              <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
                <button type="button" className="btn btn-ghost" onClick={()=>setShow(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">🎥 Post Class Link</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}