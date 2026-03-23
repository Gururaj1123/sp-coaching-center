import React from 'react';
import {useAuth} from '../context/AuthContext';
import {useNavigate} from 'react-router-dom';
import './Sidebar.css';

const CC={'SSLC Kannada':'sslc','CBSE Kannada':'cbse','Spoken English':'eng','Competitive Prep':'comp','All':'all'};

export default function Sidebar({active,setActive,nav}){
  const {user,logout} = useAuth();
  const navigate = useNavigate();
  const ck = CC[user?.subject||user?.course]||'all';

  return(
    <aside className="sb">
      <div className="sb-brand" onClick={()=>navigate('/')}>
        <div className="sb-logo">SP</div>
        <div>
          <div className="sb-name">SP Coaching</div>
          <div className="sb-place">S.N Nagar, Sagara</div>
        </div>
      </div>

      <div className="sb-user">
        <div className={`sb-av sb-av-${ck}`}>{user?.name?.charAt(0).toUpperCase()}</div>
        <div className="sb-ui">
          <div className="sb-uname">{user?.name}</div>
          <span className={`badge c-${ck}`}>
            {user?.role==='teacher'?(user?.subject||'Teacher'):user?.course}
          </span>
          <div className="sb-urole">{user?.role==='teacher'?'Teacher':'Student'}</div>
        </div>
      </div>

      <nav className="sb-nav">
        {nav.map(item=>(
          <button key={item.id} className={`sb-item ${active===item.id?'sb-active':''}`} onClick={()=>setActive(item.id)}>
            <span className="sb-ico">{item.icon}</span>
            <span>{item.label}</span>
            {item.badge&&<span className="sb-badge">{item.badge}</span>}
          </button>
        ))}
      </nav>

      <div className="sb-foot">
        <button className="sb-logout" onClick={()=>{logout();navigate('/');}}>
          🚪 Sign Out
        </button>
      </div>
    </aside>
  );
}
