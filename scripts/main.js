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


  // Array of quotes from films and anime
  const quotes = [
    { text: "With great power comes great responsibility.", source: "Spider-Man" },
    { text: "It's over 9000!", source: "Dragon Ball Z" },
    { text: "I am your father.", source: "Star Wars" },
    { text: "To infinity and beyond!", source: "Toy Story" },
    { text: "Just keep swimming.", source: "Finding Nemo" },
    { text: "I am Groot.", source: "Guardians of the Galaxy" },
    { text: "The truth is out there.", source: "The X-Files" },
    { text: "Winter is coming.", source: "Game of Thrones" },
    { text: "Live long and prosper.", source: "Star Trek" },
    { text: "I see dead people.", source: "The Sixth Sense" },
    { text: "I am inevitable.", source: "Avengers: Endgame" },
    { text: "I'll be back.", source: "The Terminator" },
    { text: "May the Force be with you.", source: "Star Wars" },
    { text: "I am Groot.", source: "Guardians of the Galaxy" },
    { text: "Believe it!", source: "Naruto" },
    { text: "All men are not created equal.", source: "My Hero Academia" },
    { text: "The one piece is real!", source: "One Piece" },
    { text: "Reality is often disappointing.", source: "Avengers: Infinity War" },
    { text: "I see now that the circumstances of one's birth are irrelevant. It is what you do with the gift of life that determines who you are.", source: "Pokémon: The First Movie" },
    { text: "A true hero isn't measured by the size of his strength, but by the strength of his heart.", source: "Hercules" }

    // ... (keep your other quotes here)
];

// Display random quote immediately (no waiting for DOMContentLoaded)
const quoteElement = document.getElementById('random-quote');
const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
quoteElement.innerHTML = `"${randomQuote.text}"<br><small>- ${randomQuote.source}</small>`;

// Remove loading elements after animation completes
setTimneout(() => {
    document.querySelector('.initial-loader').remove();
    document.querySelector('.loading-wrapper').remove();
    document.body.style.overflow = 'auto';
}, 5500);