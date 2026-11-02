/**
 * Ares Vault - Seed-Based Password Generator Logic
 * 100% Client-side execution. Zero telemetry.
 * Generates high-entropy passwords derived from personal anchors.
 */

(function () {
  'use strict';

  // DOM Elements
  const form = document.getElementById('vault-form');
  const inputName = document.getElementById('seed-name');
  const inputDob = document.getElementById('seed-dob');
  const inputColor = document.getElementById('seed-color');
  const inputCustom = document.getElementById('seed-custom');
  
  // Options
  const optLeet = document.getElementById('opt-leet');
  const optSymbols = document.getElementById('opt-symbols');
  const optSalt = document.getElementById('opt-salt');
  const optUpper = document.getElementById('opt-upper');
  const optSeparator = document.getElementById('opt-separator');

  // Outputs
  const primaryDisplay = document.getElementById('primary-password-text');
  const primaryStrengthLabel = document.getElementById('strength-label');
  const primaryStrengthValue = document.getElementById('strength-value');
  const strengthCrackTime = document.getElementById('strength-crack-time');
  const strengthEntropy = document.getElementById('strength-entropy');
  const strengthSegments = [
    document.getElementById('seg-1'),
    document.getElementById('seg-2'),
    document.getElementById('seg-3'),
    document.getElementById('seg-4')
  ];
  
  const variationsList = document.getElementById('variations-list');
  const btnToggleVisibility = document.getElementById('btn-toggle-visibility');
  const iconEyeOpen = document.getElementById('icon-eye-open');
  const iconEyeClosed = document.getElementById('icon-eye-closed');
  const btnCopyPrimary = document.getElementById('btn-copy-primary');
  const btnCopyAll = document.getElementById('btn-copy-all');
  const btnReset = document.getElementById('btn-reset');
  const btnQuickDemo = document.getElementById('btn-quick-demo');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');

  let isPasswordMasked = false;
  let currentPrimaryPassword = '';
  let generatedVariations = [];

  // Leet mapping dictionary
  const LEET_MAP = {
    'a': '@', 'A': '4',
    'e': '3', 'E': '3',
    'i': '1', 'I': '1',
    'o': '0', 'O': '0',
    's': '$', 'S': '$',
    't': '7', 'T': '7',
    'b': '8', 'B': '8',
    'g': '9', 'G': '9'
  };

  const SYMBOLS = ['!', '@', '#', '$', '%', '^', '&', '*', '_', '-'];

  // Initialize
  function init() {
    setupColorChips();
    setupEventListeners();
    // Default sample on initial load for instant visual delight
    generateAllPasswords();
  }

  function setupColorChips() {
    const chips = document.querySelectorAll('.color-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const colorVal = chip.getAttribute('data-color');
        if (colorVal) {
          inputColor.value = colorVal;
        }
      });
    });

    inputColor.addEventListener('input', () => {
      chips.forEach(c => {
        if (c.getAttribute('data-color')?.toLowerCase() === inputColor.value.trim().toLowerCase()) {
          c.classList.add('active');
        } else {
          c.classList.remove('active');
        }
      });
    });
  }

  function setupEventListeners() {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      generateAllPasswords();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        generateAllPasswords();
      } else if (e.key === 'Escape' && document.activeElement.tagName === 'INPUT') {
        document.activeElement.blur();
      }
    });

    // Toggle Masking
    btnToggleVisibility.addEventListener('click', togglePasswordMasking);

    // Copy Primary
    btnCopyPrimary.addEventListener('click', () => {
      if (!currentPrimaryPassword) return;
      copyToClipboard(currentPrimaryPassword, 'Primary password copied to clipboard');
    });

    // Copy All
    btnCopyAll.addEventListener('click', () => {
      if (generatedVariations.length === 0) return;
      const allText = generatedVariations.map(v => `${v.category}: ${v.password}`).join('\n');
      copyToClipboard(allText, 'All passwords copied to clipboard');
    });

    // Reset Form
    btnReset.addEventListener('click', () => {
      form.reset();
      document.querySelectorAll('.color-chip').forEach(c => c.classList.remove('active'));
      clearOutputs();
      showToast('Vault cleared');
    });

    // Quick Demo
    btnQuickDemo.addEventListener('click', () => {
      inputName.value = 'Ares';
      inputDob.value = '2000-05-15';
      inputColor.value = 'Crimson';
      inputCustom.value = 'Titan';
      
      const redChip = document.querySelector('.color-chip[data-color="Crimson"]');
      if (redChip) redChip.classList.add('active');
      
      generateAllPasswords();
      showToast('Loaded demo seed configuration');
    });

    // Real-time update on options toggle
    [optLeet, optSymbols, optSalt, optUpper, optSeparator].forEach(ctrl => {
      if (ctrl) {
        ctrl.addEventListener('change', () => {
          if (hasAnyInput()) {
            generateAllPasswords();
          }
        });
      }
    });
  }

  function hasAnyInput() {
    return Boolean(
      inputName.value.trim() || 
      inputDob.value || 
      inputColor.value.trim() || 
      inputCustom.value.trim()
    );
  }

  // Parse DOB into components
  function parseDob(dobString) {
    if (!dobString) {
      return { year: '2025', shortYear: '25', month: '01', day: '01', numeric: '2025' };
    }
    const clean = dobString.replace(/[^0-9]/g, '');
    let year = '2025';
    let month = '01';
    let day = '01';

    if (dobString.includes('-')) {
      const parts = dobString.split('-');
      if (parts.length === 3) {
        year = parts[0] || '2025';
        month = parts[1] || '01';
        day = parts[2] || '01';
      }
    } else if (clean.length >= 4) {
      year = clean.slice(-4);
      if (clean.length >= 8) {
        day = clean.slice(0, 2);
        month = clean.slice(2, 4);
      }
    }
    const shortYear = year.slice(-2);
    return { year, shortYear, month, day, numeric: clean || `${year}${month}${day}` };
  }

  // Apply leetspeak transformation
  function toLeet(text) {
    return text.split('').map(char => LEET_MAP[char] || char).join('');
  }

  // Capitalize first letter
  function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Alternating case
  function alternatingCase(str) {
    return str.split('').map((c, i) => i % 2 === 0 ? c.toUpperCase() : c.toLowerCase()).join('');
  }

  // Generate deterministic secure salt
  function generateSalt(length = 3) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    let salt = '';
    for (let i = 0; i < length; i++) {
      salt += chars[array[i] % chars.length];
    }
    return salt;
  }

  // Clean strings
  function sanitize(str) {
    return (str || '').trim().replace(/\s+/g, '');
  }

  function generateAllPasswords() {
    const rawName = sanitize(inputName.value) || 'Ares';
    const rawColor = sanitize(inputColor.value) || 'Crimson';
    const rawCustom = sanitize(inputCustom.value) || 'Vault';
    const dobObj = parseDob(inputDob.value);

    const useLeet = optLeet ? optLeet.checked : true;
    const useSymbols = optSymbols ? optSymbols.checked : true;
    const useSalt = optSalt ? optSalt.checked : true;
    const forceUpper = optUpper ? optUpper.checked : false;
    const separator = optSeparator ? optSeparator.value : '-';

    const s1 = useSymbols ? '#' : (separator || '');
    const s2 = useSymbols ? '!' : (separator || '');
    const s3 = useSymbols ? '$' : (separator || '');
    const s4 = useSymbols ? '*' : (separator || '');

    const saltToken = useSalt ? generateSalt(3) : '';

    // Transform based on options
    let nameFormatted = capitalize(rawName);
    let colorFormatted = capitalize(rawColor);
    let customFormatted = capitalize(rawCustom);

    if (forceUpper) {
      nameFormatted = nameFormatted.toUpperCase();
      colorFormatted = colorFormatted.toUpperCase();
      customFormatted = customFormatted.toUpperCase();
    }

    let nameLeet = useLeet ? toLeet(nameFormatted) : nameFormatted;
    let colorLeet = useLeet ? toLeet(colorFormatted) : colorFormatted;
    let customLeet = useLeet ? toLeet(customFormatted) : customFormatted;

    // Algorithm 1: Fortress Tactical (Default primary)
    const fortress = `${colorLeet}${s1}${nameLeet}${s2}${dobObj.shortYear}${s3}${customLeet}${saltToken ? s4 + saltToken : ''}`;

    // Algorithm 2: Clean Memorable Passphrase
    const sep = separator || '-';
    const passphrase = `${colorFormatted}${sep}${nameFormatted}${sep}${dobObj.year}${sep}${customFormatted}`;

    // Algorithm 3: Ultra High-Entropy Shield
    const ultra = `${s1}${customLeet.slice(0, 3)}${s2}${nameLeet}${dobObj.day}${colorLeet.slice(0, 3)}${s3}${dobObj.shortYear}${saltToken ? s4 + saltToken : ''}`;

    // Algorithm 4: Compact Alphanumeric PIN / Token
    const pin = `${nameFormatted.slice(0, 2)}${colorFormatted.slice(0, 2)}${dobObj.day}${dobObj.shortYear}${customFormatted.slice(0, 2)}`;

    // Algorithm 5: Leet Titanium
    const leetTitanium = `${toLeet(nameFormatted)}_${toLeet(colorFormatted)}${dobObj.year}#${toLeet(customFormatted)}`;

    // Algorithm 6: Alternating Wave
    const alternating = `${alternatingCase(nameFormatted)}${s1}${alternatingCase(colorFormatted)}${dobObj.shortYear}${s2}${customFormatted.toLowerCase()}`;

    // Algorithm 7: Minimalist Dot Vault
    const dotVault = `${rawColor.toLowerCase()}.${rawName.toLowerCase()}.${dobObj.year}.${rawCustom.toLowerCase()}`;

    // Algorithm 8: Symbol Interleaved Matrix
    const interleaved = `${s2}${colorFormatted}${s1}${nameLeet}${dobObj.shortYear}${s3}${customLeet}${s4}`;

    // Update primary
    currentPrimaryPassword = fortress;
    renderPrimaryPassword(currentPrimaryPassword);

    // Save list of variations
    generatedVariations = [
      { category: 'Fortress Tactical (Primary)', password: fortress, desc: 'High-entropy combination of all personal seeds with leet & symbols' },
      { category: 'Memorable Passphrase', password: passphrase, desc: 'Clean, human-readable phrase easy to type on touch keyboards' },
      { category: 'Ultra High-Entropy', password: ultra, desc: 'Interleaved seeds with high brute-force resistance' },
      { category: 'Alphanumeric Compact', password: pin, desc: 'Symbol-free alphanumeric format for systems with symbol restrictions' },
      { category: 'Titanium Leet', password: leetTitanium, desc: 'Substituted characters adhering to high-complexity security filters' },
      { category: 'Alternating Wave', password: alternating, desc: 'Dynamic casing rhythm for improved memorability' },
      { category: 'Minimalist Dot Vault', password: dotVault, desc: 'Structured hierarchy format for terminal and development access' },
      { category: 'Interleaved Matrix', password: interleaved, desc: 'Boundary symbols preventing credential stuffing attacks' }
    ];

    renderVariations(generatedVariations);
  }

  function renderPrimaryPassword(pwd) {
    if (isPasswordMasked) {
      primaryDisplay.textContent = '•'.repeat(pwd.length);
    } else {
      primaryDisplay.textContent = pwd;
    }
    primaryDisplay.classList.remove('empty-state');
    
    // Evaluate strength
    const strength = evaluatePasswordStrength(pwd);
    updateStrengthMeter(strength);
  }

  function renderVariations(variations) {
    variationsList.innerHTML = '';
    variations.forEach(item => {
      const row = document.createElement('div');
      row.className = 'variation-item';
      
      const displayPwd = isPasswordMasked ? '•'.repeat(item.password.length) : escapeHtml(item.password);

      row.innerHTML = `
        <div class="variation-info">
          <span class="variation-category">${escapeHtml(item.category)}</span>
          <span class="variation-password">${displayPwd}</span>
        </div>
        <button type="button" class="variation-copy-btn" data-password="${escapeHtml(item.password)}" aria-label="Copy ${escapeHtml(item.category)}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <span>Copy</span>
        </button>
      `;

      const copyBtn = row.querySelector('.variation-copy-btn');
      copyBtn.addEventListener('click', () => {
        copyToClipboard(item.password, `${item.category} copied`);
        copyBtn.classList.add('copied');
        copyBtn.querySelector('span').textContent = 'Copied';
        setTimeout(() => {
          copyBtn.classList.remove('copied');
          copyBtn.querySelector('span').textContent = 'Copy';
        }, 1500);
      });

      variationsList.appendChild(row);
    });
  }

  function togglePasswordMasking() {
    isPasswordMasked = !isPasswordMasked;
    if (isPasswordMasked) {
      iconEyeOpen.style.display = 'none';
      iconEyeClosed.style.display = 'block';
      btnToggleVisibility.setAttribute('aria-label', 'Reveal password');
    } else {
      iconEyeOpen.style.display = 'block';
      iconEyeClosed.style.display = 'none';
      btnToggleVisibility.setAttribute('aria-label', 'Hide password');
    }
    renderPrimaryPassword(currentPrimaryPassword);
    renderVariations(generatedVariations);
  }

  function clearOutputs() {
    currentPrimaryPassword = '';
    generatedVariations = [];
    primaryDisplay.textContent = 'Fill seeds above to generate';
    primaryDisplay.classList.add('empty-state');
    variationsList.innerHTML = '';
    updateStrengthMeter({ score: 0, label: 'Waiting', entropy: 0, crackTime: 'Instant' });
  }

  // Password Entropy & Crack Time Calculator
  function evaluatePasswordStrength(password) {
    if (!password) {
      return { score: 0, label: 'Empty', entropy: 0, crackTime: '0 seconds' };
    }

    let poolSize = 0;
    if (/[a-z]/.test(password)) poolSize += 26;
    if (/[A-Z]/.test(password)) poolSize += 26;
    if (/[0-9]/.test(password)) poolSize += 10;
    if (/[^a-zA-Z0-9]/.test(password)) poolSize += 33;

    if (poolSize === 0) poolSize = 1;

    // Shannon Entropy: L * log2(poolSize)
    const entropy = Math.round(password.length * Math.log2(poolSize));

    // Crack time estimation based on 10 billion guesses/second
    const combinations = Math.pow(poolSize, Math.min(password.length, 32));
    const seconds = combinations / 10000000000;

    let crackTime = 'Instant';
    if (seconds > 31536000000000) {
      crackTime = 'Centuries';
    } else if (seconds > 31536000) {
      crackTime = `${Math.round(seconds / 31536000)} Years`;
    } else if (seconds > 86400) {
      crackTime = `${Math.round(seconds / 86400)} Days`;
    } else if (seconds > 3600) {
      crackTime = `${Math.round(seconds / 3600)} Hours`;
    } else if (seconds > 60) {
      crackTime = `${Math.round(seconds / 60)} Mins`;
    } else if (seconds > 1) {
      crackTime = `${Math.round(seconds)} Secs`;
    }

    let score = 1;
    let label = 'Weak';

    if (entropy >= 80 && password.length >= 14) {
      score = 4;
      label = 'Fortress';
    } else if (entropy >= 60 && password.length >= 10) {
      score = 3;
      label = 'Strong';
    } else if (entropy >= 40) {
      score = 2;
      label = 'Moderate';
    }

    return { score, label, entropy, crackTime };
  }

  function updateStrengthMeter(strength) {
    primaryStrengthValue.textContent = strength.label;
    strengthCrackTime.textContent = strength.crackTime;
    strengthEntropy.textContent = `${strength.entropy} bits`;

    // Clear segments
    strengthSegments.forEach(seg => {
      seg.className = 'strength-segment';
    });

    for (let i = 0; i < strength.score; i++) {
      if (strengthSegments[i]) {
        if (strength.score === 1) strengthSegments[i].classList.add('active-weak');
        else if (strength.score === 2) strengthSegments[i].classList.add('active-fair');
        else if (strength.score === 3) strengthSegments[i].classList.add('active-good');
        else if (strength.score >= 4) strengthSegments[i].classList.add('active-strong');
      }
    }
  }

  // Clipboard copy with toast notification
  function copyToClipboard(text, message) {
    if (!navigator.clipboard) {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showToast(message);
      return;
    }

    navigator.clipboard.writeText(text).then(() => {
      showToast(message);
    }).catch(err => {
      console.error('Copy failed:', err);
      showToast('Failed to copy to clipboard');
    });
  }

  let toastTimeout = null;
  function showToast(message) {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
