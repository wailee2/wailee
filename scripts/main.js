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
    isNavOpen: false
  };
  
  // Initialize Application
  function init() {
    initializeDarkMode();
    initializeCurrentSection();
    setupEventListeners();
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
  
  function navigateToIndex(index) {
    if (index < 0) index = state.sectionIds.length - 1;
    if (index >= state.sectionIds.length) index = 0;
    
    state.currentSectionIndex = index;
    updateVisibleSection();
    localStorage.setItem('currentSection', state.sectionIds[index]);
  }
  
  function navigateToSection(sectionId) {
    const index = state.sectionIds.indexOf(sectionId);
    if (index !== -1) {
      navigateToIndex(index);
    }
  }
  
  function updateVisibleSection() {
    elements.sections.forEach((section, i) => {
      if (i === state.currentSectionIndex) {
        section.classList.remove('prev');
        section.classList.add('active');
      } else {
        section.classList.remove('active');
        section.classList.add('prev');
      }
    });
  }
  
  // Navigation Overlay
  function toggleNavigation() {
    state.isNavOpen = !state.isNavOpen;
    elements.navOverlay.classList.toggle('active', state.isNavOpen);
  }
  
  function closeNavigation() {
    state.isNavOpen = false;
    elements.navOverlay.classList.remove('active');
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