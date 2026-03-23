import React, { useState } from 'react';
import Sidebar   from '../components/Sidebar';
import MobileNav from '../components/MobileNav';
import TOverview      from '../components/teacher/TOverview';
import TStudents      from '../components/teacher/TStudents';
import TNotes         from '../components/teacher/TNotes';
import TAnnouncements from '../components/teacher/TAnnouncements';
import TSuggestions   from '../components/teacher/TSuggestions';
import './Dashboard.css';

const NAV = [
  { id: 'overview',      icon: '📊', label: 'Overview' },
  { id: 'students',      icon: '👥', label: 'Students' },
  { id: 'notes',         icon: '📄', label: 'Notes' },
  { id: 'announcements', icon: '📢', label: 'Announce' },
  { id: 'suggestions',   icon: '💬', label: 'Queries' },
];

export default function TeacherDashboard() {
  const [active, setActive] = useState('overview');
  const pages = {
    overview:      <TOverview setActive={setActive} />,
    students:      <TStudents />,
    notes:         <TNotes />,
    announcements: <TAnnouncements />,
    suggestions:   <TSuggestions />,
  };
  return (
    <div className="dash">
      <Sidebar active={active} setActive={setActive} nav={NAV} />
      <main className="dash-main">{pages[active]}</main>
      <MobileNav active={active} setActive={setActive} nav={NAV} />
    </div>
  );
}