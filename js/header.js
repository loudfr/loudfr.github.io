let lastScrollTop = 0;
let hoverBg = null;
let activeLink = null;
let mobileMenuOpen = false;

function initHeader() {
  const header = document.getElementById("main-header");
  const nav = header.querySelector(".nav-menu");
  const logo = document.querySelector(".logo");
  hoverBg = nav.querySelector(".hover-bg");
  const links = nav.querySelectorAll(".nav-link");
  
  // Éléments mobile
  const hamburgerMenu = document.getElementById("hamburgerMenu");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileMenuOverlay = document.getElementById("mobileMenuOverlay");
  const mobileLinks = document.querySelectorAll(".mobile-nav-link");

  // Définir la page active
  setActivePageLink(links, mobileLinks);

  // Positionner initialement le fond sous l'actif
  activeLink = nav.querySelector(".nav-link.active");
  if (activeLink) {
    moveHoverBgTo(activeLink);
  }

  // Scroll hide/show et animation du logo
  window.addEventListener("scroll", () => {
    let st = window.scrollY || document.documentElement.scrollTop;
    
    if (st > lastScrollTop && !mobileMenuOpen) {
        header.style.top = "-100px";
    } else {
        header.style.top = window.innerWidth <= 768 ? "10px" : "15px";
    }
    
    if (st > 50) {
        logo.style.height = window.innerWidth <= 768 ? "35px" : "35px";
    } else {
        logo.style.height = window.innerWidth <= 768 ? "45px" : "60px";
    }
    
    lastScrollTop = st <= 0 ? 0 : st;
  }, false);

  // Desktop menu hover
  links.forEach(link => {
    link.addEventListener("mouseenter", () => moveHoverBgTo(link));
    link.addEventListener("mouseleave", () => moveHoverBgTo(activeLink));
  });

  // Mobile menu functionality
  if (hamburgerMenu && mobileMenu && mobileMenuOverlay) {
    hamburgerMenu.addEventListener("click", toggleMobileMenu);
    mobileMenuOverlay.addEventListener("click", closeMobileMenu);
    
    // Fermer le menu quand on clique sur un lien
    mobileLinks.forEach(link => {
      link.addEventListener("click", closeMobileMenu);
    });
  }
}

function toggleMobileMenu() {
  const hamburgerMenu = document.getElementById("hamburgerMenu");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileMenuOverlay = document.getElementById("mobileMenuOverlay");
  
  mobileMenuOpen = !mobileMenuOpen;
  
  hamburgerMenu.classList.toggle("active");
  mobileMenu.classList.toggle("active");
  mobileMenuOverlay.classList.toggle("active");
  
  // Empêcher le scroll du body quand le menu est ouvert
  document.body.style.overflow = mobileMenuOpen ? "hidden" : "auto";
}

function closeMobileMenu() {
  const hamburgerMenu = document.getElementById("hamburgerMenu");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileMenuOverlay = document.getElementById("mobileMenuOverlay");
  
  mobileMenuOpen = false;
  
  hamburgerMenu.classList.remove("active");
  mobileMenu.classList.remove("active");
  mobileMenuOverlay.classList.remove("active");
  
  document.body.style.overflow = "auto";
}

function setActivePageLink(links, mobileLinks) {
  const currentPage = window.location.pathname;
  const fileName = currentPage.split('/').pop();
  
  // Fonction pour définir l'actif
  function setActive(linkArray) {
    linkArray.forEach(link => link.classList.remove("active"));
    
    linkArray.forEach(link => {
      const href = link.getAttribute("href");
      
      if ((fileName.startsWith("pf") || currentPage.includes("portfolio.html")) && href.includes("portfolio.html")) {
        link.classList.add("active");
      } else if (currentPage.includes("contact.html") && href.includes("contact.html")) {
        link.classList.add("active");
      } else if (currentPage.includes("projets.html") && href.includes("projets.html")) {
        link.classList.add("active");
      } else if (currentPage.includes("index.html") || currentPage === "/" || currentPage.endsWith("/")) {
        if (href.includes("index.html") || href === "/" || href.includes("LOUISE")) {
          link.classList.add("active");
        }
      }
    });
  }
  
  setActive(links);
  if (mobileLinks) setActive(mobileLinks);
}

function moveHoverBgTo(targetLink) {
  if (!targetLink || !hoverBg) return;
  const nav = targetLink.parentElement;
  const linkRect = targetLink.getBoundingClientRect();
  const navRect = nav.getBoundingClientRect();
  const offsetLeft = linkRect.left - navRect.left;
  hoverBg.style.left = offsetLeft + "px";
  hoverBg.style.width = linkRect.width + "px";
}

function getHeaderPath() {
  const currentPath = window.location.pathname;
  
  if (currentPath.includes('/pages/')) {
    return "../../includes/header.html";
  } else if (currentPath.includes('/pages/')) {
    return "../includes/header.html";
  } else {
    return "includes/header.html";
  }
}

// Fermer le menu mobile si on redimensionne vers desktop
window.addEventListener('resize', () => {
  if (window.innerWidth > 768 && mobileMenuOpen) {
    closeMobileMenu();
  }
});

fetch(getHeaderPath())
  .then(response => response.text())
  .then(data => {
    document.getElementById("header-placeholder").innerHTML = data;
    initHeader();
  })
  .catch(error => {
    console.error("Erreur lors du chargement du header:", error);
  });


document.addEventListener('DOMContentLoaded', function() {

    // Mobile dropdown functionality
    const dropdownTrigger = document.getElementById('dropdownTrigger');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const currentSectionSpan = document.getElementById('currentSection');
    const mobileSectionLinks = document.querySelectorAll('.mobile-section-link');

    if (dropdownTrigger && dropdownMenu) {
        // Toggle dropdown
        dropdownTrigger.addEventListener('click', function(e) {
            e.stopPropagation();
            const isActive = dropdownTrigger.classList.contains('active');
            
            if (isActive) {
                closeDropdown();
            } else {
                openDropdown();
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!dropdownTrigger.contains(e.target) && !dropdownMenu.contains(e.target)) {
                closeDropdown();
            }
        });

        // Handle mobile section link clicks
        mobileSectionLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // GARDEZ "Sections" comme texte fixe
                currentSectionSpan.textContent = "Sections";
                
                // Update active state
                mobileSectionLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                // Navigate to section
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
                
                // Close dropdown
                closeDropdown();
            });
        });

        function openDropdown() {
            dropdownTrigger.classList.add('active');
            dropdownMenu.classList.add('active');
        }

        function closeDropdown() {
            dropdownTrigger.classList.remove('active');
            dropdownMenu.classList.remove('active');
        }

        // Update current section based on scroll position
        function updateCurrentSection() {
            if (window.innerWidth <= 768) {
                const sections = document.querySelectorAll('section[id^="AC"], #auto-evaluation, #conclusion');
                let currentSection = null;
                
                sections.forEach(section => {
                    const rect = section.getBoundingClientRect();
                    if (rect.top <= 100 && rect.bottom >= 100) {
                        currentSection = section;
                    }
                });
                
                if (currentSection) {
                    const sectionId = currentSection.getAttribute('id');
                    const correspondingLink = document.querySelector(`.mobile-section-link[href="#${sectionId}"]`);
                    
                    if (correspondingLink) {
                        mobileSectionLinks.forEach(l => l.classList.remove('active'));
                        correspondingLink.classList.add('active');
                        // GARDEZ "Sections" même au scroll
                        currentSectionSpan.textContent = "Sections";
                    }
                }
            }
        }

        // Update on scroll
        window.addEventListener('scroll', updateCurrentSection);
        
        // Initial update
        updateCurrentSection();
    }

});