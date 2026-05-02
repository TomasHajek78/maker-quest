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
    // If we have saved state, make splash shorter or skip it
    const saved = localStorage.getItem('makerQuestState');
    if (saved) {
      splash.style.animationDelay = '1s';
    }
    splash.classList.add('fade-out');
  }

  setupEventListeners();
  loadState();
});

function setupEventListeners() {
  ageButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const age = btn.getAttribute('data-age');
      selectAgeGroup(age);
    });
  });
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
  mainContent.innerHTML = `
    <div class="dashboard animate-fade-in">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-md);">
        <h2>Tvé Mise: ${state.ageGroup} let</h2>
      </div>
      
      <!-- Skill Radar Preview (The WOW Factor) -->
      <div class="glass-card" style="padding: var(--space-sm); margin-bottom: var(--space-lg); background: var(--grad-surface);">
        <div style="display: flex; gap: var(--space-sm); align-items: center;">
          <div id="radar-container" style="width: 100px; height: 100px;">
            ${renderSkillRadar(100)}
          </div>
          <div>
            <h4 style="color: var(--color-secondary); margin-bottom: 2px;">Tvůj Skill Radar</h4>
            <p style="font-size: 0.75rem; color: var(--color-text-dim);">Tvé dovednosti rostou s každou splněnou misí!</p>
          </div>
        </div>
      </div>

      <div class="glass-card mission-card" id="mission-1-card" style="border-left: 4px solid var(--color-primary);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
          <div>
            <span style="font-size: 0.7rem; color: var(--color-primary); font-weight: 700; text-transform: uppercase;">Mise 1: Zahřívačka</span>
            <h3>První dojmy</h3>
          </div>
          <span style="font-size: 1.2rem;">🚀</span>
        </div>
        <p style="font-size: 0.9rem; color: var(--color-text-dim); margin-bottom: var(--space-sm);">
          ${state.ageGroup === '5-7' ? 'Najdi 3 věci, které mají tvoji oblíbenou barvu.' : 'Najdi 3 nejzajímavější vynálezy na festivalu.'}
        </p>
        <button class="btn btn-primary" style="width: 100%;" onclick="startMission1()">ZAČÍT MISI</button>
      </div>

      <div class="glass-card mission-card locked" style="opacity: 0.5; filter: grayscale(1); margin-top: var(--space-sm);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <span style="font-size: 0.7rem; color: var(--color-text-dim); font-weight: 700; text-transform: uppercase;">Mise 2: Pozoruj & hodnoť</span>
            <h3>Hledání unikátů</h3>
          </div>
          <span style="font-size: 1.2rem;">🔒</span>
        </div>
      </div>
    </div>
  `;
}

function startMission1() {
  mainContent.innerHTML = `
    <div class="mission-view animate-fade-in">
      <button class="btn btn-outline" style="margin-bottom: var(--space-md); padding: 5px 10px; font-size: 0.8rem;" onclick="renderDashboard()">← Zpět</button>
      <h2 style="margin-bottom: var(--space-sm);">Mise 1: První dojmy</h2>
      <p style="color: var(--color-text-dim); margin-bottom: var(--space-lg);">Vyfoť 3 věci, které tě dnes nejvíc "praštily do očí".</p>
      
      <div class="photo-grid" style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: var(--space-lg);">
        ${[1, 2, 3].map(i => `
          <div class="glass-card photo-slot" style="aspect-ratio: 1; display: flex; align-items: center; justify-content: center; border-style: dashed; position: relative;">
            <span style="font-size: 1.5rem;">📸</span>
            <input type="file" accept="image/*" capture="environment" style="position: absolute; inset: 0; opacity: 0; cursor: pointer;" onchange="handlePhotoUpload(${i}, this)">
          </div>
        `).join('')}
      </div>

      <div id="mission-progress" style="margin-top: var(--space-md);">
        <p style="font-size: 0.8rem; margin-bottom: 5px;">Postup mise: <span id="photo-count">0</span> / 3</p>
        <div style="width: 100%; height: 8px; background: var(--color-bg-alt); border-radius: 4px; overflow: hidden;">
          <div id="progress-bar" style="width: 0%; height: 100%; background: var(--grad-main); transition: width 0.3s ease;"></div>
        </div>
      </div>
    </div>
  `;
}

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
      alert('Skvělá práce! První mise splněna. Tvé dovednosti vzrostly!');
      state.missionsCompleted.push(1);
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
