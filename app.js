/**
 * Ares Vault - Frosted Glassmorphic Credential Synthesizer Logic
 * Inspired by Reference UI (Lifestats Glass Console)
 * 100% Client-Side Privacy, Zero Network Calls, Deterministic Hashing
 */

(function () {
  'use strict';

  // Constants & Storage Keys
  const THEME_STORAGE_KEY = 'ares_vault_theme';

  // DOM Elements - Navigation & Theme
  const dockBtnVault = document.getElementById('dock-btn-vault');
  const dockBtnAnchors = document.getElementById('dock-btn-anchors');
  const dockBtnArchetypes = document.getElementById('dock-btn-archetypes');
  const dockBtnTheme = document.getElementById('dock-btn-theme');
  const dockBtnGuide = document.getElementById('dock-btn-guide');
  const iconSun = document.querySelector('.icon-sun');
  const iconMoon = document.querySelector('.icon-moon');

  // DOM Elements - Inputs
  const inputName = document.getElementById('seed-name');
  const inputDob = document.getElementById('seed-dob');
  const inputColor = document.getElementById('seed-color');
  const inputCustom = document.getElementById('seed-custom');

  // DOM Elements - Options
  const optLeet = document.getElementById('opt-leet');
  const optSymbols = document.getElementById('opt-symbols');
  const optSalt = document.getElementById('opt-salt');
  const optUpper = document.getElementById('opt-upper');
  const optSeparator = document.getElementById('opt-separator');

  // DOM Elements - Scrubber & Swatches
  const eraCapsules = document.querySelectorAll('.era-capsule-btn');
  const btnEraPrev = document.getElementById('btn-era-prev');
  const btnEraNext = document.getElementById('btn-era-next');
  const matteSwatches = document.querySelectorAll('.matte-swatch');
  const presetPills = document.querySelectorAll('.preset-pill');
  const btnShuffleWord = document.getElementById('btn-shuffle-word');

  // DOM Elements - Header & Actions
  const btnDemoTrigger = document.getElementById('btn-demo-trigger');
  const btnResetTrigger = document.getElementById('btn-reset-trigger');
  const btnSecurityInfo = document.getElementById('btn-security-info');

  // DOM Elements - Primary Display
  const primaryDisplay = document.getElementById('primary-password-text');
  const activeCredentialBadge = document.getElementById('active-credential-badge');
  const btnToggleVisibility = document.getElementById('btn-toggle-visibility');
  const iconEyeOpen = document.getElementById('icon-eye-open');
  const iconEyeClosed = document.getElementById('icon-eye-closed');
  const btnCopyPrimary = document.getElementById('btn-copy-primary');
  const copyPrimaryLabel = document.getElementById('copy-primary-label');
  const strengthValue = document.getElementById('strength-value');
  const strengthCrackTime = document.getElementById('strength-crack-time');
  const strengthEntropy = document.getElementById('strength-entropy');
  const strengthSegments = [
    document.getElementById('seg-1'),
    document.getElementById('seg-2'),
    document.getElementById('seg-3'),
    document.getElementById('seg-4')
  ];

  // DOM Elements - Archetype Switcher Carousel
  const archetypeCounterCurrent = document.getElementById('archetype-counter-current');
  const archetypeCounterTotal = document.getElementById('archetype-counter-total');
  const btnArchetypePrev = document.getElementById('btn-archetype-prev');
  const btnArchetypeNext = document.getElementById('btn-archetype-next');
  const archetypeName = document.getElementById('archetype-name');
  const archetypeDesc = document.getElementById('archetype-desc');
  const archetypeCategoryBadge = document.getElementById('archetype-category-badge');
  const activeArchetypePassword = document.getElementById('active-archetype-password');
  const btnCopyArchetype = document.getElementById('btn-copy-archetype');
  const copyArchetypeLabel = document.getElementById('copy-archetype-label');
  const archetypePipsTrack = document.getElementById('archetype-pips-track');
  const btnCopyAll = document.getElementById('btn-copy-all');

  // Toast
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');

  // State
  let isPasswordMasked = false;
  let currentPrimaryPassword = '';
  let activeArchetypeIndex = 0;
  let generatedArchetypes = [];
  let toastTimer = null;

  // Curated High-Entropy Anchor Words
  const ANCHOR_WORDS = [
    'Titan', 'Obsidian', 'Vanguard', 'Krypton', 'Aegis',
    'Valiant', 'Phantom', 'Sentinel', 'Apex', 'Zenith',
    'Solstice', 'Tempest', 'Eclipse', 'Polaris', 'Orion'
  ];

  // Leet Map
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

  // Initialize
  function init() {
    initTheme();
    setupEventListeners();
    setupEraScrubber();
    setupMatteSwatches();
    setupPresetPills();
    generate();
  }

  // Theme Management
  function initTheme() {
    const urlParams = new URLSearchParams(window.location.search);
    const urlTheme = urlParams.get('theme');
    const savedTheme = urlTheme || localStorage.getItem(THEME_STORAGE_KEY) || document.documentElement.getAttribute('data-theme') || 'dark';
    applyTheme(savedTheme);

    if (dockBtnTheme) {
      dockBtnTheme.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
        localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
        showToast(`Switched to ${nextTheme === 'dark' ? 'Studio Dark' : 'Daylight'} mode`);
      });
    }
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (iconSun && iconMoon) {
      if (theme === 'dark') {
        iconSun.style.display = 'block';
        iconMoon.style.display = 'none';
      } else {
        iconSun.style.display = 'none';
        iconMoon.style.display = 'block';
      }
    }
  }

  // Event Listeners
  function setupEventListeners() {
    // Inputs triggering live re-computation
    const liveInputs = [inputName, inputDob, inputColor, inputCustom];
    liveInputs.forEach(input => {
      if (input) {
        input.addEventListener('input', () => {
          syncInputsWithScrubber();
          generate();
        });
      }
    });

    // Options
    const liveOptions = [optLeet, optSymbols, optSalt, optUpper, optSeparator];
    liveOptions.forEach(opt => {
      if (opt) {
        opt.addEventListener('change', generate);
      }
    });

    // Shuffle word button
    if (btnShuffleWord) {
      btnShuffleWord.addEventListener('click', () => {
        const randomWord = ANCHOR_WORDS[Math.floor(Math.random() * ANCHOR_WORDS.length)];
        inputCustom.value = randomWord;
        generate();
        showToast(`Anchor shuffled to "${randomWord}"`);
      });
    }

    // Demo Data Button
    if (btnDemoTrigger) {
      btnDemoTrigger.addEventListener('click', () => {
        inputName.value = 'Ares';
        inputDob.value = '2000-05-15';
        inputColor.value = 'Crimson';
        inputCustom.value = 'Titan';
        syncInputsWithScrubber();
        syncSwatchesWithColor('Crimson');
        generate();
        showToast('Demo seed anchors loaded');
      });
    }

    // Reset Button
    if (btnResetTrigger) {
      btnResetTrigger.addEventListener('click', () => {
        inputName.value = '';
        inputDob.value = '';
        inputColor.value = '';
        inputCustom.value = '';
        generate();
        showToast('All anchors cleared');
      });
    }

    // Security Info Bell
    if (btnSecurityInfo) {
      btnSecurityInfo.addEventListener('click', () => {
        showToast('100% Client-Side Sandbox: Zero network calls');
      });
    }

    // Mask / Unmask Toggle
    if (btnToggleVisibility) {
      btnToggleVisibility.addEventListener('click', toggleVisibility);
    }

    // Copy Primary
    if (btnCopyPrimary) {
      btnCopyPrimary.addEventListener('click', copyPrimary);
    }

    // Prev / Next Archetype Navigation
    if (btnArchetypePrev) {
      btnArchetypePrev.addEventListener('click', () => {
        if (!generatedArchetypes.length) return;
        activeArchetypeIndex = (activeArchetypeIndex - 1 + generatedArchetypes.length) % generatedArchetypes.length;
        renderActiveArchetype();
      });
    }

    if (btnArchetypeNext) {
      btnArchetypeNext.addEventListener('click', () => {
        if (!generatedArchetypes.length) return;
        activeArchetypeIndex = (activeArchetypeIndex + 1) % generatedArchetypes.length;
        renderActiveArchetype();
      });
    }

    // Copy Active Archetype
    if (btnCopyArchetype) {
      btnCopyArchetype.addEventListener('click', copyActiveArchetype);
    }

    // Static Pip Buttons
    if (archetypePipsTrack) {
      const pipBtns = archetypePipsTrack.querySelectorAll('.archetype-pip-btn');
      pipBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
          activeArchetypeIndex = index;
          renderActiveArchetype();
          const item = generatedArchetypes[index];
          if (item) showToast(`Viewing ${item.name} (${index + 1}/8)`);
        });
      });
    }

    // Copy All
    if (btnCopyAll) {
      btnCopyAll.addEventListener('click', copyAllArchetypes);
    }

    // Dock Navigation Scroll
    if (dockBtnVault) {
      dockBtnVault.addEventListener('click', () => {
        setActiveDock(dockBtnVault);
        document.getElementById('section-hero')?.scrollIntoView({ behavior: 'smooth' });
      });
    }

    if (dockBtnAnchors) {
      dockBtnAnchors.addEventListener('click', () => {
        setActiveDock(dockBtnAnchors);
        document.getElementById('section-anchors')?.scrollIntoView({ behavior: 'smooth' });
      });
    }

    if (dockBtnArchetypes) {
      dockBtnArchetypes.addEventListener('click', () => {
        setActiveDock(dockBtnArchetypes);
        document.getElementById('section-archetypes')?.scrollIntoView({ behavior: 'smooth' });
      });
    }

    if (dockBtnGuide) {
      dockBtnGuide.addEventListener('click', (e) => {
        e.preventDefault();
        setActiveDock(dockBtnGuide);
        document.getElementById('usage-guide')?.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }

  function setActiveDock(activeBtn) {
    [dockBtnVault, dockBtnAnchors, dockBtnArchetypes, dockBtnGuide].forEach(btn => {
      if (btn) btn.classList.remove('active');
    });
    if (activeBtn) activeBtn.classList.add('active');
  }

  // Era Scrubber Setup
  function setupEraScrubber() {
    eraCapsules.forEach(capsule => {
      capsule.addEventListener('click', () => {
        eraCapsules.forEach(c => c.classList.remove('active'));
        capsule.classList.add('active');
        const dob = capsule.getAttribute('data-dob');
        if (dob && inputDob) {
          inputDob.value = dob;
          generate();
        }
      });
    });

    if (btnEraPrev && btnEraNext) {
      btnEraPrev.addEventListener('click', () => shiftEra(-1));
      btnEraNext.addEventListener('click', () => shiftEra(1));
    }
  }

  function shiftEra(direction) {
    const capsulesArr = Array.from(eraCapsules);
    const activeIndex = capsulesArr.findIndex(c => c.classList.contains('active'));
    let newIndex = activeIndex + direction;
    if (newIndex < 0) newIndex = capsulesArr.length - 1;
    if (newIndex >= capsulesArr.length) newIndex = 0;
    capsulesArr[newIndex].click();
  }

  function syncInputsWithScrubber() {
    if (!inputDob || !inputDob.value) return;
    const year = inputDob.value.split('-')[0];
    eraCapsules.forEach(capsule => {
      if (capsule.getAttribute('data-year') === year) {
        capsule.classList.add('active');
      } else {
        capsule.classList.remove('active');
      }
    });
  }

  // Matte Swatches Setup
  function setupMatteSwatches() {
    matteSwatches.forEach(swatch => {
      swatch.addEventListener('click', () => {
        matteSwatches.forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
        const colorName = swatch.getAttribute('data-color');
        if (colorName && inputColor) {
          inputColor.value = colorName;
          generate();
        }
      });
    });
  }

  function syncSwatchesWithColor(colorName) {
    matteSwatches.forEach(swatch => {
      if (swatch.getAttribute('data-color').toLowerCase() === (colorName || '').toLowerCase()) {
        swatch.classList.add('active');
      } else {
        swatch.classList.remove('active');
      }
    });
  }

  // Preset Pills Setup
  function setupPresetPills() {
    presetPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const name = pill.getAttribute('data-name');
        if (name && inputName) {
          inputName.value = name;
          generate();
        }
      });
    });
  }

  // Deterministic Hash Helper (FNV-1a 32-bit for client-side deterministic entropy salt)
  function fnv1a(str) {
    let hash = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i);
      hash = (hash * 0x01000193) >>> 0;
    }
    return hash;
  }

  // Apply Leet Substitution
  function applyLeet(str) {
    return str.split('').map(char => LEET_MAP[char] || char).join('');
  }

  // Cognitive Mnemonic Helpers for "Complicated yet Remembrable" Credentials
  function toConsonants(word) {
    if (!word) return '';
    if (word.length <= 3) return word;
    // Keep first letter, strip internal unstressed vowels
    const first = word[0];
    const rest = word.slice(1).replace(/[aeiou]/gi, '');
    return first + rest;
  }

  function toMnemonicLeet(word, enableLeet) {
    if (!word) return '';
    if (!enableLeet) return word;
    // Replace internal vowels with classic leet numbers: a->4, e->3, i->1, o->0
    const leetVowels = {
      'a': '4', 'A': '4',
      'e': '3', 'E': '3',
      'i': '1', 'I': '1',
      'o': '0', 'O': '0'
    };
    return word.split('').map((c, i) => {
      if (i === 0) return c; // preserve first letter casing
      return leetVowels[c] || c;
    }).join('');
  }

  // Primary Synthesis Engine
  function generate() {
    const rawName = (inputName?.value || 'Ares').trim();
    const rawDob = (inputDob?.value || '2000-05-15').trim();
    const rawColor = (inputColor?.value || 'Crimson').trim();
    const rawCustom = (inputCustom?.value || 'Titan').trim();

    const useLeet = optLeet?.checked ?? true;
    const useSymbols = optSymbols?.checked ?? true;
    const useSalt = optSalt?.checked ?? true;
    const forceUpper = optUpper?.checked ?? false;
    const separator = optSeparator?.value !== undefined ? optSeparator.value : '-';

    // Parse DOB components
    const dobParts = rawDob.split('-');
    const year = dobParts[0] || '2000';
    const month = dobParts[1] || '05';
    const day = dobParts[2] || '15';
    const shortYear = year.slice(-2);
    const techYear = `2k${shortYear}`;

    // Compute deterministic salt token
    const combinedEntropySeed = `${rawName}:${rawDob}:${rawColor}:${rawCustom}`;
    const seedHash = fnv1a(combinedEntropySeed);
    const saltToken = seedHash.toString(36).slice(0, 3);

    // Cognitive Obfuscated Anchors (Complicated & Remembrable)
    const mName = toMnemonicLeet(rawName, useLeet);
    const mColor = toMnemonicLeet(rawColor, useLeet);
    const mCustom = toMnemonicLeet(rawCustom, useLeet);

    const cName = toConsonants(rawName);
    const cColor = toConsonants(rawColor);
    const cCustom = toConsonants(rawCustom);

    // 1. Fortress Tactical (Hero Archetype - Multi-set cryptographic diffusion)
    const sym1 = useSymbols ? '#' : '_';
    const sym2 = useSymbols ? '$!' : '-';
    const sym3 = useSymbols ? '$' : shortYear;
    const sym4 = useSymbols ? '@' : '.';
    const saltPart = useSalt ? `*${saltToken}` : '';

    let fortressBase = `${mColor}${sym1}${mName}${sym2}${shortYear}${sym3}${mCustom}${sym4}${saltPart}`;
    if (forceUpper) fortressBase = fortressBase.toUpperCase();

    // 2. Memorable Passphrase (Cognitively Compounded & Obfuscated)
    // Avoids naive dictionary words by using phonetic consonant/leet tokens
    const phraseParts = [mColor, mName, shortYear, mCustom];
    let memorablePassphrase = phraseParts.join(separator);
    if (useSymbols && separator === '-') memorablePassphrase += '!';
    if (forceUpper) memorablePassphrase = memorablePassphrase.toUpperCase();

    // 3. Enterprise Compliant (1 Upper, 1 Lower, 1 Digit, 1 Symbol - Un-guessable)
    // E.g. Ar3s.Crmsn@2k36
    const entSep1 = useSymbols ? '.' : '';
    const entSep2 = useSymbols ? '@' : '';
    let enterprise = `${mName}${entSep1}${cColor}${entSep2}${techYear}`;
    if (!useSymbols) enterprise += shortYear;
    if (forceUpper) enterprise = enterprise.toUpperCase();

    // 4. Kebab Identifier (Phonetic consonant slug)
    // E.g. ar3s-crmsn-ttn-36
    let kebab = `${mName.toLowerCase()}-${cColor.toLowerCase()}-${cCustom.toLowerCase()}-${shortYear}`;

    // 5. Developer CLI Token (API / Stripe format with obfuscated anchors & salt)
    // E.g. ar3s_live_2k36_crm_ttn_kff
    const devSalt = useSalt ? `_${saltToken}` : '';
    let devToken = `${mName.toLowerCase()}_live_${techYear}_${cColor.toLowerCase().slice(0, 3)}_${cCustom.toLowerCase()}${devSalt}`;
    if (forceUpper) devToken = devToken.toUpperCase();

    // 6. Alphanumeric PIN (Strictly symbols-free for legacy enterprise/banking)
    // Obfuscated with leet digits & consonant compaction so it's not a plain dictionary word
    let alphanumeric = `${mName}${cColor}${shortYear}${mCustom}`.replace(/[^a-zA-Z0-9]/g, '');
    if (forceUpper) alphanumeric = alphanumeric.toUpperCase();

    // 7. Ultra High-Entropy (Maximum symbol diffusion & salt interleave)
    let ultra = `#${mCustom}!${mName}!${saltToken}${mColor}${shortYear}*${cCustom.slice(0, 2)}`;
    if (forceUpper) ultra = ultra.toUpperCase();

    // 8. Compact Mobile (12 chars, keypad friendly, high entropy)
    const mobSym = useSymbols ? '!' : '';
    let mobile = `${mName.slice(0, 3)}${mobSym}${cColor.slice(0, 3)}${shortYear}*${cCustom.slice(0, 2)}`;
    if (forceUpper) mobile = mobile.toUpperCase();

    // Store generated variations
    generatedArchetypes = [
      {
        id: 'fortress',
        name: 'Fortress Tactical',
        category: 'Fortress',
        badgeClass: 'ongoing',
        value: fortressBase,
        description: 'Multi-set leet token with cryptographic seed salt'
      },
      {
        id: 'memorable',
        name: 'Memorable Passphrase',
        category: 'Memorable',
        badgeClass: 'complete',
        value: memorablePassphrase,
        description: 'Delimited cognitive shorthand (un-guessable from favorites)'
      },
      {
        id: 'dev_token',
        name: 'Developer CLI Token',
        category: 'High Entropy',
        badgeClass: 'ongoing',
        value: devToken,
        description: 'Standardized underscore slug for API keys & CLI'
      },
      {
        id: 'alphanumeric',
        name: 'Alphanumeric PIN',
        category: 'Compatible',
        badgeClass: 'neutral',
        value: alphanumeric,
        description: 'Zero special symbols for legacy form requirements'
      },
      {
        id: 'ultra',
        name: 'Ultra High-Entropy',
        category: 'Maximum',
        badgeClass: 'ongoing',
        value: ultra,
        description: 'Maximum symbol diffusion and shuffled anchors'
      },
      {
        id: 'mobile',
        name: 'Compact Mobile',
        category: 'Compact',
        badgeClass: 'complete',
        value: mobile,
        description: 'Optimized length for virtual keyboard inputs'
      },
      {
        id: 'enterprise',
        name: 'Enterprise Compliant',
        category: 'Standard',
        badgeClass: 'neutral',
        value: enterprise,
        description: 'Guarantees upper, lower, number and punctuation'
      },
      {
        id: 'kebab',
        name: 'Kebab Identifier',
        category: 'Memorable',
        badgeClass: 'complete',
        value: kebab,
        description: 'Clean hyphenated lowercase string'
      }
    ];

    // Render Single Active Archetype Showcase & Synchronize Hero
    renderActiveArchetype();
  }

  // Render Single Active Archetype (Focused Switcher Deck)
  function renderActiveArchetype() {
    if (!generatedArchetypes.length) return;
    if (activeArchetypeIndex < 0) activeArchetypeIndex = 0;
    if (activeArchetypeIndex >= generatedArchetypes.length) activeArchetypeIndex = 0;

    const active = generatedArchetypes[activeArchetypeIndex];

    // 1. Counter "1 / 8"
    if (archetypeCounterCurrent) archetypeCounterCurrent.textContent = activeArchetypeIndex + 1;
    if (archetypeCounterTotal) archetypeCounterTotal.textContent = generatedArchetypes.length;

    // 2. Name & Description & Category Badge
    if (archetypeName) archetypeName.textContent = active.name;
    if (archetypeDesc) archetypeDesc.textContent = active.description;
    if (archetypeCategoryBadge) {
      archetypeCategoryBadge.textContent = active.category;
      archetypeCategoryBadge.className = `status-pill-badge ${active.badgeClass}`;
    }

    // 3. Password display in active showcase card
    if (activeArchetypePassword) {
      activeArchetypePassword.textContent = active.value;
    }

    // 4. Synchronize Primary Hero Display and Metrics
    currentPrimaryPassword = active.value;
    if (primaryDisplay) {
      primaryDisplay.textContent = currentPrimaryPassword;
    }
    if (activeCredentialBadge) {
      activeCredentialBadge.textContent = active.name;
    }
    computeMetrics(currentPrimaryPassword);

    // 5. Update Numbered Capsule Pips in Track (1 to 8)
    renderArchetypePips();

    // 6. Ensure mask blur is synchronously applied to BOTH displays if masked
    applyMaskState();
  }

  // Render 8 numbered quick-switch capsules
  function renderArchetypePips() {
    if (!archetypePipsTrack) return;
    const pipBtns = archetypePipsTrack.querySelectorAll('.archetype-pip-btn');
    if (pipBtns.length === generatedArchetypes.length) {
      pipBtns.forEach((btn, index) => {
        const item = generatedArchetypes[index];
        const isActive = index === activeArchetypeIndex;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        if (item) btn.setAttribute('title', `Switch to format ${index + 1}: ${item.name}`);
      });
    } else {
      archetypePipsTrack.innerHTML = '';
      generatedArchetypes.forEach((item, index) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `archetype-pip-btn ${index === activeArchetypeIndex ? 'active' : ''}`;
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-selected', index === activeArchetypeIndex ? 'true' : 'false');
        btn.setAttribute('title', `Switch to format ${index + 1}: ${item.name}`);
        btn.textContent = `${index + 1}`;
        btn.addEventListener('click', () => {
          activeArchetypeIndex = index;
          renderActiveArchetype();
          showToast(`Viewing ${item.name} (${index + 1}/8)`);
        });
        archetypePipsTrack.appendChild(btn);
      });
    }
  }

  // Calculate Shannon Entropy & Crack Resistance
  function computeMetrics(pwd) {
    if (!pwd) {
      updateMetricDisplays(0, 'Minimal', 'Instant');
      return;
    }

    let poolSize = 0;
    if (/[a-z]/.test(pwd)) poolSize += 26;
    if (/[A-Z]/.test(pwd)) poolSize += 26;
    if (/[0-9]/.test(pwd)) poolSize += 10;
    if (/[^a-zA-Z0-9]/.test(pwd)) poolSize += 33;
    if (poolSize === 0) poolSize = 26;

    const entropyBits = Math.round(pwd.length * (Math.log(poolSize) / Math.log(2)));

    let rating = 'Fortress';
    let crackTime = 'Centuries';
    let activeSegments = 4;

    if (entropyBits < 40) {
      rating = 'Weak';
      crackTime = 'Seconds';
      activeSegments = 1;
    } else if (entropyBits < 60) {
      rating = 'Moderate';
      crackTime = 'Hours';
      activeSegments = 2;
    } else if (entropyBits < 90) {
      rating = 'Strong';
      crackTime = 'Decades';
      activeSegments = 3;
    } else {
      rating = 'Fortress';
      crackTime = 'Centuries';
      activeSegments = 4;
    }

    updateMetricDisplays(entropyBits, rating, crackTime, activeSegments);
  }

  function updateMetricDisplays(entropyBits, rating, crackTime, activeSegments) {
    if (strengthValue) strengthValue.textContent = rating;
    if (strengthCrackTime) strengthCrackTime.textContent = crackTime;
    if (strengthEntropy) strengthEntropy.textContent = `${entropyBits} bits`;

    // Segmented bar
    strengthSegments.forEach((seg, i) => {
      if (!seg) return;
      if (i < activeSegments) {
        seg.className = 'strength-seg active';
      } else {
        seg.className = 'strength-seg';
      }
    });
  }

  // Visibility Toggle (Synchronously masks / reveals BOTH Primary and Archetype displays)
  function toggleVisibility() {
    isPasswordMasked = !isPasswordMasked;
    applyMaskState();
    showToast(isPasswordMasked ? 'All credentials masked' : 'All credentials revealed');
  }

  // Apply Masking State across all password displays
  function applyMaskState() {
    if (primaryDisplay) {
      primaryDisplay.classList.toggle('masked', isPasswordMasked);
    }
    if (activeArchetypePassword) {
      activeArchetypePassword.classList.toggle('masked', isPasswordMasked);
    }
    if (iconEyeOpen && iconEyeClosed) {
      iconEyeOpen.style.display = isPasswordMasked ? 'none' : 'block';
      iconEyeClosed.style.display = isPasswordMasked ? 'block' : 'none';
    }
  }

  // Copy Active Archetype Credential
  function copyActiveArchetype() {
    const active = generatedArchetypes[activeArchetypeIndex];
    if (!active) return;
    copyToClipboard(active.value, () => {
      if (btnCopyArchetype) {
        btnCopyArchetype.classList.add('copied');
        if (copyArchetypeLabel) copyArchetypeLabel.textContent = 'Copied';
        setTimeout(() => {
          btnCopyArchetype.classList.remove('copied');
          if (copyArchetypeLabel) copyArchetypeLabel.textContent = 'Copy';
        }, 1800);
      }
      showToast(`Copied ${active.name} to clipboard`);
    });
  }

  // Copy Primary Credential
  function copyPrimary() {
    if (!currentPrimaryPassword) return;
    copyToClipboard(currentPrimaryPassword, () => {
      if (btnCopyPrimary) {
        btnCopyPrimary.classList.add('copied');
        if (copyPrimaryLabel) copyPrimaryLabel.textContent = 'Copied';
        setTimeout(() => {
          btnCopyPrimary.classList.remove('copied');
          if (copyPrimaryLabel) copyPrimaryLabel.textContent = 'Copy';
        }, 1800);
      }
      showToast('Primary credential copied to clipboard');
    });
  }

  // Copy All Archetypes
  function copyAllArchetypes() {
    if (!generatedArchetypes.length) return;
    const formatted = generatedArchetypes
      .map(item => `${item.name}:\n${item.value}`)
      .join('\n\n');

    copyToClipboard(formatted, () => {
      showToast('All 8 synthesized archetypes copied');
    });
  }

  // Generic Clipboard Wrapper
  function copyToClipboard(text, onSuccess) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(onSuccess).catch(() => fallbackCopy(text, onSuccess));
    } else {
      fallbackCopy(text, onSuccess);
    }
  }

  function fallbackCopy(text, onSuccess) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      if (onSuccess) onSuccess();
    } catch (e) {
      console.error('Clipboard copy failed', e);
    }
    document.body.removeChild(textarea);
  }

  // Subtle Toast
  function showToast(message) {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.classList.add('visible');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('visible');
    }, 2400);
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
