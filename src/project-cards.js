// Project Cards Interaction Script
document.addEventListener('DOMContentLoaded', function() {
  // Initialize the project cards functionality
  initProjectCards();
});

function initProjectCards() {
  // Get the projects container
  const projectsContainer = document.querySelector('.projects-container');
  
  if (!projectsContainer) return;
  
  // Enable horizontal scrolling with mouse wheel
  projectsContainer.addEventListener('wheel', function(e) {
    if (e.deltaY !== 0) {
      e.preventDefault();
      projectsContainer.scrollLeft += e.deltaY;
    }
  }, { passive: false });
  
  // Add hover effects for mobile devices
  const projectCards = document.querySelectorAll('.project-card');
  
  projectCards.forEach(card => {
    // Touch events for mobile
    card.addEventListener('touchstart', function() {
      this.classList.add('touch-hover');
    }, { passive: true });
    
    card.addEventListener('touchend', function() {
      this.classList.remove('touch-hover');
    }, { passive: true });
    
    // Add keyboard navigation for accessibility
    card.setAttribute('tabindex', '0');
    
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        const link = this.querySelector('.project-link');
        if (link) link.click();
      }
    });
  });
  
  // Add scroll arrows for better UX
  createScrollButtons(projectsContainer);
}

function createScrollButtons(container) {
  // Create left and right scroll buttons
  const leftButton = document.createElement('button');
  leftButton.classList.add('scroll-button', 'left-button');
  leftButton.innerHTML = '&lt;';
  leftButton.setAttribute('aria-label', 'Scroll left');
  
  const rightButton = document.createElement('button');
  rightButton.classList.add('scroll-button', 'right-button');
  rightButton.innerHTML = '&gt;';
  rightButton.setAttribute('aria-label', 'Scroll right');
  
  // Add click handlers
  leftButton.addEventListener('click', () => {
    container.scrollBy({ left: -350, behavior: 'smooth' });
  });
  
  rightButton.addEventListener('click', () => {
    container.scrollBy({ left: 350, behavior: 'smooth' });
  });
  
  // Add buttons to the DOM
  const projectsSection = document.getElementById('projects');
  projectsSection.appendChild(leftButton);
  projectsSection.appendChild(rightButton);
  
  // Show/hide buttons based on scroll position
  updateScrollButtonVisibility(container, leftButton, rightButton);
  
  container.addEventListener('scroll', () => {
    updateScrollButtonVisibility(container, leftButton, rightButton);
  });
}

function updateScrollButtonVisibility(container, leftButton, rightButton) {
  // Show left button only if we're not at the beginning
  leftButton.style.opacity = container.scrollLeft > 0 ? '1' : '0';
  leftButton.style.pointerEvents = container.scrollLeft > 0 ? 'auto' : 'none';
  
  // Show right button only if we're not at the end
  const maxScroll = container.scrollWidth - container.clientWidth;
  rightButton.style.opacity = container.scrollLeft < maxScroll - 10 ? '1' : '0';
  rightButton.style.pointerEvents = container.scrollLeft < maxScroll - 10 ? 'auto' : 'none';
} 