import React,{useEffect,useState,useCallback} from 'react';
import axios from 'axios';
import {useAuth} from '../../context/AuthContext';
import {Toast,fmt,COURSES,CC} from '../helpers';

export default function TNotes(){
  const {user}=useAuth();
  const [notes,setNotes]=useState([]);
  const [show,setShow]=useState(false);
  const [form,setForm]=useState({title:'',description:'',course:user?.subject!=='All'?user?.subject:''});
  const [file,setFile]=useState(null);
  const [filter,setFilter]=useState('All');
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
    try{
      await axios.post('/api/teacher/notes',fd,{headers:{'Content-Type':'multipart/form-data'}});
      setToast({msg:'✅ Notes uploaded successfully!',type:'ok'});
      setShow(false);
      setForm({title:'',description:'',course:user?.subject!=='All'?user?.subject:''});
      setFile(null); load();
    }catch(e){setToast({msg:e.response?.data?.error||'Upload failed',type:'err'});}
    finally{setUploading(false);}
  };

  const del=async id=>{
    if(!window.confirm('Delete this note?')) return;
    await axios.delete(`/api/teacher/notes/${id}`);
    setToast({msg:'🗑️ Note deleted',type:'ok'}); load();
  };

  const filtered=notes.filter(n=>filter==='All'||n.course===filter);

  return(
    <div className="anim-fade-up">
      {toast&&<Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}

      <div className="ph">
        <div>
          <div className="ph-title">Notes & PDFs 📄</div>
          <div className="ph-sub">Upload study materials for your students</div>
        </div>
        <button className="btn btn-primary" onClick={()=>setShow(true)}>⬆ Upload PDF</button>
      </div>

      <div style={{marginBottom:20}}>
        <select style={{maxWidth:240}} value={filter} onChange={e=>setFilter(e.target.value)}>
          <option value="All">All Courses</option>
          {COURSES.map(c=><option key={c}>{c}</option>)}
        </select>
      </div>

      {filtered.length===0?(
        <div className="empty"><div className="ei">📭</div><p>No notes uploaded yet</p></div>
      ):(
        <div className="items-grid">
          {filtered.map((n,i)=>(
            <div key={n.id} className="ic anim-fade-up" style={{animationDelay:`${i*0.07}s`}}>
              <div className="ic-head">
                <div>
                  <div style={{fontSize:38,marginBottom:8}}>📄</div>
                  <div className="ic-title">{n.title}</div>
                  {n.description&&<div className="ic-meta" style={{marginTop:4}}>{n.description}</div>}
                </div>
                <span className={`badge c-${CC[n.course]||'all'}`}>{n.course}</span>
              </div>
              <div className="ic-meta">By {n.teacher_name} · {fmt(n.created_at)}</div>
              <div className="ic-actions">
                <a href={`/uploads/${n.filename}`} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">👁 View</a>
                <a href={`/uploads/${n.filename}`} download className="btn btn-secondary btn-sm">⬇ Download</a>
                <button className="btn btn-danger btn-sm" onClick={()=>del(n.id)}>🗑 Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {show&&(
        <div className="overlay" onClick={e=>e.target===e.currentTarget&&setShow(false)}>
          <div className="modal">
            <div className="modal-title">Upload Study Notes</div>
            <form onSubmit={upload}>
              <div className="fg"><label>Title</label><input required placeholder="e.g. Chapter 3 – Grammar" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></div>
              <div className="fg"><label>Description (optional)</label><textarea rows={2} placeholder="Brief description of the notes…" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></div>
              <div className="fg">
                <label>Course</label>
                <select required value={form.course} onChange={e=>setForm({...form,course:e.target.value})}>
                  <option value="">Select course…</option>
                  {COURSES.map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="fg">
                <label>PDF File</label>
                <input type="file" accept=".pdf" required onChange={e=>setFile(e.target.files[0])} style={{cursor:'pointer'}}/>
                {file&&<div style={{fontSize:12,color:'var(--green)',marginTop:6,fontWeight:600}}>✅ {file.name}</div>}
              </div>
              <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
                <button type="button" className="btn btn-ghost" onClick={()=>setShow(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={uploading}>{uploading?'⏳ Uploading…':'⬆ Upload'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
