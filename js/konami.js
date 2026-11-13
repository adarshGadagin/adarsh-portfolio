/* ==========================================================================
   KONAMI CODE EASTER EGG (INTERACTIVE UNIX SHELL — ADARSH-OS)
   Sequence: ↑ ↑ ↓ ↓ ← → ← → B A
   Launches an interactive bash-like CLI terminal with real commands & history.
   ========================================================================== */

import { playUiSound } from './utils.js';
import { cycleTheme } from './theme.js';

// Canonical Konami sequence
const KONAMI_SEQUENCE = [
  'arrowup', 'arrowup', 'arrowdown', 'arrowdown',
  'arrowleft', 'arrowright', 'arrowleft', 'arrowright',
  'b', 'a'
];

function normalizeKey(key) {
  const k = key.toLowerCase();
  if (k === 'up') return 'arrowup';
  if (k === 'down') return 'arrowdown';
  if (k === 'left') return 'arrowleft';
  if (k === 'right') return 'arrowright';
  return k;
}

let previouslyFocusedElement = null;
let isShellInitialized = false;
const commandHistory = [];
let historyIndex = -1;

const VIRTUAL_FILES = {
  'about.md': `## Adarsh Gadagin
2nd-Year B.Tech Computer Science & Engineering student at REVA University, Bangalore.
Passionate about software engineering, exploring artificial intelligence, and understanding low-level systems under the hood.`,

  'skills.json': `{
  "languages": ["C", "C++", "Java", "Python", "JavaScript"],
  "focus": ["Systems Programming", "Web Development", "AI/ML", "IoT"],
  "embedded": ["ESP32", "RFID (MFRC522)", "SPI / GPIO", "Relays"],
  "tools": ["Git", "GitHub", "VS Code", "Vite", "Linux"]
}`,

  'projects.txt': `Featured Projects:
1. 2D Graphics Editor (C)
   - Rasterization, primitives, memory structures, serialization
   - Source: https://github.com/adarshGadagin/2d-graphics-editor

2. Smart Door Access System (ESP32 / C++)
   - RFID UID authentication, optocoupled relay, fail-safe lock`,

  'certs.txt': `IBM SkillsBuild Verified Credentials:
- Python for Data Science
- Data Analysis using Python
- Data Visualization using Python`,

  'contact.txt': `Get in touch:
- Email:    adarshgadagin@gmail.com
- GitHub:   https://github.com/adarshGadagin
- LinkedIn: https://www.linkedin.com/in/adarsh-gadagin/`,

  'secret.key': `0x534543524554: [EASTER_EGG_FOUND] 🏆
"Talk is cheap. Show me the code." — Linus Torvalds`
};

export function openEasterEgg() {
  const modalOverlay = document.getElementById('konami-modal');
  const input = document.getElementById('terminal-input');
  if (!modalOverlay) return;

  previouslyFocusedElement = document.activeElement;
  modalOverlay.classList.add('active');
  modalOverlay.setAttribute('aria-hidden', 'false');

  playUiSound('konami');

  if (!isShellInitialized) {
    setupInteractiveTerminal();
    isShellInitialized = true;
  }

  setTimeout(() => {
    input?.focus();
  }, 60);
}

export function closeEasterEgg() {
  const modalOverlay = document.getElementById('konami-modal');
  if (!modalOverlay) return;

  modalOverlay.classList.remove('active');
  modalOverlay.setAttribute('aria-hidden', 'true');

  if (previouslyFocusedElement && typeof previouslyFocusedElement.focus === 'function') {
    previouslyFocusedElement.focus();
  }
}

function setupInteractiveTerminal() {
  const output = document.getElementById('terminal-output');
  const input = document.getElementById('terminal-input');
  const body = document.getElementById('terminal-body');
  const closeDot = document.getElementById('t-close-dot');

  if (!output || !input) return;

  closeDot?.addEventListener('click', closeEasterEgg);

  // Focus input when clicking terminal window
  body?.addEventListener('click', () => {
    input.focus();
  });

  // Initial Boot Welcome Banner
  printInitialBanner(output);

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const rawCmd = input.value.trim();
      input.value = '';

      if (rawCmd) {
        commandHistory.push(rawCmd);
        historyIndex = commandHistory.length;
      }

      printCommandLine(output, rawCmd);
      if (rawCmd) {
        executeCommand(rawCmd, output);
      }
      scrollTerminalToBottom(body);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        input.value = commandHistory[historyIndex] || '';
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        input.value = commandHistory[historyIndex] || '';
      } else {
        historyIndex = commandHistory.length;
        input.value = '';
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      handleTabCompletion(input);
    }
  });
}

function printInitialBanner(output) {
  const banner = document.createElement('div');
  banner.className = 'terminal-line';
  banner.innerHTML = `
<div style="color: #38BDF8; font-weight: 700; margin-bottom: 6px;">
  ╔═══════════════════════════════════════════════════════════════╗<br>
  ║                     ADARSH-OS (v2.4.0)                        ║<br>
  ║        Type <span style="color:#34D399">'help'</span> for commands • <span style="color:#A78BFA">'neofetch'</span> for specs         ║<br>
  ╚═══════════════════════════════════════════════════════════════╝
</div>
<div style="color: #94A3B8; margin-bottom: 8px;">
  Host: Adarsh Gadagin • REVA Dept. of CSE • Bangalore, IN<br>
  Logged in as: <span style="color:#34D399">adarsh</span> (interactive bash shell)
</div>`;
  output.appendChild(banner);
}

function printCommandLine(output, cmd) {
  const line = document.createElement('div');
  line.className = 'terminal-line';
  line.innerHTML = `
    <span class="terminal-prompt-prefix">
      <span class="t-user">adarsh@adarsh-os</span>:<span class="t-path">~</span><span class="t-dollar">$</span>
    </span>
    <span style="color:#F8FAFC; margin-left: 6px;">${escapeHtml(cmd)}</span>
  `;
  output.appendChild(line);
}

function executeCommand(rawCmd, output) {
  playUiSound('action');
  const parts = rawCmd.trim().split(/\s+/);
  const command = parts[0].toLowerCase();
  const args = parts.slice(1);

  const res = document.createElement('div');
  res.className = 'terminal-line';

  switch (command) {
    case 'help':
    case '?':
      res.innerHTML = `
<div style="color:#38BDF8; font-weight:600; margin-bottom:6px;">AVAILABLE COMMANDS:</div>
<div style="display:grid; grid-template-columns: 130px 1fr; row-gap: 6px; column-gap: 8px; color:#CBD5E1; align-items:center;">
  <div><span class="t-cmd">neofetch</span></div><div>System architecture & developer specs</div>
  <div><span class="t-cmd">ls</span></div><div>List virtual directory files</div>
  <div><span class="t-cmd">cat &lt;file&gt;</span></div><div>Display file content (e.g. cat about.md)</div>
  <div><span class="t-cmd">projects</span></div><div>View featured software & hardware projects</div>
  <div><span class="t-cmd">skills</span></div><div>Display competency bars & technical stack</div>
  <div><span class="t-cmd">whoami</span></div><div>Print current user session identity</div>
  <div><span class="t-cmd">date</span></div><div>Current local date & time (Bangalore, IST)</div>
  <div><span class="t-cmd">matrix</span></div><div>Simulate cyber digital rain burst</div>
  <div><span class="t-cmd">quote</span></div><div>Print inspirational engineering quote</div>
  <div><span class="t-cmd">theme</span></div><div>Toggle portfolio dark / light theme</div>
  <div><span class="t-cmd">echo &lt;msg&gt;</span></div><div>Print text back to terminal</div>
  <div><span class="t-cmd">clear</span></div><div>Clear terminal screen</div>
  <div><span class="t-cmd">sudo &lt;cmd&gt;</span></div><div>Execute command with root privileges</div>
  <div><span class="t-cmd">exit</span></div><div>Close developer shell session</div>
</div>`;
      break;

    case 'neofetch':
      res.innerHTML = `
<div style="display:flex; gap: 20px; align-items: flex-start; color:#CBD5E1; margin: 4px 0;">
  <pre style="color:#38BDF8; font-weight:700; line-height:1.2; margin:0;">
    /\\_/\\    
   ( o.o )   
    > ^ <    
  </pre>
  <div>
    <div style="color:#34D399; font-weight:700; margin-bottom:4px;">adarsh@adarsh-os</div>
    <div style="color:#64748B; margin-bottom:6px;">-----------------------</div>
    <div><span class="t-cyan">OS:</span> Adarsh-OS v2.4 (x86_64 Linux)</div>
    <div><span class="t-cyan">Host:</span> REVA University — Dept. of CSE</div>
    <div><span class="t-cyan">Standing:</span> 2nd-Year B.Tech Computer Science</div>
    <div><span class="t-cyan">Kernel:</span> 6.8.0-sys-bangalore</div>
    <div><span class="t-cyan">Uptime:</span> 2 years (Continuous Learning)</div>
    <div><span class="t-cyan">Shell:</span> bash 5.2.15</div>
    <div><span class="t-cyan">Languages:</span> C, C++, Java, Python, JavaScript</div>
    <div><span class="t-cyan">Philosophy:</span> <span style="color:#FBBF24;">"Talk is cheap. Show me the code."</span></div>
  </div>
</div>`;
      break;

    case 'ls':
    case 'dir':
      res.innerHTML = `
<div style="display:flex; flex-wrap:wrap; gap: 10px; margin: 4px 0;">
  <span class="t-cmd">about.md</span>
  <span class="t-cmd">skills.json</span>
  <span class="t-cmd">projects.txt</span>
  <span class="t-cmd">certs.txt</span>
  <span class="t-cmd">contact.txt</span>
  <span class="t-cmd" style="color:#FCA5A5; border-color:rgba(239,68,68,0.3); background:rgba(239,68,68,0.08);">secret.key</span>
</div>`;
      break;

    case 'cat':
      if (!args[0]) {
        res.innerHTML = `<div class="t-res-error">cat: missing file operand. Try 'cat about.md' or 'ls'</div>`;
      } else {
        const fileName = args[0].toLowerCase();
        if (VIRTUAL_FILES[fileName]) {
          res.innerHTML = `<div class="t-res-card"><pre style="color:#E2E8F0; margin:0; white-space:pre-wrap; line-height:1.5;">${escapeHtml(VIRTUAL_FILES[fileName])}</pre></div>`;
        } else {
          res.innerHTML = `<div class="t-res-error">cat: ${escapeHtml(args[0])}: No such file or directory</div>`;
        }
      }
      break;

    case 'projects':
      res.innerHTML = `
<div class="t-res-card" style="line-height:1.6;">
  <div style="margin-bottom:8px;">
    <span class="t-cmd">1. 2D Graphics Editor (C)</span><br>
    <span class="t-dim">Primitive rasterization, geometry manipulation, binary serialization.</span><br>
    <a href="https://github.com/adarshGadagin/2d-graphics-editor" target="_blank" rel="noopener noreferrer" style="color:#34D399; text-decoration:underline;">→ https://github.com/adarshGadagin/2d-graphics-editor</a>
  </div>
  <div>
    <span class="t-cmd">2. Smart Door Access System (C++ / ESP32)</span><br>
    <span class="t-dim">RFID 13.56 MHz UID authentication, optocoupled 12V relay, fail-safe lock.</span>
  </div>
</div>`;
      break;

    case 'skills':
      res.innerHTML = `
<div class="t-res-card" style="line-height:1.7;">
  <div>C Systems      [<span style="color:#34D399;">████████████████░░░░</span>] 80%</div>
  <div>C++ / DSA      [<span style="color:#34D399;">██████████████░░░░░░</span>] 75%</div>
  <div>Python Data    [<span style="color:#38BDF8;">██████████████░░░░░░</span>] 75%</div>
  <div>Java OOP       [<span style="color:#A78BFA;">████████████░░░░░░░░</span>] 65%</div>
  <div>Web Frontend   [<span style="color:#34D399;">████████████████░░░░</span>] 80%</div>
  <div>Embedded / IoT [<span style="color:#FBBF24;">█████████████░░░░░░░</span>] 70%</div>
</div>`;
      break;

    case 'whoami':
      res.innerHTML = `
<div class="t-res-success">
  <span style="color:#38BDF8; font-weight:700;">@</span>
  <span><strong>adarsh</strong> — 2nd-Year B.Tech CSE, REVA University Bangalore</span>
</div>`;
      break;

    case 'date':
      res.innerHTML = `
<div class="t-res-success">
  <span style="color:#38BDF8; font-weight:700;">⏱</span>
  <span>${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</span>
</div>`;
      break;

    case 'echo':
      res.innerHTML = `<div class="t-res-info">${escapeHtml(args.join(' '))}</div>`;
      break;

    case 'quote':
      res.innerHTML = `
<div class="t-res-card" style="border-left: 3px solid #818CF8;">
  <div style="color:#F8FAFC; font-style:italic;">"Talk is cheap. Show me the code."</div>
  <div style="color:#818CF8; font-size:0.75rem; margin-top:3px;">— Linus Torvalds</div>
</div>`;
      break;

    case 'theme':
      cycleTheme();
      res.innerHTML = `
<div class="t-res-success">
  <span style="color:#34D399; font-weight:700;">✓ [OK]</span>
  <span>Portfolio visual theme toggled successfully.</span>
</div>`;
      break;

    case 'matrix':
      res.innerHTML = `
<div class="t-res-card" style="border-left: 3px solid #10B981; font-family:monospace; line-height:1.3; color:#10B981;">
  01000001 01100100 01100001 01110010 01110011 01101000 00100000<br>
  01000111 01100001 01100100 01100001 01100111 01101001 01101110<br>
  <span style="color:#34D399; font-weight:600;">[SYSTEM]: MATRIX CONSTRUCT INITIALIZED // ACCESS_OVERRIDE_ENABLED</span>
</div>`;
      break;

    case 'clear':
    case 'cls':
      output.innerHTML = '';
      return;

    case 'sudo':
      res.innerHTML = `
<div class="t-res-error">
  <span style="font-weight:700;">[AUTH ERROR]</span>
  <span>User 'visitor' is not in sudoers file. Incident reported to Santa Claus 🎅</span>
</div>`;
      break;

    case 'exit':
    case 'quit':
      closeEasterEgg();
      return;

    default:
      res.innerHTML = `
<div class="t-res-error">
  <span>command not found: <code>${escapeHtml(command)}</code>. Type <kbd class="t-cmd" style="font-size:0.7rem; padding:0 5px;">help</kbd> for commands.</span>
</div>`;
      break;
  }

  output.appendChild(res);
}

function handleTabCompletion(input) {
  const val = input.value;
  const words = val.split(' ');
  const availableCommands = [
    'help', 'neofetch', 'ls', 'cat', 'projects', 'skills',
    'whoami', 'date', 'matrix', 'quote', 'theme', 'clear', 'sudo', 'exit'
  ];
  const fileNames = Object.keys(VIRTUAL_FILES);

  if (words.length === 1) {
    const match = availableCommands.find((c) => c.startsWith(words[0].toLowerCase()));
    if (match) input.value = match + ' ';
  } else if (words.length === 2 && words[0].toLowerCase() === 'cat') {
    const match = fileNames.find((f) => f.startsWith(words[1].toLowerCase()));
    if (match) input.value = `cat ${match}`;
  }
}

function scrollTerminalToBottom(body) {
  if (body) {
    body.scrollTop = body.scrollHeight;
  }
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function initKonami() {
  let konamiIndex = 0;
  const modalOverlay = document.getElementById('konami-modal');
  const closeBtn = document.getElementById('konami-close-btn');

  window.addEventListener('keydown', (e) => {
    const activeEl = document.activeElement;
    if (
      activeEl &&
      (activeEl.tagName === 'INPUT' ||
        activeEl.tagName === 'TEXTAREA' ||
        activeEl.isContentEditable)
    ) {
      return;
    }

    const key = normalizeKey(e.key);
    const expectedKey = KONAMI_SEQUENCE[konamiIndex];

    if (key === expectedKey) {
      konamiIndex++;
      if (konamiIndex === KONAMI_SEQUENCE.length) {
        openEasterEgg();
        konamiIndex = 0;
      }
    } else {
      if (key === KONAMI_SEQUENCE[0]) {
        konamiIndex = 1;
      } else {
        konamiIndex = 0;
      }
    }
  });

  closeBtn?.addEventListener('click', closeEasterEgg);
  modalOverlay?.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeEasterEgg();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay?.classList.contains('active')) {
      closeEasterEgg();
    }
  });
}
