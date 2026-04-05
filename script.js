/* ════ STATE ════ */
let state = {
  player: { name:'Novice Hero', avatar:'🧙', level:1, xp:0, xpToNext:100, totalXP:0, streak:0, bestStreak:0, totalCompleted:0, joinedChallenges:[], lastActiveDate:null, joinDate:null, xpLog:[], hasOnboarded:false, friendCode:null, friends:[], groupId:null, isPro:false },
  habits: [], todayCompleted: {}, selectedIcon:'🏃', selectedColor:'#0d8a7f', currentCat:'all',
  customChallenges: [], challengeLog: {}, challengeTimes: {},
  cardConfig: { bg:'default', showAvatar:true, showName:true, showXP:true, showLevel:true, showStats:true, stats:['streak','totalCompleted','todayDone'], showAch:false, achs:[], nameColor:'' },
  unlockedAchs: []
};

const CARD_BG_PRESETS = [
  { id:'default', label:'Dark',        bg:'' },
  { id:'purple',  label:'Violet',      bg:'linear-gradient(135deg,#2d1b69,#11052c)' },
  { id:'ocean',   label:'Ocean',       bg:'linear-gradient(135deg,#0f2027,#2c5364)' },
  { id:'sunset',  label:'Sunset',      bg:'linear-gradient(135deg,#c94b4b,#4b134f)' },
  { id:'forest',  label:'Forest',      bg:'linear-gradient(135deg,#134e5e,#71b280)' },
  { id:'gold',    label:'Gold',        bg:'linear-gradient(135deg,#7a5200,#c9820a)' },
  { id:'night',   label:'Night',       bg:'linear-gradient(135deg,#0f0c29,#302b63)' },
  { id:'rose',    label:'Rose',        bg:'linear-gradient(135deg,#7b1a4b,#c4374a)' },
  // Pro-only
  { id:'aurora',  label:'Aurora',      bg:'linear-gradient(135deg,#0d324d,#7f5a83,#00b4d8)', pro:true },
  { id:'inferno', label:'Inferno',     bg:'linear-gradient(135deg,#200122,#6f0000,#ff4e00)', pro:true },
  { id:'galaxy',  label:'Galaxy',      bg:'linear-gradient(135deg,#0a001f,#3d0066,#7700cc,#00d4ff)', pro:true },
  { id:'emerald', label:'Emerald',     bg:'linear-gradient(135deg,#003d1a,#007a3d,#00e676)', pro:true },
  { id:'cyber',   label:'Cyber',       bg:'linear-gradient(135deg,#0a0a0a,#00f5ff,#7b2fff,#0a0a0a)', pro:true },
  { id:'lava',    label:'Lava',        bg:'linear-gradient(135deg,#1a0000,#8b0000,#ff6600,#ffd700)', pro:true },
  { id:'arcane',  label:'Arcane',      bg:'linear-gradient(135deg,#12002e,#3d0099,#9b00ff,#ff00aa)', pro:true },
  { id:'titanium',label:'Titanium',    bg:'linear-gradient(135deg,#0d0d0d,#1a1a2e,#16213e,#4a4a8a)', pro:true },
];

const ACH_RARITY_CFG = {
  common:    { badgeBg:'linear-gradient(135deg,#334155,#64748b)', border:'#64748b', glow:'rgba(100,116,139,.8)'  },
  rare:      { badgeBg:'linear-gradient(135deg,#1e3a8a,#3b82f6)', border:'#3b82f6', glow:'rgba(59,130,246,.85)' },
  epic:      { badgeBg:'linear-gradient(135deg,#4c1d95,#7c3aed)', border:'#7c3aed', glow:'rgba(109,40,217,.85)' },
  legendary: { badgeBg:'linear-gradient(135deg,#78350f,#d97706,#fbbf24)', border:'#f59e0b', glow:'rgba(251,191,36,.9)' },
};

const CARD_STAT_OPTIONS = [
  { id:'streak',         label:'Streak',      color:'var(--rose)',  get:function(p,s){ return p.streak; } },
  { id:'bestStreak',     label:'Best Streak', color:'#f59e0b',      get:function(p,s){ return p.bestStreak; } },
  { id:'totalXP',        label:'Total XP',    color:'var(--teal)',  get:function(p,s){ return p.totalXP.toLocaleString(); } },
  { id:'totalCompleted', label:'Completed',   color:'var(--green)', get:function(p,s){ return p.totalCompleted; } },
  { id:'level',          label:'Level',       color:'#a78bfa',      get:function(p,s){ return p.level; } },
  { id:'todayDone',      label:'Today',       color:'var(--green)', get:function(p,s){ return Object.values(s.todayCompleted||{}).filter(Boolean).length; } },
];

const ICONS = ['🏃','🧘','📚','💪','💧','🥗','😴','🧠','✍️','🎯','🎨','🎸','🏊','🚴','🌿','🌅','💻','📖','🏋️','🎭','🗣️','🧩','🌱','⚡','🔥','💎','🎪','🌍'];
const COLORS = ['#0d8a7f','#c4374a','#6d3dbd','#1a8a5a','#c9820a','#c47028','#e05252','#00a8cc','#8b5cf6','#059669','#f472b6','#d97706'];
const DIFF_XP  = { easy:10, medium:25, hard:50, epic:100 };
const DIFF_LBL = { easy:'Easy', medium:'Medium', hard:'Hard', epic:'Epic' };
const DIFF_CLS = { easy:'diff-easy', medium:'diff-medium', hard:'diff-hard', epic:'diff-epic' };
const DIFF_EMO = { easy:'⚡', medium:'⚔️', hard:'🔥', epic:'💎' };
const CAT_MAP  = { health:'💪 Health', mind:'🧠 Mind', skill:'🎯 Skills', social:'🤝 Social', creative:'🎨 Creative' };
const WEEK_DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

const DEFAULT_HABITS = [
  { id:'h1', name:'Morning Run',      desc:'5km every morning. Get the blood pumping!', icon:'🏃', color:'#0d8a7f', diff:'medium', cat:'health', streak:3 },
  { id:'h2', name:'Meditation',       desc:'10 minutes of silence and focus',            icon:'🧘', color:'#6d3dbd', diff:'easy',   cat:'mind',   streak:7 },
  { id:'h3', name:'Read 30 Pages',    desc:'30 pages before bed',                        icon:'📚', color:'#c9820a', diff:'easy',   cat:'mind',   streak:2 },
  { id:'h4', name:'Drink 2L Water',   desc:'Stay hydrated all day',                      icon:'💧', color:'#1a8a5a', diff:'easy',   cat:'health', streak:5 },
  { id:'h5', name:'Code 1 Hour',      desc:'1 hour learning a new skill',                icon:'💻', color:'#c4374a', diff:'hard',   cat:'skill',  streak:1 },
  { id:'h6', name:'No Social Media',  desc:'Digital detox — phone down',                 icon:'🌿', color:'#059669', diff:'medium', cat:'mind',   streak:0 },
];

const CHALLENGES = [
  // ── HEALTH ──────────────────────────────────────────────────────────────────
  { id:'c1',  cat:'health',   name:'Week Warrior',       desc:'Train every day for 7 days in a row',            icon:'💪', badge:'HARD',   cc1:'rgba(196,55,74,.06)',   g1:'#c4374a', g2:'#c47028', xp:200,  participants:3821, progress:40, diffCls:'diff-hard'   },
  { id:'c2',  cat:'health',   name:'Hydration Hero',     desc:'Drink 2L of water daily for 21 days',            icon:'💧', badge:'EASY',   cc1:'rgba(26,138,90,.06)',   g1:'#1a8a5a', g2:'#0d8a7f', xp:80,   participants:8201, progress:55, diffCls:'diff-easy'   },
  { id:'c3',  cat:'health',   name:'Morning Runner',     desc:'Run every morning for 21 days straight',         icon:'🏃', badge:'HARD',   cc1:'rgba(13,138,127,.06)',  g1:'#0d8a7f', g2:'#059669', xp:250,  participants:2103, progress:35, diffCls:'diff-hard'   },
  { id:'c4',  cat:'health',   name:'Cold Shower Hero',   desc:'Take a cold shower every day for 30 days',       icon:'🚿', badge:'MEDIUM', cc1:'rgba(0,168,204,.06)',   g1:'#00a8cc', g2:'#0d8a7f', xp:150,  participants:1540, progress:30, diffCls:'diff-medium' },
  { id:'c5',  cat:'health',   name:'10K Steps',          desc:'Walk 10,000 steps every day for 30 days',        icon:'👟', badge:'EASY',   cc1:'rgba(5,150,105,.06)',   g1:'#059669', g2:'#1a8a5a', xp:100,  participants:6300, progress:60, diffCls:'diff-easy'   },
  { id:'c6',  cat:'health',   name:'Sleep Champion',     desc:'Sleep 8 hours every night for 14 days',          icon:'😴', badge:'EASY',   cc1:'rgba(109,61,189,.06)',  g1:'#6d3dbd', g2:'#8b5cf6', xp:80,   participants:4100, progress:50, diffCls:'diff-easy'   },
  { id:'c7',  cat:'health',   name:'No Sugar',           desc:'Cut out sugar completely for 21 days',           icon:'🍎', badge:'HARD',   cc1:'rgba(196,112,40,.06)',  g1:'#c47028', g2:'#c9820a', xp:220,  participants:890,  progress:25, diffCls:'diff-hard'   },
  { id:'c8',  cat:'health',   name:'Fitness Beast',      desc:'Work out 5 days a week for 6 weeks',             icon:'🏋️', badge:'EPIC',   cc1:'rgba(196,55,74,.06)',   g1:'#c4374a', g2:'#6d3dbd', xp:500,  participants:710,  progress:20, diffCls:'diff-epic'   },
  // ── MIND ────────────────────────────────────────────────────────────────────
  { id:'c9',  cat:'mind',     name:'30-Day Detox',       desc:'No social media for 30 days',                    icon:'📵', badge:'EPIC',   cc1:'rgba(109,61,189,.06)',  g1:'#6d3dbd', g2:'#c4374a', xp:500,  participants:1247, progress:60, diffCls:'diff-epic'   },
  { id:'c10', cat:'mind',     name:'Meditation Master',  desc:'Meditate every single day for 14 days',          icon:'🧘', badge:'EASY',   cc1:'rgba(13,138,127,.06)',  g1:'#0d8a7f', g2:'#1a8a5a', xp:100,  participants:5634, progress:70, diffCls:'diff-easy'   },
  { id:'c11', cat:'mind',     name:'Gratitude Journal',  desc:'Write 3 gratitudes every day for 30 days',       icon:'📝', badge:'EASY',   cc1:'rgba(201,130,10,.06)',  g1:'#c9820a', g2:'#c47028', xp:80,   participants:3200, progress:65, diffCls:'diff-easy'   },
  { id:'c12', cat:'mind',     name:'Digital Sunset',     desc:'No screens after 9pm for 21 days',               icon:'🌙', badge:'MEDIUM', cc1:'rgba(109,61,189,.06)',  g1:'#6d3dbd', g2:'#00a8cc', xp:150,  participants:1800, progress:40, diffCls:'diff-medium' },
  { id:'c13', cat:'mind',     name:'Brain Training',     desc:'Solve a puzzle or brain game every day for 14 days', icon:'🧩', badge:'EASY', cc1:'rgba(139,92,246,.06)', g1:'#8b5cf6', g2:'#6d3dbd', xp:80, participants:2900, progress:55, diffCls:'diff-easy'   },
  { id:'c14', cat:'mind',     name:'Journaling Habit',   desc:'Write in your journal every day for 30 days',    icon:'✍️', badge:'EASY',   cc1:'rgba(201,130,10,.06)',  g1:'#c9820a', g2:'#0d8a7f', xp:80,   participants:4200, progress:60, diffCls:'diff-easy'   },
  { id:'c15', cat:'mind',     name:'Mindful Mornings',   desc:'Spend 10 min in silence every morning for 21 days', icon:'🌅', badge:'MEDIUM', cc1:'rgba(196,112,40,.06)', g1:'#c47028', g2:'#6d3dbd', xp:130, participants:2100, progress:45, diffCls:'diff-medium' },
  // ── EDUCATION & SKILLS ──────────────────────────────────────────────────────
  { id:'c16', cat:'skill',    name:'Book Marathon',      desc:'Read 4 books in 30 days',                        icon:'📚', badge:'MEDIUM', cc1:'rgba(201,130,10,.06)',  g1:'#c9820a', g2:'#0d8a7f', xp:150,  participants:892,  progress:25, diffCls:'diff-medium' },
  { id:'c17', cat:'skill',    name:'Code & Conquer',     desc:'Write code every single day for 14 days',        icon:'💻', badge:'HARD',   cc1:'rgba(109,61,189,.06)',  g1:'#6d3dbd', g2:'#c4374a', xp:300,  participants:2103, progress:35, diffCls:'diff-hard'   },
  { id:'c18', cat:'skill',    name:'Language Sprint',    desc:'Learn a new language 15 min/day for 30 days',    icon:'🌍', badge:'MEDIUM', cc1:'rgba(13,138,127,.06)',  g1:'#0d8a7f', g2:'#c9820a', xp:180,  participants:1560, progress:30, diffCls:'diff-medium' },
  { id:'c19', cat:'skill',    name:'Online Course',      desc:'Complete an online course within 30 days',       icon:'🎓', badge:'HARD',   cc1:'rgba(196,55,74,.06)',   g1:'#c4374a', g2:'#c9820a', xp:280,  participants:980,  progress:20, diffCls:'diff-hard'   },
  { id:'c20', cat:'skill',    name:'Skill Builder',      desc:'Practice a chosen skill 30 min/day for 21 days', icon:'🎯', badge:'MEDIUM', cc1:'rgba(201,130,10,.06)',  g1:'#c9820a', g2:'#6d3dbd', xp:150,  participants:2200, progress:40, diffCls:'diff-medium' },
  { id:'c21', cat:'skill',    name:'Financial Tracker',  desc:'Track every single expense for 30 days',         icon:'💰', badge:'EASY',   cc1:'rgba(26,138,90,.06)',   g1:'#1a8a5a', g2:'#c9820a', xp:100,  participants:3400, progress:50, diffCls:'diff-easy'   },
  { id:'c22', cat:'skill',    name:'Reading Streak',     desc:'Read at least 20 minutes every day for 30 days', icon:'📖', badge:'EASY',   cc1:'rgba(201,130,10,.06)',  g1:'#c9820a', g2:'#1a8a5a', xp:80,   participants:4100, progress:55, diffCls:'diff-easy'   },
  { id:'c23', cat:'skill',    name:'Public Speaker',     desc:'Give 5 presentations or speeches in 30 days',    icon:'🗣️', badge:'HARD',   cc1:'rgba(196,55,74,.06)',   g1:'#c4374a', g2:'#8b5cf6', xp:350,  participants:540,  progress:15, diffCls:'diff-hard'   },
  // ── SOCIAL ──────────────────────────────────────────────────────────────────
  { id:'c24', cat:'social',   name:'Kindness Quest',     desc:'Do 1 random act of kindness every day for 21 days', icon:'🤝', badge:'EASY', cc1:'rgba(244,114,182,.06)', g1:'#f472b6', g2:'#c4374a', xp:80, participants:3100, progress:60, diffCls:'diff-easy'   },
  { id:'c25', cat:'social',   name:'Compliment Daily',   desc:'Give 1 sincere compliment every day for 14 days', icon:'💬', badge:'EASY',  cc1:'rgba(13,138,127,.06)',  g1:'#0d8a7f', g2:'#f472b6', xp:80,   participants:2700, progress:65, diffCls:'diff-easy'   },
  { id:'c26', cat:'social',   name:'Network Builder',    desc:'Meet or connect with 3 new people a week for 4 weeks', icon:'👥', badge:'MEDIUM', cc1:'rgba(196,55,74,.06)', g1:'#c4374a', g2:'#6d3dbd', xp:160, participants:890, progress:25, diffCls:'diff-medium' },
  { id:'c27', cat:'social',   name:'Volunteer Hero',     desc:'Volunteer at least 8 hours within 30 days',      icon:'🤲', badge:'HARD',   cc1:'rgba(13,138,127,.06)',  g1:'#0d8a7f', g2:'#1a8a5a', xp:300,  participants:540,  progress:20, diffCls:'diff-hard'   },
  { id:'c28', cat:'social',   name:'Family First',       desc:'Have family dinner 5 nights a week for 4 weeks', icon:'🏠', badge:'MEDIUM', cc1:'rgba(201,130,10,.06)',  g1:'#c9820a', g2:'#c4374a', xp:150,  participants:1200, progress:40, diffCls:'diff-medium' },
  { id:'c29', cat:'social',   name:'Unplug & Connect',   desc:'Spend 1 hour phone-free with someone daily for 14 days', icon:'🌿', badge:'MEDIUM', cc1:'rgba(5,150,105,.06)', g1:'#059669', g2:'#0d8a7f', xp:130, participants:1600, progress:45, diffCls:'diff-medium' },
  // ── CREATIVE ────────────────────────────────────────────────────────────────
  { id:'c30', cat:'creative', name:'Art Every Day',      desc:'Create something artistic every day for 30 days', icon:'🎨', badge:'MEDIUM', cc1:'rgba(244,114,182,.06)', g1:'#f472b6', g2:'#8b5cf6', xp:180, participants:1300, progress:35, diffCls:'diff-medium' },
  { id:'c31', cat:'creative', name:'Photo Journal',      desc:'Take 1 meaningful photo every day for 30 days',  icon:'📷', badge:'EASY',   cc1:'rgba(139,92,246,.06)',  g1:'#8b5cf6', g2:'#f472b6', xp:80,   participants:3200, progress:55, diffCls:'diff-easy'   },
  { id:'c32', cat:'creative', name:'Writing Streak',     desc:'Write at least 500 words every day for 14 days', icon:'✏️', badge:'MEDIUM', cc1:'rgba(201,130,10,.06)',  g1:'#c9820a', g2:'#8b5cf6', xp:160,  participants:1800, progress:30, diffCls:'diff-medium' },
  { id:'c33', cat:'creative', name:'Music Practice',     desc:'Practice an instrument 20 min/day for 21 days',  icon:'🎸', badge:'MEDIUM', cc1:'rgba(109,61,189,.06)',  g1:'#6d3dbd', g2:'#f472b6', xp:160,  participants:1100, progress:35, diffCls:'diff-medium' },
  { id:'c34', cat:'creative', name:'Passion Project',    desc:'Work on your passion project every day for 60 days', icon:'🎭', badge:'EPIC', cc1:'rgba(109,61,189,.06)', g1:'#6d3dbd', g2:'#c4374a', xp:600, participants:420,  progress:15, diffCls:'diff-epic'   },
  { id:'c35', cat:'creative', name:'Cook Something New', desc:'Try a brand-new recipe every week for 2 months', icon:'🍳', badge:'EASY',   cc1:'rgba(196,112,40,.06)',  g1:'#c47028', g2:'#c9820a', xp:100,  participants:2100, progress:45, diffCls:'diff-easy'   },
];

// Illustrated SVG artwork per challenge — bg gradient + inline SVG
const CH_ART = {
  c1:  { bg:'linear-gradient(135deg,#fff5f5 30%,#fee2e2 100%)', svg:'<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="82" cy="60" r="42" fill="#FECACA" opacity=".22"/><rect x="7" y="48" width="15" height="30" rx="7.5" fill="#B91C1C"/><rect x="12" y="43" width="13" height="40" rx="6.5" fill="#DC2626"/><rect x="16" y="39" width="9" height="48" rx="4.5" fill="#EF4444"/><rect x="25" y="54" width="70" height="18" rx="9" fill="#DC2626"/><rect x="29" y="55" width="40" height="8" rx="4" fill="rgba(255,255,255,.22)"/><rect x="95" y="39" width="9" height="48" rx="4.5" fill="#EF4444"/><rect x="95" y="43" width="13" height="40" rx="6.5" fill="#DC2626"/><rect x="98" y="48" width="15" height="30" rx="7.5" fill="#B91C1C"/><rect x="50" y="54" width="8" height="18" rx="3" fill="#991B1B" opacity=".35"/><rect x="62" y="54" width="8" height="18" rx="3" fill="#991B1B" opacity=".35"/><circle cx="26" cy="27" r="4.5" fill="#FCA5A5"/><circle cx="110" cy="24" r="3.5" fill="#FCA5A5" opacity=".8"/><circle cx="116" cy="36" r="2.5" fill="#FCA5A5" opacity=".6"/></svg>' },
  c2:  { bg:'linear-gradient(135deg,#f0f9ff 30%,#e0f2fe 100%)', svg:'<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="78" cy="64" r="42" fill="#BAE6FD" opacity=".25"/><rect x="55" y="14" width="26" height="11" rx="4" fill="#0369A1"/><rect x="57" y="16" width="22" height="7" rx="3" fill="#0284C7"/><rect x="57" y="25" width="22" height="8" rx="3" fill="#0EA5E9"/><rect x="46" y="33" width="44" height="58" rx="12" fill="#0EA5E9"/><rect x="48" y="35" width="40" height="54" rx="10" fill="#38BDF8"/><rect x="50" y="37" width="14" height="48" rx="7" fill="rgba(255,255,255,.22)"/><rect x="48" y="64" width="40" height="25" rx="0 0 10 10" fill="#0EA5E9" opacity=".4"/><path d="M68 50 Q64 42 68 36 Q72 42 76 50 Q76 58 68 58 Q60 58 68 50Z" fill="white" opacity=".75"/><path d="M34 58 Q22 44 38 40 Q35 52 34 58Z" fill="#34D399"/><path d="M36 56 Q27 46 40 43" stroke="#059669" stroke-width="1.8" stroke-linecap="round" fill="none"/><path d="M106 50 Q118 36 112 58 Q104 54 106 50Z" fill="#34D399"/><path d="M104 52 Q114 40 110 56" stroke="#059669" stroke-width="1.8" stroke-linecap="round" fill="none"/><circle cx="38" cy="76" r="3" fill="#7DD3FC"/><circle cx="114" cy="72" r="3" fill="#7DD3FC" opacity=".8"/><circle cx="32" cy="89" r="2" fill="#BAE6FD"/><circle cx="116" cy="86" r="2" fill="#BAE6FD"/><circle cx="112" cy="28" r="3.5" fill="#7DD3FC" opacity=".7"/></svg>' },
  c3:  { bg:'linear-gradient(135deg,#fff7ed 30%,#fed7aa 100%)', svg:'<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="78" cy="62" r="40" fill="#FED7AA" opacity=".28"/><circle cx="74" cy="24" r="11" fill="#FB923C"/><circle cx="74" cy="24" r="7" fill="#FDBA74"/><path d="M70 35 Q64 48 58 60" stroke="#EA580C" stroke-width="7" stroke-linecap="round" fill="none"/><path d="M70 35 Q76 48 82 58" stroke="#EA580C" stroke-width="7" stroke-linecap="round" fill="none"/><path d="M58 60 Q50 72 46 82" stroke="#C2410C" stroke-width="6" stroke-linecap="round" fill="none"/><path d="M82 58 Q88 70 86 82" stroke="#C2410C" stroke-width="6" stroke-linecap="round" fill="none"/><path d="M66 42 Q54 38 44 48" stroke="#FB923C" stroke-width="5.5" stroke-linecap="round" fill="none"/><path d="M78 40 Q90 34 98 42" stroke="#FB923C" stroke-width="5.5" stroke-linecap="round" fill="none"/><path d="M20 68 L38 68" stroke="#FDBA74" stroke-width="3" stroke-linecap="round"/><path d="M16 78 L34 78" stroke="#FDBA74" stroke-width="2.5" stroke-linecap="round"/><circle cx="112" cy="30" r="3.5" fill="#FED7AA" opacity=".8"/><circle cx="118" cy="44" r="2.5" fill="#FED7AA" opacity=".6"/></svg>' },
  c4:  { bg:'linear-gradient(135deg,#f0f9ff 30%,#e0f2fe 100%)', svg:'<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="78" cy="58" r="40" fill="#BAE6FD" opacity=".28"/><rect x="26" y="56" width="82" height="38" rx="10" fill="#0369A1"/><path d="M26 68 Q36 62 46 68 Q56 74 66 68 Q76 62 86 68 Q96 74 108 68" stroke="rgba(255,255,255,.35)" stroke-width="2.5" fill="none"/><path d="M26 78 Q36 72 46 78 Q56 84 66 78 Q76 72 86 78 Q96 84 108 78" stroke="rgba(255,255,255,.25)" stroke-width="2" fill="none"/><circle cx="70" cy="42" r="10" fill="#FDBA74"/><circle cx="70" cy="42" r="7" fill="#FEF3C7"/><path d="M60 52 Q54 60 50 70" stroke="#0284C7" stroke-width="7" stroke-linecap="round" fill="none"/><path d="M80 50 Q90 56 98 60" stroke="#0284C7" stroke-width="7" stroke-linecap="round" fill="none"/><circle cx="28" cy="40" r="3.5" fill="#7DD3FC"/><circle cx="20" cy="54" r="2.5" fill="#7DD3FC" opacity=".8"/><circle cx="114" cy="44" r="3" fill="#BAE6FD" opacity=".8"/></svg>' },
  c5:  { bg:'linear-gradient(135deg,#f0fdf4 30%,#dcfce7 100%)', svg:'<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="72" cy="64" r="40" fill="#BBF7D0" opacity=".28"/><ellipse cx="72" cy="88" rx="34" ry="8" fill="#15803D" opacity=".3"/><ellipse cx="72" cy="84" rx="34" ry="8" fill="#22C55E"/><rect x="38" y="52" width="68" height="32" fill="#16A34A"/><ellipse cx="72" cy="52" rx="34" ry="10" fill="#4ADE80"/><ellipse cx="72" cy="48" rx="30" ry="8" fill="#86EFAC"/><circle cx="58" cy="46" r="7" fill="#EF4444"/><circle cx="72" cy="44" r="8" fill="#FDBA74"/><circle cx="86" cy="46" r="6" fill="#4ADE80"/><path d="M56 46 Q52 38 60 34" stroke="#16A34A" stroke-width="2.5" stroke-linecap="round" fill="none"/><path d="M84 44 Q90 38 84 32" stroke="#16A34A" stroke-width="2.5" stroke-linecap="round" fill="none"/><path d="M38 60 Q38 68 40 76" stroke="rgba(255,255,255,.2)" stroke-width="4" stroke-linecap="round" fill="none"/><circle cx="26" cy="44" r="4" fill="#A7F3D0"/><circle cx="20" cy="58" r="3" fill="#A7F3D0" opacity=".8"/></svg>' },
  c6:  { bg:'linear-gradient(135deg,#faf5ff 30%,#ede9fe 100%)', svg:'<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="80" cy="62" r="42" fill="#C4B5FD" opacity=".2"/><circle cx="72" cy="58" r="34" fill="#FDE68A"/><circle cx="72" cy="58" r="28" fill="#FCD34D"/><circle cx="56" cy="48" r="27" fill="#1E1B4B"/><circle cx="72" cy="58" r="32" fill="#FDE68A" opacity=".15"/><text x="96" y="44" font-size="24" fill="#A78BFA" font-family="Georgia,serif" font-weight="bold" opacity=".9">z</text><text x="104" y="28" font-size="18" fill="#8B5CF6" font-family="Georgia,serif" font-weight="bold" opacity=".8">z</text><text x="110" y="54" font-size="14" fill="#7C3AED" font-family="Georgia,serif" font-weight="bold" opacity=".65">z</text><path d="M26 48 L27.5 43 L29 48 L34 49.5 L29 51 L27.5 56 L26 51 L21 49.5Z" fill="#FDE68A" opacity=".75"/><path d="M108 76 L109 73 L110 76 L113 77 L110 78 L109 81 L108 78 L105 77Z" fill="#C4B5FD" opacity=".7"/><circle cx="20" cy="68" r="2.5" fill="#FDE68A" opacity=".8"/><circle cx="32" cy="82" r="2" fill="#FDE68A" opacity=".6"/><circle cx="112" cy="82" r="2.5" fill="#DDD6FE" opacity=".8"/></svg>' },
  c7:  { bg:'linear-gradient(135deg,#fff5f5 30%,#fef2f2 100%)', svg:'<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="74" cy="60" r="40" fill="#FECACA" opacity=".25"/><path d="M60 25 Q60 18 66 16" stroke="#16A34A" stroke-width="3.5" stroke-linecap="round" fill="none"/><ellipse cx="72" cy="60" rx="24" ry="34" fill="#EF4444"/><ellipse cx="72" cy="54" rx="20" ry="28" fill="#F87171"/><ellipse cx="72" cy="48" rx="14" ry="10" fill="#FCA5A5"/><rect x="56" y="56" width="32" height="8" rx="4" fill="#DC2626" opacity=".4"/><line x1="44" y1="36" x2="100" y2="92" stroke="white" stroke-width="6" stroke-linecap="round"/><line x1="100" y1="36" x2="44" y2="92" stroke="white" stroke-width="6" stroke-linecap="round"/><circle cx="26" cy="42" r="4" fill="#FCA5A5"/><circle cx="20" cy="56" r="3" fill="#FCA5A5" opacity=".8"/><circle cx="108" cy="30" r="3.5" fill="#FCA5A5" opacity=".7"/></svg>' },
  c8:  { bg:'linear-gradient(135deg,#fff1f2 30%,#ffe4e6 100%)', svg:'<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="80" cy="60" r="42" fill="#FCA5A5" opacity=".22"/><rect x="5" y="46" width="16" height="34" rx="8" fill="#991B1B"/><rect x="10" y="41" width="14" height="44" rx="7" fill="#B91C1C"/><rect x="14" y="37" width="10" height="52" rx="5" fill="#DC2626"/><rect x="24" y="52" width="72" height="22" rx="11" fill="#DC2626"/><rect x="28" y="53" width="38" height="9" rx="4.5" fill="rgba(255,255,255,.2)"/><rect x="96" y="37" width="10" height="52" rx="5" fill="#DC2626"/><rect x="96" y="41" width="14" height="44" rx="7" fill="#B91C1C"/><rect x="99" y="46" width="16" height="34" rx="8" fill="#991B1B"/><rect x="52" y="52" width="6" height="22" rx="2" fill="#7F1D1D" opacity=".4"/><rect x="62" y="52" width="6" height="22" rx="2" fill="#7F1D1D" opacity=".4"/><circle cx="28" cy="26" r="5" fill="#FCA5A5"/><circle cx="112" cy="24" r="4" fill="#FCA5A5" opacity=".8"/><circle cx="118" cy="36" r="3" fill="#FCA5A5" opacity=".6"/></svg>' },
  c9:  { bg:'linear-gradient(135deg,#faf5ff 30%,#f3e8ff 100%)', svg:'<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="78" cy="60" r="40" fill="#DDD6FE" opacity=".25"/><rect x="30" y="52" width="70" height="22" rx="11" fill="#6B7280"/><rect x="32" y="54" width="22" height="18" rx="9" fill="#9CA3AF"/><rect x="54" y="54" width="44" height="18" rx="8" fill="#F9FAFB"/><rect x="56" y="56" width="40" height="14" rx="6" fill="#F3F4F6"/><path d="M88 50 Q88 42 92 40 Q98 40 100 46 Q104 52 100 56" stroke="#D97706" stroke-width="4" stroke-linecap="round" fill="none"/><path d="M90 48 Q90 40 94 38" stroke="#FBBF24" stroke-width="2.5" stroke-linecap="round" fill="none" opacity=".7"/><line x1="26" y1="42" x2="96" y2="88" stroke="#EF4444" stroke-width="5" stroke-linecap="round"/><line x1="96" y1="42" x2="26" y2="88" stroke="#EF4444" stroke-width="5" stroke-linecap="round"/><circle cx="20" cy="50" r="3.5" fill="#E9D5FF"/><circle cx="14" cy="64" r="2.5" fill="#E9D5FF" opacity=".8"/></svg>' },
  c10: { bg:'linear-gradient(135deg,#f0fdf4 30%,#dcfce7 100%)', svg:'<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="76" cy="62" r="42" fill="#BBF7D0" opacity=".25"/><ellipse cx="72" cy="96" rx="36" ry="6" fill="#15803D" opacity=".2"/><rect x="36" y="88" width="72" height="8" rx="4" fill="#4ADE80"/><circle cx="72" cy="38" r="12" fill="#6EE7B7"/><circle cx="72" cy="38" r="8" fill="#A7F3D0"/><path d="M72 50 L72 72" stroke="#10B981" stroke-width="8" stroke-linecap="round" fill="none"/><path d="M62 58 Q48 52 40 60" stroke="#10B981" stroke-width="7" stroke-linecap="round" fill="none"/><path d="M82 58 Q96 52 104 60" stroke="#10B981" stroke-width="7" stroke-linecap="round" fill="none"/><path d="M64 72 Q54 82 52 92" stroke="#059669" stroke-width="6.5" stroke-linecap="round" fill="none"/><path d="M80 72 Q90 82 88 92" stroke="#059669" stroke-width="6.5" stroke-linecap="round" fill="none"/><circle cx="26" cy="46" r="4" fill="#A7F3D0"/><circle cx="20" cy="60" r="3" fill="#A7F3D0" opacity=".8"/><path d="M106 34 L107.5 30 L109 34 L113 35.5 L109 37 L107.5 41 L106 37 L102 35.5Z" fill="#6EE7B7" opacity=".7"/></svg>' },
  c11: { bg:'linear-gradient(135deg,#fffbeb 30%,#fef3c7 100%)', svg:'<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="76" cy="62" r="40" fill="#FDE68A" opacity=".28"/><rect x="28" y="22" width="56" height="72" rx="7" fill="#92400E"/><rect x="34" y="22" width="50" height="72" rx="5" fill="#FFFBEB"/><rect x="28" y="22" width="12" height="72" rx="5" fill="#78350F"/><rect x="30" y="24" width="8" height="68" rx="4" fill="#92400E"/><line x1="46" y1="38" x2="78" y2="38" stroke="#D97706" stroke-width="1.8" opacity=".5"/><line x1="46" y1="48" x2="78" y2="48" stroke="#D97706" stroke-width="1.8" opacity=".45"/><line x1="46" y1="58" x2="74" y2="58" stroke="#D97706" stroke-width="1.8" opacity=".4"/><line x1="46" y1="68" x2="70" y2="68" stroke="#D97706" stroke-width="1.8" opacity=".35"/><path d="M52 77 Q52 72 56 72 Q60 72 60 77 Q60 72 64 72 Q68 72 68 77 Q68 82 60 87 Q52 82 52 77Z" fill="#EF4444"/><rect x="80" y="64" width="9" height="38" rx="4.5" fill="#F59E0B" transform="rotate(-30 80 64)"/><circle cx="108" cy="24" r="4" fill="#FDE68A"/><circle cx="114" cy="36" r="3" fill="#FDE68A" opacity=".8"/></svg>' },
  c12: { bg:'linear-gradient(135deg,#eef2ff 30%,#e0e7ff 100%)', svg:'<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="78" cy="60" r="42" fill="#C7D2FE" opacity=".22"/><circle cx="72" cy="68" r="28" stroke="#818CF8" stroke-width="2" fill="rgba(199,210,254,.15)"/><circle cx="72" cy="68" r="18" stroke="#6366F1" stroke-width="2" fill="rgba(99,102,241,.12)"/><circle cx="72" cy="68" r="8" fill="#4338CA"/><circle cx="72" cy="50" r="11" fill="#6B7280"/><circle cx="72" cy="50" r="8" fill="#FDBA74"/><circle cx="72" cy="50" r="5" fill="#FEF3C7"/><path d="M66 58 Q60 64 60 72" stroke="#4338CA" stroke-width="6" stroke-linecap="round" fill="none"/><path d="M78 58 Q84 64 84 72" stroke="#4338CA" stroke-width="6" stroke-linecap="round" fill="none"/><path d="M62 76 Q56 86 58 94" stroke="#3730A3" stroke-width="5.5" stroke-linecap="round" fill="none"/><path d="M82 76 Q88 86 86 94" stroke="#3730A3" stroke-width="5.5" stroke-linecap="round" fill="none"/><path d="M104 32 L105.5 28 L107 32 L111 33.5 L107 35 L105.5 39 L104 35 L100 33.5Z" fill="#818CF8" opacity=".7"/><circle cx="26" cy="44" r="3.5" fill="#E0E7FF"/><circle cx="20" cy="58" r="2.5" fill="#E0E7FF" opacity=".8"/></svg>' },
  c13: { bg:'linear-gradient(135deg,#faf5ff 30%,#ede9fe 100%)', svg:'<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="76" cy="60" r="40" fill="#DDD6FE" opacity=".28"/><rect x="22" y="26" width="52" height="40" rx="10" fill="#7C3AED"/><rect x="24" y="28" width="48" height="36" rx="8" fill="#8B5CF6"/><path d="M38 62 L44 72 L44 62Z" fill="#7C3AED"/><text x="32" y="50" font-size="18" fill="white" font-family="Arial,sans-serif" font-weight="bold">Aa</text><rect x="50" y="52" width="52" height="38" rx="10" fill="#6D28D9"/><rect x="52" y="54" width="48" height="34" rx="8" fill="#7C3AED"/><path d="M86 86 L80 90 L80 86Z" fill="#6D28D9"/><text x="58" y="74" font-size="16" fill="#DDD6FE" font-family="Arial,sans-serif" font-weight="bold">&#25991;A</text><circle cx="108" cy="28" r="4" fill="#E9D5FF"/><circle cx="114" cy="40" r="3" fill="#E9D5FF" opacity=".8"/><circle cx="24" cy="88" r="3.5" fill="#DDD6FE" opacity=".7"/></svg>' },
  c14: { bg:'linear-gradient(135deg,#fffbeb 30%,#fef3c7 100%)', svg:'<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="76" cy="62" r="40" fill="#FDE68A" opacity=".28"/><rect x="24" y="24" width="78" height="64" rx="6" fill="#92400E"/><path d="M24 24 Q63 24 63 88 Q24 88 24 24Z" fill="#FFFBEB"/><path d="M63 24 Q102 24 102 88 Q63 88 63 24Z" fill="#FEF3C7"/><rect x="24" y="24" width="4" height="64" rx="2" fill="#78350F"/><rect x="98" y="24" width="4" height="64" rx="2" fill="#78350F"/><line x1="30" y1="38" x2="60" y2="38" stroke="#D97706" stroke-width="1.5" opacity=".5"/><line x1="30" y1="46" x2="60" y2="46" stroke="#D97706" stroke-width="1.5" opacity=".45"/><line x1="30" y1="54" x2="58" y2="54" stroke="#D97706" stroke-width="1.5" opacity=".4"/><line x1="66" y1="38" x2="96" y2="38" stroke="#D97706" stroke-width="1.5" opacity=".5"/><line x1="66" y1="46" x2="96" y2="46" stroke="#D97706" stroke-width="1.5" opacity=".45"/><line x1="66" y1="54" x2="94" y2="54" stroke="#D97706" stroke-width="1.5" opacity=".4"/><rect x="60" y="22" width="6" height="14" rx="3" fill="#EF4444"/><circle cx="108" cy="26" r="4" fill="#FDE68A"/><circle cx="114" cy="38" r="3" fill="#FDE68A" opacity=".8"/></svg>' },
  c15: { bg:'linear-gradient(135deg,#fff7ed 30%,#ffedd5 100%)', svg:'<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="70" cy="62" r="36" fill="#FDE68A" opacity=".3"/><circle cx="70" cy="62" r="26" fill="#F59E0B"/><circle cx="70" cy="62" r="20" fill="#FCD34D"/><line x1="70" y1="22" x2="70" y2="32" stroke="#FCD34D" stroke-width="4.5" stroke-linecap="round"/><line x1="70" y1="92" x2="70" y2="102" stroke="#FCD34D" stroke-width="4.5" stroke-linecap="round"/><line x1="30" y1="62" x2="40" y2="62" stroke="#FCD34D" stroke-width="4.5" stroke-linecap="round"/><line x1="100" y1="62" x2="110" y2="62" stroke="#FCD34D" stroke-width="4.5" stroke-linecap="round"/><line x1="41" y1="33" x2="48" y2="40" stroke="#FCD34D" stroke-width="4" stroke-linecap="round"/><line x1="92" y1="84" x2="99" y2="91" stroke="#FCD34D" stroke-width="4" stroke-linecap="round"/><line x1="99" y1="33" x2="92" y2="40" stroke="#FCD34D" stroke-width="4" stroke-linecap="round"/><line x1="48" y1="84" x2="41" y2="91" stroke="#FCD34D" stroke-width="4" stroke-linecap="round"/><path d="M18 80 Q22 72 30 72 L32 72" stroke="#FDBA74" stroke-width="2.5" stroke-linecap="round" fill="none"/></svg>' },
  c16: { bg:'linear-gradient(135deg,#fffbeb 30%,#fef3c7 100%)', svg:'<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="76" cy="62" r="40" fill="#FDE68A" opacity=".25"/><rect x="28" y="78" width="64" height="14" rx="5" fill="#DC2626"/><rect x="30" y="80" width="14" height="10" rx="3" fill="#B91C1C"/><rect x="30" y="64" width="60" height="18" rx="5" fill="#2563EB"/><rect x="32" y="66" width="13" height="14" rx="3" fill="#1D4ED8"/><rect x="32" y="50" width="56" height="18" rx="5" fill="#D97706"/><rect x="34" y="52" width="12" height="14" rx="3" fill="#B45309"/><rect x="34" y="38" width="52" height="16" rx="5" fill="#16A34A"/><rect x="36" y="40" width="11" height="12" rx="3" fill="#15803D"/><rect x="34" y="26" width="48" height="16" rx="5" fill="#7C3AED"/><rect x="36" y="28" width="10" height="12" rx="3" fill="#6D28D9"/><circle cx="108" cy="32" r="4" fill="#FDE68A"/><circle cx="114" cy="44" r="3" fill="#FDE68A" opacity=".8"/></svg>' },
  c17: { bg:'linear-gradient(135deg,#eff6ff 30%,#dbeafe 100%)', svg:'<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="78" cy="58" r="40" fill="#BFDBFE" opacity=".28"/><rect x="20" y="26" width="80" height="54" rx="7" fill="#1E40AF"/><rect x="22" y="28" width="76" height="50" rx="6" fill="#1E293B"/><rect x="24" y="30" width="72" height="46" rx="5" fill="#0F172A"/><text x="30" y="48" font-size="8.5" fill="#34D399" font-family="Courier New,monospace">&lt;div class=</text><text x="30" y="58" font-size="8.5" fill="#60A5FA" font-family="Courier New,monospace">  fn() {</text><text x="30" y="68" font-size="8.5" fill="#F472B6" font-family="Courier New,monospace">  return;</text><rect x="14" y="80" width="92" height="10" rx="5" fill="#3B82F6"/><rect x="40" y="80" width="40" height="5" rx="2.5" fill="#1D4ED8"/><circle cx="86" cy="34" r="5" fill="#34D399" opacity=".5"/><circle cx="94" cy="34" r="5" fill="#FBBF24" opacity=".5"/><circle cx="102" cy="34" r="5" fill="#EF4444" opacity=".5"/><circle cx="108" cy="22" r="4" fill="#BFDBFE"/><circle cx="114" cy="34" r="3" fill="#BFDBFE" opacity=".7"/></svg>' },
  c18: { bg:'linear-gradient(135deg,#f0f9ff 30%,#e0f2fe 100%)', svg:'<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="66" cy="62" r="36" fill="#0EA5E9" opacity=".12"/><circle cx="66" cy="62" r="34" stroke="#0EA5E9" stroke-width="3" fill="rgba(186,230,253,.18)"/><ellipse cx="66" cy="62" rx="15" ry="34" stroke="#0EA5E9" stroke-width="2" fill="none"/><line x1="32" y1="62" x2="100" y2="62" stroke="#0EA5E9" stroke-width="2"/><line x1="33" y1="46" x2="99" y2="46" stroke="#0EA5E9" stroke-width="1.5" opacity=".55"/><line x1="33" y1="78" x2="99" y2="78" stroke="#0EA5E9" stroke-width="1.5" opacity=".55"/><line x1="36" y1="32" x2="96" y2="32" stroke="#0EA5E9" stroke-width="1.2" opacity=".35"/><circle cx="104" cy="28" r="7" fill="#FDE68A"/><circle cx="104" cy="28" r="5" fill="#FCD34D"/><path d="M56 28 Q64 32 60 40" stroke="#FBBF24" stroke-width="2.5" stroke-linecap="round" fill="none"/><rect x="94" y="30" width="6" height="14" rx="2" fill="#EF4444" transform="rotate(20 94 30)"/><circle cx="112" cy="58" r="3.5" fill="#7DD3FC"/><circle cx="116" cy="70" r="2.5" fill="#BAE6FD" opacity=".8"/></svg>' },
  c19: { bg:'linear-gradient(135deg,#fffbeb 30%,#fef3c7 100%)', svg:'<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="74" cy="60" r="42" fill="#FDE68A" opacity=".28"/><rect x="52" y="20" width="32" height="52" rx="16" fill="#D97706"/><rect x="54" y="22" width="28" height="48" rx="14" fill="#F59E0B"/><rect x="58" y="24" width="20" height="40" rx="10" fill="#FCD34D"/><rect x="62" y="26" width="12" height="36" rx="6" fill="#FEF3C7"/><path d="M36 58 Q36 86 68 86 Q100 86 100 58" stroke="#D97706" stroke-width="5" stroke-linecap="round" fill="none"/><rect x="65" y="86" width="6" height="20" rx="3" fill="#D97706"/><rect x="52" y="104" width="32" height="7" rx="3.5" fill="#F59E0B"/><path d="M22 46 Q18 62 22 72" stroke="#FDE68A" stroke-width="3" stroke-linecap="round" fill="none" opacity=".7"/><path d="M16 40 Q10 60 16 76" stroke="#FDE68A" stroke-width="2.5" stroke-linecap="round" fill="none" opacity=".5"/><circle cx="108" cy="24" r="4" fill="#FDE68A"/><circle cx="114" cy="36" r="3" fill="#FDE68A" opacity=".8"/></svg>' },
  c20: { bg:'linear-gradient(135deg,#f0fdf4 30%,#dcfce7 100%)', svg:'<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="62" cy="64" r="42" fill="#BBF7D0" opacity=".2"/><circle cx="62" cy="64" r="38" stroke="#BBF7D0" stroke-width="3" fill="rgba(187,247,208,.08)"/><circle cx="62" cy="64" r="28" stroke="#4ADE80" stroke-width="3" fill="rgba(74,222,128,.08)"/><circle cx="62" cy="64" r="18" stroke="#22C55E" stroke-width="3" fill="rgba(34,197,94,.12)"/><circle cx="62" cy="64" r="8" fill="#16A34A"/><circle cx="62" cy="64" r="4" fill="#15803D"/><line x1="100" y1="20" x2="62" y2="64" stroke="#EF4444" stroke-width="3.5" stroke-linecap="round"/><path d="M96 13 L106 16 L100 24Z" fill="#EF4444"/><circle cx="110" cy="26" r="3.5" fill="#A7F3D0"/><circle cx="116" cy="38" r="2.5" fill="#A7F3D0" opacity=".8"/></svg>' },
  c21: { bg:'linear-gradient(135deg,#fffbeb 30%,#fef3c7 100%)', svg:'<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="76" cy="64" r="40" fill="#FDE68A" opacity=".28"/><ellipse cx="70" cy="90" rx="28" ry="8" fill="#D97706"/><ellipse cx="70" cy="88" rx="28" ry="8" fill="#F59E0B"/><rect x="42" y="58" width="56" height="30" fill="#F59E0B"/><ellipse cx="70" cy="58" rx="28" ry="9" fill="#FCD34D"/><ellipse cx="70" cy="55" rx="24" ry="7" fill="#FDE68A"/><ellipse cx="70" cy="80" rx="28" ry="9" fill="#FBBF24"/><ellipse cx="84" cy="74" rx="22" ry="8" fill="#D97706"/><rect x="62" y="46" width="44" height="28" fill="#FCD34D" opacity=".85"/><ellipse cx="84" cy="46" rx="22" ry="8" fill="#FDE68A"/><text x="52" y="78" font-size="16" fill="#92400E" font-family="Arial,sans-serif" font-weight="bold">$</text><text x="72" y="66" font-size="14" fill="#B45309" font-family="Arial,sans-serif" font-weight="bold">$</text><circle cx="22" cy="44" r="4" fill="#FDE68A"/><circle cx="16" cy="58" r="3" fill="#FDE68A" opacity=".8"/></svg>' },
  c22: { bg:'linear-gradient(135deg,#fffbeb 30%,#fef9c3 100%)', svg:'<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="74" cy="62" r="40" fill="#FDE68A" opacity=".28"/><rect x="44" y="20" width="46" height="78" rx="8" fill="#1E293B"/><rect x="46" y="22" width="42" height="74" rx="6" fill="#334155"/><rect x="48" y="26" width="38" height="58" rx="4" fill="#0F172A"/><circle cx="67" cy="90" r="4" fill="#475569"/><circle cx="67" cy="90" r="2.5" fill="#94A3B8"/><line x1="40" y1="34" x2="94" y2="86" stroke="#EF4444" stroke-width="6" stroke-linecap="round"/><line x1="94" y1="34" x2="40" y2="86" stroke="#EF4444" stroke-width="6" stroke-linecap="round"/><circle cx="108" cy="26" r="4" fill="#FDE68A"/><circle cx="114" cy="38" r="3" fill="#FDE68A" opacity=".8"/></svg>' },
  c23: { bg:'linear-gradient(135deg,#fdf4ff 30%,#fae8ff 100%)', svg:'<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="72" cy="60" r="40" fill="#F5D0FE" opacity=".28"/><rect x="54" y="16" width="28" height="50" rx="14" fill="#A21CAF"/><rect x="56" y="18" width="24" height="46" rx="12" fill="#C026D3"/><rect x="60" y="20" width="16" height="40" rx="8" fill="#D946EF"/><rect x="64" y="22" width="8" height="34" rx="4" fill="#F0ABFC" opacity=".5"/><path d="M36 56 Q36 82 68 82 Q100 82 100 56" stroke="#A21CAF" stroke-width="5" stroke-linecap="round" fill="none"/><rect x="65" y="82" width="6" height="18" rx="3" fill="#A21CAF"/><rect x="54" y="98" width="28" height="6" rx="3" fill="#C026D3"/><text x="108" y="38" font-size="16" fill="#C026D3" font-family="Georgia,serif" font-weight="bold" opacity=".8">&#9834;</text><text x="114" y="56" font-size="13" fill="#A21CAF" font-family="Georgia,serif" opacity=".7">&#9835;</text><circle cx="24" cy="44" r="4" fill="#F0ABFC"/><circle cx="18" cy="58" r="3" fill="#F0ABFC" opacity=".8"/></svg>' },
  c24: { bg:'linear-gradient(135deg,#fffbeb 30%,#fef9c3 100%)', svg:'<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="76" cy="64" r="42" fill="#FDE68A" opacity=".25"/><path d="M28 76 Q28 64 40 64 L70 64 Q78 64 82 56 Q86 47 94 50 Q102 52 96 64 L84 82 Q78 90 70 90 L40 90 Q28 90 28 80Z" fill="#FDE68A"/><path d="M28 78 Q31 68 42 68 L68 68" stroke="#D97706" stroke-width="1.5" opacity=".35" fill="none"/><path d="M55 54 Q55 44 62 44 Q69 44 69 54 Q69 44 76 44 Q83 44 83 54 Q83 64 69 72 Q55 64 55 54Z" fill="#EF4444"/><path d="M36 58 Q24 44 40 38 Q38 52 36 58Z" fill="#34D399"/><path d="M38 56 Q28 44 42 40" stroke="#059669" stroke-width="1.5" stroke-linecap="round" fill="none"/><circle cx="108" cy="26" r="4" fill="#FDE68A"/><circle cx="114" cy="38" r="3" fill="#FDE68A" opacity=".8"/><circle cx="24" cy="44" r="3.5" fill="#FDE68A" opacity=".7"/></svg>' },
  c25: { bg:'linear-gradient(135deg,#fdf4ff 30%,#fce7f3 100%)', svg:'<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="72" cy="60" r="40" fill="#FBCFE8" opacity=".28"/><rect x="18" y="24" width="60" height="44" rx="12" fill="#DB2777"/><rect x="20" y="26" width="56" height="40" rx="10" fill="#EC4899"/><path d="M34 64 L40 76 L40 64Z" fill="#DB2777"/><path d="M40 44 Q40 36 46 36 Q52 36 52 44 Q52 36 58 36 Q64 36 64 44 Q64 52 52 58 Q40 52 40 44Z" fill="white"/><rect x="44" y="58" width="58" height="42" rx="12" fill="#BE185D"/><rect x="46" y="60" width="54" height="38" rx="10" fill="#DB2777"/><path d="M86 96 L80 100 L80 96Z" fill="#BE185D"/><path d="M60 76 Q60 70 65 70 Q70 70 70 76 Q70 70 75 70 Q80 70 80 76 Q80 82 70 87 Q60 82 60 76Z" fill="white"/><circle cx="108" cy="26" r="4" fill="#FBCFE8"/><circle cx="114" cy="38" r="3" fill="#FBCFE8" opacity=".8"/></svg>' },
  c26: { bg:'linear-gradient(135deg,#eff6ff 30%,#dbeafe 100%)', svg:'<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="68" cy="58" r="42" fill="#BFDBFE" opacity=".25"/><circle cx="60" cy="38" r="14" fill="#3B82F6"/><circle cx="60" cy="38" r="10" fill="#60A5FA"/><circle cx="60" cy="38" r="6" fill="#93C5FD"/><path d="M34 88 Q34 66 60 66 Q86 66 86 88Z" fill="#2563EB"/><circle cx="96" cy="34" r="11" fill="#60A5FA"/><circle cx="96" cy="34" r="7" fill="#93C5FD"/><path d="M78 82 Q78 64 96 64 Q114 64 114 82Z" fill="#3B82F6" opacity=".7"/><circle cx="24" cy="34" r="11" fill="#60A5FA"/><circle cx="24" cy="34" r="7" fill="#93C5FD"/><path d="M6 82 Q6 64 24 64 Q42 64 42 82Z" fill="#3B82F6" opacity=".7"/><line x1="60" y1="38" x2="96" y2="34" stroke="#BFDBFE" stroke-width="2.5" stroke-dasharray="4 3"/><line x1="60" y1="38" x2="24" y2="34" stroke="#BFDBFE" stroke-width="2.5" stroke-dasharray="4 3"/></svg>' },
  c27: { bg:'linear-gradient(135deg,#f0fdf4 30%,#dcfce7 100%)', svg:'<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="68" cy="64" r="40" fill="#BBF7D0" opacity=".28"/><path d="M15 82 Q18 68 30 68 L56 68 Q60 60 66 58 Q72 56 74 66 L74 84 Q68 92 60 92 L30 92 Q15 92 15 84Z" fill="#34D399"/><path d="M121 82 Q118 68 106 68 L80 68 L80 84 Q74 92 82 92 L112 92 Q127 92 127 84 Q127 70 121 82Z" fill="#10B981"/><path d="M44 56 Q44 46 50 46 Q56 46 56 56 Q56 46 62 46 Q68 46 68 56 Q68 65 56 72 Q44 65 44 56Z" fill="#EF4444"/><path d="M18 62 Q8 48 24 42 Q22 56 18 62Z" fill="#86EFAC"/><path d="M122 60 Q132 48 116 42 Q118 56 122 60Z" fill="#86EFAC"/><circle cx="26" cy="34" r="4" fill="#A7F3D0"/><circle cx="112" cy="34" r="4" fill="#A7F3D0"/><circle cx="20" cy="50" r="3" fill="#A7F3D0" opacity=".8"/></svg>' },
  c28: { bg:'linear-gradient(135deg,#fff7ed 30%,#ffedd5 100%)', svg:'<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="72" cy="64" r="40" fill="#FED7AA" opacity=".28"/><polygon points="68,18 110,54 26,54" fill="#EA580C"/><polygon points="68,22 106,54 30,54" fill="#F97316"/><rect x="28" y="54" width="80" height="44" rx="4" fill="#FB923C"/><rect x="50" y="68" width="36" height="30" rx="5" fill="#FDBA74"/><rect x="30" y="60" width="22" height="22" rx="4" fill="#FED7AA"/><rect x="76" y="60" width="22" height="22" rx="4" fill="#FED7AA"/><path d="M60 78 Q60 72 65 72 Q70 72 70 78 Q70 72 75 72 Q80 72 80 78 Q80 84 70 89 Q60 84 60 78Z" fill="#EF4444"/><rect x="84" y="22" width="5" height="28" rx="2.5" fill="#C2410C"/><rect x="80" y="22" width="10" height="6" rx="2" fill="#9A3412"/><circle cx="22" cy="36" r="4" fill="#FED7AA"/><circle cx="16" cy="50" r="3" fill="#FED7AA" opacity=".8"/></svg>' },
  c29: { bg:'linear-gradient(135deg,#f0fdf4 30%,#dcfce7 100%)', svg:'<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="74" cy="58" r="42" fill="#BBF7D0" opacity=".22"/><rect x="62" y="70" width="10" height="34" rx="5" fill="#92400E"/><rect x="64" y="72" width="6" height="30" rx="3" fill="#A16207"/><path d="M67 70 Q67 44 88 24 Q112 14 112 14 Q112 40 92 56 Q78 66 67 70Z" fill="#22C55E"/><path d="M67 70 Q67 44 46 24 Q22 14 22 14 Q22 40 42 56 Q56 66 67 70Z" fill="#16A34A"/><path d="M67 70 L67 28" stroke="#15803D" stroke-width="3.5" stroke-linecap="round"/><path d="M67 50 Q78 42 88 34" stroke="#4ADE80" stroke-width="2" stroke-linecap="round" fill="none" opacity=".6"/><path d="M67 50 Q56 42 46 34" stroke="#4ADE80" stroke-width="2" stroke-linecap="round" fill="none" opacity=".6"/><circle cx="30" cy="88" r="5" fill="#86EFAC"/><circle cx="42" cy="96" r="4" fill="#4ADE80" opacity=".8"/><circle cx="20" cy="96" r="3" fill="#86EFAC" opacity=".7"/><path d="M26 78 L28 74 L30 78 L34 79.5 L30 81 L28 85 L26 81 L22 79.5Z" fill="#86EFAC" opacity=".7"/></svg>' },
  c30: { bg:'linear-gradient(135deg,#fdf4ff 30%,#f3e8ff 100%)', svg:'<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="70" cy="64" r="40" fill="#E9D5FF" opacity=".28"/><rect x="28" y="24" width="60" height="72" rx="4" fill="#FFFBEB"/><rect x="28" y="24" width="60" height="72" rx="4" stroke="#D97706" stroke-width="2" fill="none"/><rect x="28" y="24" width="20" height="72" rx="2" fill="#FEF3C7"/><line x1="54" y1="38" x2="82" y2="38" stroke="#D97706" stroke-width="1.5" opacity=".4"/><line x1="54" y1="48" x2="82" y2="48" stroke="#D97706" stroke-width="1.5" opacity=".38"/><line x1="54" y1="58" x2="80" y2="58" stroke="#D97706" stroke-width="1.5" opacity=".35"/><rect x="84" y="54" width="8" height="42" rx="4" fill="#7C3AED" transform="rotate(-20 84 54)"/><circle cx="86" cy="50" r="6" fill="#6D28D9"/><circle cx="86" cy="50" r="3" fill="#A78BFA"/><circle cx="22" cy="44" r="4" fill="#E9D5FF"/><circle cx="16" cy="58" r="3" fill="#E9D5FF" opacity=".8"/></svg>' },
  c31: { bg:'linear-gradient(135deg,#f0f9ff 30%,#e0f2fe 100%)', svg:'<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="72" cy="64" r="40" fill="#BAE6FD" opacity=".28"/><rect x="22" y="36" width="84" height="58" rx="10" fill="#0369A1"/><rect x="24" y="38" width="80" height="54" rx="8" fill="#0284C7"/><path d="M42 32 L48 24 L76 24 L82 32Z" fill="#0369A1"/><circle cx="64" cy="64" r="20" fill="#075985"/><circle cx="64" cy="64" r="15" fill="#0EA5E9"/><circle cx="64" cy="64" r="9" fill="#38BDF8"/><circle cx="64" cy="64" r="4" fill="#BAE6FD"/><rect x="86" y="42" width="6" height="6" rx="1.5" fill="#38BDF8"/><circle cx="89" cy="39" r="5" fill="#FCD34D"/><circle cx="89" cy="39" r="3" fill="#FEF3C7"/><circle cx="22" cy="34" r="3.5" fill="#7DD3FC" opacity=".7"/><circle cx="110" cy="30" r="4" fill="#BAE6FD"/></svg>' },
  c32: { bg:'linear-gradient(135deg,#fffbeb 30%,#fef3c7 100%)', svg:'<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="72" cy="62" r="40" fill="#FDE68A" opacity=".28"/><path d="M48 92 Q32 96 26 88 Q20 80 28 72 Q34 66 44 68 Q52 56 56 34 Q60 22 70 20 Q78 20 80 28 Q82 36 76 44 L84 92 Q70 96 48 92Z" fill="#D97706"/><path d="M50 90 Q34 94 28 86 Q23 79 30 72 Q36 66 46 68 Q54 56 58 34 Q62 22 70 22 Q77 22 78 30 Q80 37 74 44 L82 90 Q68 94 50 90Z" fill="#F59E0B"/><ellipse cx="64" cy="84" rx="22" ry="10" fill="#B45309"/><ellipse cx="64" cy="82" rx="22" ry="10" fill="#D97706"/><line x1="58" y1="52" x2="78" y2="80" stroke="#FEF3C7" stroke-width="1.5" opacity=".6"/><line x1="54" y1="60" x2="74" y2="86" stroke="#FEF3C7" stroke-width="1.5" opacity=".5"/><text x="94" y="38" font-size="18" fill="#F59E0B" font-family="Georgia,serif" opacity=".8">&#9834;</text><text x="100" y="56" font-size="14" fill="#D97706" font-family="Georgia,serif" opacity=".7">&#9835;</text><circle cx="22" cy="44" r="4" fill="#FDE68A"/><circle cx="16" cy="58" r="3" fill="#FDE68A" opacity=".8"/></svg>' },
  c33: { bg:'linear-gradient(135deg,#faf5ff 30%,#ede9fe 100%)', svg:'<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="72" cy="62" r="40" fill="#DDD6FE" opacity=".28"/><rect x="24" y="36" width="56" height="72" rx="4" fill="#FFFBEB"/><rect x="26" y="38" width="52" height="68" rx="3" fill="#FEF9F0"/><line x1="32" y1="50" x2="74" y2="50" stroke="#D97706" stroke-width="1.5" opacity=".4"/><line x1="32" y1="58" x2="74" y2="58" stroke="#D97706" stroke-width="1.5" opacity=".38"/><line x1="32" y1="66" x2="74" y2="66" stroke="#D97706" stroke-width="1.5" opacity=".35"/><line x1="32" y1="74" x2="68" y2="74" stroke="#D97706" stroke-width="1.5" opacity=".32"/><path d="M88 22 Q98 18 102 26 Q106 34 100 40 L62 88 L52 90 L50 80Z" fill="#7C3AED"/><path d="M90 24 Q98 21 101 28 Q104 35 99 40 L62 86 L54 88 L53 82Z" fill="#8B5CF6"/><path d="M50 80 L52 90 L62 88Z" fill="#4C1D95"/><circle cx="98" cy="24" r="5" fill="#C4B5FD" opacity=".8"/><circle cx="104" cy="36" r="4" fill="#DDD6FE" opacity=".7"/><circle cx="22" cy="44" r="3.5" fill="#E9D5FF"/><circle cx="16" cy="58" r="2.5" fill="#E9D5FF" opacity=".8"/></svg>' },
  c34: { bg:'linear-gradient(135deg,#faf5ff 30%,#f3e8ff 100%)', svg:'<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="72" cy="60" r="42" fill="#E9D5FF" opacity=".22"/><path d="M68 18 L75 42 L100 42 L80 56 L88 80 L68 66 L48 80 L56 56 L36 42 L61 42Z" fill="#7C3AED"/><path d="M68 22 L74 44 L97 44 L78 57 L86 78 L68 65 L50 78 L58 57 L39 44 L62 44Z" fill="#A78BFA"/><circle cx="68" cy="56" r="8" fill="#DDD6FE" opacity=".7"/><circle cx="68" cy="56" r="4" fill="#EDE9FE"/><path d="M105 24 L106.5 20 L108 24 L112 25.5 L108 27 L106.5 31 L105 27 L101 25.5Z" fill="#C4B5FD" opacity=".8"/><path d="M22 44 L23.5 40 L25 44 L29 45.5 L25 47 L23.5 51 L22 47 L18 45.5Z" fill="#DDD6FE" opacity=".7"/><circle cx="112" cy="50" r="3" fill="#E9D5FF"/><circle cx="22" cy="76" r="3" fill="#E9D5FF" opacity=".7"/></svg>' },
  c35: { bg:'linear-gradient(135deg,#fff7ed 30%,#ffedd5 100%)', svg:'<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="74" cy="64" r="40" fill="#FED7AA" opacity=".28"/><ellipse cx="66" cy="78" rx="34" ry="10" fill="#92400E" opacity=".3"/><ellipse cx="66" cy="76" rx="34" ry="10" fill="#B45309"/><rect x="32" y="50" width="68" height="26" fill="#D97706"/><ellipse cx="66" cy="50" rx="34" ry="10" fill="#F59E0B"/><ellipse cx="66" cy="47" rx="30" ry="8" fill="#FCD34D"/><rect x="62" y="20" width="8" height="30" rx="4" fill="#B45309"/><path d="M58 20 Q62 14 66 20" stroke="#92400E" stroke-width="2.5" stroke-linecap="round" fill="none"/><path d="M35 54 Q33 62 33 70" stroke="rgba(255,255,255,.18)" stroke-width="4.5" stroke-linecap="round" fill="none"/><path d="M62 14 Q64 6 68 10" stroke="#FCD34D" stroke-width="2" stroke-linecap="round" fill="none" opacity=".6"/><path d="M56 8 Q60 2 66 6" stroke="#FBBF24" stroke-width="2" stroke-linecap="round" fill="none" opacity=".5"/><path d="M94 70 L94 72 L104 72 L104 70 Q104 64 99 64 Q94 64 94 70Z" fill="#B45309"/><circle cx="22" cy="44" r="4" fill="#FED7AA"/><circle cx="16" cy="58" r="3" fill="#FED7AA" opacity=".8"/></svg>' },
};

const LEADERBOARD = [
  { name:'AlexXP',      avatar:'🦸',    level:42, xp:48200, streak:34, me:false },
  { name:'MashaMind',   avatar:'🧙‍♀️', level:38, xp:41500, streak:21, me:false },
  { name:'Dmitry_G',    avatar:'⚔️',   level:35, xp:37800, streak:15, me:false },
  { name:'YOU',         avatar:'🧙',    level:1,  xp:0,     streak:0,  me:true  },
  { name:'NightCoder',  avatar:'🦊',    level:29, xp:28100, streak:8,  me:false },
  { name:'FitnessQueen',avatar:'💪',    level:26, xp:24300, streak:12, me:false },
  { name:'BookWorm42',  avatar:'📚',    level:22, xp:19800, streak:5,  me:false },
  { name:'ZenMaster',   avatar:'🧘',    level:19, xp:15200, streak:18, me:false },
];

const ACHIEVEMENTS = [
  // ── COMMON ───────────────────────────────────────────────────────────────────
  { id:'a1',  rarity:'common',    name:'First Step',         desc:'Complete your very first quest',      xpReward:50,
    target:1,   getProgress:function(p,s){ return Math.min(1,p.totalCompleted||0); },
    svg:'<svg viewBox="0 0 60 60" fill="none"><circle cx="30" cy="30" r="18" fill="rgba(255,255,255,.12)"/><path d="M30 42V22" stroke="white" stroke-width="3.5" stroke-linecap="round"/><path d="M22 29l8-8 8 8" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="24" cy="40" rx="5" ry="4" fill="white" opacity=".85"/><ellipse cx="37" cy="36" rx="4" ry="3.5" fill="white" opacity=".6"/></svg>', unlocked:false },
  { id:'a9',  rarity:'common',    name:'Quick Start',        desc:'Complete 5 quests in a single day',   xpReward:150,
    target:5,   getProgress:function(p,s){ return Math.min(5,Object.values(s.todayCompleted||{}).filter(Boolean).length); },
    svg:'<svg viewBox="0 0 60 60" fill="none"><path d="M34 14L20 31h11l-5 15 15-17H30l4-15z" fill="white" opacity=".9"/></svg>', unlocked:false },
  { id:'a10', rarity:'common',    name:'Early Bird',         desc:'Complete a quest before 8am',         xpReward:80,
    target:1,   getProgress:function(p,s){ return p.hadEarlyBird?1:0; },
    svg:'<svg viewBox="0 0 60 60" fill="none"><circle cx="30" cy="30" r="11" fill="white" opacity=".9"/><path d="M30 12v5M30 43v5M12 30h5M43 30h5M17.6 17.6l3.5 3.5M38.9 38.9l3.5 3.5M17.6 42.4l3.5-3.5M38.9 21.1l3.5-3.5" stroke="white" stroke-width="3" stroke-linecap="round" opacity=".65"/></svg>', unlocked:false },
  { id:'a13', rarity:'common',    name:'Habit Starter',      desc:'Create your first habit',             xpReward:30,
    target:1,   getProgress:function(p,s){ return Math.min(1,(s.habits||[]).length); },
    svg:'<svg viewBox="0 0 60 60" fill="none"><rect x="16" y="16" width="28" height="28" rx="7" fill="rgba(255,255,255,.18)" stroke="white" stroke-width="2.5"/><path d="M21 30l6.5 6.5L39 24" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>', unlocked:false },
  { id:'a14', rarity:'common',    name:'Social',             desc:'Add your first friend',               xpReward:40,
    target:1,   getProgress:function(p,s){ return Math.min(1,(p.friends||[]).length); },
    svg:'<svg viewBox="0 0 60 60" fill="none"><circle cx="22" cy="25" r="8" fill="rgba(255,255,255,.85)"/><circle cx="38" cy="25" r="8" fill="rgba(255,255,255,.6)"/><path d="M10 46c0-7 5-11 12-11 3 0 5 .8 6 1.5 1-.7 3.5-1.5 8-1.5 7 0 12 4 12 11" stroke="white" stroke-width="3" stroke-linecap="round" fill="none" opacity=".75"/></svg>', unlocked:false },
  // ── RARE ─────────────────────────────────────────────────────────────────────
  { id:'a2',  rarity:'rare',      name:'On Fire',            desc:'Reach a 7-day streak',                xpReward:100,
    target:7,   getProgress:function(p,s){ return Math.min(7,p.streak||0); },
    svg:'<svg viewBox="0 0 60 60" fill="none"><path d="M30 46c-10 0-16-8-16-16 0-6 2.5-10 6-13-1 5 2 9 2 9 1-7 5-13 11-17-2 6 1 11 1 11 2-4 5-9 5-15 5 5 10 11 10 18 0 9-7 17-19 23z" fill="rgba(255,255,255,.9)"/></svg>', unlocked:false },
  { id:'a3',  rarity:'rare',      name:'Discipline Warrior', desc:'Create 5 habits',                     xpReward:75,
    target:5,   getProgress:function(p,s){ return Math.min(5,(s.habits||[]).length); },
    svg:'<svg viewBox="0 0 60 60" fill="none"><path d="M18 18l24 24M42 18L18 42" stroke="white" stroke-width="5" stroke-linecap="round"/><circle cx="30" cy="30" r="5" fill="white"/><path d="M16 14h4l2 4M44 14h-4l-2 4M16 46h4l2-4M44 46h-4l-2-4" stroke="white" stroke-width="2.5" stroke-linecap="round"/></svg>', unlocked:false },
  { id:'a5',  rarity:'rare',      name:'Week Champion',      desc:'Complete all quests 7 days in a row', xpReward:200,
    target:7,   getProgress:function(p,s){ return Math.min(7,p.streak||0); },
    svg:'<svg viewBox="0 0 60 60" fill="none"><path d="M18 20h24v16l-12 12L18 36V20z" fill="rgba(255,255,255,.18)" stroke="white" stroke-width="2.5"/><path d="M14 20h4M42 20h4M30 48v4" stroke="white" stroke-width="2.5" stroke-linecap="round"/><circle cx="30" cy="31" r="5" fill="white" opacity=".9"/></svg>', unlocked:false },
  { id:'a11', rarity:'rare',      name:'Ironclad',           desc:'Reach a 14-day streak',               xpReward:250,
    target:14,  getProgress:function(p,s){ return Math.min(14,p.streak||0); },
    svg:'<svg viewBox="0 0 60 60" fill="none"><path d="M30 13l14 5v13c0 8.5-6 15-14 19-8-4-14-10.5-14-19V18z" fill="rgba(255,255,255,.18)" stroke="white" stroke-width="2.5"/><path d="M23 31l5 5.5 9-9.5" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>', unlocked:false },
  { id:'a15', rarity:'rare',      name:'Centurion',          desc:'Complete 50 quests',                  xpReward:250,
    target:50,  getProgress:function(p,s){ return Math.min(50,p.totalCompleted||0); },
    svg:'<svg viewBox="0 0 60 60" fill="none"><path d="M30 13l4.5 9.2 10.1 1.5-7.3 7.1 1.7 10.1L30 36l-9 4.9 1.7-10.1-7.3-7.1 10.1-1.5z" fill="white" opacity=".9"/><path d="M22 44l8 4 8-4" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" opacity=".65"/></svg>', unlocked:false },
  { id:'a12', rarity:'rare',      name:'Bookworm',           desc:'Complete 30 quests',                  xpReward:200,
    target:30,  getProgress:function(p,s){ return Math.min(30,p.totalCompleted||0); },
    svg:'<svg viewBox="0 0 60 60" fill="none"><rect x="14" y="15" width="14" height="30" rx="2.5" fill="rgba(255,255,255,.85)"/><rect x="30" y="15" width="14" height="30" rx="2.5" fill="rgba(255,255,255,.6)"/><path d="M28 15v30" stroke="white" stroke-width="2"/><path d="M17 23h8M17 29h8M17 35h5M33 23h8M33 29h8M33 35h5" stroke="rgba(0,0,0,.2)" stroke-width="1.5" stroke-linecap="round"/></svg>', unlocked:false },
  // ── EPIC ─────────────────────────────────────────────────────────────────────
  { id:'a4',  rarity:'epic',      name:'Diamond Mind',       desc:'Reach level 10',                      xpReward:500,
    target:10,  getProgress:function(p,s){ return Math.min(10,p.level||1); },
    svg:'<svg viewBox="0 0 60 60" fill="none"><path d="M30 13l11 11-11 26-11-26z" fill="rgba(255,255,255,.85)"/><path d="M19 24h22" stroke="rgba(255,255,255,.45)" stroke-width="1.5"/><path d="M19 24l11-11M41 24l-11-11" stroke="rgba(255,255,255,.35)" stroke-width="1.5"/><path d="M19 24l11 26 11-26" fill="rgba(255,255,255,.25)"/></svg>', unlocked:false },
  { id:'a6',  rarity:'epic',      name:'Flow State',         desc:'Reach a 30-day streak',               xpReward:1000,
    target:30,  getProgress:function(p,s){ return Math.min(30,p.streak||0); },
    svg:'<svg viewBox="0 0 60 60" fill="none"><path d="M11 26c5-7 10-11 19-11s14 8 19 2" stroke="white" stroke-width="3.5" stroke-linecap="round" fill="none"/><path d="M11 34c5-7 10-11 19-11s14 8 19 2" stroke="white" stroke-width="3.5" stroke-linecap="round" fill="none" opacity=".6"/><path d="M11 42c5-7 10-11 19-11s14 8 19 2" stroke="white" stroke-width="3.5" stroke-linecap="round" fill="none" opacity=".3"/></svg>', unlocked:false },
  { id:'a7',  rarity:'epic',      name:'Sniper',             desc:'Complete 100 quests',                 xpReward:500,
    target:100, getProgress:function(p,s){ return Math.min(100,p.totalCompleted||0); },
    svg:'<svg viewBox="0 0 60 60" fill="none"><circle cx="30" cy="30" r="16" stroke="white" stroke-width="2.5" fill="none"/><circle cx="30" cy="30" r="9" stroke="white" stroke-width="2" fill="none" opacity=".6"/><circle cx="30" cy="30" r="3.5" fill="white"/><path d="M30 11v7M30 42v7M11 30h7M42 30h7" stroke="white" stroke-width="2.5" stroke-linecap="round" opacity=".55"/></svg>', unlocked:false },
  { id:'a16', rarity:'epic',      name:'XP Hoarder',         desc:'Accumulate 10,000 total XP',          xpReward:600,
    target:10000,getProgress:function(p,s){ return Math.min(10000,p.totalXP||0); },
    svg:'<svg viewBox="0 0 60 60" fill="none"><polygon points="30,12 36.8,23.6 50,25.6 40.5,34.8 42.7,48 30,41 17.3,48 19.5,34.8 10,25.6 23.2,23.6" fill="rgba(255,255,255,.9)"/></svg>', unlocked:false },
  { id:'a17', rarity:'epic',      name:'Challenge Seeker',   desc:'Join 10 challenges',                  xpReward:400,
    target:10,  getProgress:function(p,s){ return Math.min(10,(p.joinedChallenges||[]).length); },
    svg:'<svg viewBox="0 0 60 60" fill="none"><circle cx="30" cy="30" r="17" stroke="white" stroke-width="2.5" fill="rgba(255,255,255,.12)"/><path d="M22 27c0-4.4 3.6-8 8-8s8 3.6 8 8c0 3-1.5 5.6-4 7.2V37H26v-2.8c-2.5-1.6-4-4.2-4-7.2z" fill="white" opacity=".88"/><rect x="26" y="39" width="8" height="3" rx="1.5" fill="white" opacity=".65"/><rect x="27.5" y="44" width="5" height="2" rx="1" fill="white" opacity=".45"/></svg>', unlocked:false },
  // ── LEGENDARY ────────────────────────────────────────────────────────────────
  { id:'a8',  rarity:'legendary', name:'Grand Master',       desc:'Reach level 25',                      xpReward:1500,
    target:25,  getProgress:function(p,s){ return Math.min(25,p.level||1); },
    svg:'<svg viewBox="0 0 60 60" fill="none"><path d="M16 38h28l-4-16-8 8-6-14-6 14-8-8z" fill="rgba(255,255,255,.9)"/><rect x="14" y="40" width="32" height="5" rx="2.5" fill="white" opacity=".65"/><circle cx="14" cy="26" r="4" fill="white" opacity=".8"/><circle cx="46" cy="26" r="4" fill="white" opacity=".8"/><circle cx="30" cy="20" r="4.5" fill="white"/></svg>', unlocked:false },
  { id:'a18', rarity:'legendary', name:'Iron Will',          desc:'Reach a 100-day streak',              xpReward:2000,
    target:100, getProgress:function(p,s){ return Math.min(100,p.streak||0); },
    svg:'<svg viewBox="0 0 60 60" fill="none"><path d="M23 44V30l-7-4.5V20l7-5h14l7 5v5.5L37 30v14H23z" fill="rgba(255,255,255,.88)" stroke="white" stroke-width="1.5" stroke-linejoin="round"/><path d="M23 30h14M26 36h8M26 41h8" stroke="rgba(0,0,0,.18)" stroke-width="2" stroke-linecap="round"/><path d="M26 16h8" stroke="white" stroke-width="2.5" stroke-linecap="round" opacity=".5"/></svg>', unlocked:false },
  { id:'a19', rarity:'legendary', name:'Quest God',          desc:'Complete 500 quests',                 xpReward:3000,
    target:500, getProgress:function(p,s){ return Math.min(500,p.totalCompleted||0); },
    svg:'<svg viewBox="0 0 60 60" fill="none"><path d="M30 11l5 10.5 11.5 1.7-8.3 8 2 11.5L30 37l-10.2 5.7 2-11.5-8.3-8 11.5-1.7z" fill="white" opacity=".9"/><path d="M22 40l8 9 8-9" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" opacity=".7"/></svg>', unlocked:false },
  { id:'a20', rarity:'legendary', name:'Zenith',             desc:'Reach level 50',                      xpReward:5000,
    target:50,  getProgress:function(p,s){ return Math.min(50,p.level||1); },
    svg:'<svg viewBox="0 0 60 60" fill="none"><path d="M30 13l17 31H13z" fill="rgba(255,255,255,.18)" stroke="white" stroke-width="2.5" stroke-linejoin="round"/><path d="M30 17l11 21H19z" fill="rgba(255,255,255,.4)"/><path d="M30 21l6 11H24z" fill="white" opacity=".88"/><path d="M13 44h34" stroke="white" stroke-width="2.5" stroke-linecap="round" opacity=".4"/></svg>', unlocked:false },
];

const CLASSES = [
  { minLevel:1,  name:'Discipline Apprentice', prefix:'⚔️' },
  { minLevel:5,  name:'Habit Warrior',         prefix:'🛡️' },
  { minLevel:10, name:'Productivity Mage',     prefix:'🧙' },
  { minLevel:20, name:'Mind Master',           prefix:'🔮' },
  { minLevel:35, name:'Legend of Will',        prefix:'👑' },
];

const PAGE_TITLES = {
  quests:       'My <span style="color:var(--teal)">Dashboard</span>',
  challenges:   'Your <span style="color:var(--teal)">Challenges</span>',
  leaderboard:  'World <span style="color:var(--teal)">Leaderboard</span>',
  achievements: '<span style="color:var(--teal)">Achievements</span>',
  subscription: '<span style="color:var(--teal)">Go Pro</span>',
  group:        '👥 Group <span style="color:var(--teal)">Challenge</span>',
  profile:      '👤 My <span style="color:var(--teal)">Profile</span>',
  social:       '🌐 <span style="color:var(--teal)">Friends</span>',
  chat:         '💬 <span style="color:var(--teal)">Chat</span>',
  'friends-lb': '🏆 <span style="color:var(--teal)">Friends Leaderboard</span>',
};

/* ════ PERSISTENCE ════ */
function save() {
  try { localStorage.setItem('hqd_v1', JSON.stringify(state)); } catch(e) {}
  if (window._fbSave) window._fbSave(state);
}

/* ════ ONBOARDING SLIDES ════ */
var _obCurrentSlide = 0;
var _OB_TOTAL_SLIDES = 4;

function nextObSlide() {
  _obCurrentSlide++;
  if (_obCurrentSlide >= _OB_TOTAL_SLIDES) {
    skipToObForm();
    return;
  }
  var track = document.getElementById('ob-slides-track');
  if (track) track.style.transform = 'translateX(-' + (_obCurrentSlide * 100) + '%)';
  // Update dots
  document.querySelectorAll('.ob-dot').forEach(function(d, i) {
    d.classList.toggle('ob-dot-active', i === _obCurrentSlide);
  });
  // Change button text on last slide
  var btn = document.getElementById('ob-next-btn');
  if (btn) btn.textContent = _obCurrentSlide === _OB_TOTAL_SLIDES - 1 ? "Let's Go →" : 'Next →';
}

function skipToObForm() {
  var slidesWrap = document.getElementById('ob-slides-wrap');
  var formCard   = document.getElementById('ob-form-card');
  if (slidesWrap) {
    slidesWrap.style.opacity = '0';
    slidesWrap.style.transition = 'opacity .3s';
    setTimeout(function() { slidesWrap.style.display = 'none'; }, 300);
  }
  if (formCard) {
    formCard.style.display = 'block';
    formCard.classList.add('ob-form-enter');
  }
}
window.nextObSlide  = nextObSlide;
window.skipToObForm = skipToObForm;

/* ════ DARK MODE ════ */
function toggleDarkMode(on) {
  document.body.classList.toggle('dark', on);
  try { localStorage.setItem('hqd_darkmode', on ? '1' : '0'); } catch(e) {}
  var cb = document.getElementById('nm-checkbox');
  if (cb) cb.checked = on;
}

function _loadDarkMode() {
  var saved = localStorage.getItem('hqd_darkmode');
  var on = saved === '1';
  document.body.classList.toggle('dark', on);
  // Sync checkbox once profile page DOM is ready
  var cb = document.getElementById('nm-checkbox');
  if (cb) cb.checked = on;
}

function load() {
  try {
    const r = localStorage.getItem('hqd_v1');
    if (r) { const s = JSON.parse(r); state = { ...state, ...s }; }
  } catch(e) {}
  if (!state.habits.length) state.habits = DEFAULT_HABITS;
  // Init join date once — used on profile page for "Days Active"
  if (!state.player.joinDate) { state.player.joinDate = new Date().toISOString(); save(); }
  if (!state.player.xpLog)    { state.player.xpLog = []; }
  // Existing users (already gave themselves a name) skip onboarding automatically
  if (state.player.name && state.player.name !== 'Novice Hero') {
    state.player.hasOnboarded = true;
  }
  _loadDarkMode();
  checkDayReset();
  restoreAchievements();
}

function restoreAchievements() {
  var ids = state.unlockedAchs || [];
  ACHIEVEMENTS.forEach(function(a) { a.unlocked = ids.indexOf(a.id) !== -1; });
}

function checkDayReset() {
  const today = new Date().toDateString();
  if (state.player.lastActiveDate !== today) {
    const yest = new Date(); yest.setDate(yest.getDate() - 1);
    if (state.player.lastActiveDate && state.player.lastActiveDate !== yest.toDateString()) {
      state.player.streak = 0;
    }
    state.todayCompleted = {};
    state.player.lastActiveDate = today;
    save();
  }
}

/* ════ SIDEBAR TOGGLE ════ */
function toggleSidebar() {
  var app = document.getElementById('app');
  var expandBtn = document.getElementById('sb-expand-btn');
  var hidden = app.classList.toggle('sidebar-hidden');
  expandBtn.style.display = hidden ? 'flex' : 'none';
}

/* ════ NAVIGATION ════ */
function goPage(page, btn) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.sb-nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  if (btn) btn.classList.add('active');
  document.getElementById('topbar-title').innerHTML = PAGE_TITLES[page] || page;
  if (page === 'challenges')   renderChallenges();
  if (page === 'leaderboard')  renderLeaderboard();
  if (page === 'achievements') renderAchievements();
  if (page === 'profile')      renderProfilePage();
  if (page === 'social')       renderSocialPage();
}

/* ════ RENDER ════ */
function getClass(lv) {
  let c = CLASSES[0];
  for (const cl of CLASSES) if (lv >= cl.minLevel) c = cl;
  return c;
}

function renderAll() {
  const p = state.player, cls = getClass(p.level);
  const pct = Math.min(100, (p.xp / p.xpToNext) * 100);
  const todayDone = Object.values(state.todayCompleted).filter(Boolean).length;
  const total = state.habits.length;

  // Sidebar
  renderAvatarEl(document.getElementById('sb-avatar'), p.avatar);
  document.getElementById('sb-name').textContent      = p.name;
  document.getElementById('sb-class').textContent     = '';
  document.getElementById('sb-xp-bar').style.width    = pct + '%';
  document.getElementById('sb-xp-label').textContent  = `${p.xp} / ${p.xpToNext}`;
  document.getElementById('sb-level').textContent     = p.level;
  document.getElementById('sb-total-xp').textContent  = p.totalXP.toLocaleString();
  document.getElementById('sb-streak').textContent    = p.streak;
  document.getElementById('sb-done-count').textContent = p.totalCompleted;

  // Topbar
  document.getElementById('tb-xp').textContent     = p.totalXP.toLocaleString();
  document.getElementById('tb-streak').textContent  = p.streak;

  // Char panel
  renderAvatarEl(document.getElementById('d-avatar'), p.avatar);
  document.getElementById('d-name').textContent     = p.name;
  document.getElementById('d-class').textContent    = '';
  document.getElementById('d-xp-bar').style.width   = pct + '%';
  document.getElementById('d-xp-label').textContent = `${p.xp} / ${p.xpToNext}`;
  document.getElementById('d-level').textContent    = p.level;
  const circ = 163.4;
  document.getElementById('d-level-arc').setAttribute('stroke-dashoffset', circ - (pct / 100) * circ);
  renderCharPanel();

  // Stats
  document.getElementById('d-total-xp').textContent  = p.totalXP.toLocaleString();
  document.getElementById('d-streak').textContent    = p.bestStreak;
  document.getElementById('d-completed').textContent = p.totalCompleted;
  document.getElementById('d-today').textContent     = total ? Math.round((todayDone / total) * 100) + '%' : '0%';

  renderWeekStrip();
  renderDashChallenges();
  renderMiniLB();
}

function renderWeekStrip() {
  const now = new Date();
  const today = now.getDay(), todayIdx = today === 0 ? 6 : today - 1;
  // Get Mon of this week
  const mon = new Date(now);
  mon.setDate(now.getDate() - todayIdx);

  document.getElementById('d-week-strip').innerHTML =
    '<div class="week-strip-inner" onclick="openCalendarModal()" title="Open Calendar">' +
    WEEK_DAYS.map((d, i) => {
      const day = new Date(mon); day.setDate(mon.getDate() + i);
      const dateStr = day.toDateString();
      const isToday = i === todayIdx;
      const isPast  = i < todayIdx;
      const hasActivity = _dayHasActivity(dateStr);
      const dotCls = isToday ? 'today' : (hasActivity ? 'done' : (isPast ? 'past' : ''));
      const label  = hasActivity ? '✓' : day.getDate();
      return `<div class="day-col">
        <div class="day-name">${d}</div>
        <div class="day-dot ${dotCls}">${label}</div>
      </div>`;
    }).join('') +
    '</div>';
}

// Returns true if any challenge was completed on that dateStr
function _dayHasActivity(dateStr) {
  var log = state.challengeLog || {};
  return Object.keys(log).some(function(id) {
    var entry = log[id][dateStr];
    return entry && entry.status === 'completed';
  });
}

// Returns list of completed/skipped challenge names for a given dateStr
function _dayActivity(dateStr) {
  var allCh = CHALLENGES.concat(state.customChallenges || []);
  var log    = state.challengeLog || {};
  var completed = [], skipped = [];
  allCh.forEach(function(c) {
    var entry = log[c.id] && log[c.id][dateStr];
    if (!entry) return;
    if (entry.status === 'completed') completed.push(c);
    if (entry.status === 'skipped')   skipped.push(c);
  });
  return { completed: completed, skipped: skipped };
}

/* ════ CALENDAR MODAL ════ */
var _calYear  = new Date().getFullYear();
var _calMonth = new Date().getMonth(); // 0-based

function openCalendarModal(date) {
  if (date) { _calYear = date.getFullYear(); _calMonth = date.getMonth(); }
  else       { _calYear = new Date().getFullYear(); _calMonth = new Date().getMonth(); }

  var existing = document.getElementById('cal-modal-overlay');
  if (!existing) {
    var ov = document.createElement('div');
    ov.id = 'cal-modal-overlay';
    ov.className = 'cal-modal-overlay';
    ov.onclick = function(e) { if (e.target === ov) closeCalendarModal(); };
    document.body.appendChild(ov);
  }
  document.getElementById('cal-modal-overlay').style.display = 'flex';
  _renderCalModal();
}

function closeCalendarModal() {
  var ov = document.getElementById('cal-modal-overlay');
  if (ov) ov.style.display = 'none';
}

function _calNavMonth(delta) {
  _calMonth += delta;
  if (_calMonth > 11) { _calMonth = 0;  _calYear++; }
  if (_calMonth < 0)  { _calMonth = 11; _calYear--; }
  _renderCalModal();
}

function _renderCalModal() {
  var ov = document.getElementById('cal-modal-overlay');
  if (!ov) return;

  var MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var now    = new Date();
  var first  = new Date(_calYear, _calMonth, 1);
  var last   = new Date(_calYear, _calMonth + 1, 0);
  // Start grid on Monday
  var startDow = first.getDay(); // 0=Sun
  var offset   = startDow === 0 ? 6 : startDow - 1;
  var totalCells = offset + last.getDate();
  var rows = Math.ceil(totalCells / 7);

  var cells = '';
  for (var r = 0; r < rows; r++) {
    cells += '<div class="cal-row">';
    for (var col = 0; col < 7; col++) {
      var cellIdx = r * 7 + col;
      var dayNum  = cellIdx - offset + 1;
      if (dayNum < 1 || dayNum > last.getDate()) {
        cells += '<div class="cal-cell cal-cell-empty"></div>';
      } else {
        var d = new Date(_calYear, _calMonth, dayNum);
        var dateStr = d.toDateString();
        var isToday = dateStr === now.toDateString();
        var isFuture = d > now;
        var act = _dayActivity(dateStr);
        var hasDone = act.completed.length > 0;
        var hasSkip = act.skipped.length > 0;
        var dotHtml = hasDone
          ? '<div class="cal-dot cal-dot-done"></div>'
          : (hasSkip ? '<div class="cal-dot cal-dot-skip"></div>' : '');
        cells += '<div class="cal-cell' + (isToday ? ' cal-cell-today' : '') + (isFuture ? ' cal-cell-future' : '') + '" ' +
          'onclick="' + (isFuture ? '' : '_showCalDay(\'' + dateStr + '\')') + '">' +
          '<span class="cal-cell-num">' + dayNum + '</span>' +
          dotHtml +
        '</div>';
      }
    }
    cells += '</div>';
  }

  ov.innerHTML =
    '<div class="cal-modal-card">' +
      '<button class="cal-modal-close" onclick="closeCalendarModal()">✕</button>' +
      '<div class="cal-modal-header">' +
        '<button class="cal-nav-btn" onclick="_calNavMonth(-1)">‹</button>' +
        '<div class="cal-modal-title">' + MONTHS[_calMonth] + ' ' + _calYear + '</div>' +
        '<button class="cal-nav-btn" onclick="_calNavMonth(1)">›</button>' +
      '</div>' +
      '<div class="cal-dow-row">' +
        ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(function(d) {
          return '<div class="cal-dow">' + d + '</div>';
        }).join('') +
      '</div>' +
      '<div class="cal-grid">' + cells + '</div>' +
      '<div id="cal-day-detail" class="cal-day-detail"></div>' +
    '</div>';
}

function _showCalDay(dateStr) {
  var act  = _dayActivity(dateStr);
  var d    = new Date(dateStr);
  var lbl  = d.toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' });
  var el   = document.getElementById('cal-day-detail');
  if (!el) return;

  if (!act.completed.length && !act.skipped.length) {
    el.innerHTML = '<div class="cal-day-hdr">' + lbl + '</div>' +
      '<div class="cal-day-empty">No activity recorded</div>';
    return;
  }

  var html = '<div class="cal-day-hdr">' + lbl + '</div>';
  if (act.completed.length) {
    html += act.completed.map(function(c) {
      return '<div class="cal-day-item cal-day-done">' +
        '<span class="cal-day-icon">' + c.icon + '</span>' +
        '<span class="cal-day-name">' + c.name + '</span>' +
        '<span class="cal-day-xp">+' + c.xp + ' XP</span>' +
      '</div>';
    }).join('');
  }
  if (act.skipped.length) {
    html += act.skipped.map(function(c) {
      return '<div class="cal-day-item cal-day-skip">' +
        '<span class="cal-day-icon">' + c.icon + '</span>' +
        '<span class="cal-day-name">' + c.name + '</span>' +
        '<span class="cal-day-skiplbl">skipped</span>' +
      '</div>';
    }).join('');
  }
  el.innerHTML = html;
}

function filterCat(el) {
  document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  state.currentCat = el.dataset.cat;
  renderHabits();
}

function renderHabits() {
  const grid = document.getElementById('d-habits-grid');
  const habits = state.currentCat === 'all' ? state.habits : state.habits.filter(h => h.cat === state.currentCat);
  if (!habits.length) {
    grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><div class="empty-icon">⚔️</div><p>No quests yet. Create your first one!</p></div>';
    return;
  }
  grid.innerHTML = habits.map(h => {
    const done = !!state.todayCompleted[h.id], xp = DIFF_XP[h.diff] || 25, flames = Math.min(7, h.streak || 0);
    const flameHtml = Array.from({ length:7 }, (_,i) => `<span class="hc-flame ${i < flames ? 'lit' : ''}">🔥</span>`).join('');
    return `<div class="habit-card ${done ? 'done' : ''}" style="--hc:${h.color}">
      <div class="hc-top"><div class="hc-icon">${h.icon}</div><div class="hc-xp">+${xp} XP</div></div>
      <div class="hc-name">${h.name}</div>
      <div class="hc-desc">${h.desc || ''}</div>
      <div class="hc-meta">
        <span class="hc-tag ${DIFF_CLS[h.diff]}">${DIFF_EMO[h.diff]} ${DIFF_LBL[h.diff]}</span>
        <span class="hc-tag" style="background:var(--bg);border:1px solid var(--border2);color:var(--muted)">${CAT_MAP[h.cat] || h.cat}</span>
      </div>
      <div class="hc-bottom">
        <div class="hc-flames">${flameHtml}</div>
        <button class="hc-check ${done ? 'done' : ''}" onclick="completeHabit('${h.id}',event)">${done ? '✓' : '○'}</button>
      </div>
    </div>`;
  }).join('');
}

function completeHabit(id, e) {
  if (state.todayCompleted[id]) return;
  state.todayCompleted[id] = true;
  const h = state.habits.find(h => h.id === id); if (!h) return;
  const xp = DIFF_XP[h.diff] || 25;
  grantXP(xp, e);
  h.streak = (h.streak || 0) + 1;
  state.player.streak = Math.max(state.player.streak, 1);
  state.player.bestStreak = Math.max(state.player.bestStreak, state.player.streak);
  state.player.totalCompleted++;
  showToast(`⚔️ ${h.name}`, `+${xp} XP — quest complete!`, 'xp-gain');
  if (h.streak === 7) showToast('🔥 7-Day Streak!', "You're on fire!", 'streak');
  checkAchievements();
  renderAll();
  save();
}

function grantXP(amount, e) {
  if (e) {
    const b = document.createElement('div');
    b.className = 'xp-burst';
    b.textContent = `+${amount} XP`;
    b.style.left = (e.clientX - 30) + 'px';
    b.style.top  = (e.clientY - 20) + 'px';
    document.body.appendChild(b);
    setTimeout(() => b.remove(), 1200);
  }
  state.player.xp += amount;
  state.player.totalXP += amount;
  // Log to current month for the profile XP chart
  var _ym = new Date().toISOString().slice(0, 7);
  if (!state.player.xpLog) state.player.xpLog = [];
  var _logE = state.player.xpLog.find(function(e) { return e.ym === _ym; });
  if (_logE) { _logE.xp += amount; } else { state.player.xpLog.push({ ym: _ym, xp: amount }); }
  while (state.player.xp >= state.player.xpToNext) {
    state.player.xp -= state.player.xpToNext;
    state.player.level++;
    state.player.xpToNext = Math.floor(100 * Math.pow(1.4, state.player.level - 1));
    const nc = getClass(state.player.level);
    showToast('🎉 Level Up!', `Level ${state.player.level} — ${nc.prefix} ${nc.name}`, 'level-up');
  }
}

function checkAchievements() {
  if (!state.unlockedAchs) state.unlockedAchs = [];
  ACHIEVEMENTS.forEach(function(a) {
    if (a.unlocked || !a.getProgress) return;
    if (a.getProgress(state.player, state) >= a.target) {
      a.unlocked = true;
      state.unlockedAchs.push(a.id);
      grantXP(a.xpReward);
      showToast('🎖 Achievement!', '"' + a.name + '" — +' + a.xpReward + ' XP', 'level-up');
    }
  });
}

function achFrame(rarity) {
  /* Returns an SVG ring frame matching the rarity — crown complexity scales up */
  if (rarity === 'legendary') return (
    '<svg viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg" style="position:absolute;inset:-20px;width:calc(100% + 40px);height:calc(100% + 40px);pointer-events:none;z-index:3">' +
    '<defs><radialGradient id="lg1" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#fde68a"/><stop offset="100%" stop-color="#b45309"/></radialGradient>' +
    '<radialGradient id="lg2" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#fef3c7"/><stop offset="100%" stop-color="#d97706"/></radialGradient></defs>' +
    /* Outer thin ring */ '<circle cx="55" cy="68" r="34" stroke="#fbbf24" stroke-width="1.2" fill="none" opacity=".5"/>' +
    /* Main ring */ '<circle cx="55" cy="68" r="31" stroke="url(#lg1)" stroke-width="7" fill="none"/>' +
    /* Inner highlight */ '<circle cx="55" cy="68" r="28" stroke="#fde68a" stroke-width="1.5" fill="none" opacity=".35"/>' +
    /* Side flames L */ '<path d="M17 60 Q10 52 15 44 Q18 52 17 60Z" fill="#f59e0b" opacity=".85"/><path d="M19 62 Q13 54 18 48 Q20 54 19 62Z" fill="#fbbf24" opacity=".6"/>' +
    /* Side flames R */ '<path d="M93 60 Q100 52 95 44 Q92 52 93 60Z" fill="#f59e0b" opacity=".85"/><path d="M91 62 Q97 54 92 48 Q90 54 91 62Z" fill="#fbbf24" opacity=".6"/>' +
    /* Side studs */ '<circle cx="24" cy="68" r="4.5" fill="#fbbf24" stroke="#92400e" stroke-width="1"/><circle cx="86" cy="68" r="4.5" fill="#fbbf24" stroke="#92400e" stroke-width="1"/>' +
    /* Bottom gem */ '<circle cx="55" cy="100" r="4" fill="#fbbf24" stroke="#92400e" stroke-width="1.2"/>' +
    /* Crown base */ '<path d="M35 38 h40 v5 H35z" rx="2" fill="#b45309"/><path d="M35 37 h40 v2 H35z" fill="#fbbf24" opacity=".5"/>' +
    /* Crown spires */ '<path d="M35 38 L38 18 L47 30 L55 10 L63 30 L72 18 L75 38Z" fill="url(#lg2)" stroke="#92400e" stroke-width="1.2" stroke-linejoin="round"/>' +
    /* Crown gems */ '<circle cx="55" cy="13" r="5" fill="#ef4444" stroke="#fbbf24" stroke-width="1"/>' +
    '<circle cx="38" cy="21" r="4" fill="#fbbf24" stroke="#92400e" stroke-width=".8"/>' +
    '<circle cx="72" cy="21" r="4" fill="#fbbf24" stroke="#92400e" stroke-width=".8"/>' +
    '<polygon points="47,26 50,32 47,35 44,32" fill="#fde68a" opacity=".9"/>' +
    '<polygon points="63,26 66,32 63,35 60,32" fill="#fde68a" opacity=".9"/>' +
    /* Sparkles */ '<path d="M10 40 L11.5 36 L13 40 L11.5 44Z" fill="#fde68a" opacity=".8"/><path d="M97 40 L98.5 36 L100 40 L98.5 44Z" fill="#fde68a" opacity=".8"/>' +
    '</svg>'
  );
  if (rarity === 'epic') return (
    '<svg viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg" style="position:absolute;inset:-18px;width:calc(100% + 36px);height:calc(100% + 36px);pointer-events:none;z-index:3">' +
    '<defs><linearGradient id="ep1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#4c1d95"/><stop offset="100%" stop-color="#7c3aed"/></linearGradient>' +
    '<linearGradient id="ep2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#d97706"/><stop offset="100%" stop-color="#fbbf24"/></linearGradient></defs>' +
    '<circle cx="55" cy="68" r="34" stroke="#a78bfa" stroke-width="1" fill="none" opacity=".4"/>' +
    '<circle cx="55" cy="68" r="31" stroke="url(#ep1)" stroke-width="6.5" fill="none"/>' +
    '<circle cx="55" cy="68" r="28" stroke="#c4b5fd" stroke-width="1" fill="none" opacity=".3"/>' +
    /* Side gems */ '<circle cx="24" cy="68" r="5" fill="#7c3aed" stroke="#a78bfa" stroke-width="1.2"/><circle cx="24" cy="68" r="2.5" fill="#c4b5fd"/>' +
    '<circle cx="86" cy="68" r="5" fill="#7c3aed" stroke="#a78bfa" stroke-width="1.2"/><circle cx="86" cy="68" r="2.5" fill="#c4b5fd"/>' +
    /* Bottom gem */ '<polygon points="55,99 58,104 55,107 52,104" fill="#a78bfa"/>' +
    /* Sparkles */ '<path d="M13 52 L14.5 48 L16 52 L14.5 56Z" fill="#a78bfa" opacity=".7"/><path d="M94 52 L95.5 48 L97 52 L95.5 56Z" fill="#a78bfa" opacity=".7"/>' +
    '<path d="M16 78 L17.5 74 L19 78 L17.5 82Z" fill="#7c3aed" opacity=".6"/><path d="M91 78 L92.5 74 L94 78 L92.5 82Z" fill="#7c3aed" opacity=".6"/>' +
    /* Crown base */ '<path d="M37 40 h36 v4 H37z" fill="#92400e" rx="2"/><path d="M37 39 h36 v2 H37z" fill="#fbbf24" opacity=".6"/>' +
    /* Crown 3 spires */ '<path d="M37 40 L41 24 L55 34 L69 24 L73 40Z" fill="url(#ep2)" stroke="#78350f" stroke-width="1.2" stroke-linejoin="round"/>' +
    /* Crown gems */ '<polygon points="55,20 58,27 55,30 52,27" fill="#a78bfa"/>' +
    '<circle cx="41" cy="27" r="4" fill="#7c3aed" stroke="#fbbf24" stroke-width="1"/>' +
    '<circle cx="69" cy="27" r="4" fill="#7c3aed" stroke="#fbbf24" stroke-width="1"/>' +
    '</svg>'
  );
  if (rarity === 'rare') return (
    '<svg viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg" style="position:absolute;inset:-16px;width:calc(100% + 32px);height:calc(100% + 32px);pointer-events:none;z-index:3">' +
    '<defs><linearGradient id="rr1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#1e3a8a"/><stop offset="100%" stop-color="#3b82f6"/></linearGradient></defs>' +
    '<circle cx="55" cy="68" r="34" stroke="#93c5fd" stroke-width="1" fill="none" opacity=".35"/>' +
    '<circle cx="55" cy="68" r="31" stroke="url(#rr1)" stroke-width="6" fill="none"/>' +
    '<circle cx="55" cy="68" r="28" stroke="#bfdbfe" stroke-width="1" fill="none" opacity=".25"/>' +
    /* Side studs */ '<circle cx="24" cy="68" r="4.5" fill="#1d4ed8" stroke="#93c5fd" stroke-width="1.2"/>' +
    '<circle cx="86" cy="68" r="4.5" fill="#1d4ed8" stroke="#93c5fd" stroke-width="1.2"/>' +
    /* Bottom small gem */ '<circle cx="55" cy="100" r="3.5" fill="#3b82f6" stroke="#93c5fd" stroke-width="1"/>' +
    /* Crown base */ '<path d="M40 42 h30 v3.5 H40z" fill="#1e40af" rx="1.5"/>' +
    /* Crown 2 simple points + center */ '<path d="M40 42 L43 28 L55 36 L67 28 L70 42Z" fill="#2563eb" stroke="#93c5fd" stroke-width="1" stroke-linejoin="round"/>' +
    /* Crown top gem */ '<polygon points="55,23 58.5,30 55,33 51.5,30" fill="#bfdbfe"/>' +
    '<circle cx="43" cy="30" r="3.5" fill="#60a5fa" stroke="#1d4ed8" stroke-width=".8"/>' +
    '<circle cx="67" cy="30" r="3.5" fill="#60a5fa" stroke="#1d4ed8" stroke-width=".8"/>' +
    '</svg>'
  );
  /* common */ return (
    '<svg viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg" style="position:absolute;inset:-14px;width:calc(100% + 28px);height:calc(100% + 28px);pointer-events:none;z-index:3">' +
    '<circle cx="55" cy="70" r="31" stroke="#475569" stroke-width="5.5" fill="none"/>' +
    '<circle cx="55" cy="70" r="34" stroke="#64748b" stroke-width="1" fill="none" opacity=".3"/>' +
    /* Rough simple 3-spike top */ '<path d="M44 42 L47 28 L55 36 L63 28 L66 42" stroke="#64748b" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>' +
    /* Side dots */ '<circle cx="24" cy="70" r="4" fill="#475569"/>' +
    '<circle cx="86" cy="70" r="4" fill="#475569"/>' +
    /* Bottom dot */ '<circle cx="55" cy="102" r="3" fill="#475569" opacity=".7"/>' +
    '</svg>'
  );
}

function renderAchievements() {
  checkAchievements();
  save();
  var total = ACHIEVEMENTS.length;
  var unl   = ACHIEVEMENTS.filter(function(a){ return a.unlocked; }).length;
  document.getElementById('d-ach-unlocked').textContent = unl;
  document.getElementById('d-ach-locked').textContent   = total - unl;

  var RARITY = {
    common:    { label:'Common',    badgeBg:'linear-gradient(135deg,#334155,#64748b)',     color:'#64748b', vivid:'#94a3b8', glow:'rgba(100,116,139,.75)', tagBg:'#475569',  tagColor:'#e2e8f0', cardStripe:'#64748b', cardTint:'rgba(100,116,139,.07)', hdrColor:'#475569' },
    rare:      { label:'Rare',      badgeBg:'linear-gradient(135deg,#1e3a8a,#3b82f6)',     color:'#2563eb', vivid:'#60a5fa', glow:'rgba(59,130,246,.8)',   tagBg:'#1d4ed8',  tagColor:'#dbeafe', cardStripe:'#3b82f6', cardTint:'rgba(59,130,246,.07)',  hdrColor:'#1d4ed8' },
    epic:      { label:'Epic',      badgeBg:'linear-gradient(135deg,#4c1d95,#7c3aed)',     color:'#6d28d9', vivid:'#a78bfa', glow:'rgba(109,40,217,.8)',   tagBg:'#5b21b6',  tagColor:'#ede9fe', cardStripe:'#7c3aed', cardTint:'rgba(109,40,217,.08)', hdrColor:'#5b21b6' },
    legendary: { label:'Legendary', badgeBg:'linear-gradient(135deg,#78350f,#d97706,#fbbf24)', color:'#b45309', vivid:'#fbbf24', glow:'rgba(251,191,36,.9)', tagBg:'linear-gradient(90deg,#b45309,#f59e0b)', tagColor:'#000', cardStripe:'#f59e0b', cardTint:'rgba(245,158,11,.1)', hdrColor:'#b45309' },
  };
  var ORDER = ['common','rare','epic','legendary'];

  var html = '';
  ORDER.forEach(function(rarity) {
    var group = ACHIEVEMENTS.filter(function(a){ return a.rarity === rarity; });
    if (!group.length) return;
    var rc = RARITY[rarity];
    var unlockedCount = group.filter(function(a){ return a.unlocked; }).length;
    html += '<div class="ach-section">' +
      '<div class="ach-section-hdr" style="border-bottom:2px solid ' + rc.cardStripe + '33">' +
        '<span class="ach-section-dot" style="background:' + rc.vivid + ';box-shadow:0 0 8px ' + rc.glow + ';width:11px;height:11px"></span>' +
        '<span class="ach-section-lbl" style="color:' + rc.hdrColor + ';font-size:.72rem">' + rc.label + '</span>' +
        '<span class="ach-section-count" style="background:' + rc.cardStripe + '22;color:' + rc.hdrColor + ';padding:2px 10px;border-radius:20px;border:1px solid ' + rc.cardStripe + '44">' + unlockedCount + ' / ' + group.length + '</span>' +
      '</div>';
    html += group.map(function(a) {
      var prog   = a.getProgress ? a.getProgress(state.player, state) : 0;
      var pct    = Math.min(100, Math.round(prog / a.target * 100));
      var locked = !a.unlocked;
      var progLabel = a.target >= 1000
        ? (prog >= 1000 ? (prog/1000).toFixed(1)+'k' : prog) + ' / ' + (a.target/1000)+'k'
        : prog + ' / ' + a.target;
      var cardStyle = locked
        ? 'border:1px solid var(--border);background:var(--surface)'
        : 'border:1px solid ' + rc.cardStripe + '55;border-left:4px solid ' + rc.cardStripe + ';background:linear-gradient(135deg,' + rc.cardTint + ' 0%,var(--surface) 65%);box-shadow:0 2px 12px ' + rc.glow.replace('.8','0.12').replace('.9','0.12').replace('.75','0.1')+'';
      var badgeStyle = locked
        ? 'background:linear-gradient(135deg,var(--bg),var(--surface));border:2px dashed var(--border2)'
        : 'background:' + rc.badgeBg + ';box-shadow:0 0 22px ' + rc.glow;
      var fillStyle = locked
        ? 'width:' + pct + '%;background:var(--border2)'
        : 'width:' + pct + '%;background:linear-gradient(90deg,' + rc.color + ',' + rc.vivid + ')';
      var trackStyle = locked ? '' : 'background:' + rc.cardStripe + '22';
      var tagStyle = 'color:' + rc.tagColor + ';background:' + rc.tagBg + ';border:none;font-weight:800;letter-spacing:.08em';
      return '<div class="ach-card-h ach-r-' + rarity + (locked ? ' ach-locked' : ' ach-unlocked') + '" style="' + cardStyle + '">' +
        '<div class="ach-frame-wrap">' +
          '<div class="ach-badge-ico" style="' + badgeStyle + '">' + a.svg + '</div>' +
          achFrame(rarity) +
        '</div>' +
        '<div class="ach-body">' +
          '<div class="ach-head-row">' +
            '<span class="ach-name-h">' + a.name + '</span>' +
            '<span class="ach-rarity-tag" style="' + tagStyle + '">' + rc.label + '</span>' +
          '</div>' +
          '<div class="ach-desc-h">' + a.desc + '</div>' +
          '<div class="ach-prog-wrap">' +
            '<div class="ach-prog-track" style="' + trackStyle + '"><div class="ach-prog-fill" style="' + fillStyle + '"></div></div>' +
            '<span class="ach-prog-num">' + progLabel + '</span>' +
          '</div>' +
          '<div class="ach-foot-row">' +
            (a.unlocked ? '<span class="ach-done-badge" style="color:' + rc.vivid + '">✓ Unlocked</span>' : '<span class="ach-pct-lbl">' + pct + '% complete</span>') +
            '<span class="ach-xp-tag" style="color:' + rc.vivid + ';border-color:' + rc.cardStripe + '55;background:' + rc.cardTint + '">+' + a.xpReward.toLocaleString() + ' XP</span>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');
    html += '</div>';
  });

  document.getElementById('d-ach-grid').innerHTML = html;
}

/* ════ CARD CUSTOMIZER ════ */

function renderCharPanel() {
  var cfg = state.cardConfig || {};
  var p   = state.player;
  var panel = document.getElementById('char-panel');
  if (!panel) return;

  // Background (pro backgrounds only apply if user isPro)
  var isPro = state.player.isPro;
  var bgPreset = CARD_BG_PRESETS.find(function(b) { return b.id === (cfg.bg || 'default'); });
  if (bgPreset && bgPreset.pro && !isPro) bgPreset = CARD_BG_PRESETS[0]; // fallback to default
  panel.style.background = (bgPreset && bgPreset.bg) ? bgPreset.bg : '';

  // Name color (pro only)
  var nameEl = document.getElementById('d-name');
  if (nameEl) nameEl.style.color = (isPro && cfg.nameColor) ? cfg.nameColor : '';

  // Show/hide sections
  function sec(id, show) { var el = document.getElementById(id); if (el) el.style.display = (show === false) ? 'none' : ''; }
  sec('cp-sec-avatar', cfg.showAvatar !== false);
  sec('cp-sec-name',   cfg.showName   !== false);
  sec('cp-sec-xp',     cfg.showXP     !== false);
  sec('cp-sec-level',  cfg.showLevel  !== false);
  sec('cp-sec-stats',  cfg.showStats  !== false);

  // Dynamic stats row
  var statsEl = document.getElementById('cp-sec-stats');
  if (statsEl) {
    var statIds = (cfg.stats && cfg.stats.length) ? cfg.stats : ['streak','totalCompleted','todayDone'];
    statsEl.innerHTML = statIds.map(function(id) {
      var opt = CARD_STAT_OPTIONS.find(function(o) { return o.id === id; });
      if (!opt) return '';
      return '<div class="cp-stat"><div class="cp-stat-val" style="color:' + opt.color + '">' +
        opt.get(p, state) + '</div><div class="cp-stat-lbl">' + opt.label + '</div></div>';
    }).join('');
  }

  // Pinned achievements row
  var achEl = document.getElementById('cp-sec-ach');
  if (achEl) {
    // Show pinned achievements if any are selected (showAch flag optional — auto-show if achs selected)
    var pinned = (cfg.achs && cfg.achs.length) ?
      cfg.achs.map(function(id) { return ACHIEVEMENTS.find(function(a) { return a.id === id && a.unlocked; }); }).filter(Boolean) : [];
    achEl.style.display = pinned.length ? '' : 'none';
    achEl.innerHTML = pinned.map(function(a) {
      var rc = ACH_RARITY_CFG[a.rarity] || ACH_RARITY_CFG.common;
      return '<div class="cp-ach-badge" title="' + a.name + '" style="border-color:' + rc.border + '66;background:' + rc.badgeBg.replace('linear-gradient','linear-gradient').split(')')[0] + ')20">' +
        '<span class="cp-ach-badge-ico" style="background:' + rc.badgeBg + ';box-shadow:0 0 8px ' + rc.glow + '">' +
          '<span style="display:flex;align-items:center;justify-content:center;width:18px;height:18px">' + a.svg + '</span>' +
        '</span>' +
        '<span class="cp-ach-name" style="color:' + rc.border + '">' + a.name + '</span>' +
      '</div>';
    }).join('');
  }
}

var _cpDraft = {};

function openCardCustomizer() {
  _cpDraft = JSON.parse(JSON.stringify(state.cardConfig || {}));
  if (!_cpDraft.bg)    _cpDraft.bg    = 'default';
  if (!_cpDraft.stats) _cpDraft.stats = ['streak','totalCompleted','todayDone'];
  if (!_cpDraft.achs)  _cpDraft.achs  = [];
  if (!_cpDraft.nameColor) _cpDraft.nameColor = '';

  var isPro = state.player.isPro;

  // Backgrounds (8 free + 8 pro)
  document.getElementById('cp-bg-grid').innerHTML = CARD_BG_PRESETS.map(function(b) {
    var locked = b.pro && !isPro;
    var sel = !locked && _cpDraft.bg === b.id;
    return '<div class="cp-bg-swatch' + (sel ? ' cp-bg-sel' : '') + (locked ? ' cp-bg-locked' : '') + '" ' +
      'style="background:' + (b.bg || 'var(--surface)') + ';border-color:' + (b.bg ? 'transparent' : 'var(--border2)') + '" ' +
      (locked ? 'onclick="cpProPrompt()" title="' + b.label + ' — Pro only"' : 'onclick="cpSetBg(\'' + b.id + '\')" title="' + b.label + '"') +
      '><span class="cp-bg-lbl">' + b.label + '</span>' +
      (locked ? '<span class="cp-bg-pro-lock">👑</span>' : '') +
      '</div>';
  }).join('');

  // Show/hide toggles
  var sections = [
    { key:'showAvatar', label:'Avatar' },
    { key:'showName',   label:'Name' },
    { key:'showXP',     label:'XP Bar' },
    { key:'showLevel',  label:'Level Ring' },
    { key:'showStats',  label:'Stats Row' },
    { key:'showAch',    label:'Achievements Row' },
  ];
  document.getElementById('cp-toggle-list').innerHTML = sections.map(function(s) {
    var on = _cpDraft[s.key] !== false;
    return '<label class="cp-toggle-row"><span>' + s.label + '</span>' +
      '<input type="checkbox"' + (on ? ' checked' : '') + ' onchange="cpToggle(\'' + s.key + '\',this.checked)"></label>';
  }).join('');

  // Stat pills
  document.getElementById('cp-stat-grid').innerHTML = CARD_STAT_OPTIONS.map(function(o) {
    var sel = (_cpDraft.stats || []).indexOf(o.id) !== -1;
    return '<div class="cp-pill' + (sel ? ' cp-pill-sel' : '') + '" onclick="cpToggleStat(\'' + o.id + '\')">' + o.label + '</div>';
  }).join('');

  // Achievement slots
  _cpActiveSlot = -1;
  cpRenderSlots();
  document.getElementById('cp-ach-options').style.display = 'none';

  // Name color picker (pro only)
  var colorSec = document.getElementById('cp-name-color-sec');
  if (colorSec) {
    if (!isPro) {
      colorSec.innerHTML = '<div class="cp-pro-locked-row">🔒 Name color is a <a onclick="goPage(\'subscription\',null)" class="cp-upgrade-link">👑 Pro feature</a></div>';
    } else {
      var NAME_COLORS = [
        { id:'',        label:'Default', hex:'' },
        { id:'#ffd700', label:'Gold',    hex:'#ffd700' },
        { id:'#00d4ff', label:'Cyan',    hex:'#00d4ff' },
        { id:'#a78bfa', label:'Violet',  hex:'#a78bfa' },
        { id:'#f472b6', label:'Pink',    hex:'#f472b6' },
        { id:'#34d399', label:'Mint',    hex:'#34d399' },
        { id:'#fb923c', label:'Orange',  hex:'#fb923c' },
        { id:'#f87171', label:'Red',     hex:'#f87171' },
        { id:'#ffffff', label:'White',   hex:'#ffffff' },
      ];
      colorSec.innerHTML = '<div class="cp-color-grid">' + NAME_COLORS.map(function(c) {
        var sel = _cpDraft.nameColor === c.id;
        return '<div class="cp-color-swatch' + (sel ? ' cp-color-sel' : '') + '" ' +
          'style="background:' + (c.hex || 'var(--fg)') + '" ' +
          'onclick="cpSetNameColor(\'' + c.id + '\')" title="' + c.label + '"></div>';
      }).join('') + '</div>';
    }
  }

  document.getElementById('cp-modal').classList.add('show');
}

function closeCardCustomizer() { document.getElementById('cp-modal').classList.remove('show'); }

function cpProPrompt() {
  showToast('👑 Pro Only', 'Upgrade to Pro to unlock epic backgrounds!', 'streak');
}

function cpSetBg(id) {
  var preset = CARD_BG_PRESETS.find(function(b) { return b.id === id; });
  if (preset && preset.pro && !state.player.isPro) { cpProPrompt(); return; }
  _cpDraft.bg = id;
  document.querySelectorAll('#cp-bg-grid .cp-bg-swatch').forEach(function(el, i) {
    el.classList.toggle('cp-bg-sel', !CARD_BG_PRESETS[i].pro && CARD_BG_PRESETS[i].id === id);
  });
}

function cpSetNameColor(color) {
  _cpDraft.nameColor = color;
  document.querySelectorAll('.cp-color-swatch').forEach(function(el) {
    var c = el.getAttribute('onclick').match(/'([^']*)'/);
    el.classList.toggle('cp-color-sel', c && c[1] === color);
  });
}

function cpToggle(key, val) { _cpDraft[key] = val; }

function cpToggleStat(id) {
  var arr = _cpDraft.stats || [];
  var idx = arr.indexOf(id);
  if (idx !== -1) { arr.splice(idx, 1); }
  else { if (arr.length >= 3) { showToast('⚠️ Max 3', 'Select up to 3 stats', 'streak'); return; } arr.push(id); }
  _cpDraft.stats = arr;
  document.querySelectorAll('#cp-stat-grid .cp-pill').forEach(function(el, i) {
    el.classList.toggle('cp-pill-sel', arr.indexOf(CARD_STAT_OPTIONS[i].id) !== -1);
  });
}

var _cpActiveSlot = -1;

function cpRenderSlots() {
  var isPro = state.player.isPro;
  var maxSlots = isPro ? 3 : 1;
  var arr = _cpDraft.achs || [];
  var html = '';
  for (var i = 0; i < 3; i++) {
    var locked = i >= maxSlots;
    var achId  = arr[i];
    var ach    = achId ? ACHIEVEMENTS.find(function(a) { return a.id === achId; }) : null;
    var active = _cpActiveSlot === i;
    if (locked) {
      html += '<div class="cp-ach-slot cp-ach-slot-locked" onclick="cpProPrompt()" title="Pro only">' +
        '<span class="cp-slot-lock">🔒</span><span class="cp-slot-crown">👑</span></div>';
    } else if (ach) {
      var rc = ACH_RARITY_CFG[ach.rarity] || ACH_RARITY_CFG.common;
      html += '<div class="cp-ach-slot cp-ach-slot-filled' + (active ? ' cp-ach-slot-active' : '') + '" ' +
        'style="background:' + rc.badgeBg + ';border:2.5px solid ' + rc.border + ';box-shadow:0 0 16px ' + rc.glow + '" ' +
        'onclick="cpRemoveSlot(' + i + ')" title="Remove ' + ach.name + '">' +
        '<div style="width:36px;height:36px;display:flex;align-items:center;justify-content:center">' + ach.svg + '</div>' +
        '<span class="cp-slot-x">✕</span></div>';
    } else {
      html += '<div class="cp-ach-slot cp-ach-slot-empty' + (active ? ' cp-ach-slot-active' : '') + '" onclick="cpPickSlot(' + i + ')" title="Add achievement">' +
        '<span class="cp-slot-plus">+</span></div>';
    }
  }
  document.getElementById('cp-ach-slots').innerHTML = html;
}

function cpPickSlot(i) {
  _cpActiveSlot = i;
  cpRenderSlots();
  var arr = _cpDraft.achs || [];
  var unlocked = ACHIEVEMENTS.filter(function(a) { return a.unlocked; });
  var optEl = document.getElementById('cp-ach-options');
  if (!unlocked.length) {
    optEl.innerHTML = '<div style="color:var(--muted);font-size:.82rem;padding:4px 0">Unlock achievements first to pin them here.</div>';
  } else {
    optEl.innerHTML = '<div class="cp-pill-grid">' + unlocked.map(function(a) {
      var usedIdx = arr.indexOf(a.id);
      var usedOther = usedIdx !== -1 && usedIdx !== i;
      var rc = ACH_RARITY_CFG[a.rarity] || ACH_RARITY_CFG.common;
      var dot = '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:' + rc.border + ';margin-right:6px;flex-shrink:0;box-shadow:0 0 5px ' + rc.glow + '"></span>';
      return '<div class="cp-pill' + (usedOther ? ' cp-ach-opt-used' : '') + '" ' +
        'style="display:flex;align-items:center' + (usedOther ? '' : ';border-color:' + rc.border + '66') + '" ' +
        (usedOther ? '' : 'onclick="cpSelectAchForSlot(\'' + a.id + '\')"') + '>' +
        dot + a.name + '</div>';
    }).join('') + '</div>';
  }
  optEl.style.display = '';
}

function cpRemoveSlot(i) {
  var arr = _cpDraft.achs || [];
  arr.splice(i, 1);
  _cpDraft.achs = arr;
  _cpActiveSlot = -1;
  cpRenderSlots();
  document.getElementById('cp-ach-options').style.display = 'none';
}

function cpSelectAchForSlot(achId) {
  var arr = _cpDraft.achs || [];
  var existingIdx = arr.indexOf(achId);
  if (existingIdx !== -1) arr.splice(existingIdx, 1);
  arr.splice(_cpActiveSlot, 0, achId);
  if (arr.length > 3) arr = arr.slice(0, 3);
  _cpDraft.achs = arr;
  _cpActiveSlot = -1;
  cpRenderSlots();
  document.getElementById('cp-ach-options').style.display = 'none';
}

function saveCardConfig() {
  state.cardConfig = _cpDraft;
  save();
  renderCharPanel();
  closeCardCustomizer();
  showToast('✨ Card saved!', 'Your card has been updated', 'xp-gain');
}

function activatePro() {
  state.player.isPro = true;
  save();
  showToast('👑 Pro Activated!', 'Welcome to HabitQuest Pro — enjoy your perks!', 'level-up');
}

function renderMiniLB() {
  var el = document.getElementById('d-mini-lb');
  if (!el) return;

  var friends = state.player.friends || [];

  // Always show self immediately
  var entries = [{
    name:   state.player.name || 'You',
    avatar: state.player.avatar || '🧙',
    level:  state.player.level || 1,
    xp:     state.player.totalXP || 0,
    isMe:   true
  }];

  if (!friends.length) {
    // No friends yet — just show self with a prompt
    _renderMiniLBRows(el, entries);
    return;
  }

  if (!window._loadFriendProfiles) {
    _renderMiniLBRows(el, entries);
    return;
  }

  window._loadFriendProfiles(friends).then(function(snaps) {
    snaps.forEach(function(snap) {
      if (!snap.exists()) return;
      var p = snap.data().player || {};
      entries.push({
        name:   p.name   || 'Friend',
        avatar: p.avatar || '🧙',
        level:  p.level  || 1,
        xp:     p.totalXP || 0,
        isMe:   false
      });
    });
    _renderMiniLBRows(el, entries);
  }).catch(function() {
    _renderMiniLBRows(el, entries);
  });
}

function _renderMiniLBRows(el, entries) {
  entries.sort(function(a, b) { return b.xp - a.xp; });
  var medals = ['🥇','🥈','🥉'];
  if (entries.length === 1 && !entries[0].isMe) {
    el.innerHTML = '<div style="color:var(--muted);font-size:.8rem;padding:8px 0">Add friends to see them here!</div>';
    return;
  }
  el.innerHTML = entries.map(function(r, i) {
    var medal = medals[i] || ('#' + (i + 1));
    var rc = i === 0 ? 't1' : i === 1 ? 't2' : i === 2 ? 't3' : '';
    return '<div class="mini-lb-row' + (r.isMe ? ' me' : '') + '">' +
      '<div class="mini-rank ' + rc + '">' + medal + '</div>' +
      avatarHtml(r.avatar) +
      '<div><div class="mini-name">' + (r.isMe ? 'YOU' : r.name) + '</div>' +
      '<div style="font-family:var(--ff-mono);font-size:.6rem;color:var(--muted)">Lv. ' + r.level + '</div></div>' +
      '<div class="mini-xp">' + r.xp.toLocaleString() + '</div>' +
    '</div>';
  }).join('');
}

// Returns the today entry for a challenge: { status, count } or null
function _chTodayEntry(id) {
  var today = new Date().toDateString();
  var log = state.challengeLog || {};
  return (log[id] && log[id][today]) || null;
}

// Computes current streak (consecutive completed days ending today or yesterday)
function _chStreak(id) {
  var log = (state.challengeLog || {})[id] || {};
  var streak = 0;
  var d = new Date();
  // If today not completed yet, start checking from yesterday
  var todayStr = d.toDateString();
  var todayEntry = log[todayStr];
  if (!todayEntry || todayEntry.status !== 'completed') d.setDate(d.getDate() - 1);
  for (var i = 0; i < 365; i++) {
    var key = d.toDateString();
    if (log[key] && log[key].status === 'completed') { streak++; d.setDate(d.getDate() - 1); }
    else break;
  }
  return streak;
}

// Returns group habits as challenge-compatible objects for dashboard rendering
function _getGroupChallengesForDash() {
  if (!window.activeGroup || !window._latestGroupHabits || !window._latestGroupHabits.length) return [];
  return window._latestGroupHabits.map(function(h) {
    return {
      id: 'grp_' + h.id,
      _origId: h.id,
      name: h.name,
      desc: h.desc || '',
      icon: h.icon || '👥',
      xp: DIFF_XP[h.diff] || 25,
      cc1: h.color || '#0d8a7f',
      isGroup: true,
      isCustom: true,
      dailyLimit: 1
    };
  });
}

// Done on a group challenge: track XP/streak locally + sync completion to Firebase
function checkInGroupChallenge(id, action) {
  checkInChallenge(id, action);
  if (action === 'completed') {
    var gc = _getGroupChallengesForDash().find(function(c) { return c.id === id; });
    if (gc && window.currentUser && window.activeGroup && window._completeGroupHabit) {
      window._completeGroupHabit(window.activeGroup.id, gc._origId, null);
    }
  }
}

function _renderDashChCard(c, isGroup) {
  var entry    = _chTodayEntry(c.id);
  var status   = entry ? entry.status : 'pending';
  var count    = entry ? (entry.count || 0) : 0;
  var limit    = c.isCustom ? (c.dailyLimit || 1) : 1;
  var limitLbl = limit === 99 ? '∞' : limit;
  var streak   = _chStreak(c.id);
  var streakHtml = streak > 0
    ? '<span class="dch-streak">🔥 ' + streak + ' day' + (streak > 1 ? 's' : '') + '</span>'
    : '';

  var fn = isGroup ? 'checkInGroupChallenge' : 'checkInChallenge';
  var actionHtml;
  if (status === 'completed' || (limit !== 99 && count >= limit)) {
    actionHtml = '<div class="dch-done">✅ Done <span class="dch-xp-earned">+' + (count * c.xp) + ' XP</span></div>';
  } else if (status === 'skipped') {
    actionHtml = '<div class="dch-skipped">⏭ Skipped today</div>';
  } else {
    var countHtml = (c.isCustom && limit > 1)
      ? ' <span class="dch-count">(' + count + '/' + limitLbl + ')</span>'
      : '';
    actionHtml =
      '<div class="dch-btns">' +
        '<button class="dch-btn-done" onclick="' + fn + '(\'' + c.id + '\',\'completed\')">' +
          '✅ Done' + countHtml +
        '</button>' +
        '<button class="dch-btn-skip" onclick="' + fn + '(\'' + c.id + '\',\'skipped\')">' +
          '⏭ Skip' +
        '</button>' +
      '</div>';
  }

  return '<div class="dash-ch-card" style="border-left:4px solid ' + (c.cc1 || '#6d3dbd') + '" onclick="openChallengeDetail(\'' + c.id + '\')">' +
    '<div class="dash-ch-icon">' + c.icon + '</div>' +
    '<div class="dash-ch-info">' +
      '<div class="dash-ch-name">' + c.name + ' ' + streakHtml + '</div>' +
      '<div class="dash-ch-desc">' + c.desc + '</div>' +
    '</div>' +
    '<div class="dch-action" onclick="event.stopPropagation()">' + actionHtml + '</div>' +
  '</div>';
}

function renderDashChallenges() {
  var el = document.getElementById('d-dash-challenges');
  if (!el) return;

  var joined = (state.player.joinedChallenges || []);
  var allCh  = CHALLENGES.concat(state.customChallenges || []);
  var solo   = allCh.filter(function(c) { return joined.includes(c.id); });
  var group  = _getGroupChallengesForDash();

  var html = '';

  // ── Solo Challenges ──
  html += '<div class="dash-section-label">👤 Solo Challenges</div>';
  if (!solo.length) {
    html += '<div style="color:var(--muted);font-size:.88rem;padding:8px 0 4px">' +
      'No challenges joined yet. <a href="#" onclick="goPage(\'challenges\',document.querySelector(\'[onclick*=challenges]\')); return false;" ' +
      'style="color:var(--teal);text-decoration:none">Browse challenges →</a></div>';
  } else {
    html += '<div class="dash-ch-list">' + solo.map(function(c) { return _renderDashChCard(c, false); }).join('') + '</div>';
  }

  // ── Group Challenges ── (only shown when user is in a group)
  if (window.activeGroup) {
    html += '<div class="dash-section-label" style="margin-top:20px">👥 Group Challenges</div>';
    if (!group.length) {
      html += '<div style="color:var(--muted);font-size:.88rem;padding:8px 0 4px">' +
        'No group challenges yet. <a href="#" onclick="goPage(\'group\',document.querySelector(\'[onclick*=group]\')); return false;" ' +
        'style="color:var(--teal);text-decoration:none">Go to Group →</a></div>';
    } else {
      html += '<div class="dash-ch-list">' + group.map(function(c) { return _renderDashChCard(c, true); }).join('') + '</div>';
    }
  }

  el.innerHTML = html;
}

// Returns ms until local midnight (00:00:00 next day)
function _msUntilMidnight() {
  var now = new Date();
  var midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return midnight.getTime() - now.getTime();
}

// Format milliseconds as HH:MM:SS
function _fmtCountdown(ms) {
  if (ms <= 0) return '00:00:00';
  var s = Math.floor(ms / 1000);
  var h = Math.floor(s / 3600);
  var m = Math.floor((s % 3600) / 60);
  var sec = s % 60;
  return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m + ':' + (sec < 10 ? '0' : '') + sec;
}

function checkInChallenge(id, action) {
  var allCh = CHALLENGES.concat(state.customChallenges || []).concat(_getGroupChallengesForDash());
  var c = allCh.find(function(x) { return x.id === id; });
  if (!c) return;
  var today = new Date().toDateString();
  if (!state.challengeLog) state.challengeLog = {};
  if (!state.challengeLog[id]) state.challengeLog[id] = {};
  var entry = state.challengeLog[id][today] || { status: 'pending', count: 0 };
  var limit = c.isCustom ? (c.dailyLimit || 1) : 1;

  if (action === 'completed') {
    // Block if already hit today's limit
    if (entry.status === 'completed' || (limit !== 99 && entry.count >= limit)) {
      showToast('⏳ Not yet!', 'Next entry at midnight', 'streak');
      return;
    }
    var newCount = entry.count + 1;
    var nowDone  = limit === 99 || newCount >= limit;
    state.challengeLog[id][today] = { status: nowDone ? 'completed' : 'pending', count: newCount };
    grantXP(c.xp);
    renderAll();
    save();
    if (_detailModalId === id) _renderDetailModal(c);
    showToast('✅ ' + c.name, '+' + c.xp + ' XP earned!', 'xp-gain');
  } else {
    if (entry.status === 'completed') return;
    state.challengeLog[id][today] = { status: 'skipped', count: entry.count };
    renderDashChallenges();
    if (_detailModalId === id) _renderDetailModal(c);
    save();
    showToast('⏭ Skipped', c.name + ' — come back tomorrow', 'streak');
  }
}

/* ════ CHALLENGE DETAIL MODAL ════ */
var _detailModalId = null;
var _detailTimerInterval = null;

function openChallengeDetail(id) {
  var allCh = CHALLENGES.concat(state.customChallenges || []).concat(_getGroupChallengesForDash());
  var c = allCh.find(function(x) { return x.id === id; });
  if (!c) return;
  _detailModalId = id;

  // Create overlay if not exists
  var existing = document.getElementById('ch-detail-overlay');
  if (!existing) {
    var ov = document.createElement('div');
    ov.id = 'ch-detail-overlay';
    ov.className = 'ch-detail-overlay';
    ov.onclick = function(e) { if (e.target === ov) closeChallengeDetail(); };
    document.body.appendChild(ov);
  }
  document.getElementById('ch-detail-overlay').style.display = 'flex';
  _renderDetailModal(c);
}

function _renderDetailModal(c) {
  var ov = document.getElementById('ch-detail-overlay');
  if (!ov) return;

  var today = new Date().toDateString();
  var entry = ((state.challengeLog || {})[c.id] || {})[today] || { status: 'pending', count: 0 };
  var limit = c.isCustom ? (c.dailyLimit || 1) : 1;
  var limitLbl = limit === 99 ? 'Unlimited' : limit + '× per day';
  var streak = _chStreak(c.id);
  var isDone = entry.status === 'completed' || (limit !== 99 && entry.count >= limit);
  var remaining = isDone ? _msUntilMidnight() : 0;

  var actionHtml;
  if (isDone || entry.status === 'skipped') {
    actionHtml =
      '<div class="chd-countdown-wrap">' +
        '<div class="chd-countdown-lbl">Next entry available in</div>' +
        '<div class="chd-countdown" id="chd-timer">' + _fmtCountdown(_msUntilMidnight()) + '</div>' +
      '</div>' +
      '<div class="chd-status-row">' +
        (isDone ? '<span class="chd-done-badge">✅ Completed today</span>' : '') +
        (entry.status === 'skipped' && !isDone ? '<span class="chd-skip-badge">⏭ Skipped today</span>' : '') +
      '</div>';
  } else {
    actionHtml =
      '<div class="chd-btns">' +
        '<button class="chd-btn-done" onclick="checkInChallenge(\'' + c.id + '\',\'completed\')">' +
          '✅ Mark as Done &nbsp;+' + c.xp + ' XP' +
          (limit > 1 && limit !== 99 ? ' <span style="opacity:.7;font-size:.8rem">(' + entry.count + '/' + limit + ')</span>' : '') +
        '</button>' +
        '<button class="chd-btn-skip" onclick="checkInChallenge(\'' + c.id + '\',\'skipped\')">' +
          '⏭ Skip Today' +
        '</button>' +
      '</div>';
  }

  var durationInfo = c.isCustom
    ? '<span class="chd-pill">📅 ' + (c.durationLabel || '') + '</span><span class="chd-pill">' + limitLbl + '</span>'
    : '';

  ov.innerHTML =
    '<div class="ch-detail-card" style="border-top:5px solid ' + (c.cc1 || '#6d3dbd') + '">' +
      '<button class="chd-close" onclick="closeChallengeDetail()">✕</button>' +
      '<div class="chd-icon">' + c.icon + '</div>' +
      '<div class="chd-name">' + c.name + '</div>' +
      '<div class="chd-desc">' + c.desc + '</div>' +
      '<div class="chd-pills">' + durationInfo + '<span class="chd-pill">⚡ ' + c.xp + ' XP/day</span></div>' +
      (streak > 0 ? '<div class="chd-streak">🔥 ' + streak + '-day streak</div>' : '') +
      '<div class="chd-divider"></div>' +
      actionHtml +
    '</div>';

  // Live countdown ticking every second
  if (_detailTimerInterval) clearInterval(_detailTimerInterval);
  _detailTimerInterval = setInterval(function() {
    var timerEl = document.getElementById('chd-timer');
    if (!timerEl) { clearInterval(_detailTimerInterval); return; }
    var rem = _msUntilMidnight();
    if (rem <= 0) {
      clearInterval(_detailTimerInterval);
      _renderDetailModal(c);
    } else {
      timerEl.textContent = _fmtCountdown(rem);
    }
  }, 1000);
}

function closeChallengeDetail() {
  _detailModalId = null;
  if (_detailTimerInterval) { clearInterval(_detailTimerInterval); _detailTimerInterval = null; }
  var ov = document.getElementById('ch-detail-overlay');
  if (ov) ov.style.display = 'none';
}

var _chActiveCat = 'all';

var CH_CATS = [
  { id:'all',      label:'All',        icon:'⚡' },
  { id:'health',   label:'Sport',      icon:'💪' },
  { id:'mind',     label:'Mind',       icon:'🧠' },
  { id:'skill',    label:'Education',  icon:'📚' },
  { id:'social',   label:'Social',     icon:'🤝' },
  { id:'creative', label:'Creative',   icon:'🎨' },
];

function filterChallenges(cat) {
  _chActiveCat = cat;
  document.querySelectorAll('.ch-cat-pill').forEach(function(el) {
    el.classList.toggle('active', el.dataset.cat === cat);
  });
  renderChallenges();
}

function renderChallenges() {
  var custom  = (state.customChallenges || []);
  var preset  = _chActiveCat === 'all'
    ? CHALLENGES
    : CHALLENGES.filter(function(c) { return c.cat === _chActiveCat; });
  // Custom challenges only visible in All or their own section
  var visible = _chActiveCat === 'all' ? preset.concat(custom) : preset;

  // Category tab bar
  var tabBar = '<div class="cat-pills ch-cat-bar">' +
    CH_CATS.map(function(c) {
      return '<button class="cat-pill ch-cat-pill' + (c.id === _chActiveCat ? ' active' : '') + '" ' +
        'data-cat="' + c.id + '" onclick="filterChallenges(\'' + c.id + '\')">' +
        c.icon + ' ' + c.label + '</button>';
    }).join('') +
  '</div>';

  var cards = visible.map(function(c) {
    var joined   = state.player.joinedChallenges.includes(c.id);
    var isCustom = !!c.isCustom;

    // Artwork: use CH_ART for presets, generate a simple illustrated circle for custom
    var art = CH_ART[c.id];
    if (!art) {
      var cc = c.cc1 || 'rgba(109,61,189,.5)';
      art = {
        bg: 'linear-gradient(135deg,#f9fafb 30%,#f3f4f6 100%)',
        svg: '<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">' +
             '<circle cx="75" cy="60" r="36" fill="' + cc + '" opacity=".25"/>' +
             '<circle cx="75" cy="60" r="26" fill="' + cc + '" opacity=".3"/>' +
             '<text x="57" y="75" font-size="34">' + c.icon + '</text></svg>'
      };
    }

    var badgeHtml = isCustom
      ? '<div class="ch-badge-d diff-custom">✨ Custom' + (c.dailyLimit > 1 ? ' · ' + (c.dailyLimit === 99 ? '∞' : c.dailyLimit) + '×/day' : '') + '</div>'
      : '<div class="ch-badge-d ' + c.diffCls + '">' + c.badge + '</div>';
    var durationHtml = isCustom
      ? '<div class="reward-chip" style="background:var(--teal-bg);border-color:var(--teal-br);color:var(--teal)">📅 ' + c.durationLabel + '</div>'
      : '';

    return '<div class="challenge-card ch-card-illustrated" style="--cc1:' + (c.cc1 || '#6d3dbd') + ';background:' + art.bg + '">' +
      '<div class="ch-card-art">' + art.svg + '</div>' +
      '<div class="ch-card-body">' +
        badgeHtml +
        '<div class="ch-name">' + c.name + '</div>' +
        '<div class="ch-desc">' + c.desc + '</div>' +
        '<div class="ch-rewards"><div class="reward-chip">⚡ ' + c.xp + ' XP</div>' + durationHtml + '</div>' +
        (!isCustom ? '<div class="ch-bar"><div class="ch-bar-fill" style="width:' + (joined ? c.progress : 0) + '%;--cg1:' + c.g1 + ';--cg2:' + c.g2 + '"></div></div>' : '') +
        '<button class="ch-join-btn ' + (joined ? 'joined' : '') + '" onclick="joinChallenge(\'' + c.id + '\',this)">' + (joined ? '✓ Joined — Quit?' : '⚡ Join Challenge') + '</button>' +
        (isCustom ? '<button class="ch-delete-btn" onclick="deleteCustomChallenge(\'' + c.id + '\')">🗑 Remove</button>' : '') +
      '</div>' +
    '</div>';
  }).join('');

  var grid = document.getElementById('d-challenges-grid');
  if (grid) grid.innerHTML = tabBar + '<div class="challenges-grid ch-inner-grid">' + cards + '</div>';
}

/* ════ CUSTOM CHALLENGES ════ */
var _achSelectedIcon = '⚡';

function openAddChallengeModal() {
  _achSelectedIcon = '⚡';
  var modal = document.getElementById('add-ch-modal');
  // Build icon picker
  var icons = ['⚡','🔥','💪','🧘','📚','💧','🥗','😴','🧠','✍️','🎯','🎨','🎸','🏊','🚴','🌿','🌅','💻','📖','🏋️','🎭','🗣️','🧩','🌱','💎','🏃','🎪','🌍','❄️','🧗'];
  document.getElementById('ach-icon-row').innerHTML = icons.map(function(ic) {
    return '<div class="ach-icon-opt' + (ic === _achSelectedIcon ? ' sel' : '') + '" onclick="selectAchIcon(this,\'' + ic + '\')">' + ic + '</div>';
  }).join('');
  document.getElementById('ach-name').value = '';
  document.getElementById('ach-desc').value = '';
  document.getElementById('ach-error').textContent = '';
  modal.style.display = 'flex';
}

function closeAddChallengeModal() {
  document.getElementById('add-ch-modal').style.display = 'none';
}

function selectAchIcon(el, icon) {
  document.querySelectorAll('.ach-icon-opt').forEach(function(e) { e.classList.remove('sel'); });
  el.classList.add('sel');
  _achSelectedIcon = icon;
}

function submitCustomChallenge() {
  var name = document.getElementById('ach-name').value.trim();
  var desc = document.getElementById('ach-desc').value.trim();
  var xp   = parseInt(document.getElementById('ach-xp').value);
  var dur  = parseInt(document.getElementById('ach-duration').value);
  var daily = parseInt(document.getElementById('ach-daily').value);
  var errEl = document.getElementById('ach-error');

  if (!name) { errEl.textContent = 'Please enter a challenge name.'; return; }
  if (!desc) { errEl.textContent = 'Please add a short description.'; return; }

  var durLabels = {7:'1 Week',14:'2 Weeks',30:'1 Month',60:'2 Months',90:'3 Months',365:'1 Year'};
  var colors = ['#c4374a','#6d3dbd','#0d8a7f','#c9820a','#1a8a5a','#c47028','#8b5cf6'];
  var cc1 = colors[Math.floor(Math.random() * colors.length)];

  var ch = {
    id: 'custom_' + Date.now(),
    name: name,
    desc: desc,
    icon: _achSelectedIcon,
    xp: xp,
    duration: dur,
    durationLabel: durLabels[dur] || (dur + ' days'),
    dailyLimit: daily,
    cc1: cc1,
    isCustom: true,
    createdAt: new Date().toISOString()
  };

  if (!state.customChallenges) state.customChallenges = [];
  state.customChallenges.push(ch);
  // Auto-join the custom challenge
  if (!state.player.joinedChallenges.includes(ch.id)) state.player.joinedChallenges.push(ch.id);
  save();
  closeAddChallengeModal();
  renderChallenges();
  renderDashChallenges();
  showToast('✨ Challenge Created!', name + ' — good luck!', 'streak');
}

function deleteCustomChallenge(id) {
  state.customChallenges = (state.customChallenges || []).filter(function(c) { return c.id !== id; });
  state.player.joinedChallenges = state.player.joinedChallenges.filter(function(i) { return i !== id; });
  save();
  renderChallenges();
  renderDashChallenges();
}

function recordCustomChallenge(id) {
  checkInChallenge(id, 'completed');
}

function joinChallenge(id, btn) {
  var allCh = CHALLENGES.concat(state.customChallenges || []);
  const c = allCh.find(c => c.id === id);
  if (state.player.joinedChallenges.includes(id)) {
    // Quit
    state.player.joinedChallenges = state.player.joinedChallenges.filter(function(i) { return i !== id; });
    btn.className = 'ch-join-btn';
    btn.textContent = '⚡ Join Challenge';
    if (!c.isCustom) {
      var fill = btn.previousElementSibling && btn.previousElementSibling.querySelector && btn.previousElementSibling.querySelector('.ch-bar-fill');
      if (fill) fill.style.width = '0%';
    }
    showToast('👋 Left Challenge', c.name, 'streak');
    save();
    renderDashChallenges();
    return;
  }
  // Join
  state.player.joinedChallenges.push(id);
  btn.className = 'ch-join-btn joined';
  btn.textContent = '✓ Joined — Quit?';
  if (!c.isCustom) {
    var fill2 = btn.previousElementSibling && btn.previousElementSibling.querySelector && btn.previousElementSibling.querySelector('.ch-bar-fill');
    if (fill2) fill2.style.width = c.progress + '%';
  }
  showToast('⚡ Challenge Joined!', c.name + ' — good luck!', 'streak');
  save();
  renderDashChallenges();
}

function renderLeaderboard() {
  const data = LEADERBOARD.map(r => {
    if (r.me) return { ...r, level:state.player.level, xp:state.player.totalXP, streak:state.player.streak, avatar:state.player.avatar, name:'YOU' };
    return r;
  }).sort((a,b) => b.xp - a.xp);
  document.getElementById('d-lb').innerHTML =
    `<div class="lb-hdr">🏆 World Ranking <span style="color:var(--muted);font-size:.72rem;margin-left:auto;font-family:var(--ff-mono)">ALL TIME</span></div>` +
    data.map((r, i) => {
      const rank = i + 1, rc = rank===1?'t1':rank===2?'t2':rank===3?'t3':'';
      const medal = rank===1?'🥇':rank===2?'🥈':rank===3?'🥉':rank;
      return `<div class="lb-row ${r.me ? 'me' : ''}">
        <div class="lb-rank ${rc}">${medal}</div>
        <div class="lb-av">${r.avatar && r.avatar.startsWith('http') ? '<img src="'+r.avatar+'" style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block">' : r.avatar}</div>
        <div>
          <div class="lb-name">${r.name}${r.me ? ' <span style="color:var(--teal);font-size:.65rem;font-family:var(--ff-mono)">YOU</span>' : ''}</div>
          <div class="lb-lv">Lv. ${r.level}</div>
        </div>
        <div class="lb-streak-val">${r.streak > 0 ? '🔥 ' + r.streak : '—'}</div>
        <div class="lb-xp">${r.xp.toLocaleString()} XP</div>
      </div>`;
    }).join('');
}

/* ════ MODAL ════ */
function openModal() {
  document.getElementById('d-icon-grid').innerHTML  = ICONS.map(ic => `<div class="icon-opt ${ic === state.selectedIcon ? 'sel' : ''}" onclick="selIcon(this,'${ic}')">${ic}</div>`).join('');
  document.getElementById('d-color-grid').innerHTML = COLORS.map(col => `<div class="color-opt ${col === state.selectedColor ? 'sel' : ''}" style="background:${col}" onclick="selColor(this,'${col}')"></div>`).join('');
  document.getElementById('d-h-name').value = '';
  document.getElementById('d-h-desc').value = '';
  document.getElementById('d-modal').classList.add('show');
}

function closeModal() {
  var m = document.getElementById('d-modal');
  m.classList.remove('show');
  m.style.display = 'none';  // clear inline style set by avatar/QR pickers
  m.innerHTML = '';           // clear stale content
}

function selIcon(el, ic) {
  document.querySelectorAll('.icon-opt').forEach(e => e.classList.remove('sel'));
  el.classList.add('sel');
  state.selectedIcon = ic;
}

function selColor(el, col) {
  document.querySelectorAll('.color-opt').forEach(e => e.classList.remove('sel'));
  el.classList.add('sel');
  state.selectedColor = col;
}

function addHabit() {
  const name = document.getElementById('d-h-name').value.trim();
  if (!name) { document.getElementById('d-h-name').focus(); return; }
  state.habits.push({
    id: 'h' + Date.now(),
    name,
    desc: document.getElementById('d-h-desc').value.trim(),
    icon: state.selectedIcon,
    color: state.selectedColor,
    diff: document.getElementById('d-h-diff').value,
    cat: document.getElementById('d-h-cat').value,
    streak: 0,
  });
  closeModal();
  renderAll();
  checkAchievements();
  showToast('⚔️ New Quest!', `"${name}" added`, 'xp-gain');
  save();
}

document.getElementById('d-modal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});
// Escape key also closes modal
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeModal();
});

/* ════ TOAST ════ */
function showToast(title, msg, type = 'xp-gain') {
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  const icons = { 'xp-gain':'⚡', 'level-up':'🎉', 'streak':'🔥' };
  el.innerHTML = `<span class="toast-icon">${icons[type] || '✨'}</span><div><div style="font-weight:700;font-size:.85rem">${title}</div><div style="color:var(--muted);font-size:.77rem;margin-top:2px">${msg}</div></div>`;
  document.getElementById('toast-container').appendChild(el);
  setTimeout(() => {
    el.style.animation = 'toastin .3s reverse forwards';
    setTimeout(() => el.remove(), 320);
  }, 3200);
}

/* ════ AVATAR ════ */
const DICEBEAR_AVATARS = [
  // Heroes
  { id:'h1', cat:'heroes', url:'https://api.dicebear.com/9.x/adventurer/svg?seed=Felix&backgroundColor=b6e3f4' },
  { id:'h2', cat:'heroes', url:'https://api.dicebear.com/9.x/adventurer/svg?seed=Aneka&backgroundColor=ffd5dc' },
  { id:'h3', cat:'heroes', url:'https://api.dicebear.com/9.x/adventurer/svg?seed=Warrior&backgroundColor=c0aede' },
  { id:'h4', cat:'heroes', url:'https://api.dicebear.com/9.x/adventurer/svg?seed=Shadow&backgroundColor=d1d4f9' },
  { id:'h5', cat:'heroes', url:'https://api.dicebear.com/9.x/adventurer/svg?seed=Dragon&backgroundColor=ffdfbf' },
  { id:'h6', cat:'heroes', url:'https://api.dicebear.com/9.x/adventurer/svg?seed=Storm&backgroundColor=b6e3f4' },
  // Robots
  { id:'r1', cat:'robots', url:'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Cleo' },
  { id:'r2', cat:'robots', url:'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Orion' },
  { id:'r3', cat:'robots', url:'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Pixel' },
  { id:'r4', cat:'robots', url:'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Nova' },
  { id:'r5', cat:'robots', url:'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Apex' },
  { id:'r6', cat:'robots', url:'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Zeta' },
  // Pixel
  { id:'p1', cat:'pixel', url:'https://api.dicebear.com/9.x/pixel-art/svg?seed=Nala' },
  { id:'p2', cat:'pixel', url:'https://api.dicebear.com/9.x/pixel-art/svg?seed=Ryker' },
  { id:'p3', cat:'pixel', url:'https://api.dicebear.com/9.x/pixel-art/svg?seed=Luna' },
  { id:'p4', cat:'pixel', url:'https://api.dicebear.com/9.x/pixel-art/svg?seed=Blaze' },
  { id:'p5', cat:'pixel', url:'https://api.dicebear.com/9.x/pixel-art/svg?seed=Ghost' },
  { id:'p6', cat:'pixel', url:'https://api.dicebear.com/9.x/pixel-art/svg?seed=Titan' },
  // Faces
  { id:'f1', cat:'faces', url:'https://api.dicebear.com/9.x/lorelei/svg?seed=Alex&backgroundColor=b6e3f4' },
  { id:'f2', cat:'faces', url:'https://api.dicebear.com/9.x/lorelei/svg?seed=Sam&backgroundColor=ffd5dc' },
  { id:'f3', cat:'faces', url:'https://api.dicebear.com/9.x/lorelei/svg?seed=Jordan&backgroundColor=c0aede' },
  { id:'f4', cat:'faces', url:'https://api.dicebear.com/9.x/lorelei/svg?seed=Morgan&backgroundColor=ffdfbf' },
  { id:'f5', cat:'faces', url:'https://api.dicebear.com/9.x/lorelei/svg?seed=Casey&backgroundColor=d1d4f9' },
  { id:'f6', cat:'faces', url:'https://api.dicebear.com/9.x/lorelei/svg?seed=Robin&backgroundColor=b6e3f4' },
  // Fun
  { id:'u1', cat:'fun', url:'https://api.dicebear.com/9.x/thumbs/svg?seed=Champion' },
  { id:'u2', cat:'fun', url:'https://api.dicebear.com/9.x/thumbs/svg?seed=Quest' },
  { id:'u3', cat:'fun', url:'https://api.dicebear.com/9.x/thumbs/svg?seed=Spirit' },
  { id:'u4', cat:'fun', url:'https://api.dicebear.com/9.x/thumbs/svg?seed=Vortex' },
  { id:'u5', cat:'fun', url:'https://api.dicebear.com/9.x/thumbs/svg?seed=Rocket' },
  { id:'u6', cat:'fun', url:'https://api.dicebear.com/9.x/thumbs/svg?seed=Blaze' },
];

// Renders avatar (emoji string OR DiceBear URL) into a DOM element.
function renderAvatarEl(el, avatar) {
  if (!el) return;
  if (avatar && avatar.startsWith('http')) {
    el.innerHTML = '<img src="' + avatar + '" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;display:block">';
  } else {
    el.innerHTML = avatar || '🧙';
  }
}

// Returns avatar HTML string for use in innerHTML templates.
function avatarHtml(avatar, extraCls) {
  var cls = 'mini-avatar' + (extraCls ? ' ' + extraCls : '');
  if (avatar && avatar.startsWith('http')) {
    return '<div class="' + cls + '"><img src="' + avatar + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block"></div>';
  }
  return '<div class="' + cls + '">' + (avatar || '🧙') + '</div>';
}

function openAvatarPicker() {
  var modal = document.getElementById('d-modal');
  modal.style.display = 'flex';
  var catDefs = [
    { id:'all', label:'All' }, { id:'heroes', label:'Heroes' },
    { id:'robots', label:'Robots' }, { id:'pixel', label:'Pixel' },
    { id:'faces', label:'Faces' }, { id:'fun', label:'Fun' },
  ];
  var tabsHtml = catDefs.map(function(c) {
    return '<button class="ap-tab' + (c.id === 'all' ? ' active' : '') + '" onclick="filterAvatarCat(\'' + c.id + '\')">' + c.label + '</button>';
  }).join('');
  var gridHtml = DICEBEAR_AVATARS.map(function(av) {
    var sel = state.player.avatar === av.url;
    return '<div class="ap-item' + (sel ? ' selected' : '') + '" data-cat="' + av.cat + '" onclick="selectAvatar(\'' + av.url + '\')">' +
      '<img src="' + av.url + '" loading="lazy" alt="avatar">' +
    '</div>';
  }).join('');
  modal.innerHTML =
    '<div class="ap-modal">' +
      '<div class="ap-header">' +
        '<div class="ap-title">Choose Your Avatar</div>' +
        '<button class="ap-close" onclick="document.getElementById(\'d-modal\').style.display=\'none\'">✕</button>' +
      '</div>' +
      '<div class="ap-tabs">' + tabsHtml + '</div>' +
      '<div class="ap-grid" id="ap-grid">' + gridHtml + '</div>' +
    '</div>';
}

function filterAvatarCat(cat) {
  document.querySelectorAll('.ap-tab').forEach(function(t) { t.classList.remove('active'); });
  event.currentTarget.classList.add('active');
  document.querySelectorAll('.ap-item').forEach(function(item) {
    item.style.display = (cat === 'all' || item.dataset.cat === cat) ? 'flex' : 'none';
  });
}

function selectAvatar(url) {
  state.player.avatar = url;
  renderAll();
  var pfAv = document.getElementById('pf-avatar');
  if (pfAv) renderAvatarEl(pfAv, url);
  save();
  document.getElementById('d-modal').style.display = 'none';
  showToast('Avatar updated! 🎨');
}

// Make sidebar + quest panel avatars open the picker too
document.getElementById('sb-avatar').addEventListener('click', openAvatarPicker);
document.getElementById('d-avatar').addEventListener('click', openAvatarPicker);

/* ════ SUBSCRIPTION ════ */
function selectDesktopPlan(name, price) {
  document.getElementById('d-plan-name').textContent  = '👑 ' + name;
  document.getElementById('d-plan-price').textContent = price;
  document.getElementById('d-pay-form').scrollIntoView({ behavior:'smooth', block:'center' });
  showToast('👑 Plan Selected', name + ' — fill in payment details', 'level-up');
}

function fmtCard(input) {
  let v = input.value.replace(/\D/g,'').substring(0,16);
  input.value = v.replace(/(.{4})/g,'$1 ').trim();
}

function fmtExp(input) {
  let v = input.value.replace(/\D/g,'').substring(0,4);
  if (v.length > 2) v = v.substring(0,2) + ' / ' + v.substring(2);
  input.value = v;
}

function desktopPayment() {
  const name  = document.getElementById('d-pay-name').value.trim();
  const email = document.getElementById('d-pay-email').value.trim();
  const card  = document.getElementById('d-pay-card').value.replace(/\s/g,'');
  const cvc   = document.getElementById('d-pay-cvc').value.trim();
  if (!name || !email || card.length < 16 || cvc.length < 3) {
    showToast('⚠️ Missing Info', 'Please fill all payment fields', 'streak');
    return;
  }
  const btn = document.querySelector('.btn-pay');
  btn.textContent = '⏳ Processing…';
  btn.disabled = true;
  btn.style.opacity = '.7';
  setTimeout(() => {
    document.getElementById('d-pay-form').style.display    = 'none';
    document.getElementById('d-pay-success').style.display = 'block';
    showToast('🎉 Welcome to Pro!', 'Subscription is now active', 'level-up');
    grantXP(500);
    renderAll();
    save();
  }, 2000);
}

/* ════ WORLD MAP ════ */
const WM_EQ = {
  treadmill: { icon:'🏃', name:'Morning Run',       sub:'Log your treadmill session',       xp:35, fields:[
    { id:'dist',  label:'Distance (km)',  type:'number', placeholder:'e.g. 5'  },
    { id:'time',  label:'Duration (min)', type:'number', placeholder:'e.g. 30' },
    { id:'speed', label:'Avg Speed',      type:'number', placeholder:'km/h'    },
    { id:'feel',  label:'Felt like', type:'select', full:true, options:['🔥 Beast mode','💪 Strong','😐 Average','😮‍💨 Tough'] },
  ]},
  yoga: { icon:'🧘', name:'Meditation', sub:'Log your mindfulness session', xp:25, fields:[
    { id:'mins', label:'Duration (min)', type:'number', placeholder:'e.g. 15' },
    { id:'type', label:'Style',    type:'select', options:['Breathing','Body scan','Visualization','Mantra','Guided'] },
    { id:'mood', label:'Mood after', type:'select', options:['☀️ Peaceful','⚡ Energized','😴 Sleepy','🙏 Grateful'] },
  ]},
  books: { icon:'📚', name:'Read 30 Pages', sub:'Track your reading progress', xp:20, fields:[
    { id:'pages', label:'Pages read',  type:'number', placeholder:'e.g. 30' },
    { id:'book',  label:'Book title',  type:'text',   placeholder:'What are you reading?' },
    { id:'mins',  label:'Minutes',     type:'number', placeholder:'e.g. 40' },
  ]},
  water: { icon:'💧', name:'Drink 2L Water', sub:'Stay hydrated', xp:15, fields:[
    { id:'litres', label:'Litres today', type:'number', placeholder:'e.g. 2' },
    { id:'cups',   label:'Cups/glasses', type:'number', placeholder:'e.g. 8' },
  ]},
  computer: { icon:'💻', name:'Code 1 Hour', sub:'Log your coding session', xp:40, fields:[
    { id:'mins',    label:'Minutes coded',   type:'number', placeholder:'e.g. 60' },
    { id:'lang',    label:'Language', type:'select', options:['JavaScript','Python','TypeScript','Rust','Go','Swift','Other'] },
    { id:'project', label:'Project / Topic', type:'text',   placeholder:'What did you build?' },
  ]},
  safe: { icon:'📵', name:'No Social Media', sub:'Lock the phone — own your focus', xp:30, fields:[
    { id:'hours',   label:'Hours offline', type:'number', placeholder:'e.g. 4' },
    { id:'avoided', label:'Apps avoided', type:'select', options:['Instagram','TikTok','Twitter/X','YouTube','All 🏆'] },
    { id:'used',    label:'Used time for', type:'text',   placeholder:'e.g. Reading, workout...' },
  ]},
};

let wmCurrentEq = null;
const wmLogs = JSON.parse(localStorage.getItem('hq_wm_logs') || '{}');

function wmEnterRoom(roomId) {
  document.getElementById('wm-map-grid').style.display = 'none';
  const sw = document.getElementById('wm-scene-wrap');
  sw.classList.add('active');
  const names = { bedroom:'Bedroom', gym:'Gym', study:'Study', arena:'Arena', hall:'Hall of Fame' };
  const subs  = { bedroom:'Click objects to log daily habits', gym:'Click equipment to log your workout', study:'Click items to log learning', arena:'Track your challenge progress', hall:'View your achievements' };
  document.getElementById('wm-scene-name').textContent = (names[roomId] || roomId).toUpperCase();
  document.getElementById('wm-scene-sub').textContent  = subs[roomId] || '';
  document.getElementById('wm-scene-name').style.color = { bedroom:'#c9820a', gym:'#0d8a7f', study:'#5b8de8', arena:'#c4374a', hall:'#8b5cbf' }[roomId] || '#fff';
  const bgs = {
    bedroom: 'radial-gradient(ellipse 55% 35% at 25% 75%,rgba(201,130,10,.1) 0%,transparent 55%),linear-gradient(180deg,#0f0a04,#1c1208 40%,#130d06)',
    gym:     'radial-gradient(ellipse 65% 45% at 50% 90%,rgba(13,138,80,.08) 0%,transparent 55%),linear-gradient(180deg,#080f0a,#0d1a0e 40%,#060d07)',
    study:   'radial-gradient(ellipse 45% 35% at 65% 65%,rgba(60,100,220,.08) 0%,transparent 55%),linear-gradient(180deg,#070a14,#0d1224 40%,#060810)',
    arena:   'radial-gradient(ellipse 55% 35% at 50% 80%,rgba(196,55,74,.09) 0%,transparent 55%),linear-gradient(180deg,#0f0608,#1c0a0e 40%,#0a0406)',
    hall:    'radial-gradient(ellipse 55% 35% at 50% 80%,rgba(109,61,189,.09) 0%,transparent 55%),linear-gradient(180deg,#090610,#130a1e 40%,#070510)',
  };
  document.getElementById('wm-svg-area').style.background = bgs[roomId] || bgs.bedroom;
}

function wmGoBack() {
  wmCloseLog();
  document.getElementById('wm-map-grid').style.display = '';
  document.getElementById('wm-scene-wrap').classList.remove('active');
}

function wmOpenLog(id) {
  const eq = WM_EQ[id]; if (!eq) return;
  wmCurrentEq = id;
  document.getElementById('wm-log-icon').textContent = eq.icon;
  document.getElementById('wm-log-name').textContent = eq.name;
  document.getElementById('wm-log-sub').textContent  = eq.sub + (eq.xp > 0 ? ` — earn +${eq.xp} XP` : '');
  document.getElementById('wm-save-btn').textContent = eq.xp > 0 ? `⚡ Save & Earn +${eq.xp} XP` : '✓ Save Log';

  const fc = document.getElementById('wm-log-fields'); fc.innerHTML = '';
  eq.fields.forEach(f => {
    const d = document.createElement('div');
    d.className = 'wm-lf' + (f.full ? ' full' : '');
    const inp = f.type === 'select'
      ? `<select id="wf_${f.id}">` + f.options.map(o => `<option>${o}</option>`).join('') + '</select>'
      : `<input type="${f.type}" id="wf_${f.id}" placeholder="${f.placeholder || ''}" autocomplete="off"/>`;
    d.innerHTML = `<label>${f.label}</label>${inp}`;
    fc.appendChild(d);
  });

  const logs = wmLogs[id] || [];
  const lh = document.getElementById('wm-log-history');
  lh.innerHTML = logs.length
    ? `<div class="wm-lh-ttl">Recent logs</div>` + logs.slice(0,3).map(l => {
        const s = Object.entries(l.values).slice(0,2).map(([,v]) => v).join(' · ');
        return `<div class="wm-lh-row"><span>${s}</span><div style="text-align:right"><div class="wm-lh-val">+${l.xp} XP</div><div class="wm-lh-date">${l.date}</div></div></div>`;
      }).join('')
    : '';

  document.getElementById('wm-log-panel').classList.add('open');
}

function wmCloseLog() {
  document.getElementById('wm-log-panel').classList.remove('open');
  wmCurrentEq = null;
}

function wmSaveLog() {
  if (!wmCurrentEq) return;
  const eq = WM_EQ[wmCurrentEq];
  const values = {}; let hasData = false;
  eq.fields.forEach(f => {
    const el = document.getElementById('wf_' + f.id);
    if (el) { values[f.id] = el.value; if (el.value) hasData = true; }
  });
  if (!hasData) { showToast('⚠️ Empty', 'Fill in at least one field', 'streak'); return; }
  if (!wmLogs[wmCurrentEq]) wmLogs[wmCurrentEq] = [];
  wmLogs[wmCurrentEq].unshift({
    date: new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'short' }),
    values,
    xp: eq.xp,
  });
  try { localStorage.setItem('hq_wm_logs', JSON.stringify(wmLogs)); } catch(e) {}
  if (eq.xp > 0) { grantXP(eq.xp); renderAll(); save(); }
  showToast(`${eq.icon} Quest Complete!`, `${eq.name} — +${eq.xp} XP`, 'xp-gain');
  wmCloseLog();
}

/* ════ FIREBASE BRIDGE ════ */
// Called by the Firebase module (index.html) when Firestore data arrives.
// Merges remote state into local state and re-renders without reloading.
window._setState = function(remoteState) {
  if (remoteState.player)           state.player           = { ...state.player, ...remoteState.player };
  if (remoteState.habits)           state.habits           = remoteState.habits;
  if (remoteState.todayCompleted)   state.todayCompleted   = remoteState.todayCompleted;
  if (remoteState.customChallenges) state.customChallenges = remoteState.customChallenges;
  if (remoteState.challengeLog)     state.challengeLog     = remoteState.challengeLog;
  if (remoteState.challengeTimes)   state.challengeTimes   = remoteState.challengeTimes;
  if (remoteState.unlockedAchs)     state.unlockedAchs     = remoteState.unlockedAchs;
  restoreAchievements();
  checkAchievements();
  renderAll();
  // Re-run after renderAll so group habits (managed by Firebase, not _setState) are included
  renderDashChallenges();
  // Restore group subscription when Firestore user doc loads and has a saved groupId
  if (state.player.groupId && !window.activeGroup && window._subscribeToGroupFull) {
    window._subscribeToGroupFull(state.player.groupId);
  }
};

// Called by the Firebase module to write groupId into state and persist it.
// This is the bridge between the ES module scope and the script.js state object.
window._setGroupId = function(gid) {
  state.player.groupId = gid || null;
  save();
};

// Group functions — implementation lives in the Firebase module (index.html),
// but are callable from anywhere in the app.
function createGroup(name) {
  if (!window.currentUser) { showToast('⚠️ Not signed in', 'Sign in with Google first', 'streak'); return; }
  if (window._createGroup) window._createGroup(name);
}

function joinGroup(groupId) {
  if (!window.currentUser) { showToast('⚠️ Not signed in', 'Sign in with Google first', 'streak'); return; }
  if (window._joinGroup) window._joinGroup(groupId);
}

function subscribeToGroupHabits(groupId) {
  if (window._subscribeToGroupHabits) window._subscribeToGroupHabits(groupId);
}

/* patch goPage to handle worldmap scene reset + group page render */
const _origGoPage = goPage;
goPage = function(page, btn) {
  if (page !== 'worldmap') {
    document.getElementById('wm-scene-wrap').classList.remove('active');
    document.getElementById('wm-map-grid').style.display = '';
  }
  _origGoPage(page, btn);
  if (page === 'worldmap') {
    document.getElementById('topbar-title').innerHTML = '🗺️ <span style="color:var(--teal)">World Map</span>';
  }
  if (page === 'quests')     renderDashChallenges();
  if (page === 'group')      renderGroupPage();
  if (page === 'profile')    renderProfilePage();
  if (page === 'social')     renderSocialPage();
  if (page === 'chat')       renderChatPage();
  if (page === 'friends-lb') renderFriendsLeaderboard();
};

/* ════ GROUP CHALLENGE ════ */

// createGroupFromUI — reads the group name input and creates the group.
// A unique 6-char join code is generated server-side in _createGroup.
function createGroupFromUI() {
  if (!window.currentUser) {
    showToast('⚠️ Not signed in', 'Sign in with Google first', 'streak');
    return;
  }
  var nameEl = document.getElementById('grp-name-input');
  var name   = nameEl ? nameEl.value.trim() : '';
  if (!name) {
    showToast('⚠️ Name required', 'Enter a group name first', 'streak');
    if (nameEl) nameEl.focus();
    return;
  }
  // Clear the input so it's fresh if the user ever creates another group
  if (nameEl) nameEl.value = '';
  if (window._createGroup) window._createGroup(name);
}

// joinGroupFromUI — handles three input formats, then routes through
// _checkAndJoinGroup so existing members skip the username modal.
//   1. Full invite URL with ?group=ID  → extract ID, check membership
//   2. Short code (4–8 alphanumeric)   → resolve via joinCode field, then check
//   3. Raw Firestore document ID       → check membership directly
function joinGroupFromUI() {
  if (!window.currentUser) {
    showToast('⚠️ Not signed in', 'Sign in with Google first', 'streak');
    return;
  }
  var raw = (document.getElementById('grp-code-input').value || '').trim();
  if (!raw) { showToast('⚠️ Empty field', 'Enter a join code or invite link', 'streak'); return; }

  // 1. URL with ?group= param
  try {
    var url   = new URL(raw);
    var param = url.searchParams.get('group');
    if (param) { window._checkAndJoinGroup && window._checkAndJoinGroup(param); return; }
  } catch(e) { /* not a URL — continue */ }

  // 2. Short join code (4–8 letters/digits)
  if (/^[A-Za-z0-9]{4,8}$/.test(raw)) {
    window._resolveCodeAndJoin && window._resolveCodeAndJoin(raw);
    return;
  }

  // 3. Fallback: raw Firestore document ID
  window._checkAndJoinGroup && window._checkAndJoinGroup(raw);
}

// showUsernameModal — shown to new members before they join a group.
// Called by _checkAndJoinGroup when the user isn't already a member.
function showUsernameModal(groupId) {
  var modal = document.getElementById('d-modal');
  modal.querySelector('.modal').innerHTML =
    '<button class="modal-close" onclick="closeModal()">✕</button>' +
    '<div class="modal-title">👥 Join Group</div>' +
    '<div class="modal-sub">Pick a username for this group — it\'s only visible to members here.</div>' +
    '<label class="form-label">Your Username</label>' +
    '<input class="form-input" id="grp-username-input" maxlength="20" ' +
      'placeholder="e.g. SpeedRunner42" autocomplete="off"/>' +
    '<div id="grp-username-error" style="color:var(--rose);font-size:.75rem;' +
      'margin-top:-8px;margin-bottom:8px;display:none"></div>' +
    '<div class="modal-actions">' +
      '<button class="btn-secondary" onclick="closeModal()">Cancel</button>' +
      '<button class="btn-primary" onclick="submitUsernameAndJoin(\'' + groupId + '\')">Join →</button>' +
    '</div>';
  modal.classList.add('show');
  // Autofocus after the modal animation
  setTimeout(function() {
    var inp = document.getElementById('grp-username-input');
    if (inp) inp.focus();
  }, 80);
}

// submitUsernameAndJoin — validates the username input and calls _joinGroupWithUsername.
function submitUsernameAndJoin(groupId) {
  var input  = document.getElementById('grp-username-input');
  var errEl  = document.getElementById('grp-username-error');
  var username = input ? input.value.trim() : '';

  if (!username) {
    if (errEl) { errEl.textContent = 'Username is required'; errEl.style.display = 'block'; }
    return;
  }
  if (username.length > 20) {
    if (errEl) { errEl.textContent = 'Max 20 characters'; errEl.style.display = 'block'; }
    return;
  }

  closeModal();
  if (window._joinGroupWithUsername) window._joinGroupWithUsername(groupId, username);
}

// leaveGroupUI — called by the "Leave Group" button
function leaveGroupUI() {
  if (!window.currentUser || !window.activeGroup) return;
  if (!confirm('Leave "' + window.activeGroup.name + '"?')) return;
  if (window._leaveGroup) window._leaveGroup(window.activeGroup.id);
}

// copyInviteLink — copies the full ?group=ID URL to clipboard
function copyInviteLink() {
  if (!window.activeGroup) return;
  var link = window.location.origin + window.location.pathname + '?group=' + window.activeGroup.id;
  navigator.clipboard.writeText(link).then(function() {
    showToast('📋 Copied!', 'Invite link is in your clipboard', 'xp-gain');
  }).catch(function() {
    prompt('Copy this link and share it:', link);
  });
}

// copyJoinCode — copies just the short code to clipboard (easiest to share in chat)
function copyJoinCode() {
  if (!window.activeGroup) return;
  var code = window.activeGroup.joinCode || '';
  if (!code) { showToast('⚠️ No code', 'This group has no join code', 'streak'); return; }
  navigator.clipboard.writeText(code).then(function() {
    showToast('🔑 Code copied!', code, 'xp-gain');
  }).catch(function() {
    prompt('Share this join code:', code);
  });
}

// renderGroupPage — decides which panel to show based on auth + group state
function renderGroupPage() {
  var signinEl = document.getElementById('grp-signin-prompt');
  var setupEl  = document.getElementById('grp-setup');
  var activeEl = document.getElementById('grp-active');
  if (!signinEl || !setupEl || !activeEl) return;

  if (!window.currentUser) {
    // Not signed in — show sign-in prompt
    signinEl.style.display = 'block';
    setupEl.style.display  = 'none';
    activeEl.style.display = 'none';
    return;
  }

  signinEl.style.display = 'none';

  if (!window.activeGroup) {
    // If we have a saved groupId, we're still waiting for the Firestore snapshot.
    // Show nothing (keep whatever is visible) and trigger re-subscription if needed.
    var savedGid = null;
    try { savedGid = localStorage.getItem('hqd_groupId'); } catch(e) {}
    if (savedGid) {
      // Hide both panels while snapshot loads — grp-setup is visible by default in HTML
      setupEl.style.display  = 'none';
      activeEl.style.display = 'none';
      if (!window._groupSubPending) {
        window._groupSubPending = true;
        if (window._subscribeToGroupFull) window._subscribeToGroupFull(savedGid);
      }
      return;
    }
    // No saved group — show create/join panel
    window._groupSubPending = false;
    setupEl.style.display  = 'block';
    activeEl.style.display = 'none';
    return;
  }

  // Group is loaded — clear the pending flag
  window._groupSubPending = false;

  // Inside a group — show the active group panel
  setupEl.style.display  = 'none';
  activeEl.style.display = 'block';

  var memberCount = (window.activeGroup.members || []).length;
  document.getElementById('grp-name').textContent          = window.activeGroup.name;
  document.getElementById('grp-members-count').textContent = memberCount + (memberCount === 1 ? ' member' : ' members');

  // Join code badge
  var codeEl = document.getElementById('grp-join-code');
  if (codeEl) codeEl.textContent = window.activeGroup.joinCode || '——';

  var link = window.location.origin + window.location.pathname + '?group=' + window.activeGroup.id;
  document.getElementById('grp-invite-link').textContent = link;
}

// renderGroupMembers — called by Firebase module with member data.
// Caches data and delegates rendering to renderGroupLeaderboard so it can
// also incorporate per-habit result totals from renderGroupHabits.
function renderGroupMembers(membersData) {
  window._latestGroupMembers = membersData || [];
  renderGroupLeaderboard();
}

// renderGroupLeaderboard — combines _latestGroupMembers + _latestGroupHabits
// to rank members by their total submitted results, with XP as tiebreaker.
// Called whenever either data set changes.
function renderGroupLeaderboard() {
  var el = document.getElementById('grp-members-list');
  if (!el) return;

  var members = window._latestGroupMembers || [];
  var habits  = window._latestGroupHabits  || [];

  if (!members.length) {
    el.innerHTML = '<div style="padding:12px 14px;font-size:.8rem;color:var(--muted)">No members yet</div>';
    return;
  }

  // Aggregate each member's total result value across all habits.
  // results field on each habit: { [uid]: { displayName, value, updatedAt } }
  var scores = {}; // uid → { total: number, unit: string }
  habits.forEach(function(h) {
    var res  = h.results || {};
    var unit = h.unit || '';
    Object.keys(res).forEach(function(uid) {
      if (!scores[uid]) scores[uid] = { total: 0, unit: unit };
      scores[uid].total += (res[uid].value || 0);
      if (!scores[uid].unit && unit) scores[uid].unit = unit;
    });
  });

  // Merge result scores into member objects, then sort
  var ranked = members.slice().map(function(m) {
    var s = scores[m.uid] || { total: 0, unit: '' };
    return { uid: m.uid, name: m.name, avatar: m.avatar, level: m.level,
             totalXP: m.totalXP, streak: m.streak, isMe: m.isMe,
             resultTotal: s.total, resultUnit: s.unit };
  }).sort(function(a, b) {
    // Primary: result total descending; secondary: XP descending
    if (b.resultTotal !== a.resultTotal) return b.resultTotal - a.resultTotal;
    return b.totalXP - a.totalXP;
  });

  el.innerHTML = ranked.map(function(m, i) {
    var rank  = i + 1;
    var medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank;
    var rc    = rank === 1 ? 't1' : rank === 2 ? 't2' : rank === 3 ? 't3' : '';

    // Show result total if any results submitted, else show XP
    var hasResults = m.resultTotal > 0;
    var scoreHtml = hasResults
      ? m.resultTotal + (m.resultUnit ? ' <span class="mini-lb-sub">' + m.resultUnit + '</span>' : '')
      : (m.totalXP || 0).toLocaleString() + ' <span class="mini-lb-sub">XP</span>';

    return '<div class="mini-lb-row ' + (m.isMe ? 'me' : '') + '">' +
      '<div class="mini-rank ' + rc + '">' + medal + '</div>' +
      avatarHtml(m.avatar) +
      '<div style="flex:1;min-width:0">' +
        '<div class="mini-name" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' +
          m.name + (m.isMe ? ' <span class="grp-you-badge">YOU</span>' : '') +
        '</div>' +
        '<div style="font-family:var(--ff-mono);font-size:.58rem;color:var(--muted)">Lv.' + m.level + ' · 🔥' + m.streak + '</div>' +
      '</div>' +
      '<div class="mini-lb-score">' + scoreHtml + '</div>' +
    '</div>';
  }).join('');
}

// renderGroupHabits — called by Firebase module when habits subcollection changes.
// Renders each card with: edit button, result input, current results, complete button.
function renderGroupHabits(habits) {
  // Always cache and update dashboard — even when the group page isn't visible
  window._latestGroupHabits = habits || [];
  renderDashChallenges();

  var grid = document.getElementById('grp-habits-grid');
  if (!grid) return;

  // Cache for leaderboard computation
  renderGroupLeaderboard();

  if (!habits || !habits.length) {
    grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1">' +
      '<div class="empty-icon">👥</div>' +
      '<p>No shared quests yet — click "+ Share Quest" to add one</p></div>';
    return;
  }

  var uid = window.currentUser ? window.currentUser.uid : null;

  grid.innerHTML = habits.map(function(h) {
    var completedBy = h.completedToday || [];
    var iDone   = uid && completedBy.includes(uid);
    var xp      = DIFF_XP[h.diff] || 25;
    var unit    = h.unit  || '';
    var goal    = h.goal  || 0;
    var results = h.results || {};
    var myRes   = uid && results[uid] ? results[uid] : null;

    // Top 3 results sorted by value for the "results" preview
    var topResults = Object.values(results)
      .sort(function(a, b) { return b.value - a.value; })
      .slice(0, 3);

    // Goal row — only shown if unit or goal is set
    var goalHtml = (unit || goal)
      ? '<div style="font-family:var(--ff-mono);font-size:.6rem;color:var(--muted);margin-bottom:6px">' +
          '🎯 Goal: ' + (goal || '—') + (unit ? ' ' + unit : '') +
        '</div>'
      : '';

    // Result input row — only shown when signed in
    var resultInputHtml = uid
      ? '<div class="grp-result-row">' +
          '<input class="grp-result-input" id="ri-' + h.id + '" type="number" min="0" step="any" ' +
            'placeholder="' + (unit ? '0 ' + unit : 'result') + '" ' +
            'value="' + (myRes ? myRes.value : '') + '"/>' +
          (unit ? '<span class="grp-result-unit">' + unit + '</span>' : '') +
          '<button class="grp-result-submit" onclick="submitGroupResult(\'' + h.id + '\')">' +
            (myRes ? '↺ Update' : '+ Submit') +
          '</button>' +
        '</div>'
      : '';

    // My current result
    var myResultHtml = myRes
      ? '<div class="grp-result-mine">My result: ' + myRes.value + (unit ? ' ' + unit : '') + '</div>'
      : '';

    // Other members' top results
    var allResultsHtml = topResults.length
      ? '<div class="grp-all-results">' +
          topResults.map(function(r) {
            return '• ' + (r.displayName || 'User') + ': ' + r.value + (unit ? ' ' + unit : '');
          }).join('<br>') +
        '</div>'
      : '';

    return '<div class="habit-card ' + (iDone ? 'done' : '') + '" style="--hc:' + (h.color || '#0d8a7f') + '">' +
      '<div class="hc-top">' +
        '<div class="hc-icon">' + (h.icon || '⚔️') + '</div>' +
        '<div style="display:flex;align-items:center;gap:6px">' +
          '<div class="hc-xp">+' + xp + ' XP</div>' +
          (uid ? '<button class="grp-edit-btn" onclick="editGroupHabit(\'' + h.id + '\')">✏️ Edit</button>' : '') +
        '</div>' +
      '</div>' +
      '<div class="hc-name">' + h.name + '</div>' +
      '<div class="hc-desc">' + (h.desc || '') + '</div>' +
      goalHtml +
      resultInputHtml +
      myResultHtml +
      allResultsHtml +
      '<div class="hc-bottom">' +
        '<div style="font-family:var(--ff-mono);font-size:.65rem;color:var(--muted)">' +
          completedBy.length + ' completed today' +
        '</div>' +
        '<button class="hc-check ' + (iDone ? 'done' : '') + '" ' +
          'onclick="completeGroupHabit(\'' + h.id + '\',event)">' +
          (iDone ? '✓' : '○') +
        '</button>' +
      '</div>' +
    '</div>';
  }).join('');
}

// completeGroupHabit — marks habit done for current user in Firestore
function completeGroupHabit(habitId, e) {
  if (!window.currentUser || !window.activeGroup) return;
  if (window._completeGroupHabit) window._completeGroupHabit(window.activeGroup.id, habitId, e);
}

// addGroupHabit — opens a picker to choose a personal habit to share
function addGroupHabit() {
  if (!window.currentUser || !window.activeGroup) return;
  if (!state.habits.length) {
    showToast('⚠️ No habits', 'Create personal habits on the Quests page first', 'streak');
    return;
  }
  // Reuse the existing modal — rebuild inner content as a habit picker
  var modal = document.getElementById('d-modal');
  modal.querySelector('.modal').innerHTML =
    '<button class="modal-close" onclick="closeModal()">✕</button>' +
    '<div class="modal-title">Share Quest with Group</div>' +
    '<div class="modal-sub">Pick a personal habit to add to the shared group quests</div>' +
    '<div style="display:flex;flex-direction:column;gap:8px;margin-top:4px">' +
    state.habits.map(function(h) {
      return '<button onclick="shareHabitToGroup(\'' + h.id + '\')" ' +
        'style="display:flex;align-items:center;gap:10px;padding:10px 14px;' +
        'background:var(--bg);border:1.5px solid var(--border2);border-radius:10px;' +
        'cursor:pointer;font-family:var(--ff-body);font-size:.88rem;text-align:left;transition:all var(--t)">' +
        '<span style="font-size:1.3rem">' + h.icon + '</span>' +
        '<span style="font-weight:600;flex:1">' + h.name + '</span>' +
        '<span style="font-family:var(--ff-mono);font-size:.6rem;color:var(--muted)">' + (h.diff || 'easy') + '</span>' +
      '</button>';
    }).join('') +
    '</div>' +
    '<div class="modal-actions" style="margin-top:16px">' +
      '<button class="btn-secondary" onclick="closeModal()">Cancel</button>' +
    '</div>';
  modal.classList.add('show');
}

// shareHabitToGroup — sends chosen habit to Firestore habits subcollection
function shareHabitToGroup(habitId) {
  if (!window.currentUser || !window.activeGroup) return;
  var h = state.habits.find(function(x) { return x.id === habitId; });
  if (!h) return;
  closeModal();
  if (window._addHabitToGroup) window._addHabitToGroup(window.activeGroup.id, h);
}

// submitGroupResult — reads the number input on a habit card and saves to Firestore.
// Results are stored as habit.results.{uid} so the existing habits onSnapshot picks
// them up and re-renders the leaderboard for all group members instantly.
function submitGroupResult(habitId) {
  if (!window.currentUser || !window.activeGroup) {
    showToast('⚠️ Not signed in', 'Sign in to submit a result', 'streak');
    return;
  }
  var input = document.getElementById('ri-' + habitId);
  if (!input) return;
  var value = parseFloat(input.value);
  if (isNaN(value) || value < 0) {
    showToast('⚠️ Invalid', 'Enter a positive number', 'streak');
    return;
  }
  var displayName = (window.currentUser.displayName || state.player.name || 'Anonymous').split(' ')[0];
  if (window._submitResult) {
    window._submitResult(window.activeGroup.id, habitId, value, displayName);
  }
}

// editGroupHabit — opens a modal to edit name, desc, difficulty, unit, and goal
// for an existing group habit. Only visible to signed-in members.
function editGroupHabit(habitId) {
  if (!window.currentUser || !window.activeGroup) return;
  var habits = window._latestGroupHabits || [];
  var h = habits.find(function(x) { return x.id === habitId; });
  if (!h) return;

  var UNITS = ['', 'km', 'miles', 'minutes', 'hours', 'pages', 'reps', 'sets', 'glasses', 'calories'];

  var unitOpts = UNITS.map(function(u) {
    return '<option value="' + u + '"' + (h.unit === u ? ' selected' : '') + '>' +
      (u || '— none —') + '</option>';
  }).join('');

  var diffOpts = ['easy', 'medium', 'hard', 'epic'].map(function(d) {
    return '<option value="' + d + '"' + (h.diff === d ? ' selected' : '') + '>' +
      DIFF_LBL[d] + ' (+' + DIFF_XP[d] + ' XP)</option>';
  }).join('');

  var modal = document.getElementById('d-modal');
  modal.querySelector('.modal').innerHTML =
    '<button class="modal-close" onclick="closeModal()">✕</button>' +
    '<div class="modal-title">✏️ Edit Challenge</div>' +
    '<div class="modal-sub">Update the shared group challenge details</div>' +

    '<label class="form-label">Challenge Name</label>' +
    '<input class="form-input" id="ge-name" value="' + (h.name || '').replace(/"/g, '&quot;') +
      '" placeholder="e.g. Morning Run"/>' +

    '<label class="form-label">Description</label>' +
    '<input class="form-input" id="ge-desc" value="' + (h.desc || '').replace(/"/g, '&quot;') +
      '" placeholder="What should members do?"/>' +

    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">' +
      '<div>' +
        '<label class="form-label">Difficulty</label>' +
        '<select class="form-input" id="ge-diff" style="margin-bottom:0">' + diffOpts + '</select>' +
      '</div>' +
      '<div>' +
        '<label class="form-label">Unit to Track</label>' +
        '<select class="form-input" id="ge-unit" style="margin-bottom:0">' + unitOpts + '</select>' +
      '</div>' +
    '</div>' +

    '<label class="form-label" style="margin-top:14px">Goal / Target ' +
      '<span style="font-weight:400;color:var(--muted)">(optional)</span></label>' +
    '<input class="form-input" id="ge-goal" type="number" min="0" step="any" ' +
      'value="' + (h.goal || '') + '" placeholder="e.g. 10"/>' +

    '<div class="modal-actions" style="margin-top:8px">' +
      '<button class="btn-secondary" onclick="closeModal()">Cancel</button>' +
      '<button class="btn-primary" onclick="saveGroupHabitEdit(\'' + habitId + '\')">Save Changes</button>' +
    '</div>';

  modal.classList.add('show');
}

// saveGroupHabitEdit — reads the edit modal fields and writes updates to Firestore.
function saveGroupHabitEdit(habitId) {
  if (!window.currentUser || !window.activeGroup) return;
  var name = (document.getElementById('ge-name').value || '').trim();
  var desc = (document.getElementById('ge-desc').value || '').trim();
  var diff = document.getElementById('ge-diff').value;
  var unit = document.getElementById('ge-unit').value;
  var goal = parseFloat(document.getElementById('ge-goal').value) || 0;

  if (!name) { showToast('⚠️ Name required', 'Enter a challenge name', 'streak'); return; }

  closeModal();
  if (window._updateGroupHabit) {
    window._updateGroupHabit(window.activeGroup.id, habitId, { name: name, desc: desc, diff: diff, unit: unit, goal: goal });
  }
}

// checkGroupInviteUrl — reads ?group=ID from URL so auto-join can fire after sign-in
function checkGroupInviteUrl() {
  var params  = new URLSearchParams(window.location.search);
  var groupId = params.get('group');
  if (groupId) {
    // Store it; Firebase module picks it up once the user is authenticated
    window._pendingGroupId = groupId;
    // Navigate to the group page so the user lands there automatically
    goPage('group', document.getElementById('nav-group'));
  }
}

// Run URL check immediately on load
checkGroupInviteUrl();

/* ════ PROFILE PAGE ════ */

function renderProfilePage() {
  var p   = state.player;
  var cls = getClass(p.level);
  var pct = Math.min(100, (p.xp / p.xpToNext) * 100);

  renderAvatarEl(document.getElementById('pf-avatar'), p.avatar);
  document.getElementById('pf-name').textContent      = p.name;
  document.getElementById('pf-class').textContent     = '';
  document.getElementById('pf-level').textContent     = p.level;
  document.getElementById('pf-streak').textContent    = p.streak;
  document.getElementById('pf-completed').textContent = p.totalCompleted;
  document.getElementById('pf-total-xp').textContent  = (p.totalXP || 0).toLocaleString();
  document.getElementById('pf-xp-label').textContent  = (p.xp || 0) + ' / ' + (p.xpToNext || 100);
  document.getElementById('pf-xp-bar').style.width    = pct + '%';
  document.getElementById('pf-xp-sub').textContent    = ((p.xpToNext || 100) - (p.xp || 0)) + ' XP to next level';

  // Days active since first launch
  var days = 0;
  if (p.joinDate) {
    days = Math.max(0, Math.floor((Date.now() - new Date(p.joinDate).getTime()) / 86400000));
  }
  document.getElementById('pf-days').textContent = days || 1;

  // Joined date label
  var joinedEl = document.getElementById('pf-joined');
  joinedEl.textContent = p.joinDate
    ? 'Joined ' + new Date(p.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '';

  renderXPChart();
  var fcEl = document.getElementById('pf-friend-code');
  if (fcEl) fcEl.textContent = getFriendCode();

  // Sync night mode checkbox to current state
  var cb = document.getElementById('nm-checkbox');
  if (cb) cb.checked = document.body.classList.contains('dark');
}

function renderXPChart() {
  var el = document.getElementById('pf-chart');
  if (!el) return;

  var log = (state.player.xpLog || []).slice();

  if (!log.length) {
    el.innerHTML = '<div style="text-align:center;padding:30px 0;color:var(--muted);font-size:.82rem">' +
      'Complete quests to build your XP history</div>';
    return;
  }

  // Build a continuous month range from first logged month to today
  var allMonths = [];
  var first = log.reduce(function(min, e) { return e.ym < min ? e.ym : min; }, log[0].ym);
  var cursor = new Date(first + '-02'); // offset 2 days to avoid timezone edge
  var now    = new Date();
  while (cursor <= now) {
    var ym    = cursor.toISOString().slice(0, 7);
    var entry = log.find(function(e) { return e.ym === ym; });
    allMonths.push({ ym: ym, xp: entry ? entry.xp : 0 });
    cursor.setMonth(cursor.getMonth() + 1);
  }

  // Keep last 12 months maximum
  if (allMonths.length > 12) allMonths = allMonths.slice(allMonths.length - 12);

  var maxXP = Math.max.apply(null, allMonths.map(function(m) { return m.xp; }));
  if (maxXP === 0) maxXP = 1;

  var CHART_H = 110; // pixel height of bar area

  function fmtMonth(ym) {
    return new Date(ym + '-02').toLocaleDateString('en-US', { month: 'short' });
  }

  el.innerHTML = allMonths.map(function(m) {
    var barH  = Math.round((m.xp / maxXP) * CHART_H);
    var isPeak = m.xp === maxXP && m.xp > 0;
    return '<div class="pf-bar-col">' +
      '<div class="pf-bar-val">' + (m.xp > 0 ? m.xp : '') + '</div>' +
      '<div class="pf-bar ' + (isPeak ? 'pf-bar-peak' : '') + '" style="height:' + barH + 'px"></div>' +
      '<div class="pf-bar-lbl">' + fmtMonth(m.ym) + '</div>' +
    '</div>';
  }).join('');
}

/* ════ ONBOARDING ════ */

var _obSelectedAvatar = DICEBEAR_AVATARS[0].url; // default to first avatar

function initObAvatarGrid() {
  var catDefs = [
    { id:'heroes', label:'Heroes' }, { id:'robots', label:'Robots' },
    { id:'pixel', label:'Pixel' }, { id:'faces', label:'Faces' },
    { id:'fun', label:'Fun' }, { id:'all', label:'All' },
  ];
  var tabsEl = document.getElementById('ob-av-tabs');
  var gridEl = document.getElementById('ob-av-grid');
  if (!tabsEl || !gridEl) return;

  tabsEl.innerHTML = catDefs.map(function(c) {
    return '<button class="ob-av-tab' + (c.id === 'heroes' ? ' active' : '') + '" onclick="obFilterCat(\'' + c.id + '\')">' + c.label + '</button>';
  }).join('');

  gridEl.innerHTML = DICEBEAR_AVATARS.map(function(av) {
    var sel = av.url === _obSelectedAvatar;
    var hidden = av.cat !== 'heroes' ? ' style="display:none"' : '';
    return '<div class="ob-av-item' + (sel ? ' selected' : '') + '" data-cat="' + av.cat + '"' + hidden + ' onclick="obSelectAvatar(\'' + av.url + '\')">' +
      '<img src="' + av.url + '" loading="lazy" alt="avatar">' +
    '</div>';
  }).join('');
}

function obFilterCat(cat) {
  document.querySelectorAll('.ob-av-tab').forEach(function(t) { t.classList.remove('active'); });
  event.currentTarget.classList.add('active');
  document.querySelectorAll('.ob-av-item').forEach(function(item) {
    item.style.display = (cat === 'all' || item.dataset.cat === cat) ? 'flex' : 'none';
  });
}

function obSelectAvatar(url) {
  _obSelectedAvatar = url;
  document.querySelectorAll('.ob-av-item').forEach(function(item) {
    var img = item.querySelector('img');
    item.classList.toggle('selected', img && img.getAttribute('src') === url);
  });
}

function submitOnboarding() {
  var nameEl = document.getElementById('ob-name-input');
  var errEl  = document.getElementById('ob-error');
  var name   = nameEl ? nameEl.value.trim() : '';

  if (!name) {
    errEl.textContent = 'Enter a nickname to continue';
    errEl.style.display = 'block';
    if (nameEl) nameEl.focus();
    return;
  }
  if (name.length < 2) {
    errEl.textContent = 'At least 2 characters please';
    errEl.style.display = 'block';
    return;
  }

  state.player.name         = name;
  state.player.avatar       = _obSelectedAvatar || '🧙';
  state.player.hasOnboarded = true;
  save();
  renderAll();

  // Slide the overlay out then hide it
  var overlay = document.getElementById('onboarding-overlay');
  overlay.classList.add('ob-exit');
  setTimeout(function() { overlay.style.display = 'none'; }, 450);
}

/* ════ SOCIAL PAGE ════ */

function getFriendCode() {
  if (!state.player.friendCode) {
    state.player.friendCode = 'HQ-' + Math.floor(10000 + Math.random() * 90000);
    save();
  }
  return state.player.friendCode;
}
window.getFriendCode = getFriendCode;
window.save = save;

function renderSocialPage() {
  var list      = document.getElementById('soc-friends-list');
  var countEl   = document.getElementById('soc-friends-count');
  var notifList = document.getElementById('soc-notif-list');
  var notifCount= document.getElementById('soc-notif-count');
  if (!list) return;

  // ── Notifications (incoming friend requests) ──────────────────────────────
  if (notifList && window._loadMyFriendRequests) {
    notifList.innerHTML = '<div class="soc-loading">Loading…</div>';
    window._loadMyFriendRequests().then(function(requestUids) {
      if (!requestUids.length) {
        notifList.innerHTML = '<div class="soc-empty" style="padding:10px 0 4px">No pending requests.</div>';
        if (notifCount) notifCount.style.display = 'none';
        return;
      }
      if (notifCount) { notifCount.textContent = requestUids.length; notifCount.style.display = ''; }
      return window._loadFriendProfiles(requestUids).then(function(snaps) {
        var rows = snaps.map(function(snap, i) {
          var fromUid = requestUids[i];
          var p = snap.exists() ? (snap.data().player || {}) : {};
          var av = p.avatar || '🧙';
          var avHtml = (av.startsWith && av.startsWith('http'))
            ? '<img src="' + av + '">'
            : av;
          var name = p.name || 'Unknown';
          var safeName = name.replace(/'/g, '&#39;');
          return '<div class="soc-notif-row">' +
            '<div class="soc-friend-av">' + avHtml + '</div>' +
            '<div class="soc-friend-info">' +
              '<div class="soc-friend-name">' + name + '</div>' +
              '<div class="soc-friend-meta">Sent you a friend request</div>' +
            '</div>' +
            '<div class="soc-notif-actions">' +
              '<button class="soc-notif-btn soc-notif-btn-accept" onclick="acceptRequest(\'' + fromUid + '\',\'' + safeName + '\')">Accept</button>' +
              '<button class="soc-notif-btn soc-notif-btn-decline" onclick="rejectRequest(\'' + fromUid + '\',\'' + safeName + '\')">Decline</button>' +
            '</div>' +
          '</div>';
        }).join('');
        notifList.innerHTML = rows;
      });
    }).catch(function() { notifList.innerHTML = ''; });
  }

  // ── Friends list ──────────────────────────────────────────────────────────
  var friends = state.player.friends || [];
  countEl.textContent = friends.length;

  if (!friends.length) {
    list.innerHTML = '<div class="soc-empty"><div class="soc-empty-icon">👥</div>No friends yet.<br>Add someone using the methods above!</div>';
    return;
  }

  list.innerHTML = '<div class="soc-loading">Loading friends…</div>';

  if (!window._loadFriendProfiles) return;
  window._loadFriendProfiles(friends).then(function(snaps) {
    window._friendProfiles = [];
    var rows = snaps.map(function(snap, idx) {
      if (!snap.exists()) return '';
      var data = snap.data();
      var p  = data.player || {};
      var cfg = data.cardConfig || {};
      window._friendProfiles.push({ p: p, cfg: cfg });
      var av = p.avatar || '🧙';
      var avHtml = (av.startsWith && av.startsWith('http'))
        ? '<img src="' + av + '">'
        : av;
      return '<div class="soc-friend-row" style="cursor:pointer" onclick="openFriendCard(' + (window._friendProfiles.length - 1) + ')">' +
        '<div class="soc-friend-av">' + avHtml + '</div>' +
        '<div class="soc-friend-info">' +
          '<div class="soc-friend-name">' + (p.name || 'Unknown') + '</div>' +
          '<div class="soc-friend-meta">Lv.' + (p.level || 1) + ' &nbsp;·&nbsp; 🔥 ' + (p.streak || 0) + ' day streak</div>' +
        '</div>' +
        '<div class="soc-friend-status" title="Offline"></div>' +
      '</div>';
    }).join('');
    list.innerHTML = rows || '<div class="soc-empty"><div class="soc-empty-icon">👥</div>No friends yet.</div>';
    countEl.textContent = snaps.filter(function(s) { return s.exists(); }).length;
  });
}

function openFriendCard(idx) {
  var entry = (window._friendProfiles || [])[idx];
  if (!entry) return;
  var p   = entry.p;
  var cfg = entry.cfg || {};

  // Resolve background
  var bgPreset = CARD_BG_PRESETS.find(function(b) { return b.id === (cfg.bg || 'default'); });
  var bgStyle  = (bgPreset && bgPreset.bg) ? bgPreset.bg : 'linear-gradient(135deg,#1a1a2e,#16213e)';

  // Avatar
  var av = p.avatar || '🧙';
  var avHtml = (av.startsWith && av.startsWith('http'))
    ? '<img src="' + av + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%">'
    : '<span style="font-size:3rem;line-height:1">' + av + '</span>';

  // XP bar
  var xp       = p.xp       || 0;
  var xpToNext = p.xpToNext || 100;
  var xpPct    = Math.min(100, Math.round(xp / xpToNext * 100));

  // Level ring arc
  var level    = p.level || 1;
  var r = 44, circ = 2 * Math.PI * r;
  var arc  = circ * (xpPct / 100);
  var nameColor = cfg.nameColor || '';

  // Stats row
  var statIds = (cfg.stats && cfg.stats.length) ? cfg.stats : ['level','totalXP','streak'];
  var STAT_MAP = {
    streak:         { label:'Streak',      color:'var(--rose)',  val: p.streak || 0 },
    bestStreak:     { label:'Best Streak', color:'#f59e0b',      val: p.bestStreak || 0 },
    totalXP:        { label:'Total XP',    color:'var(--teal)',  val: (p.totalXP || 0).toLocaleString() },
    totalCompleted: { label:'Completed',   color:'var(--green)', val: p.totalCompleted || 0 },
    level:          { label:'Level',       color:'#a78bfa',      val: level },
    todayDone:      { label:'Today',       color:'var(--green)', val: 0 },
  };
  var statsHtml = statIds.map(function(id) {
    var s = STAT_MAP[id]; if (!s) return '';
    return '<div class="fpc-stat"><div class="fpc-stat-val" style="color:' + s.color + '">' + s.val + '</div><div class="fpc-stat-lbl">' + s.label + '</div></div>';
  }).join('');

  var modal = document.getElementById('friend-card-modal');
  var card  = document.getElementById('friend-card-inner');
  card.style.background = bgStyle;
  card.innerHTML =
    '<div class="fpc-avatar-wrap"><div class="fpc-avatar">' + avHtml + '</div></div>' +
    '<div class="fpc-name"' + (nameColor ? ' style="color:' + nameColor + '"' : '') + '>' + (p.name || 'Friend') + '</div>' +
    '<div class="fpc-xp-row"><span class="fpc-xp-lbl">Experience</span><span class="fpc-xp-nums">' + xp + ' / ' + xpToNext + '</span></div>' +
    '<div class="fpc-xp-bar"><div class="fpc-xp-fill" style="width:' + xpPct + '%"></div></div>' +
    '<div class="fpc-ring-wrap">' +
      '<svg width="110" height="110" viewBox="0 0 110 110">' +
        '<circle cx="55" cy="55" r="' + r + '" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="8"/>' +
        '<circle cx="55" cy="55" r="' + r + '" fill="none" stroke="var(--rose)" stroke-width="8" stroke-linecap="round" ' +
          'stroke-dasharray="' + arc + ' ' + circ + '" transform="rotate(-90 55 55)"/>' +
      '</svg>' +
      '<div class="fpc-ring-level">' + level + '</div>' +
    '</div>' +
    '<div class="fpc-ring-lbl">LEVEL</div>' +
    '<div class="fpc-stats-row">' + statsHtml + '</div>';

  modal.classList.add('show');
}

function closeFriendCard() {
  document.getElementById('friend-card-modal').classList.remove('show');
}

function acceptRequest(fromUid, fromName) {
  if (!window._acceptFriendRequest) return;
  window._acceptFriendRequest(fromUid).then(function() {
    if (!state.player.friends) state.player.friends = [];
    if (state.player.friends.indexOf(fromUid) === -1) state.player.friends.push(fromUid);
    save();
    _socSetStatus('✅ You and ' + fromName + ' are now friends!', false);
    renderSocialPage();
  }).catch(function(e) { _socSetStatus('Error: ' + e.message, true); });
}

function rejectRequest(fromUid, fromName) {
  if (!window._rejectFriendRequest) return;
  window._rejectFriendRequest(fromUid).then(function() {
    _socSetStatus('Request from ' + fromName + ' declined.', false);
    renderSocialPage();
  }).catch(function(e) { _socSetStatus('Error: ' + e.message, true); });
}

function _socSetStatus(msg, isError) {
  var el = document.getElementById('soc-status');
  if (!el) return;
  el.textContent = msg;
  el.style.color = isError ? 'var(--rose)' : 'var(--teal)';
  el.style.display = msg ? 'block' : 'none';
}

function addByUsername() {
  if (!window.currentUser) { _socSetStatus('Sign in first to add friends.', true); return; }
  var name = (document.getElementById('soc-username-input').value || '').trim();
  if (!name) { _socSetStatus('Enter a username.', true); return; }
  if (name === state.player.name) { _socSetStatus("That's you!", true); return; }
  _socSetStatus('Searching…', false);
  window._findUserByName(name).then(function(snap) {
    if (snap.empty) { _socSetStatus('User "' + name + '" not found.', true); return; }
    var friendUid = snap.docs[0].id;
    var friends = state.player.friends || [];
    if (friends.indexOf(friendUid) !== -1) { _socSetStatus(name + ' is already your friend!', true); return; }
    return window._sendFriendRequest(friendUid).then(function() {
      _socSetStatus('📨 Friend request sent to ' + name + '!', false);
      document.getElementById('soc-username-input').value = '';
    });
  }).catch(function(e) { _socSetStatus('Error: ' + e.message, true); });
}

function addByCode() {
  if (!window.currentUser) { _socSetStatus('Sign in first to add friends.', true); return; }
  var code = (document.getElementById('soc-code-input').value || '').trim().toUpperCase();
  if (!code) { _socSetStatus('Enter a friend code.', true); return; }
  if (code === getFriendCode()) { _socSetStatus("That's your own code!", true); return; }
  _socSetStatus('Searching…', false);
  window._findUserByCode(code).then(function(snap) {
    if (snap.empty) { _socSetStatus('Code "' + code + '" not found.', true); return; }
    var friendUid = snap.docs[0].id;
    var friends = state.player.friends || [];
    if (friends.indexOf(friendUid) !== -1) { _socSetStatus('Already friends!', true); return; }
    var friendName = (snap.docs[0].data().player || {}).name || code;
    return window._sendFriendRequest(friendUid).then(function() {
      _socSetStatus('📨 Friend request sent to ' + friendName + '!', false);
      document.getElementById('soc-code-input').value = '';
    });
  }).catch(function(e) { _socSetStatus('Error: ' + e.message, true); });
}

function showMyQR() {
  var code = getFriendCode();
  var modal = document.getElementById('d-modal');
  modal.style.display = 'flex';
  var qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=' + encodeURIComponent(code);
  modal.innerHTML =
    '<div class="qr-modal">' +
      '<div class="qr-title">Your QR Code</div>' +
      '<div class="qr-sub">Let friends scan this to add you instantly</div>' +
      '<div class="qr-img"><img src="' + qrUrl + '" alt="QR Code"></div>' +
      '<div class="qr-code-text">' + code + '</div>' +
      '<button class="qr-close" onclick="document.getElementById(\'d-modal\').style.display=\'none\'">Close</button>' +
    '</div>';
}

/* ════ CHAT ════ */

var _chatUnsubscribe = null;
var _chatFriendUid   = null;

function renderChatPage() {
  var listEl = document.getElementById('chat-friends-list');
  if (!listEl) return;

  // Show list view, hide room view
  document.getElementById('chat-list-view').style.display = '';
  var roomView = document.getElementById('chat-room-view');
  roomView.style.display = 'none';
  if (_chatUnsubscribe) { _chatUnsubscribe(); _chatUnsubscribe = null; }

  var friends = state.player.friends || [];
  if (!friends.length) {
    listEl.innerHTML = '<div class="soc-empty"><div class="soc-empty-icon">💬</div>No friends yet.<br>Add friends first to start chatting!</div>';
    return;
  }
  listEl.innerHTML = '<div class="soc-loading">Loading…</div>';
  window._loadFriendProfiles(friends).then(function(snaps) {
    var rows = snaps.map(function(snap) {
      if (!snap.exists()) return '';
      var uid = snap.id;
      var p   = snap.data().player || {};
      var av  = p.avatar || '🧙';
      var avHtml = (av.startsWith && av.startsWith('http'))
        ? '<img src="' + av + '">'
        : av;
      var safeName = (p.name || 'Friend').replace(/'/g, '&#39;');
      return '<div class="soc-friend-row" style="cursor:pointer" onclick="openChatRoom(\'' + uid + '\',\'' + safeName + '\')">' +
        '<div class="soc-friend-av">' + avHtml + '</div>' +
        '<div class="soc-friend-info">' +
          '<div class="soc-friend-name">' + (p.name || 'Friend') + '</div>' +
          '<div class="soc-friend-meta">Tap to open chat</div>' +
        '</div>' +
        '<div style="color:var(--teal);font-size:1.2rem">›</div>' +
      '</div>';
    }).join('');
    listEl.innerHTML = rows || '<div class="soc-empty">No friends found.</div>';
  });
}

function openChatRoom(friendUid, friendName) {
  _chatFriendUid = friendUid;
  document.getElementById('chat-list-view').style.display = 'none';
  var roomView = document.getElementById('chat-room-view');
  roomView.style.display = 'flex';
  document.getElementById('chat-room-name').textContent = friendName;
  document.getElementById('chat-messages').innerHTML = '<div class="soc-loading">Loading messages…</div>';
  document.getElementById('chat-msg-input').value = '';

  if (!window._listenChat || !window.currentUser) return;
  if (_chatUnsubscribe) _chatUnsubscribe();
  _chatUnsubscribe = window._listenChat(friendUid, function(msgs) {
    var myUid = window.currentUser.uid;
    var msgsEl = document.getElementById('chat-messages');
    if (!msgsEl) return;
    if (!msgs.length) {
      msgsEl.innerHTML = '<div class="chat-empty">No messages yet. Say hi! 👋</div>';
      return;
    }
    msgsEl.innerHTML = msgs.map(function(m) {
      var mine = m.senderUid === myUid;
      var time = m.timestamp ? new Date(m.timestamp.seconds ? m.timestamp.seconds * 1000 : m.timestamp).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) : '';
      return '<div class="chat-msg ' + (mine ? 'chat-msg-mine' : 'chat-msg-theirs') + '">' +
        '<div class="chat-bubble">' + escapeHtml(m.text) + '</div>' +
        '<div class="chat-time">' + time + '</div>' +
      '</div>';
    }).join('');
    msgsEl.scrollTop = msgsEl.scrollHeight;
  });
}

function closeChatRoom() {
  if (_chatUnsubscribe) { _chatUnsubscribe(); _chatUnsubscribe = null; }
  _chatFriendUid = null;
  document.getElementById('chat-room-view').style.display = 'none';
  document.getElementById('chat-list-view').style.display = '';
}

function sendChatMessage() {
  var input = document.getElementById('chat-msg-input');
  var text  = (input.value || '').trim();
  if (!text || !_chatFriendUid || !window.currentUser) return;
  input.value = '';
  window._sendChatMessage(_chatFriendUid, text).catch(function(e) {
    showToast('Could not send: ' + e.message);
  });
}

function escapeHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ════ FRIENDS LEADERBOARD ════ */

function renderFriendsLeaderboard() {
  var el = document.getElementById('flb-list');
  if (!el) return;

  var friends = state.player.friends || [];
  // Include self
  var allUids = friends.slice();

  el.innerHTML = '<div class="soc-loading">Loading leaderboard…</div>';

  var loadProfiles = friends.length
    ? window._loadFriendProfiles(friends)
    : Promise.resolve([]);

  loadProfiles.then(function(snaps) {
    var entries = [];

    // Add self
    entries.push({
      name:   state.player.name || 'You',
      avatar: state.player.avatar || '🧙',
      level:  state.player.level || 1,
      xp:     state.player.totalXP || 0,
      streak: state.player.streak || 0,
      done:   state.player.totalCompleted || 0,
      isMe:   true
    });

    snaps.forEach(function(snap) {
      if (!snap.exists()) return;
      var p = snap.data().player || {};
      entries.push({
        name:   p.name || 'Friend',
        avatar: p.avatar || '🧙',
        level:  p.level || 1,
        xp:     p.totalXP || 0,
        streak: p.streak || 0,
        done:   p.totalCompleted || 0,
        isMe:   false
      });
    });

    // Sort by XP descending
    entries.sort(function(a, b) { return b.xp - a.xp; });

    if (!entries.length) {
      el.innerHTML = '<div class="soc-empty"><div class="soc-empty-icon">🏆</div>Add friends to see them here!</div>';
      return;
    }

    var medals = ['🥇','🥈','🥉'];
    el.innerHTML = '<div class="flb-table">' +
      entries.map(function(e, i) {
        var av = e.avatar;
        var avHtml = (av.startsWith && av.startsWith('http'))
          ? '<img src="' + av + '" style="width:36px;height:36px;border-radius:50%;object-fit:cover">'
          : '<span style="font-size:1.3rem">' + av + '</span>';
        var medal = medals[i] || ('#' + (i + 1));
        return '<div class="flb-row' + (e.isMe ? ' flb-row-me' : '') + '">' +
          '<div class="flb-rank">' + medal + '</div>' +
          '<div class="flb-av">' + avHtml + '</div>' +
          '<div class="flb-info">' +
            '<div class="flb-name">' + e.name + (e.isMe ? ' <span class="flb-you">You</span>' : '') + '</div>' +
            '<div class="flb-meta">Lv.' + e.level + ' &nbsp;·&nbsp; 🔥 ' + e.streak + ' streak &nbsp;·&nbsp; ✅ ' + e.done + ' done</div>' +
          '</div>' +
          '<div class="flb-xp">' + e.xp + '<span class="flb-xp-label"> XP</span></div>' +
        '</div>';
      }).join('') +
    '</div>';
  }).catch(function() {
    el.innerHTML = '<div class="soc-empty">Could not load leaderboard.</div>';
  });
}

function copyFriendCode() {
  var code = getFriendCode();
  navigator.clipboard.writeText(code).then(function() {
    showToast('Friend code copied! 🔗');
  }).catch(function() {
    showToast(code);
  });
}

/* ════ BOOT ════ */
load();
renderAll();
initObAvatarGrid();

// Show onboarding for first-time visitors; skip for returning users
if (!state.player.hasOnboarded) {
  document.getElementById('onboarding-overlay').style.display = 'flex';
}
