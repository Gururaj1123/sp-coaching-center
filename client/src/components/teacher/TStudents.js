import React,{useEffect,useState,useCallback} from 'react';
import axios from 'axios';
import {useAuth} from '../../context/AuthContext';
import {Toast,fmt,COURSES,CC} from '../helpers';

const EMPTY={name:'',email:'',password:'',course:'',phone:''};

export default function TStudents(){
  const {user}=useAuth();
  const [students,setStudents]=useState([]);
  const [show,setShow]=useState(false);
  const [form,setForm]=useState({...EMPTY,course:user?.subject!=='All'?user?.subject:''});
  const [filter,setFilter]=useState('All');
  const [search,setSearch]=useState('');
  const [toast,setToast]=useState(null);
  const [busy,setBusy]=useState(false);

  const load=useCallback(async()=>{
    const {data}=await axios.get('/api/teacher/students');
    setStudents(data);
  },[]);

  useEffect(()=>{load();},[load]);

  const add=async e=>{
    e.preventDefault(); setBusy(true);
    try{
      await axios.post('/api/teacher/students',form);
      setToast({msg:'✅ Student added successfully!',type:'ok'});
      setShow(false); setForm({...EMPTY,course:user?.subject!=='All'?user?.subject:''});
      load();
    }catch(e){ setToast({msg:e.response?.data?.error||'Failed',type:'err'}); }
    finally{setBusy(false);}
  };

  const del=async id=>{
    if(!window.confirm('Remove this student?')) return;
    await axios.delete(`/api/teacher/students/${id}`);
    setToast({msg:'🗑️ Student removed',type:'ok'}); load();
  };

  const filtered=students.filter(s=>
    (filter==='All'||s.course===filter)&&
    (s.name.toLowerCase().includes(search.toLowerCase())||s.email.toLowerCase().includes(search.toLowerCase()))
  );

  return(
    <div className="anim-fade-up">
      {toast&&<Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}

      <div className="ph">
        <div>
          <div className="ph-title">Students 👥</div>
          <div className="ph-sub">{students.length} enrolled across all courses</div>
        </div>
        <button className="btn btn-primary" onClick={()=>setShow(true)}>+ Add Student</button>
      </div>

      <div style={{display:'flex',gap:12,marginBottom:20,flexWrap:'wrap'}}>
        <input style={{maxWidth:260}} placeholder="🔍 Search by name or email…" value={search} onChange={e=>setSearch(e.target.value)}/>
        <select style={{maxWidth:220}} value={filter} onChange={e=>setFilter(e.target.value)}>
          <option value="All">All Courses</option>
          {COURSES.map(c=><option key={c}>{c}</option>)}
        </select>
      </div>

      <div className="table-wrap">
        {filtered.length===0?(
          <div className="empty"><div className="ei">👤</div><p>No students found</p></div>
        ):(
          <table>
            <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Course</th><th>Phone</th><th>Joined</th><th>Action</th></tr></thead>
            <tbody>
              {filtered.map((s,i)=>(
                <tr key={s.id} className="anim-fade-up" style={{animationDelay:`${i*0.04}s`}}>
                  <td style={{color:'var(--muted)',fontWeight:600}}>{i+1}</td>
                  <td><strong style={{color:'var(--text)'}}>{s.name}</strong></td>
                  <td style={{color:'var(--muted)'}}>{s.email}</td>
                  <td><span className={`badge c-${CC[s.course]||'all'}`}>{s.course}</span></td>
                  <td style={{color:'var(--muted)'}}>{s.phone||'—'}</td>
                  <td style={{color:'var(--muted)'}}>{fmt(s.created_at)}</td>
                  <td><button className="btn btn-danger btn-sm" onClick={()=>del(s.id)}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {show&&(
        <div className="overlay" onClick={e=>e.target===e.currentTarget&&setShow(false)}>
          <div className="modal">
            <div className="modal-title">Add New Student</div>
            <form onSubmit={add}>
              <div className="fg"><label>Full Name</label><input required placeholder="Student full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
              <div className="fg"><label>Email Address</label><input type="email" required placeholder="student@email.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div>
              <div className="fg"><label>Login Password</label><input type="password" required placeholder="Set a password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></div>
              <div className="fg">
                <label>Course</label>
                <select required value={form.course} onChange={e=>setForm({...form,course:e.target.value})}>
                  <option value="">Select course…</option>
                  {COURSES.map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="fg"><label>Phone (optional)</label><input placeholder="Phone number" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></div>
              <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
                <button type="button" className="btn btn-ghost" onClick={()=>setShow(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={busy}>{busy?'Adding…':'Add Student'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
