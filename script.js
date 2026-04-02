/* ════ STATE ════ */
let state = {
  player: { name:'Novice Hero', avatar:'🧙', level:1, xp:0, xpToNext:100, totalXP:0, streak:0, bestStreak:0, totalCompleted:0, joinedChallenges:[], lastActiveDate:null, joinDate:null, xpLog:[], hasOnboarded:false },
  habits: [], todayCompleted: {}, selectedIcon:'🏃', selectedColor:'#0d8a7f', currentCat:'all'
};

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
  { id:'c1', name:'30-Day Detox',       desc:'No social media for 30 days',         icon:'📵', badge:'EPIC',   cc1:'rgba(109,61,189,.06)', g1:'#6d3dbd', g2:'#c4374a', xp:500, participants:1247, progress:60, diffCls:'diff-epic'   },
  { id:'c2', name:'Week Warrior',       desc:'Train 7 days in a row',               icon:'💪', badge:'HARD',   cc1:'rgba(196,55,74,.06)',  g1:'#c4374a', g2:'#c47028', xp:200, participants:3821, progress:40, diffCls:'diff-hard'   },
  { id:'c3', name:'Book Marathon',      desc:'Read 4 books in 30 days',             icon:'📚', badge:'MEDIUM', cc1:'rgba(201,130,10,.06)', g1:'#c9820a', g2:'#0d8a7f', xp:150, participants:892,  progress:25, diffCls:'diff-medium' },
  { id:'c4', name:'Meditation Master',  desc:'Meditate every day for 14 days',      icon:'🧘', badge:'EASY',   cc1:'rgba(13,138,127,.06)', g1:'#0d8a7f', g2:'#1a8a5a', xp:100, participants:5634, progress:70, diffCls:'diff-easy'   },
  { id:'c5', name:'Hydration Hero',     desc:'2L water daily for 21 days',          icon:'💧', badge:'EASY',   cc1:'rgba(26,138,90,.06)',  g1:'#1a8a5a', g2:'#0d8a7f', xp:80,  participants:8201, progress:55, diffCls:'diff-easy'   },
  { id:'c6', name:'Code & Conquer',     desc:'Code every day for 14 days',          icon:'💻', badge:'HARD',   cc1:'rgba(109,61,189,.06)', g1:'#6d3dbd', g2:'#c4374a', xp:300, participants:2103, progress:35, diffCls:'diff-hard'   },
];

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
  { id:'a1',  icon:'🌟', name:'First Step',        desc:'Complete your first quest',        xpReward:50,   unlocked:false },
  { id:'a2',  icon:'🔥', name:'On Fire',            desc:'7-day streak',                     xpReward:100,  unlocked:false },
  { id:'a3',  icon:'⚔️', name:'Discipline Warrior', desc:'Add 5 quests',                     xpReward:75,   unlocked:false },
  { id:'a4',  icon:'💎', name:'Diamond Mind',        desc:'Reach level 10',                   xpReward:500,  unlocked:false },
  { id:'a5',  icon:'🏆', name:'Week Champion',       desc:'Complete all quests 7 days',       xpReward:200,  unlocked:false },
  { id:'a6',  icon:'🌊', name:'Flow State',          desc:'30-day streak',                    xpReward:1000, unlocked:false },
  { id:'a7',  icon:'🎯', name:'Sniper',              desc:'100 completed quests',             xpReward:300,  unlocked:false },
  { id:'a8',  icon:'🧙', name:'Grand Master',        desc:'Reach level 25',                   xpReward:1500, unlocked:false },
  { id:'a9',  icon:'⚡', name:'Quick Start',         desc:'5 quests in one day',              xpReward:150,  unlocked:false },
  { id:'a10', icon:'🌅', name:'Early Bird',          desc:'Quest before 8am',                 xpReward:80,   unlocked:false },
  { id:'a11', icon:'💪', name:'Atlas',               desc:'14-day fitness streak',            xpReward:250,  unlocked:false },
  { id:'a12', icon:'📚', name:'Bookworm',            desc:'30 reading days in a row',         xpReward:400,  unlocked:false },
];

const CLASSES = [
  { minLevel:1,  name:'Discipline Apprentice', prefix:'⚔️' },
  { minLevel:5,  name:'Habit Warrior',         prefix:'🛡️' },
  { minLevel:10, name:'Productivity Mage',     prefix:'🧙' },
  { minLevel:20, name:'Mind Master',           prefix:'🔮' },
  { minLevel:35, name:'Legend of Will',        prefix:'👑' },
];

const PAGE_TITLES = {
  quests:       'My <span style="color:var(--teal)">Quests</span>',
  challenges:   'Active <span style="color:var(--teal)">Challenges</span>',
  leaderboard:  'World <span style="color:var(--teal)">Leaderboard</span>',
  achievements: '<span style="color:var(--teal)">Achievements</span>',
  subscription: '<span style="color:var(--teal)">Go Pro</span>',
  group:        '👥 Group <span style="color:var(--teal)">Challenge</span>',
  profile:      '👤 My <span style="color:var(--teal)">Profile</span>',
};

/* ════ PERSISTENCE ════ */
function save() {
  try { localStorage.setItem('hqd_v1', JSON.stringify(state)); } catch(e) {}
  if (window._fbSave) window._fbSave(state);
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
  checkDayReset();
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
  document.getElementById('sb-avatar').textContent    = p.avatar;
  document.getElementById('sb-name').textContent      = p.name;
  document.getElementById('sb-class').textContent     = `${cls.prefix} ${cls.name}`;
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
  document.getElementById('d-avatar').textContent   = p.avatar;
  document.getElementById('d-name').textContent     = p.name;
  document.getElementById('d-class').textContent    = `${cls.prefix} ${cls.name}`;
  document.getElementById('d-xp-bar').style.width   = pct + '%';
  document.getElementById('d-xp-label').textContent = `${p.xp} / ${p.xpToNext}`;
  document.getElementById('d-level').textContent    = p.level;
  const circ = 163.4;
  document.getElementById('d-level-arc').setAttribute('stroke-dashoffset', circ - (pct / 100) * circ);
  document.getElementById('d-cp-streak').textContent = p.streak;
  document.getElementById('d-cp-quests').textContent = total;
  document.getElementById('d-cp-today').textContent  = todayDone;

  // Stats
  document.getElementById('d-total-xp').textContent  = p.totalXP.toLocaleString();
  document.getElementById('d-streak').textContent    = p.bestStreak;
  document.getElementById('d-completed').textContent = p.totalCompleted;
  document.getElementById('d-today').textContent     = total ? Math.round((todayDone / total) * 100) + '%' : '0%';

  renderWeekStrip();
  renderHabits();
  renderMiniLB();
}

function renderWeekStrip() {
  const today = new Date().getDay(), todayIdx = today === 0 ? 6 : today - 1;
  document.getElementById('d-week-strip').innerHTML = WEEK_DAYS.map((d, i) => {
    const isToday = i === todayIdx, done = i < todayIdx;
    return `<div class="day-col">
      <div class="day-name">${d}</div>
      <div class="day-dot ${done ? 'done' : ''} ${isToday ? 'today' : ''}">${done ? '✓' : i + 1}</div>
    </div>`;
  }).join('');
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
  const p = state.player, td = Object.values(state.todayCompleted).filter(Boolean).length;
  ACHIEVEMENTS.forEach(a => {
    if (a.unlocked) return;
    let u = false;
    if (a.id === 'a1' && p.totalCompleted >= 1)    u = true;
    if (a.id === 'a2' && p.bestStreak >= 7)         u = true;
    if (a.id === 'a3' && state.habits.length >= 5)  u = true;
    if (a.id === 'a4' && p.level >= 10)             u = true;
    if (a.id === 'a9' && td >= 5)                   u = true;
    if (u) {
      a.unlocked = true;
      grantXP(a.xpReward);
      showToast('🎖 Achievement!', `"${a.name}" — +${a.xpReward} XP`, 'level-up');
    }
  });
}

function renderAchievements() {
  const unl = ACHIEVEMENTS.filter(a => a.unlocked).length;
  document.getElementById('d-ach-unlocked').textContent = unl;
  document.getElementById('d-ach-locked').textContent   = 12 - unl;
  document.getElementById('d-ach-grid').innerHTML = ACHIEVEMENTS.map(a => `
    <div class="ach-card ${a.unlocked ? 'unlocked' : 'locked'}">
      <div class="ach-icon">${a.icon}</div>
      <div class="ach-name">${a.name}</div>
      <div class="ach-desc">${a.desc}</div>
      <div class="ach-xp">+${a.xpReward} XP</div>
    </div>`).join('');
}

function renderMiniLB() {
  const data = LEADERBOARD.map(r => {
    if (r.me) return { ...r, level:state.player.level, xp:state.player.totalXP, streak:state.player.streak };
    return r;
  }).sort((a,b) => b.xp - a.xp).slice(0, 5);
  document.getElementById('d-mini-lb').innerHTML = data.map((r, i) => {
    const rank = i + 1, rc = rank===1?'t1':rank===2?'t2':rank===3?'t3':'';
    const medal = rank===1?'🥇':rank===2?'🥈':rank===3?'🥉':rank;
    return `<div class="mini-lb-row ${r.me ? 'me' : ''}">
      <div class="mini-rank ${rc}">${medal}</div>
      <div class="mini-avatar">${r.avatar}</div>
      <div><div class="mini-name">${r.me ? 'YOU' : r.name}</div><div style="font-family:var(--ff-mono);font-size:.6rem;color:var(--muted)">Lv. ${r.level}</div></div>
      <div class="mini-xp">${r.xp.toLocaleString()}</div>
    </div>`;
  }).join('');
}

function renderChallenges() {
  document.getElementById('d-challenges-grid').innerHTML = CHALLENGES.map(c => {
    const joined = state.player.joinedChallenges.includes(c.id);
    return `<div class="challenge-card" style="--cc1:${c.cc1}">
      <div class="ch-badge-d ${c.diffCls}">${c.icon} ${c.badge}</div>
      <div class="ch-icon">${c.icon}</div>
      <div class="ch-name">${c.name}</div>
      <div class="ch-desc">${c.desc}</div>
      <div class="ch-rewards">
        <div class="reward-chip">⚡ ${c.xp} XP</div>
        <div class="reward-chip" style="background:var(--teal-bg);border-color:var(--teal-br);color:var(--teal)">👥 ${c.participants.toLocaleString()}</div>
      </div>
      <div class="ch-bar"><div class="ch-bar-fill" style="width:${joined ? c.progress : 0}%;--cg1:${c.g1};--cg2:${c.g2}"></div></div>
      <button class="ch-join-btn ${joined ? 'joined' : ''}" onclick="joinChallenge('${c.id}',this)">${joined ? '✓ Joined' : '⚡ Join Challenge'}</button>
    </div>`;
  }).join('');
}

function joinChallenge(id, btn) {
  if (state.player.joinedChallenges.includes(id)) return;
  state.player.joinedChallenges.push(id);
  const c = CHALLENGES.find(c => c.id === id);
  btn.className = 'ch-join-btn joined';
  btn.textContent = '✓ Joined';
  btn.previousElementSibling.querySelector('.ch-bar-fill').style.width = c.progress + '%';
  showToast('⚡ Challenge Joined!', c.name + ' — good luck!', 'streak');
  save();
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
        <div class="lb-av">${r.avatar}</div>
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

function closeModal() { document.getElementById('d-modal').classList.remove('show'); }

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
const AVATARS = ['🧙','🦸','⚔️','🦊','🐉','🧝','🔮','🦅','🐺','🌟'];
let aidx = 0;
[document.getElementById('sb-avatar'), document.getElementById('d-avatar')].forEach(el => {
  el.addEventListener('click', () => {
    aidx = (aidx + 1) % AVATARS.length;
    state.player.avatar = AVATARS[aidx];
    document.getElementById('sb-avatar').textContent = state.player.avatar;
    document.getElementById('d-avatar').textContent  = state.player.avatar;
    save();
  });
});

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
  if (remoteState.player)         state.player         = { ...state.player, ...remoteState.player };
  if (remoteState.habits)         state.habits         = remoteState.habits;
  if (remoteState.todayCompleted) state.todayCompleted = remoteState.todayCompleted;
  renderAll();
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
  if (page === 'group')   renderGroupPage();
  if (page === 'profile') renderProfilePage();
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
    // Signed in, no group — show create/join panel
    setupEl.style.display  = 'block';
    activeEl.style.display = 'none';
    return;
  }

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
      '<div class="mini-avatar">' + m.avatar + '</div>' +
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
  var grid = document.getElementById('grp-habits-grid');
  if (!grid) return;

  // Cache for leaderboard computation — always update even if empty
  window._latestGroupHabits = habits || [];
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

  document.getElementById('pf-avatar').textContent    = p.avatar;
  document.getElementById('pf-name').textContent      = p.name;
  document.getElementById('pf-class').textContent     = cls.prefix + ' ' + cls.name;
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

var _OB_AVATARS = ['🧙','🦸','🧝','🦊','🐺','🦁','🐉','⚔️','🛡️','🔮','💀','👑','🌟','🎭','🚀','🎯','💎','🔥'];
var _obIdx = 0;

function cycleObAvatar() {
  _obIdx = (_obIdx + 1) % _OB_AVATARS.length;
  document.getElementById('ob-avatar-display').textContent = _OB_AVATARS[_obIdx];
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
  state.player.avatar       = _OB_AVATARS[_obIdx];
  state.player.hasOnboarded = true;
  save();
  renderAll();

  // Slide the overlay out then hide it
  var overlay = document.getElementById('onboarding-overlay');
  overlay.classList.add('ob-exit');
  setTimeout(function() { overlay.style.display = 'none'; }, 450);
}

/* ════ BOOT ════ */
load();
renderAll();

// Show onboarding for first-time visitors; skip for returning users
if (!state.player.hasOnboarded) {
  document.getElementById('onboarding-overlay').style.display = 'flex';
}
