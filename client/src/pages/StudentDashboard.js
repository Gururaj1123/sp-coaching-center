import React,{useState} from 'react';
import Sidebar from '../components/Sidebar';
import SOverview      from '../components/student/SOverview';
import SNotes         from '../components/student/SNotes';
import SAnnouncements from '../components/student/SAnnouncements';
import SSuggestions   from '../components/student/SSuggestions';
import './Dashboard.css';

const NAV=[
  {id:'overview',     icon:'🏠', label:'Home'},
  {id:'announcements',icon:'📢', label:'Announcements'},
  {id:'notes',        icon:'📄', label:'Study Notes'},
  {id:'suggestions',  icon:'💬', label:'My Suggestions'},
];

export default function StudentDashboard(){
  const [active,setActive]=useState('overview');
  const pages={overview:<SOverview setActive={setActive}/>,announcements:<SAnnouncements/>,notes:<SNotes/>,suggestions:<SSuggestions/>};
  return(
    <div className="dash">
      <Sidebar active={active} setActive={setActive} nav={NAV}/>
      <main className="dash-main">{pages[active]}</main>
    </div>
  );
}
