import React,{useEffect,useState,useCallback} from 'react';
import axios from 'axios';
import {useAuth} from '../../context/AuthContext';
import {Toast,fmt,COURSES,CC,SUBJECTS} from '../helpers';

export default function THomework(){
  const {user}=useAuth();
  const [hw,setHw]=useState([]);
  const [show,setShow]=useState(false);
  const [form,setForm]=useState({title:'',description:'',course:user?.subject!=='All'?user?.subject:'',subject:'',due_date:''});
  const [filter,setFilter]=useState('All');
  const [toast,setToast]=useState(null);

  const load=useCallback(async()=>{
    const {data}=await axios.get('/api/teacher/homework');
    setHw(data);
  },[]);
  useEffect(()=>{load();},[load]);

  const post=async e=>{
    e.preventDefault();
    try{
      await axios.post('/api/teacher/homework',form);
      setToast({msg:'✅ Homework assigned!',type:'ok'});
      setShow(false);
      setForm({title:'',description:'',course:user?.subject!=='All'?user?.subject:'',subject:'',due_date:''});
      load();
    }catch(e){setToast({msg:e.response?.data?.error||'Failed',type:'err'});}
  };

  const del=async id=>{
    if(!window.confirm('Delete this homework?')) return;
    await axios.delete(`/api/teacher/homework/${id}`);
    setToast({msg:'🗑️ Deleted',type:'ok'});load();
  };

  const isOverdue=d=>new Date(d)<new Date();
  const filtered=hw.filter(h=>filter==='All'||h.course===filter);

  return(
    <div className="anim-fade-up">
      {toast&&<Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
      <div className="ph">
        <div>
          <div className="ph-title">Homework 📝</div>
          <div className="ph-sub">Assign homework by course and subject</div>
        </div>
        <button className="btn btn-primary" onClick={()=>setShow(true)}>+ Assign Homework</button>
      </div>

      <div style={{marginBottom:20}}>
        <select style={{maxWidth:240}} value={filter} onChange={e=>setFilter(e.target.value)}>
          <option value="All">All Courses</option>
          {COURSES.map(c=><option key={c}>{c}</option>)}
        </select>
      </div>

      {filtered.length===0?(
        <div className="empty"><div className="ei">📝</div><p>No homework assigned yet</p></div>
      ):(
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          {filtered.map((h,i)=>{
            const over=isOverdue(h.due_date);
            return(
              <div key={h.id} className="ic anim-fade-up" style={{animationDelay:`${i*0.05}s`,borderLeft:`4px solid ${over?'var(--red)':'var(--green)'}`}}>
                <div className="ic-head">
                  <div style={{flex:1}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6,flexWrap:'wrap'}}>
                      <span style={{fontSize:20}}>📝</span>
                      <strong style={{fontSize:15,color:'var(--text)'}}>{h.title}</strong>
                      <span className={`badge c-${CC[h.course]||'all'}`}>{h.course}</span>
                      <span style={{fontSize:11,background:'var(--surface2)',padding:'2px 8px',borderRadius:100,fontWeight:700,color:'var(--muted)'}}>{h.subject}</span>
                    </div>
                    <p style={{fontSize:14,color:'var(--text2)',lineHeight:1.65,marginBottom:8}}>{h.description}</p>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <span style={{fontSize:13,fontWeight:700,color:over?'var(--red)':'var(--green)'}}>
                        {over?'⚠️ Overdue:':'📅 Due:'} {fmt(h.due_date)}
                      </span>
                      <span style={{fontSize:12,color:'var(--muted)'}}>· By {h.teacher_name}</span>
                    </div>
                  </div>
                  <button className="btn btn-danger btn-sm" onClick={()=>del(h.id)}>🗑</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {show&&(
        <div className="overlay" onClick={e=>e.target===e.currentTarget&&setShow(false)}>
          <div className="modal">
            <div className="modal-title">Assign Homework 📝</div>
            <form onSubmit={post}>
              <div className="fg"><label>Title</label><input required placeholder="e.g. Practice Exercise 3" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></div>
              <div className="fg-row">
                <div className="fg">
                  <label>Course</label>
                  <select required value={form.course} onChange={e=>setForm({...form,course:e.target.value,subject:''})}>
                    <option value="">Select course…</option>
                    {COURSES.map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="fg">
                  <label>Subject</label>
                  <select value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})}>
                    <option value="">Select subject…</option>
                    {(SUBJECTS[form.course]||['General']).map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="fg"><label>Due Date</label><input type="date" required value={form.due_date} onChange={e=>setForm({...form,due_date:e.target.value})}/></div>
              <div className="fg"><label>Instructions</label><textarea rows={4} required placeholder="Write the homework instructions here…" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></div>
              <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
                <button type="button" className="btn btn-ghost" onClick={()=>setShow(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">📝 Assign Homework</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}