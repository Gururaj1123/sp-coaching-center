import React,{useEffect,useState,useCallback} from 'react';
import axios from 'axios';
import {useAuth} from '../../context/AuthContext';
import {Toast,fmt,COURSES,CC,SUBJECTS} from '../helpers';

const API = process.env.REACT_APP_API_URL || '';

export default function TNotes(){
  const {user}=useAuth();
  const [notes,setNotes]=useState([]);
  const [show,setShow]=useState(false);
  const [form,setForm]=useState({title:'',description:'',course:user?.subject!=='All'?user?.subject:'',subject:''});
  const [file,setFile]=useState(null);
  const [filterCourse,setFilterCourse]=useState('All');
  const [filterSubject,setFilterSubject]=useState('All');
  const [toast,setToast]=useState(null);
  const [uploading,setUploading]=useState(false);

  const load=useCallback(async()=>{
    const {data}=await axios.get('/api/teacher/notes');
    setNotes(data);
  },[]);
  useEffect(()=>{load();},[load]);

  const upload=async e=>{
    e.preventDefault();
    if(!file){setToast({msg:'Please select a PDF file',type:'err'});return;}
    setUploading(true);
    const fd=new FormData();
    fd.append('pdf',file);
    fd.append('title',form.title);
    fd.append('description',form.description);
    fd.append('course',form.course);
    fd.append('subject',form.subject||'General');
    try{
      await axios.post('/api/teacher/notes',fd,{headers:{'Content-Type':'multipart/form-data'}});
      setToast({msg:'✅ Notes uploaded!',type:'ok'});
      setShow(false);
      setForm({title:'',description:'',course:user?.subject!=='All'?user?.subject:'',subject:''});
      setFile(null);load();
    }catch(e){setToast({msg:e.response?.data?.error||'Upload failed',type:'err'});}
    finally{setUploading(false);}
  };

  const del=async id=>{
    if(!window.confirm('Delete this note?')) return;
    await axios.delete(`/api/teacher/notes/${id}`);
    setToast({msg:'🗑️ Deleted',type:'ok'});load();
  };

  const filtered=notes.filter(n=>{
    const mc=filterCourse==='All'||n.course===filterCourse;
    const ms=filterSubject==='All'||n.subject===filterSubject;
    return mc&&ms;
  });

  const grouped={};
  filtered.forEach(n=>{
    const s=n.subject||'General';
    if(!grouped[s]) grouped[s]=[];
    grouped[s].push(n);
  });

  return(
    <div className="anim-fade-up">
      {toast&&<Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
      <div className="ph">
        <div>
          <div className="ph-title">Notes & PDFs 📄</div>
          <div className="ph-sub">Upload subject-wise study materials</div>
        </div>
        <button className="btn btn-primary" onClick={()=>setShow(true)}>⬆ Upload PDF</button>
      </div>

      <div style={{display:'flex',gap:10,marginBottom:20,flexWrap:'wrap'}}>
        <select style={{maxWidth:220}} value={filterCourse} onChange={e=>{setFilterCourse(e.target.value);setFilterSubject('All');}}>
          <option value="All">All Courses</option>
          {COURSES.map(c=><option key={c}>{c}</option>)}
        </select>
        {filterCourse!=='All'&&(
          <select style={{maxWidth:200}} value={filterSubject} onChange={e=>setFilterSubject(e.target.value)}>
            <option value="All">All Subjects</option>
            {(SUBJECTS[filterCourse]||[]).map(s=><option key={s}>{s}</option>)}
          </select>
        )}
      </div>

      {filtered.length===0?(
        <div className="empty"><div className="ei">📭</div><p>No notes uploaded yet</p></div>
      ):(
        Object.entries(grouped).map(([subject,items])=>(
          <div key={subject} style={{marginBottom:28}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
              <div style={{background:'var(--primary)',color:'#fff',padding:'4px 14px',borderRadius:100,fontSize:12,fontWeight:700}}>{subject}</div>
              <div style={{fontSize:12,color:'var(--muted)'}}>{items.length} file{items.length!==1?'s':''}</div>
            </div>
            <div className="items-grid">
              {items.map((n,i)=>(
                <div key={n.id} className="ic anim-fade-up" style={{animationDelay:`${i*0.06}s`}}>
                  <div className="ic-head">
                    <div>
                      <div style={{fontSize:36,marginBottom:8}}>📄</div>
                      <div className="ic-title">{n.title}</div>
                      {n.description&&<div className="ic-meta" style={{marginTop:4}}>{n.description}</div>}
                    </div>
                    <span className={`badge c-${CC[n.course]||'all'}`}>{n.course}</span>
                  </div>
                  <div className="ic-meta">By {n.teacher_name} · {fmt(n.created_at)}</div>
                  <div className="ic-actions">
                    <a href={`${API}/uploads/${n.filename}`} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">👁 View PDF</a>
                    <a href={`${API}/uploads/${n.filename}`} download={n.title+'.pdf'} className="btn btn-primary btn-sm">⬇ Download</a>
                    <button className="btn btn-danger btn-sm" onClick={()=>del(n.id)}>🗑</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {show&&(
        <div className="overlay" onClick={e=>e.target===e.currentTarget&&setShow(false)}>
          <div className="modal">
            <div className="modal-title">Upload Study Notes</div>
            <form onSubmit={upload}>
              <div className="fg"><label>Title</label><input required placeholder="e.g. Chapter 3 – Algebra" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></div>
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
              <div className="fg"><label>Description (optional)</label><textarea rows={2} placeholder="Brief description…" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></div>
              <div className="fg">
                <label>PDF File</label>
                <input type="file" accept=".pdf" required onChange={e=>setFile(e.target.files[0])} style={{cursor:'pointer'}}/>
                {file&&<div style={{fontSize:12,color:'var(--green)',marginTop:6,fontWeight:600}}>✅ {file.name}</div>}
              </div>
              <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
                <button type="button" className="btn btn-ghost" onClick={()=>setShow(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={uploading}>{uploading?'⏳ Uploading…':'⬆ Upload PDF'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}