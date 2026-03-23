import React from 'react';
import {BrowserRouter,Routes,Route,Navigate} from 'react-router-dom';
import {AuthProvider,useAuth} from './context/AuthContext';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';

function Guard({role,children}){
  const {user,loading} = useAuth();
  if(loading) return(
    <div className="loading-screen">
      <div className="spinner"/>
      <span style={{color:'var(--muted)',fontWeight:600}}>Loading SP Coaching…</span>
    </div>
  );
  if(!user) return <Navigate to="/login" replace/>;
  if(role && user.role!==role) return <Navigate to="/login" replace/>;
  return children;
}

function AppRoutes(){
  const {user} = useAuth();
  return(
    <Routes>
      <Route path="/"        element={<Welcome/>}/>
      <Route path="/login"   element={user ? <Navigate to={user.role==='teacher'?'/teacher':'/student'} replace/> : <Login/>}/>
      <Route path="/teacher/*" element={<Guard role="teacher"><TeacherDashboard/></Guard>}/>
      <Route path="/student/*" element={<Guard role="student"><StudentDashboard/></Guard>}/>
      <Route path="*"        element={<Navigate to="/" replace/>}/>
    </Routes>
  );
}

export default function App(){
  return(
    <AuthProvider>
      <BrowserRouter><AppRoutes/></BrowserRouter>
    </AuthProvider>
  );
}
