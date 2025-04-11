// DOM Elements
const elements = {
    darkModeToggle: document.getElementById('darkModeToggle'),
    menuToggle: document.getElementById('menuToggle'),
    navOverlay: document.getElementById('navOverlay'),
    closeNav: document.getElementById('closeNav'),
    navLinks: document.querySelectorAll('.nav-content a'),
    prevBtn: document.getElementById('prevBtn'),
    nextBtn: document.getElementById('nextBtn'),
    sections: document.querySelectorAll('section')
  };
  
  // State Management
  const state = {
    currentSectionIndex: 0,
    sectionIds: Array.from(elements.sections).map(section => section.id),
    isNavOpen: false,
    isMobile: window.innerWidth <= 768 // Detect mobile devices
  };
  
  // Initialize Application
  function init() {
    initializeDarkMode();
    initializeCurrentSection();
    setupEventListeners();
    window.addEventListener('resize', handleResize);
  }
  
    // ... (keep previous code until the handleResize function)

    function handleResize() {
        state.isMobile = window.innerWidth <= 768;
        setViewportHeight();
    }
    
    // Fix mobile viewport height without blocking pull-to-refresh
    function setViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    // Initialize Application
    function init() {
        setViewportHeight(); // Set initial viewport height
        initializeDarkMode();
        initializeCurrentSection();
        setupEventListeners();
        window.addEventListener('resize', handleResize);
        
        // Re-enable pull-to-refresh by removing overscroll behavior
        document.body.style.overscrollBehaviorY = 'auto';
    }
    
    // ... (keep the rest of the previous code)
  
  // Transition Functions
  function getTransitionClass(direction) {
    return state.isMobile ? 
      (direction === 'next' ? 'slide-out-left' : 'slide-out-right') :
      (direction === 'next' ? 'fade-out' : 'fade-out');
  }
  
  function applyTransition(section, direction, action) {
    const baseClass = direction === 'next' ? 'slide' : 'fade';
    const transitionClass = `${baseClass}-${action}-${direction}`;
    
    if (action === 'start') {
      section.classList.add(transitionClass);
    } else {
      section.classList.remove(transitionClass);
    }
  }
  
  // Dark Mode Functions
  function initializeDarkMode() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      elements.darkModeToggle.checked = true;
    }
  }
  
  function toggleDarkMode() {
    const isDarkMode = elements.darkModeToggle.checked;
    document.body.classList.toggle('dark-mode', isDarkMode);
    localStorage.setItem('darkMode', isDarkMode);
  }
  
  // Section Navigation
  function initializeCurrentSection() {
    const savedSection = localStorage.getItem('currentSection');
    if (savedSection) {
      const index = state.sectionIds.indexOf(savedSection);
      if (index !== -1) {
        state.currentSectionIndex = index;
        updateVisibleSection();
      }
    }
  }
  
  function navigateToIndex(newIndex) {
    const direction = newIndex > state.currentSectionIndex ? 'next' : 'prev';
    
    // Handle wrap-around
    if (newIndex < 0) newIndex = state.sectionIds.length - 1;
    if (newIndex >= state.sectionIds.length) newIndex = 0;
    
    const currentSection = elements.sections[state.currentSectionIndex];
    const nextSection = elements.sections[newIndex];
    
    // Start transition
    if (state.isMobile) {
      currentSection.classList.add(direction === 'next' ? 'slide-out-left' : 'slide-out-right');
      nextSection.classList.add(direction === 'next' ? 'slide-in-right' : 'slide-in-left');
    } else {
      currentSection.classList.add('fade-out');
      nextSection.classList.add('fade-in');
    }
    
    // After transition completes
    setTimeout(() => {
      currentSection.classList.remove('active', 'slide-out-left', 'slide-out-right', 'fade-out');
      nextSection.classList.remove('slide-in-right', 'slide-in-left', 'fade-in');
      nextSection.classList.add('active');
      
      state.currentSectionIndex = newIndex;
      localStorage.setItem('currentSection', state.sectionIds[newIndex]);
    }, 500); // Match this duration with your CSS transition time
  }
  
  function navigateToSection(sectionId) {
    const index = state.sectionIds.indexOf(sectionId);
    if (index !== -1) {
      navigateToIndex(index);
    }
  }
  
  function updateVisibleSection() {
    elements.sections.forEach((section, i) => {
      section.classList.toggle('active', i === state.currentSectionIndex);
      section.classList.toggle('prev', i !== state.currentSectionIndex);
    });
  }
  
  // Navigation Overlay
  function toggleNavigation() {
    state.isNavOpen = !state.isNavOpen;
    elements.navOverlay.classList.toggle('active', state.isNavOpen);
    
    // Disable body scroll when nav is open
    document.body.style.overflow = state.isNavOpen ? 'hidden' : '';
  }
  
  function closeNavigation() {
    state.isNavOpen = false;
    elements.navOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  function handleOutsideClick(e) {
    if (state.isNavOpen && 
        !e.target.closest('.nav-content') && 
        e.target !== elements.menuToggle) {
      closeNavigation();
    }
  }
  
  // Event Handlers
  function handleKeyDown(e) {
    switch (e.key) {
      case 'ArrowLeft':
        navigateToIndex(state.currentSectionIndex - 1);
        break;
      case 'ArrowRight':
        navigateToIndex(state.currentSectionIndex + 1);
        break;
      case 'Escape':
        closeNavigation();
        break;
    }
  }
  
  function handleNavLinkClick(e) {
    e.preventDefault();
    const sectionId = e.target.getAttribute('data-section');
    navigateToSection(sectionId);
    closeNavigation();
  }
  
  // Setup Event Listeners
  function setupEventListeners() {
    // Dark mode toggle
    elements.darkModeToggle.addEventListener('change', toggleDarkMode);
    
    // Menu toggle
    elements.menuToggle.addEventListener('click', toggleNavigation);
    
    // Close nav button
    elements.closeNav.addEventListener('click', closeNavigation);
    
    // Navigation links
    elements.navLinks.forEach(link => {
      link.addEventListener('click', handleNavLinkClick);
    });
    
    // Previous/Next navigation
    elements.prevBtn.addEventListener('click', () => {
      navigateToIndex(state.currentSectionIndex - 1);
    });
    
    elements.nextBtn.addEventListener('click', () => {
      navigateToIndex(state.currentSectionIndex + 1);
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyDown);
    
    // Close when clicking outside
    document.addEventListener('click', handleOutsideClick);
  }
  
  // Start the application
  init();