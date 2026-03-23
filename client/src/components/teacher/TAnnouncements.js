import React,{useEffect,useState,useCallback} from 'react';
import axios from 'axios';
import {useAuth} from '../../context/AuthContext';
import {Toast,fmtTime,COURSES,CC} from '../helpers';

const TEMPLATES=[
  {label:'📅 Class Today',text:'Class is scheduled for today. Please be on time and bring your notebooks.'},
  {label:'❌ Class Cancelled',text:'Today\'s class is cancelled. The next class will be informed separately.'},
  {label:'📝 Test Tomorrow',text:'There is a test scheduled for tomorrow. Please revise all chapters covered so far.'},
  {label:'🏖️ Holiday Notice',text:'There will be no class tomorrow due to a holiday. Classes will resume from the next scheduled day.'},
  {label:'📚 Bring Materials',text:'Please bring your textbooks, notes, and stationery to the next class.'},
  {label:'🕐 Timing Change',text:'Class timings have been changed. Updated schedule will be shared shortly.'},
];

export default function TAnnouncements(){
  const {user}=useAuth();
  const [anns,setAnns]=useState([]);
  const [show,setShow]=useState(false);
  const [form,setForm]=useState({title:'',message:'',course:user?.subject!=='All'?user?.subject:'All',priority:'normal'});
  const [filter,setFilter]=useState('All');
  const [toast,setToast]=useState(null);

  const load=useCallback(async()=>{
    const {data}=await axios.get('/api/teacher/announcements');
    setAnns(data);
  },[]);
  useEffect(()=>{load();},[load]);

  const post=async e=>{
    e.preventDefault();
    try{
      await axios.post('/api/teacher/announcements',form);
      setToast({msg:'📢 Announcement posted!',type:'ok'});
      setShow(false);
      setForm({title:'',message:'',course:user?.subject!=='All'?user?.subject:'All',priority:'normal'});
      load();
    }catch{setToast({msg:'Failed to post',type:'err'});}
  };

  const del=async id=>{
    if(!window.confirm('Delete this announcement?')) return;
    await axios.delete(`/api/teacher/announcements/${id}`);
    setToast({msg:'🗑️ Deleted',type:'ok'}); load();
  };

  const filtered=anns.filter(a=>filter==='All'||a.course===filter||a.course==='All');

  return(
    <div className="anim-fade-up">
      {toast&&<Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}

      <div className="ph">
        <div>
          <div className="ph-title">Announcements 📢</div>
          <div className="ph-sub">Post updates, schedule notices and class information</div>
        </div>
        <button className="btn btn-primary" onClick={()=>setShow(true)}>+ New Announcement</button>
      </div>

      <div style={{marginBottom:20}}>
        <select style={{maxWidth:240}} value={filter} onChange={e=>setFilter(e.target.value)}>
          <option value="All">All Courses</option>
          {COURSES.map(c=><option key={c}>{c}</option>)}
        </select>
      </div>

      {filtered.length===0?(
        <div className="empty"><div className="ei">📭</div><p>No announcements yet</p></div>
      ):(
        <div>
          {filtered.map((a,i)=>(
            <div key={a.id} className={`an-card ${a.priority==='high'?'an-high':''} ${a.role==='student'?'an-student':''} anim-fade-up`} style={{animationDelay:`${i*0.05}s`}}>
              <div className="ic-head">
                <div style={{flex:1}}>
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6,flexWrap:'wrap'}}>
                    <span style={{fontSize:18}}>{a.priority==='high'?'🔴':'🔵'}</span>
                    <strong style={{fontSize:16,color:'var(--text)'}}>{a.title}</strong>
                    {a.role==='student'&&<span style={{fontSize:11,background:'#e8f1fb',color:'var(--primary)',padding:'2px 8px',borderRadius:100,fontWeight:700}}>FROM STUDENT</span>}
                    {a.priority==='high'&&<span className="badge p-high">Urgent</span>}
                  </div>
                  <p style={{fontSize:14,color:'var(--text2)',lineHeight:1.65}}>{a.message}</p>
                  <div className="ic-meta" style={{marginTop:8}}>
                    Posted by {a.poster||a.student_name} · {fmtTime(a.created_at)}
                  </div>
                </div>
                <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:8}}>
                  <span className={`badge c-${CC[a.course]||'all'}`}>{a.course}</span>
                  {a.role!=='student'&&<button className="btn btn-danger btn-sm" onClick={()=>del(a.id)}>🗑</button>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {show&&(
        <div className="overlay" onClick={e=>e.target===e.currentTarget&&setShow(false)}>
          <div className="modal">
            <div className="modal-title">New Announcement</div>

            <div style={{marginBottom:18}}>
              <label style={{marginBottom:8}}>Quick Templates</label>
              <div style={{display:'flex',flexWrap:'wrap',gap:7}}>
                {TEMPLATES.map(t=>(
                  <button key={t.label} type="button"
                    style={{padding:'6px 12px',borderRadius:8,border:'1.5px solid var(--border)',background:'var(--bg)',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'Plus Jakarta Sans,sans-serif',color:'var(--text2)',transition:'all .15s'}}
                    onMouseOver={e=>{e.target.style.background='var(--primary-l)';e.target.style.borderColor='var(--primary)';}}
                    onMouseOut={e=>{e.target.style.background='var(--bg)';e.target.style.borderColor='var(--border)';}}
                    onClick={()=>setForm({...form,title:t.label.replace(/[^\w\s]/gi,'').trim(),message:t.text})}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={post}>
              <div className="fg"><label>Title</label><input required placeholder="Announcement title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></div>
              <div className="fg"><label>Message</label><textarea rows={4} required placeholder="Write your announcement…" value={form.message} onChange={e=>setForm({...form,message:e.target.value})}/></div>
              <div className="fg-row">
                <div className="fg">
                  <label>Course</label>
                  <select value={form.course} onChange={e=>setForm({...form,course:e.target.value})}>
                    <option value="All">All Courses</option>
                    {COURSES.map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="fg">
                  <label>Priority</label>
                  <select value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}>
                    <option value="normal">🔵 Normal</option>
                    <option value="high">🔴 High Priority</option>
                  </select>
                </div>
              </div>
              <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
                <button type="button" className="btn btn-ghost" onClick={()=>setShow(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">📢 Post Announcement</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
