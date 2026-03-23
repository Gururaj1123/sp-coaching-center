import React,{useState} from 'react';
import Sidebar        from '../components/Sidebar';
import MobileNav      from '../components/MobileNav';
import SOverview      from '../components/student/SOverview';
import SNotes         from '../components/student/SNotes';
import SAnnouncements from '../components/student/SAnnouncements';
import SSuggestions   from '../components/student/SSuggestions';
import SOnlineClasses from '../components/student/SOnlineClasses';
import SHomework      from '../components/student/SHomework';
import './Dashboard.css';

const NAV=[
  {id:'overview',      icon:'🏠', label:'Home'},
  {id:'announcements', icon:'📢', label:'Notices'},
  {id:'notes',         icon:'📄', label:'Notes'},
  {id:'online',        icon:'🎥', label:'Online'},
  {id:'homework',      icon:'📝', label:'Homework'},
  {id:'suggestions',   icon:'💬', label:'Suggest'},
];

export default function StudentDashboard(){
  const [active,setActive]=useState('overview');
  const pages={
    overview:     <SOverview setActive={setActive}/>,
    announcements:<SAnnouncements/>,
    notes:        <SNotes/>,
    online:       <SOnlineClasses/>,
    homework:     <SHomework/>,
    suggestions:  <SSuggestions/>,
  };
  return(
    <div className="dash">
      <Sidebar active={active} setActive={setActive} nav={NAV}/>
      <main className="dash-main">{pages[active]}</main>
      <MobileNav active={active} setActive={setActive} nav={NAV}/>
    </div>
  );
}