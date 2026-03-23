const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'sp_coaching_sagara_2024_secure';

// Uploads directory - use /tmp on Render (ephemeral) or local
const uploadsDir = process.env.RENDER
  ? path.join('/tmp', 'sp-uploads')
  : path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Database - stored in /tmp on Render
const dbPath = process.env.RENDER
  ? path.join('/tmp', 'spcoaching.db')
  : path.join(__dirname, 'spcoaching.db');

const db = new sqlite3.Database(dbPath);

const run = (sql, p = []) => new Promise((res, rej) =>
  db.run(sql, p, function(e) { e ? rej(e) : res({ lastID: this.lastID }); })
);
const get = (sql, p = []) => new Promise((res, rej) =>
  db.get(sql, p, (e, r) => e ? rej(e) : res(r))
);
const all = (sql, p = []) => new Promise((res, rej) =>
  db.all(sql, p, (e, r) => e ? rej(e) : res(r))
);

// Init DB
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS teachers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL, email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL, subject TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL, email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL, course TEXT NOT NULL,
    phone TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL, description TEXT,
    filename TEXT NOT NULL, course TEXT NOT NULL,
    uploaded_by INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS announcements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL, message TEXT NOT NULL,
    course TEXT NOT NULL, priority TEXT DEFAULT 'normal',
    posted_by INTEGER NOT NULL, role TEXT DEFAULT 'teacher',
    student_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS suggestions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    student_name TEXT NOT NULL,
    course TEXT NOT NULL,
    type TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    teacher_reply TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Safe migrations for existing DBs
  db.run(`ALTER TABLE announcements ADD COLUMN student_name TEXT`, () => {});
  db.run(`ALTER TABLE announcements ADD COLUMN role TEXT DEFAULT 'teacher'`, () => {});

  // Seed teachers
  const seeds = [
    { name: 'Admin',        email: 'admin@spcoaching.com',   pw: 'admin123',   subject: 'All' },
    { name: 'Kavitha S.',   email: 'sslc@spcoaching.com',    pw: 'sslc123',    subject: 'SSLC Kannada' },
    { name: 'Ravi Kumar',   email: 'cbse@spcoaching.com',    pw: 'cbse123',    subject: 'CBSE Kannada' },
    { name: 'Priya Nair',   email: 'english@spcoaching.com', pw: 'english123', subject: 'Spoken English' },
    { name: 'Suresh Gowda', email: 'comp@spcoaching.com',    pw: 'comp123',    subject: 'Competitive Prep' },
  ];
  seeds.forEach(t => {
    db.get('SELECT id FROM teachers WHERE email=?', [t.email], (e, r) => {
      if (!r) db.run('INSERT INTO teachers(name,email,password,subject) VALUES(?,?,?,?)',
        [t.name, t.email, bcrypt.hashSync(t.pw, 10), t.subject]);
    });
  });
});

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

// Serve React build in production
const clientBuild = path.join(__dirname, '..', 'client', 'build');
if (fs.existsSync(clientBuild)) {
  app.use(express.static(clientBuild));
}

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadsDir),
  filename: (_, f, cb) => cb(null, Date.now() + '_' + f.originalname.replace(/\s+/g, '_'))
});
const upload = multer({
  storage,
  fileFilter: (_, f, cb) =>
    f.mimetype === 'application/pdf' ? cb(null, true) : cb(new Error('PDF only'))
});

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try { req.user = jwt.verify(token, JWT_SECRET); next(); }
  catch { res.status(401).json({ error: 'Invalid token' }); }
};

// ── AUTH ──────────────────────────────────────────────────────
app.post('/api/teacher/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const t = await get('SELECT * FROM teachers WHERE email=?', [email]);
    if (!t || !bcrypt.compareSync(password, t.password))
      return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign(
      { id: t.id, name: t.name, email: t.email, role: 'teacher', subject: t.subject },
      JWT_SECRET, { expiresIn: '8h' }
    );
    res.json({ token, user: { id: t.id, name: t.name, email: t.email, role: 'teacher', subject: t.subject } });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/student/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const s = await get('SELECT * FROM students WHERE email=?', [email]);
    if (!s || !bcrypt.compareSync(password, s.password))
      return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign(
      { id: s.id, name: s.name, email: s.email, role: 'student', course: s.course },
      JWT_SECRET, { expiresIn: '8h' }
    );
    res.json({ token, user: { id: s.id, name: s.name, email: s.email, role: 'student', course: s.course } });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── TEACHER: STUDENTS ─────────────────────────────────────────
app.get('/api/teacher/students', auth, async (req, res) => {
  try {
    const rows = req.user.subject === 'All'
      ? await all('SELECT id,name,email,course,phone,created_at FROM students ORDER BY created_at DESC')
      : await all('SELECT id,name,email,course,phone,created_at FROM students WHERE course=? ORDER BY created_at DESC', [req.user.subject]);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/teacher/students', auth, async (req, res) => {
  try {
    const { name, email, password, course, phone } = req.body;
    if (!name || !email || !password || !course)
      return res.status(400).json({ error: 'All fields required' });
    if (await get('SELECT id FROM students WHERE email=?', [email]))
      return res.status(400).json({ error: 'Email already exists' });
    const r = await run(
      'INSERT INTO students(name,email,password,course,phone) VALUES(?,?,?,?,?)',
      [name, email, bcrypt.hashSync(password, 10), course, phone || null]
    );
    res.json({ id: r.lastID, name, email, course, phone });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/teacher/students/:id', auth, async (req, res) => {
  try { await run('DELETE FROM students WHERE id=?', [req.params.id]); res.json({ ok: true }); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

// ── TEACHER: NOTES ────────────────────────────────────────────
app.post('/api/teacher/notes', auth, upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'PDF required' });
    await run(
      'INSERT INTO notes(title,description,filename,course,uploaded_by) VALUES(?,?,?,?,?)',
      [req.body.title, req.body.description || '', req.file.filename, req.body.course, req.user.id]
    );
    res.json({ ok: true, filename: req.file.filename });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/teacher/notes', auth, async (req, res) => {
  try {
    const rows = req.user.subject === 'All'
      ? await all('SELECT n.*,t.name teacher_name FROM notes n JOIN teachers t ON n.uploaded_by=t.id ORDER BY n.created_at DESC')
      : await all('SELECT n.*,t.name teacher_name FROM notes n JOIN teachers t ON n.uploaded_by=t.id WHERE n.course=? ORDER BY n.created_at DESC', [req.user.subject]);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/teacher/notes/:id', auth, async (req, res) => {
  try {
    const n = await get('SELECT filename FROM notes WHERE id=?', [req.params.id]);
    if (n) { const fp = path.join(uploadsDir, n.filename); if (fs.existsSync(fp)) fs.unlinkSync(fp); }
    await run('DELETE FROM notes WHERE id=?', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── TEACHER: ANNOUNCEMENTS ────────────────────────────────────
app.get('/api/teacher/announcements', auth, async (req, res) => {
  try {
    const sql = `
      SELECT a.*,
        CASE WHEN a.role='teacher' THEN t.name
             ELSE COALESCE(a.student_name,'Student')
        END as poster
      FROM announcements a
      LEFT JOIN teachers t ON a.posted_by=t.id AND a.role='teacher'
      WHERE (a.course=? OR a.course='All')
      ORDER BY a.created_at DESC`;
    const allSql = `
      SELECT a.*,
        CASE WHEN a.role='teacher' THEN t.name
             ELSE COALESCE(a.student_name,'Student')
        END as poster
      FROM announcements a
      LEFT JOIN teachers t ON a.posted_by=t.id AND a.role='teacher'
      ORDER BY a.created_at DESC`;
    const rows = req.user.subject === 'All'
      ? await all(allSql)
      : await all(sql, [req.user.subject]);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/teacher/announcements', auth, async (req, res) => {
  try {
    const { title, message, course, priority } = req.body;
    await run(
      'INSERT INTO announcements(title,message,course,priority,posted_by,role) VALUES(?,?,?,?,?,"teacher")',
      [title, message, course, priority || 'normal', req.user.id]
    );
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/teacher/announcements/:id', auth, async (req, res) => {
  try { await run('DELETE FROM announcements WHERE id=?', [req.params.id]); res.json({ ok: true }); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

// ── TEACHER: SUGGESTIONS ─────────────────────────────────────
app.get('/api/teacher/suggestions', auth, async (req, res) => {
  try {
    const rows = req.user.subject === 'All'
      ? await all('SELECT * FROM suggestions ORDER BY created_at DESC')
      : await all('SELECT * FROM suggestions WHERE course=? ORDER BY created_at DESC', [req.user.subject]);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/teacher/suggestions/:id', auth, async (req, res) => {
  try {
    await run(
      'UPDATE suggestions SET status=?, teacher_reply=? WHERE id=?',
      [req.body.status || 'replied', req.body.reply, req.params.id]
    );
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── STUDENT: NOTES ────────────────────────────────────────────
app.get('/api/student/notes', auth, async (req, res) => {
  try {
    const rows = await all(
      'SELECT n.*,t.name teacher_name FROM notes n JOIN teachers t ON n.uploaded_by=t.id WHERE n.course=? ORDER BY n.created_at DESC',
      [req.user.course]
    );
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── STUDENT: ANNOUNCEMENTS ────────────────────────────────────
app.get('/api/student/announcements', auth, async (req, res) => {
  try {
    const rows = await all(`
      SELECT a.*,
        CASE WHEN a.role='teacher' THEN t.name
             ELSE COALESCE(a.student_name,'Student')
        END as poster
      FROM announcements a
      LEFT JOIN teachers t ON a.posted_by=t.id AND a.role='teacher'
      WHERE (a.course=? OR a.course='All')
      ORDER BY a.created_at DESC`,
      [req.user.course]
    );
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── STUDENT: SUGGESTIONS ─────────────────────────────────────
app.get('/api/student/suggestions', auth, async (req, res) => {
  try {
    const rows = await all(
      'SELECT * FROM suggestions WHERE student_id=? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/student/suggestions', auth, async (req, res) => {
  try {
    const { type, message } = req.body;
    if (!type || !message) return res.status(400).json({ error: 'Type and message required' });
    await run(
      'INSERT INTO suggestions(student_id,student_name,course,type,message) VALUES(?,?,?,?,?)',
      [req.user.id, req.user.name, req.user.course, type, message]
    );
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Catch-all: serve React app for all non-API routes ─────────
app.get('*', (req, res) => {
  const index = path.join(clientBuild, 'index.html');
  if (fs.existsSync(index)) {
    res.sendFile(index);
  } else {
    res.json({ message: 'SP Coaching Center API is running!' });
  }
});

app.listen(PORT, () => {
  console.log('\n╔══════════════════════════════════════╗');
  console.log('║   SP COACHING CENTER - SERVER READY  ║');
  console.log(`║   Running at http://localhost:${PORT}   ║`);
  console.log('╚══════════════════════════════════════╝\n');
});
