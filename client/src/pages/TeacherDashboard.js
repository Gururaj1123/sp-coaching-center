import React,{useState} from 'react';
import Sidebar from '../components/Sidebar';
import TOverview      from '../components/teacher/TOverview';
import TStudents      from '../components/teacher/TStudents';
import TNotes         from '../components/teacher/TNotes';
import TAnnouncements from '../components/teacher/TAnnouncements';
import TSuggestions   from '../components/teacher/TSuggestions';
import './Dashboard.css';

const NAV=[
  {id:'overview',     icon:'📊', label:'Overview'},
  {id:'students',     icon:'👥', label:'Students'},
  {id:'notes',        icon:'📄', label:'Notes & PDFs'},
  {id:'announcements',icon:'📢', label:'Announcements'},
  {id:'suggestions',  icon:'💬', label:'Student Suggestions'},
];

export default function TeacherDashboard(){
  const [active,setActive]=useState('overview');
  const pages={overview:<TOverview setActive={setActive}/>,students:<TStudents/>,notes:<TNotes/>,announcements:<TAnnouncements/>,suggestions:<TSuggestions/>};
  return(
    <div className="dash">
      <Sidebar active={active} setActive={setActive} nav={NAV}/>
      <main className="dash-main">{pages[active]}</main>
    </div>
  );
}
