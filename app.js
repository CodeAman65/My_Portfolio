/* ==========================================================================
   ROHIT RAJPUT PORTFOLIO - JAVASCRIPT
   Interactions, Gate Transitions, Timeline Scrubber, & Showcase Controls
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. DOM Elements
  // --------------------------------------------------------------------------
  const gateRoot = document.getElementById('gateRoot');
  const gateCurtain = document.getElementById('gateCurtain');
  const gateMyWorkBtn = document.getElementById('gateMyWorkBtn');
  const reopenGateBtn = document.getElementById('reopenGateBtn');

  const timelineStrip = document.getElementById('timelineStrip');
  const timelineTicks = document.getElementById('timelineTicks');
  const timelinePlayhead = document.getElementById('timelinePlayhead');
  const timecodeDisplay = document.getElementById('timecodeDisplay');

  const workTabBtns = document.querySelectorAll('.work-tab-btn');
  const tabIndicator = document.getElementById('tabIndicator');
  const filterDesc = document.getElementById('filterDescription');
  const projectCards = document.querySelectorAll('.project-card');

  const videoModal = document.getElementById('videoModal');
  const videoModalClose = document.getElementById('videoModalClose');
  const videoContainer = document.getElementById('videoContainer');
  const modalProjTitle = document.getElementById('modalProjTitle');
  const modalProjDesc = document.getElementById('modalProjDesc');

  // Prevent background scrolling while gate is active (unless navigating directly to an anchor)
  if (window.location.hash && window.location.hash !== '#' && window.location.hash !== '#gate') {
    if (gateRoot) gateRoot.classList.add('is-dismissed');
    document.body.classList.remove('is-locked');
  } else {
    document.body.classList.add('is-locked');
  }

  // --------------------------------------------------------------------------
  // 2. Entry Gate Transitions & Red Hover Action
  // --------------------------------------------------------------------------
  function dismissGate() {
    if (!gateRoot) return;
    
    // Trigger red curtain wipe effect
    if (gateCurtain) {
      gateCurtain.classList.add('active');
    }

    setTimeout(() => {
      gateRoot.classList.add('is-dismissed');
      document.body.classList.remove('is-locked');

      // Collapse curtain after gate is tucked away
      setTimeout(() => {
        if (gateCurtain) {
          gateCurtain.classList.remove('active');
        }
      }, 350);
    }, 280);
  }

  function openGate() {
    if (!gateRoot) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    gateRoot.classList.remove('is-dismissed');
    document.body.classList.add('is-locked');
  }

  if (gateMyWorkBtn) {
    gateMyWorkBtn.addEventListener('click', (e) => {
      e.preventDefault();
      dismissGate();
    });
  }

  if (reopenGateBtn) {
    reopenGateBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openGate();
    });
  }

  // --------------------------------------------------------------------------
  // 3. Filmstrip Timeline Scrubber Generator & Playhead Logic
  // --------------------------------------------------------------------------
  // Generate 96 tick marks (matching 00:00:00 to 02:45:00 at 15-min increments)
  const TOTAL_TICKS = 96;
  const TOTAL_SECONDS = 9900; // 2h 45m

  if (timelineTicks) {
    timelineTicks.innerHTML = '';
    for (let i = 0; i < TOTAL_TICKS; i++) {
      const tick = document.createElement('span');
      tick.className = 'timeline-tick' + (i % 8 === 0 ? ' tick-major' : '');
      timelineTicks.appendChild(tick);
    }
  }

  function formatTimecode(progress) {
    const totalSecs = Math.max(0, Math.min(TOTAL_SECONDS, progress * TOTAL_SECONDS));
    const hours = Math.floor(totalSecs / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const seconds = Math.floor(totalSecs % 60);
    // 24 frames per second calculation
    const frames = Math.floor((totalSecs % 1) * 24);

    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(frames)}`;
  }

  function setPlayheadProgress(progressRatio) {
    const clampedRatio = Math.max(0, Math.min(1, progressRatio));
    if (timelinePlayhead) {
      timelinePlayhead.style.left = `${(clampedRatio * 100).toFixed(2)}%`;
    }
    if (timecodeDisplay) {
      timecodeDisplay.textContent = formatTimecode(clampedRatio);
    }
  }

  let isHoveringTimeline = false;

  if (timelineStrip) {
    timelineStrip.addEventListener('mousemove', (e) => {
      isHoveringTimeline = true;
      const rect = timelineStrip.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const ratio = x / rect.width;
      setPlayheadProgress(ratio);
    });

    timelineStrip.addEventListener('mouseleave', () => {
      isHoveringTimeline = false;
      updatePlayheadFromScroll();
    });

    timelineStrip.addEventListener('click', (e) => {
      const rect = timelineStrip.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const ratio = x / rect.width;
      const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({
        top: ratio * scrollMax,
        behavior: 'smooth'
      });
    });
  }

  function updatePlayheadFromScroll() {
    if (isHoveringTimeline) return;
    const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollMax <= 0) {
      setPlayheadProgress(0);
      return;
    }
    const currentScroll = window.scrollY;
    const scrollRatio = currentScroll / scrollMax;
    setPlayheadProgress(scrollRatio);
  }

  window.addEventListener('scroll', updatePlayheadFromScroll, { passive: true });
  updatePlayheadFromScroll();

  // --------------------------------------------------------------------------
  // 4. Work Format Switcher Tabs (All, Short 9:16, Long 16:9)
  // --------------------------------------------------------------------------
  function updateTabIndicator(activeBtn) {
    if (!tabIndicator || !activeBtn) return;
    tabIndicator.style.width = `${activeBtn.offsetWidth}px`;
    tabIndicator.style.transform = `translateX(${activeBtn.offsetLeft}px)`;
  }

  const initialActiveTab = document.querySelector('.work-tab-btn.active');
  if (initialActiveTab) {
    // Initial position on load
    setTimeout(() => updateTabIndicator(initialActiveTab), 50);
  }

  window.addEventListener('resize', () => {
    const currentActive = document.querySelector('.work-tab-btn.active');
    if (currentActive) updateTabIndicator(currentActive);
  });

  const descriptions = {
    all: 'Showing all 4 showcase edits: Speed Ramping, Kinetic Subtitles, Cinematic Color Grading, and Narrative Storytelling.',
    'velocity-type': 'Frame-accurate velocity curves, time remapping, and high-retention kinetic typography (9:16).',
    'color-story': 'Commercial color grading, LOG tone balancing, and emotional narrative three-act pacing (9:16).'
  };

  workTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      workTabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      updateTabIndicator(btn);

      const filter = btn.getAttribute('data-filter');
      if (filterDesc && descriptions[filter]) {
        filterDesc.textContent = descriptions[filter];
      }

      projectCards.forEach(card => {
        const cardFormats = (card.getAttribute('data-format') || '').split(' ');
        if (filter === 'all' || cardFormats.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 5. Video Preview Lightbox Modal (Local 1080p Master + YouTube Stream)
  // --------------------------------------------------------------------------
  let currentModalState = {
    title: '',
    desc: '',
    ytEmbed: '',
    ytUrl: '',
    localUrl: '',
    activeSource: 'local',
    isShort: true
  };

  function renderModalMedia() {
    if (!videoContainer) return;
    videoContainer.innerHTML = '';

    if (currentModalState.activeSource === 'local' && currentModalState.localUrl) {
      const vid = document.createElement('video');
      vid.src = currentModalState.localUrl;
      vid.controls = true;
      vid.autoplay = true;
      vid.playsInline = true;
      vid.style.width = '100%';
      vid.style.height = '100%';
      vid.style.objectFit = 'contain';
      vid.style.backgroundColor = '#000';
      videoContainer.appendChild(vid);
    } else {
      const iframe = document.createElement('iframe');
      iframe.src = currentModalState.ytEmbed;
      iframe.title = currentModalState.title;
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';
      videoContainer.appendChild(iframe);
    }
  }

  function openVideoModal(title, desc, ytEmbed, ytUrl, localUrl, isShort) {
    if (!videoModal || !videoContainer) return;

    currentModalState = {
      title,
      desc,
      ytEmbed,
      ytUrl,
      localUrl,
      activeSource: localUrl ? 'local' : 'yt',
      isShort: Boolean(isShort)
    };

    if (modalProjTitle) modalProjTitle.textContent = title;
    if (modalProjDesc) modalProjDesc.textContent = desc;

    const modalContent = videoModal.querySelector('.video-modal-content');
    if (isShort) {
      videoContainer.classList.add('ratio-short');
      if (modalContent) modalContent.classList.add('is-short-format');
    } else {
      videoContainer.classList.remove('ratio-short');
      if (modalContent) modalContent.classList.remove('is-short-format');
    }

    const btnLocal = document.getElementById('btnLocalSource');
    const btnYt = document.getElementById('btnYtSource');
    const directYt = document.getElementById('modalYtDirectLink');

    if (btnLocal && btnYt) {
      if (localUrl) {
        btnLocal.style.display = 'inline-block';
        btnLocal.classList.toggle('active', currentModalState.activeSource === 'local');
        btnYt.classList.toggle('active', currentModalState.activeSource === 'yt');
      } else {
        btnLocal.style.display = 'none';
        btnYt.classList.add('active');
        currentModalState.activeSource = 'yt';
      }
    }

    if (directYt && ytUrl) {
      directYt.href = ytUrl;
    }

    renderModalMedia();

    videoModal.classList.add('active');
    document.body.classList.add('is-locked');
  }

  // Source toggle buttons
  const btnLocalSource = document.getElementById('btnLocalSource');
  const btnYtSource = document.getElementById('btnYtSource');
  if (btnLocalSource) {
    btnLocalSource.addEventListener('click', () => {
      if (currentModalState.activeSource === 'local') return;
      currentModalState.activeSource = 'local';
      btnLocalSource.classList.add('active');
      if (btnYtSource) btnYtSource.classList.remove('active');
      renderModalMedia();
    });
  }
  if (btnYtSource) {
    btnYtSource.addEventListener('click', () => {
      if (currentModalState.activeSource === 'yt') return;
      currentModalState.activeSource = 'yt';
      btnYtSource.classList.add('active');
      if (btnLocalSource) btnLocalSource.classList.remove('active');
      renderModalMedia();
    });
  }

  function closeVideoModal() {
    if (!videoModal) return;
    videoModal.classList.remove('active');
    if (!gateRoot || gateRoot.classList.contains('is-dismissed')) {
      document.body.classList.remove('is-locked');
    }
    setTimeout(() => {
      if (videoContainer) videoContainer.innerHTML = '';
    }, 300);
  }

  projectCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const title = card.getAttribute('data-title') || 'Project Showcase';
      const desc = card.getAttribute('data-desc') || '';
      const ytEmbed = card.getAttribute('data-video') || '';
      const ytUrl = card.getAttribute('data-yt') || '';
      const localUrl = card.getAttribute('data-local') || '';
      const isShort = true;
      openVideoModal(title, desc, ytEmbed, ytUrl, localUrl, isShort);
    });
  });

  if (videoModalClose) {
    videoModalClose.addEventListener('click', closeVideoModal);
  }

  if (videoModal) {
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) {
        closeVideoModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal && videoModal.classList.contains('active')) {
      closeVideoModal();
    }
  });

  // --------------------------------------------------------------------------
  // 6. Smooth Scrolling for Internal Hash Anchors
  // --------------------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // --------------------------------------------------------------------------
  // 7. Direct Email Pipeline Clipboard Logic
  // --------------------------------------------------------------------------
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const copyEmailLabel = document.getElementById('copyEmailLabel');
  const EMAIL_TARGET = 'rohitrajput3224@gmail.com';

  if (copyEmailBtn && copyEmailLabel) {
    copyEmailBtn.addEventListener('click', async () => {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(EMAIL_TARGET);
        } else {
          const ta = document.createElement('textarea');
          ta.value = EMAIL_TARGET;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }
        copyEmailBtn.classList.add('is-copied');
        copyEmailLabel.textContent = 'Copied to Clipboard! ✓';
        setTimeout(() => {
          copyEmailBtn.classList.remove('is-copied');
          copyEmailLabel.textContent = 'Copy Address';
        }, 2400);
      } catch (err) {
        copyEmailLabel.textContent = 'rohitrajput3224@gmail.com';
      }
    });
  }

  // Initial tab position adjustment
  window.dispatchEvent(new Event('resize'));
});
