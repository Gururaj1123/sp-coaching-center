import React,{createContext,useContext,useState,useEffect} from 'react';
import axios from 'axios';

const Ctx = createContext();

// In production (Vercel/Render), API calls go to the backend URL
const API = process.env.REACT_APP_API_URL || '';

export function AuthProvider({children}){
  const [user,setUser]     = useState(null);
  const [loading,setLoading] = useState(true);

  useEffect(()=>{
    const token = localStorage.getItem('sp_token');
    const saved  = localStorage.getItem('sp_user');
    if(token && saved){
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.defaults.baseURL = API;
      setUser(JSON.parse(saved));
    }
    setLoading(false);
  },[]);

  const login = async(email,password,role)=>{
    const {data} = await axios.post(`${API}/api/${role}/login`,{email,password});
    localStorage.setItem('sp_token', data.token);
    localStorage.setItem('sp_user',  JSON.stringify(data.user));
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    axios.defaults.baseURL = API;
    setUser(data.user);
    return data.user;
  };

  const logout = ()=>{
    localStorage.removeItem('sp_token');
    localStorage.removeItem('sp_user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return <Ctx.Provider value={{user,loading,login,logout}}>{children}</Ctx.Provider>;
}

export const useAuth = ()=>useContext(Ctx);
