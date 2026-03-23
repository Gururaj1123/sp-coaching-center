import React,{useEffect,useState,useCallback} from 'react';
import axios from 'axios';
import {useAuth} from '../../context/AuthContext';
import {Toast,fmtTime,SUGGESTION_TYPES} from '../helpers';

const QUICK=[
  {icon:'📅',label:'Today\'s Class?',type:'Class Schedule - Today',msg:'Can you please confirm if class is scheduled for today and what time?'},
  {icon:'❌',label:'Class Cancelled?',type:'Class Cancelled Today',msg:'Is today\'s class cancelled? Please let us know.'},
  {icon:'➕',label:'Extra Class',type:'Request Extra Class',msg:'Can we have an extra class to cover the remaining portions?'},
  {icon:'📚',label:'Need Notes',type:'Study Material Needed',msg:'Please upload study notes for the recent topics covered in class.'},
  {icon:'📝',label:'Exam Date?',type:'Exam Date Query',msg:'Can you please share the upcoming exam schedule?'},
  {icon:'🕐',label:'Timing?',type:'Class Timing Change',msg:'Has there been any change in the class timings? Please confirm.'},
];

export default function SSuggestions(){
  const {user}=useAuth();
  const [sugs,setSugs]=useState([]);
  const [show,setShow]=useState(false);
  const [form,setForm]=useState({type:'',msg:''});
  const [toast,setToast]=useState(null);
  const [busy,setBusy]=useState(false);

  const load=useCallback(async()=>{
    const {data}=await axios.get('/api/student/suggestions');
    setSugs(data);
  },[]);
  useEffect(()=>{load();},[load]);

  const send=async e=>{
    e.preventDefault(); setBusy(true);
    try{
      await axios.post('/api/student/suggestions',{type:form.type,message:form.msg});
      setToast({msg:'✅ Suggestion sent to your teacher!',type:'ok'});
      setShow(false); setForm({type:'',msg:''}); load();
    }catch(e){setToast({msg:e.response?.data?.error||'Failed to send',type:'err'});}
    finally{setBusy(false);}
  };

  const typeIcon={'Class Schedule - Today':'📅','Class Cancelled Today':'❌','Request Extra Class':'➕','Holiday Information':'🏖️','Study Material Needed':'📚','Exam Date Query':'📝','Class Timing Change':'🕐','General Suggestion':'💡'};

  return(
    <div className="anim-fade-up">
      {toast&&<Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}

      <div className="ph">
        <div>
          <div className="ph-title">My Suggestions 💬</div>
          <div className="ph-sub">Send queries and suggestions to your teacher</div>
        </div>
        <button className="btn btn-primary" onClick={()=>setShow(true)}>+ New Suggestion</button>
      </div>

      {/* QUICK SEND */}
      <div style={{background:'#fff',border:'1.5px solid var(--border)',borderRadius:'var(--r-lg)',padding:22,marginBottom:24,boxShadow:'var(--shadow-s)'}}>
        <div style={{fontWeight:700,fontSize:15,color:'var(--text)',marginBottom:5}}>⚡ Quick Suggestions</div>
        <div style={{fontSize:13,color:'var(--muted)',marginBottom:14}}>Tap any button below to quickly inform your teacher:</div>
        <div style={{display:'flex',flexWrap:'wrap',gap:10}}>
          {QUICK.map(q=>(
            <button key={q.label}
              style={{display:'flex',alignItems:'center',gap:7,padding:'9px 16px',borderRadius:10,border:'1.5px solid var(--border)',background:'var(--bg)',fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:'Plus Jakarta Sans,sans-serif',color:'var(--text2)',transition:'all .15s'}}
              onMouseOver={e=>{e.currentTarget.style.background='var(--primary-l)';e.currentTarget.style.borderColor='var(--primary)';e.currentTarget.style.color='var(--primary)';}}
              onMouseOut={e=>{e.currentTarget.style.background='var(--bg)';e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.color='var(--text2)';}}
              onClick={()=>{ setForm({type:q.type,msg:q.msg}); setShow(true); }}>
              <span style={{fontSize:18}}>{q.icon}</span> {q.label}
            </button>
          ))}
        </div>
      </div>

      {/* HISTORY */}
      {sugs.length===0?(
        <div className="empty"><div className="ei">💬</div><p>You have not sent any suggestions yet</p></div>
      ):(
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          {sugs.map((s,i)=>(
            <div key={s.id} className="ic anim-fade-up" style={{animationDelay:`${i*0.05}s`,borderLeft:`4px solid ${s.status==='pending'?'var(--amber)':'var(--green)'}`}}>
              <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:12,marginBottom:10}}>
                <div style={{display:'flex',gap:10,alignItems:'center'}}>
                  <span style={{fontSize:24}}>{typeIcon[s.type]||'💬'}</span>
                  <div>
                    <div style={{fontWeight:700,fontSize:14,color:'var(--text)'}}>{s.type}</div>
                    <div style={{fontSize:12,color:'var(--muted)',marginTop:2}}>{fmtTime(s.created_at)}</div>
                  </div>
                </div>
                <span className={s.status==='pending'?'badge s-pend':'badge s-rep'}>{s.status==='pending'?'⏳ Pending':'✅ Replied'}</span>
              </div>

              <div style={{background:'var(--bg)',border:'1.5px solid var(--border)',borderRadius:10,padding:'10px 14px',marginBottom:10}}>
                <p style={{fontSize:14,color:'var(--text2)',lineHeight:1.65}}>{s.message}</p>
              </div>

              {s.teacher_reply&&(
                <div style={{background:'var(--primary-l)',border:'1.5px solid rgba(27,79,206,.2)',borderRadius:10,padding:'10px 14px'}}>
                  <div style={{fontSize:12,fontWeight:700,color:'var(--primary)',marginBottom:4}}>👩‍🏫 Teacher's Reply:</div>
                  <p style={{fontSize:14,color:'var(--text2)',lineHeight:1.65}}>{s.teacher_reply}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {show&&(
        <div className="overlay" onClick={e=>e.target===e.currentTarget&&setShow(false)}>
          <div className="modal">
            <div className="modal-title">Send a Suggestion</div>
            <div style={{background:'var(--primary-l)',border:'1.5px solid rgba(27,79,206,.2)',borderRadius:10,padding:'12px 14px',marginBottom:20,fontSize:13,color:'var(--primary)',fontWeight:500}}>
              💡 Use this to inform your teacher about class queries, schedule questions, material requests, and more.
            </div>
            <form onSubmit={send}>
              <div className="fg">
                <label>Suggestion Type</label>
                <select required value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
                  <option value="">Select type…</option>
                  {SUGGESTION_TYPES.map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="fg">
                <label>Your Message</label>
                <textarea rows={4} required placeholder="e.g. Is today's class at 5pm? Please confirm the timing…" value={form.msg} onChange={e=>setForm({...form,msg:e.target.value})}/>
              </div>
              <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
                <button type="button" className="btn btn-ghost" onClick={()=>setShow(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={busy}>{busy?'Sending…':'Send Suggestion ✉️'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
