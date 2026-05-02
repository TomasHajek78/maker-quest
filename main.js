// App State
const state = {
  ageGroup: null,
  currentLevel: 1,
  skills: {
    creativity: 0,
    resilience: 0,
    ethics: 0,
    technical: 0,
    communication: 0
  },
  inventory: [],
  missionsCompleted: []
};

// UI Elements
const mainContent = document.getElementById('main-content');
const ageButtons = document.querySelectorAll('.btn-age');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Splash Screen Logic
  const splash = document.getElementById('splash-screen');
  if (splash) {
    // Vždy ukázat úvod na dostatečně dlouhou dobu
    splash.style.animationDelay = '2.5s';
    splash.classList.add('fade-out');
  }

  setupEventListeners();
  loadState();
});

function setupEventListeners() {
  // Age Selection
  document.querySelectorAll('.btn-age').forEach(btn => {
    btn.addEventListener('click', () => {
      const age = btn.getAttribute('data-age');
      selectAgeGroup(age);
    });
  });

  // Navigation
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.getAttribute('data-view');
      switchView(view);
    });
  });
}

function switchView(view) {
  mainContent.style.opacity = '0';
  setTimeout(() => {
    if (view === 'quest') renderDashboard();
    if (view === 'skills') renderSkillsView();
    if (view === 'workbench') renderWorkbench();
    mainContent.style.opacity = '1';
  }, 300);
}

function selectAgeGroup(age) {
  state.ageGroup = age;
  saveState();
  
  // Transition to Missions Screen
  mainContent.style.opacity = '0';
  setTimeout(() => {
    renderDashboard();
    mainContent.style.opacity = '1';
    document.getElementById('main-nav').style.display = 'flex';
  }, 400);
}

function renderDashboard() {
  const m1Done = state.missionsCompleted.includes(1);
  const m2Done = state.missionsCompleted.includes(2);

  mainContent.innerHTML = `
    <div class="dashboard animate-fade-in">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-md);">
        <h2>Tvé Mise</h2>
      </div>
      
      <!-- Skill Radar Preview -->
      <div class="glass-card nav-item" data-view="skills" style="padding: var(--space-sm); margin-bottom: var(--space-lg); background: var(--grad-surface); cursor: pointer;">
        <div style="display: flex; gap: var(--space-sm); align-items: center;">
          <div id="radar-container" style="width: 80px; height: 80px;">
            ${renderSkillRadar(80)}
          </div>
          <div>
            <h4 style="color: var(--color-secondary); margin-bottom: 2px;">Tvůj Skill Radar</h4>
            <p style="font-size: 0.7rem; color: var(--color-text-dim);">Dovednosti: ${Math.floor(Object.values(state.skills).reduce((a,b)=>a+b,0)/5)}%</p>
          </div>
        </div>
      </div>

      <!-- Mission 1 -->
      <div class="glass-card mission-card ${m1Done ? 'completed' : ''}" style="border-left: 4px solid ${m1Done ? 'var(--color-success)' : 'var(--color-primary)'}; margin-bottom: 15px; opacity: ${m1Done ? 0.8 : 1};">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
          <div>
            <span style="font-size: 0.7rem; color: ${m1Done ? 'var(--color-success)' : 'var(--color-primary)'}; font-weight: 700; text-transform: uppercase;">Mise 1: Zahřívačka</span>
            <h3>První dojmy</h3>
          </div>
          <span style="font-size: 1.2rem;">${m1Done ? '✅' : '🚀'}</span>
        </div>
        ${m1Done ? '<p style="font-size: 0.8rem; color: var(--color-success);">SPLOUNĚNO! Získal jsi základnu robota.</p>' : `
          <p style="font-size: 0.9rem; color: var(--color-text-dim); margin-bottom: var(--space-sm);">
            ${state.ageGroup === '5-7' ? 'Najdi 3 věci, které mají tvoji oblíbenou barvu.' : 'Najdi 3 nejzajímavější vynálezy na festivalu.'}
          </p>
          <button class="btn btn-primary" style="width: 100%;" onclick="startMission1()">ZAČÍT MISI</button>
        `}
      </div>

      <!-- Mission 2 -->
      <div class="glass-card mission-card ${!m1Done ? 'locked' : ''} ${m2Done ? 'completed' : ''}" style="border-left: 4px solid ${!m1Done ? 'var(--color-text-dim)' : (m2Done ? 'var(--color-success)' : 'var(--color-secondary)')}; opacity: ${!m1Done ? 0.5 : 1};">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
          <div>
            <span style="font-size: 0.7rem; color: var(--color-text-dim); font-weight: 700; text-transform: uppercase;">Mise 2: Průzkumník</span>
            <h3>Hledání unikátů</h3>
          </div>
          <span style="font-size: 1.2rem;">${!m1Done ? '🔒' : (m2Done ? '✅' : '🔍')}</span>
        </div>
        ${!m1Done ? '<p style="font-size: 0.8rem;">Dokonči Misi 1 pro odemčení.</p>' : (m2Done ? '<p style="font-size: 0.8rem; color: var(--color-success);">SPLNĚNO! Máš senzor pozornosti.</p>' : `
          <p style="font-size: 0.9rem; color: var(--color-text-dim); margin-bottom: var(--space-sm);">Najdi ten nejbláznivější vynález a popiš, k čemu slouží.</p>
          <button class="btn btn-secondary" style="width: 100%;" onclick="startMission2()">POKRAČOVAT</button>
        `)}
      </div>
    </div>
  `;
}

function startMission2() {
  mainContent.innerHTML = `
    <div class="mission-view animate-fade-in">
      <button class="btn btn-outline" style="margin-bottom: var(--space-md); padding: 5px 10px; font-size: 0.8rem;" onclick="renderDashboard()">← Zpět</button>
      <h2 style="margin-bottom: var(--space-sm);">Mise 2: Průzkumník</h2>
      <p style="color: var(--color-text-dim); margin-bottom: var(--space-lg);">Najdi věc, u které vůbec nechápeš, jak funguje. Vyfoť ji a napiš nám svůj odhad!</p>
      
      <div class="glass-card photo-slot" style="aspect-ratio: 16/9; margin-bottom: var(--space-md); display: flex; align-items: center; justify-content: center; border-style: dashed; position: relative;">
        <span style="font-size: 2rem;">📸</span>
        <input type="file" accept="image/*" capture="environment" style="position: absolute; inset: 0; opacity: 0; cursor: pointer;" onchange="this.parentElement.innerHTML='✅'">
      </div>

      <textarea id="mission-2-desc" class="glass-card" style="width: 100%; min-height: 100px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); color: white; padding: 10px; margin-bottom: var(--space-md);" placeholder="K čemu ta věc asi slouží?"></textarea>

      <button class="btn btn-primary" style="width: 100%;" onclick="completeMission2()">ODESLAT ODPOVĚĎ</button>
    </div>
  `;
}

window.completeMission2 = function() {
  const desc = document.getElementById('mission-2-desc').value;
  if (desc.length < 5) {
    alert('Zkus nám o tom napsat aspoň jednu větu!');
    return;
  }
  
  state.skills.technical += 20;
  state.skills.creativity += 10;
  state.missionsCompleted.push(2);
  state.inventory.push('sensor_module');
  state.currentLevel = 3;
  saveState();
  
  alert('Skvělé! Získal jsi Senzor pozornosti do svého Ponku.');
  renderDashboard();
};

window.handlePhotoUpload = function(index, input) {
  if (input.files && input.files[0]) {
    const slot = input.parentElement;
    slot.style.borderStyle = 'solid';
    slot.style.borderColor = 'var(--color-success)';
    slot.innerHTML = '<span style="font-size: 1.5rem;">✅</span>';
    
    // Update stats
    state.skills.creativity += 15;
    state.skills.technical += 5;
    
    const count = document.querySelectorAll('.photo-slot:has(span:contains("✅"))').length || 
                  (state.missionsCompleted.includes(1) ? 3 : document.querySelectorAll('.photo-slot').length - document.querySelectorAll('.photo-slot input').length);
    
    // Since we don't have :has support in all browsers easily, let's just track it manually
    updateMissionProgress();
  }
};

let photosTaken = 0;
function updateMissionProgress() {
  photosTaken++;
  document.getElementById('photo-count').innerText = photosTaken;
  document.getElementById('progress-bar').style.width = (photosTaken / 3 * 100) + '%';
  
  if (photosTaken === 3) {
    setTimeout(() => {
      alert('Skvělá práce! První mise splněna. Tvé dovednosti vzrostly a získal jsi první součástku do Ponku!');
      state.missionsCompleted.push(1);
      state.inventory.push('base_module');
      state.currentLevel = 2;
      saveState();
      renderDashboard();
    }, 500);
  }
}

function renderSkillRadar(size) {
  const center = size / 2;
  const radius = size * 0.4;
  const points = [];
  const skills = Object.keys(state.skills);
  
  skills.forEach((skill, i) => {
    const angle = (Math.PI * 2 * i) / skills.length - Math.PI / 2;
    const value = (state.skills[skill] / 100) * radius;
    const x = center + Math.cos(angle) * value;
    const y = center + Math.sin(angle) * value;
    points.push(`${x},${y}`);
  });

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <!-- Web Background -->
      ${[0.2, 0.4, 0.6, 0.8, 1].map(r => `
        <circle cx="${center}" cy="${center}" r="${radius * r}" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
      `).join('')}
      <!-- Skill Area -->
      <polygon points="${points.join(' ')}" fill="rgba(6, 182, 212, 0.4)" stroke="var(--color-secondary)" stroke-width="2" />
    </svg>
  `;
}

// Persistence
function saveState() {
  localStorage.setItem('makerQuestState', JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem('makerQuestState');
  if (saved) {
    Object.assign(state, JSON.parse(saved));
    if (state.ageGroup) {
      renderDashboard();
      document.getElementById('main-nav').style.display = 'flex';
    }
  }
}
