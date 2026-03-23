import React,{useEffect,useState,useCallback} from 'react';
import axios from 'axios';
import {Toast,fmtTime,CC} from '../helpers';

export default function TSuggestions(){
  const [sugs,setSugs]=useState([]);
  const [filter,setFilter]=useState('all');
  const [reply,setReply]=useState({});
  const [replyText,setReplyText]=useState({});
  const [toast,setToast]=useState(null);

  const load=useCallback(async()=>{
    const {data}=await axios.get('/api/teacher/suggestions');
    setSugs(data);
  },[]);
  useEffect(()=>{load();},[load]);

  const doReply=async(id)=>{
    const txt=replyText[id];
    if(!txt?.trim()){setToast({msg:'Please type a reply',type:'err'});return;}
    try{
      await axios.put(`/api/teacher/suggestions/${id}`,{status:'replied',reply:txt});
      setToast({msg:'✅ Reply sent!',type:'ok'});
      setReply(r=>({...r,[id]:false}));
      setReplyText(r=>({...r,[id]:''}));
      load();
    }catch{setToast({msg:'Failed to send reply',type:'err'});}
  };

  const filtered=sugs.filter(s=>filter==='all'||(filter==='pending'&&s.status==='pending')||(filter==='replied'&&s.status==='replied'));

  const typeIcon={'Class Schedule - Today':'📅','Class Cancelled Today':'❌','Request Extra Class':'➕','Holiday Information':'🏖️','Study Material Needed':'📚','Exam Date Query':'📝','Class Timing Change':'🕐','General Suggestion':'💡'};

  return(
    <div className="anim-fade-up">
      {toast&&<Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}

      <div className="ph">
        <div>
          <div className="ph-title">Student Suggestions 💬</div>
          <div className="ph-sub">{sugs.filter(s=>s.status==='pending').length} pending · {sugs.filter(s=>s.status==='replied').length} replied</div>
        </div>
      </div>

      <div style={{display:'flex',gap:8,marginBottom:22}}>
        {['all','pending','replied'].map(f=>(
          <button key={f} className={`btn btn-sm ${filter===f?'btn-primary':'btn-ghost'}`} onClick={()=>setFilter(f)}>
            {f==='all'?'All':f==='pending'?'⏳ Pending':'✅ Replied'}
          </button>
        ))}
      </div>

      {filtered.length===0?(
        <div className="empty"><div className="ei">💬</div><p>No suggestions in this category</p></div>
      ):(
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          {filtered.map((s,i)=>(
            <div key={s.id} className={`ic anim-fade-up`} style={{animationDelay:`${i*0.05}s`,borderLeft:`4px solid ${s.status==='pending'?'var(--amber)':'var(--green)'}`}}>
              <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:12,marginBottom:10}}>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <div style={{fontSize:26}}>{typeIcon[s.type]||'💬'}</div>
                  <div>
                    <div style={{fontWeight:700,fontSize:15,color:'var(--text)'}}>{s.student_name}</div>
                    <div style={{fontSize:12,color:'var(--muted)',marginTop:2}}>{s.course}</div>
                  </div>
                </div>
                <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:6}}>
                  <span className={s.status==='pending'?'badge s-pend':'badge s-rep'}>{s.status==='pending'?'Pending':'Replied'}</span>
                  <span style={{fontSize:11,color:'var(--muted)'}}>{fmtTime(s.created_at)}</span>
                </div>
              </div>

              <div style={{background:'var(--bg)',border:'1.5px solid var(--border)',borderRadius:10,padding:'12px 14px',marginBottom:12}}>
                <div style={{fontSize:12,fontWeight:700,color:'var(--primary)',marginBottom:5,textTransform:'uppercase',letterSpacing:.5}}>{s.type}</div>
                <p style={{fontSize:14,color:'var(--text2)',lineHeight:1.65}}>{s.message}</p>
              </div>

              {s.teacher_reply&&(
                <div style={{background:' var(--primary-l)',border:'1.5px solid rgba(27,79,206,.2)',borderRadius:10,padding:'12px 14px',marginBottom:12}}>
                  <div style={{fontSize:12,fontWeight:700,color:'var(--primary)',marginBottom:5}}>✅ Your Reply:</div>
                  <p style={{fontSize:14,color:'var(--text2)',lineHeight:1.65}}>{s.teacher_reply}</p>
                </div>
              )}

              {s.status==='pending'&&(
                reply[s.id]?(
                  <div>
                    <textarea rows={3} placeholder="Type your reply to the student…" value={replyText[s.id]||''} onChange={e=>setReplyText(r=>({...r,[s.id]:e.target.value}))} style={{marginBottom:8}}/>
                    <div style={{display:'flex',gap:8}}>
                      <button className="btn btn-primary btn-sm" onClick={()=>doReply(s.id)}>Send Reply ✉️</button>
                      <button className="btn btn-ghost btn-sm" onClick={()=>setReply(r=>({...r,[s.id]:false}))}>Cancel</button>
                    </div>
                  </div>
                ):(
                  <button className="btn btn-secondary btn-sm" onClick={()=>setReply(r=>({...r,[s.id]:true}))}>💬 Reply to Student</button>
                )
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
