import React,{useState,useEffect,useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import './Welcome.css';

const COURSES=[
  {icon:'📘',color:'#1b4fce',title:'SSLC Karnataka Board',sub:'Board Exam Excellence',desc:'Comprehensive SSLC board preparation with model papers, chapter-wise revision, and expert mentorship tailored for Karnataka board.'},
  {icon:'📗',color:'#0ea5e9',title:'CBSE Board',sub:'Language Mastery',desc:'Structured CBSE Kannada curriculum for all grades with weekly assessments, grammar focus, and literature deep-dives.'},
  {icon:'🗣️',color:'#10b981',title:'Spoken English',sub:'Communicate Confidently',desc:'Interactive speaking sessions, grammar workshops, and real-world conversation practice to build lasting English fluency.'},
  {icon:'🏆',color:'#8b5cf6',title:'Competitive Prep',sub:'KAS · PSI · FDA · SDA',desc:'Focused coaching for government exams with current affairs, aptitude training, and previous year paper analysis.'},
];

const STATS=[
  {val:'50+',lbl:'Students Enrolled'},
  {val:'10+', lbl:'Years Experience'},
  {val:'95%', lbl:'Exam Pass Rate'},
  {val:'4',   lbl:'Courses Offered'},
];

const FEATURES=[
  {icon:'👨‍🏫',t:'Expert Faculty',d:'Qualified teachers with deep subject knowledge and years of coaching experience.'},
  {icon:'📋',t:'Digital Notes Portal',d:'All study PDFs accessible 24/7 through the student portal. Never miss materials.'},
  {icon:'📢',t:'Live Announcements',d:'Real-time class schedule updates, holiday notices, and exam timetables.'},
  {icon:'💬',t:'Student Suggestions',d:'Students can send schedule requests and suggestions directly to teachers.'},
  {icon:'🎯',t:'Personal Attention',d:'Small batches ensure every student gets individual guidance and feedback.'},
  {icon:'📍',t:'Local & Trusted',d:'Proudly serving S.N Nagar, Sagara families with quality education since founding.'},
];

const SUGGESTION_TYPES=['Class Schedule Query','Request for Extra Class','Holiday Information','Study Material Request','Exam Date Query','General Suggestion'];

export default function Welcome(){
  const navigate = useNavigate();
  const [scrollY,setScrollY] = useState(0);
  const [visible,setVisible] = useState(false);
  const [query,setQuery] = useState({name:'',phone:'',course:'',type:'',msg:''});
  const [sent,setSent] = useState(false);
  const heroRef = useRef();

  useEffect(()=>{
    setTimeout(()=>setVisible(true),60);
    const onScroll=()=>setScrollY(window.scrollY);
    window.addEventListener('scroll',onScroll,{passive:true});
    return()=>window.removeEventListener('scroll',onScroll);
  },[]);

  const scrollTo=id=>document.getElementById(id)?.scrollIntoView({behavior:'smooth'});

  const handleQuery=e=>{
    e.preventDefault();
    setSent(true);
    setQuery({name:'',phone:'',course:'',type:'',msg:''});
  };

  const navOpaque = scrollY>60;

  return(
    <div className={`wp ${visible?'wp-in':''}`}>

      {/* NAV */}
      <nav className={`wn ${navOpaque?'wn-solid':''}`}>
        <div className="wn-inner">
          <div className="wn-logo" onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}>
            <div className="logo-badge">SP</div>
            <div>
              <div className="logo-name">SP Coaching Center</div>
              <div className="logo-loc">S.N Nagar, Sagara</div>
            </div>
          </div>
          <div className="wn-links">
            <button onClick={()=>scrollTo('courses')}>Courses</button>
            <button onClick={()=>scrollTo('about')}>About</button>
            <button onClick={()=>scrollTo('contact')}>Contact</button>
            <button className="btn btn-primary" onClick={()=>navigate('/login')}>Portal Login →</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="wh" ref={heroRef}>
        <div className="wh-bg">
          <div className="wh-orb wh-o1"/>
          <div className="wh-orb wh-o2"/>
          <div className="wh-orb wh-o3"/>
          <div className="wh-grid"/>
          <div className="wh-wave"/>
        </div>

        <div className="wh-content">
          <div className="wh-eyebrow anim-fade-up">
            <span className="wh-dot"/>
            Sagara's Most Trusted Coaching Center
          </div>
          <h1 className="wh-title anim-fade-up d1">
            SP Coaching<br/>
            <span className="wh-title-accent">Center</span>
          </h1>
          <p className="wh-desc anim-fade-up d2">
            Empowering students of Sagara with quality education in Kannada language, English communication,
            and competitive exam preparation. Trusted by 50+ families from S.N Nagar and beyond.
          </p>
          <div className="wh-actions anim-fade-up d3">
            <button className="btn btn-primary btn-lg" onClick={()=>navigate('/login')}>
              🚀 Access Student Portal
            </button>
            <button className="btn btn-secondary btn-lg" onClick={()=>scrollTo('courses')}>
              📚 Explore Courses
            </button>
          </div>
          <div className="wh-addr anim-fade-up d4">
            <span>📍 S.N Nagar, Sagara, Karnataka</span>
            <span className="wh-sep"/>
            <span>🎓 Admissions Open</span>
          </div>
        </div>

        <div className="wh-visual anim-slide-in d2">
          <div className="wh-emblem">
            <div className="wh-ring wh-r1"/>
            <div className="wh-ring wh-r2"/>
            <div className="wh-core">
              <div className="wh-sp">SP</div>
              <div className="wh-coach">Coaching</div>
            </div>
          </div>
          <div className="wh-tag wt1 anim-fade-up d1">📘 SSLC Karnataka Board</div>
          <div className="wh-tag wt2 anim-fade-up d2">📗 CBSE Board</div>
          <div className="wh-tag wt3 anim-fade-up d3">🗣️ Spoken English</div>
          <div className="wh-tag wt4 anim-fade-up d4">🏆 Competitive Prep</div>
        </div>
      </section>

      {/* STATS BAND */}
      <div className="ws-band">
        {STATS.map((s,i)=>(
          <div key={i} className="ws-item anim-fade-up" style={{animationDelay:`${i*0.08}s`}}>
            <div className="ws-val">{s.val}</div>
            <div className="ws-lbl">{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* COURSES */}
      <section className="w-sec" id="courses">
        <div className="w-sec-inner">
          <div className="w-tag-line">What We Offer</div>
          <h2 className="w-sec-title">Our Courses</h2>
          <p className="w-sec-sub">Four expertly designed programs for every student's academic journey</p>
          <div className="wc-grid">
            {COURSES.map((c,i)=>(
              <div key={i} className="wc-card anim-fade-up" style={{animationDelay:`${i*0.1}s`,'--cc':c.color}}>
                <div className="wc-top">
                  <span className="wc-icon">{c.icon}</span>
                  <div className="wc-dot"/>
                </div>
                <div className="wc-title">{c.title}</div>
                <div className="wc-sub">{c.sub}</div>
                <p className="wc-desc">{c.desc}</p>
                <button className="wc-btn" onClick={()=>navigate('/login')}>Enroll Now →</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="w-sec w-sec-alt" id="about">
        <div className="w-sec-inner">
          <div className="w-tag-line">Why Choose Us</div>
          <h2 className="w-sec-title">About SP Coaching Center</h2>
          <p className="w-sec-sub">We combine experienced teaching with a modern digital learning platform</p>
          <div className="wf-grid">
            {FEATURES.map((f,i)=>(
              <div key={i} className="wf-item anim-fade-up" style={{animationDelay:`${i*0.08}s`}}>
                <div className="wf-icon">{f.icon}</div>
                <div>
                  <div className="wf-title">{f.t}</div>
                  <div className="wf-desc">{f.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT + QUERY FORM */}
      <section className="w-sec" id="contact">
        <div className="w-sec-inner">
          <div className="w-tag-line">Get In Touch</div>
          <h2 className="w-sec-title">Contact & Queries</h2>
          <p className="w-sec-sub">Any questions about admissions, class timings, or schedules? We are here to help.</p>

          <div className="wct-grid">
            <div className="wct-card anim-fade-up d1">
              <div className="wct-icon">📍</div>
              <div className="wct-lbl">Address</div>
              <div className="wct-val">S.N Nagar, Sagara<br/>Karnataka, India</div>
            </div>
            <div className="wct-card anim-fade-up d2">
              <div className="wct-icon">🕐</div>
              <div className="wct-lbl">Class Timings</div>
              <div className="wct-val">Morning & Evening<br/>Batches Available</div>
            </div>
            <div className="wct-card anim-fade-up d3">
              <div className="wct-icon">📞</div>
              <div className="wct-lbl">Admissions</div>
              <div className="wct-val">Contact us directly<br/>for fees & schedules</div>
            </div>
            <div className="wct-card anim-fade-up d4">
              <div className="wct-icon">💻</div>
              <div className="wct-lbl">Student Portal</div>
              <div className="wct-val" style={{display:'flex',flexDirection:'column',gap:8}}>
                Notes, Announcements & Suggestions
                <button className="btn btn-primary btn-sm" onClick={()=>navigate('/login')}>Login →</button>
              </div>
            </div>
          </div>

          <div className="wq-box anim-fade-up d2">
            <div className="wq-header">
              <div className="wq-icon">💬</div>
              <div>
                <div className="wq-title">Send Us a Query</div>
                <div className="wq-sub">Fill in the form — we will respond promptly</div>
              </div>
            </div>
            {sent?(
              <div className="wq-success">
                <div style={{fontSize:48,marginBottom:12}}>✅</div>
                <div style={{fontWeight:700,fontSize:18,color:'var(--green)',marginBottom:6}}>Query Sent Successfully!</div>
                <div style={{color:'var(--muted)',fontSize:14}}>Thank you! We will contact you soon. 🙏</div>
                <button className="btn btn-secondary" style={{marginTop:16}} onClick={()=>setSent(false)}>Send Another Query</button>
              </div>
            ):(
              <form className="wq-form" onSubmit={handleQuery}>
                <div className="fg-row">
                  <div className="fg"><label>Your Name</label><input required placeholder="Full name" value={query.name} onChange={e=>setQuery({...query,name:e.target.value})}/></div>
                  <div className="fg"><label>Phone Number</label><input placeholder="Your phone number" value={query.phone} onChange={e=>setQuery({...query,phone:e.target.value})}/></div>
                </div>
                <div className="fg-row">
                  <div className="fg">
                    <label>Course Interested In</label>
                    <select value={query.course} onChange={e=>setQuery({...query,course:e.target.value})}>
                      <option value="">Select a course…</option>
                      <option>SSLC Karnataka Board</option><option>CBSE Board</option>
                      <option>Spoken English</option><option>Competitive Prep</option>
                    </select>
                  </div>
                  <div className="fg">
                    <label>Query Type</label>
                    <select value={query.type} onChange={e=>setQuery({...query,type:e.target.value})}>
                      <option value="">Select type…</option>
                      {SUGGESTION_TYPES.map(t=><option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div className="fg"><label>Your Message</label><textarea rows={4} required placeholder="Write your query or question here…" value={query.msg} onChange={e=>setQuery({...query,msg:e.target.value})}/></div>
                <button type="submit" className="btn btn-primary btn-block btn-lg">📨 Send Query</button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="wft">
        <div className="wft-inner">
          <div className="wft-brand">
            <div className="logo-badge" style={{width:48,height:48,fontSize:18}}>SP</div>
            <div>
              <div style={{fontWeight:800,fontSize:17,color:'var(--primary)'}}>SP Coaching Center</div>
              <div style={{fontSize:13,color:'var(--muted)',marginTop:3}}>S.N Nagar, Sagara, Karnataka</div>
            </div>
          </div>
          <div className="wft-col">
            <div className="wft-head">Courses</div>
            {COURSES.map(c=><div key={c.title} className="wft-link">{c.icon} {c.title}</div>)}
          </div>
          <div className="wft-col">
            <div className="wft-head">Quick Links</div>
            <button className="wft-link wft-btn" onClick={()=>scrollTo('courses')}>Courses</button>
            <button className="wft-link wft-btn" onClick={()=>scrollTo('about')}>About Us</button>
            <button className="wft-link wft-btn" onClick={()=>scrollTo('contact')}>Contact</button>
            <button className="wft-link wft-btn" onClick={()=>navigate('/login')}>Student Portal</button>
          </div>
          <div className="wft-col">
            <div className="wft-head">Contact</div>
            <div className="wft-link">📍 S.N Nagar, Sagara</div>
            <div className="wft-link">🎓 Admissions Open</div>
            <div className="wft-link">📚 All Courses Available</div>
          </div>
        </div>
        <div className="wft-copy">
          © 2024 SP Coaching Center, Sagara. All rights reserved. · Empowering students, one lesson at a time.
        </div>
      </footer>
    </div>
  );
}
