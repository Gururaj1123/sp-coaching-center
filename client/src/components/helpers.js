import React,{useEffect} from 'react';

export function Toast({msg,type,onClose}){
  useEffect(()=>{const t=setTimeout(onClose,3200);return()=>clearTimeout(t);},[onClose]);
  return <div className={`toast ${type==='err'?'err':''}`}>{msg}</div>;
}

export const fmt     = d=>new Date(d).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});
export const fmtTime = d=>new Date(d).toLocaleString('en-IN',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});

export const COURSES=[
  'Abacus',
  'SSLC Karnataka Board',
  'CBSE Board',
  'Spoken English',
  'Competitive',
];

export const CC={
  'Abacus':              'abacus',
  'SSLC Karnataka Board':'sslc',
  'CBSE Board':          'cbse',
  'Spoken English':      'eng',
  'Competitive':         'comp',
  'All':                 'all',
};

export const SUBJECTS={
  'SSLC Karnataka Board':['Maths','Kannada','Science','Social Science','English','Model Papers','Others'],
  'CBSE Board':          ['Maths','Kannada','Science','Social Science','English','Model Papers','Others'],
  'Spoken English':      ['Grammar','Vocabulary','Speaking Practice','Others'],
  'Competitive':         ['General Knowledge','Reasoning','Maths','Kannada','English','Current Affairs','Others'],
  'Abacus':              ['Level 1','Level 2','Level 3','Level 4','Practice Sheets','Others'],
};

export const SUGGESTION_TYPES=[
  'Class Schedule - Today',
  'Class Cancelled Today',
  'Request Extra Class',
  'Holiday Information',
  'Study Material Needed',
  'Exam Date Query',
  'Class Timing Change',
  'General Suggestion',
];