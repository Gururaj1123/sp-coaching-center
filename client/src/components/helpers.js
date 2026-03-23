import React,{useEffect} from 'react';

export function Toast({msg,type,onClose}){
  useEffect(()=>{ const t=setTimeout(onClose,3200); return()=>clearTimeout(t); },[onClose]);
  return <div className={`toast ${type==='err'?'err':''}`}>{msg}</div>;
}

export const fmt = d => new Date(d).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});
export const fmtTime = d => new Date(d).toLocaleString('en-IN',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});

export const COURSES = ['SSLC Kannada','CBSE Kannada','Spoken English','Competitive Prep'];
export const CC = {'SSLC Kannada':'sslc','CBSE Kannada':'cbse','Spoken English':'eng','Competitive Prep':'comp','All':'all'};

export const SUGGESTION_TYPES = [
  'Class Schedule - Today',
  'Class Cancelled Today',
  'Request Extra Class',
  'Holiday Information',
  'Study Material Needed',
  'Exam Date Query',
  'Class Timing Change',
  'General Suggestion',
];
