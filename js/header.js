let lastScrollTop = 0;
let hoverBg = null;
let activeLink = null;

function initHeader() {
  const header = document.getElementById("main-header");
  const nav = header.querySelector(".nav-menu");
  const logo = document.querySelector(".logo");
  hoverBg = nav.querySelector(".hover-bg");
  const links = nav.querySelectorAll(".nav-link");

  // Définir la page active en fonction de l'URL actuelle
  setActivePageLink(links);

  // Positionner initialement le fond sous l'actif
  activeLink = nav.querySelector(".nav-link.active");
  if (activeLink) {
    moveHoverBgTo(activeLink);
  }

  // Scroll hide/show et animation du logo
  window.addEventListener("scroll", () => {
    let st = window.scrollY || document.documentElement.scrollTop;
    
    // Gestion du header (le nav disparaît mais pas le logo)
    if (st > lastScrollTop) {
        header.style.top = "-100px"; // scroll down, cache le header
    } else {
        header.style.top = "15px"; // scroll up, montre le header
    }
    
    // Gestion de la taille du logo (il reste visible mais change de taille)
    if (st > 50) {
        logo.style.height = "35px"; // taille réduite
    } else {
        logo.style.height = "60px"; // taille normale
    }
    
    lastScrollTop = st <= 0 ? 0 : st;
  }, false);

  // Hover déplacement
  links.forEach(link => {
    link.addEventListener("mouseenter", () => moveHoverBgTo(link));
    link.addEventListener("mouseleave", () => moveHoverBgTo(activeLink));
    link.addEventListener("click", () => {
      // Ne pas changer l'active ici car la navigation va changer de page
      // L'active sera défini automatiquement par setActivePageLink()
    });
  });
}

// Fonction pour définir le lien actif selon la page actuelle
function setActivePageLink(links) {
  const currentPage = window.location.pathname;
  
  // Retirer la classe active de tous les liens
  links.forEach(link => link.classList.remove("active"));
  
  // Ajouter la classe active au bon lien selon l'URL
  links.forEach(link => {
    const href = link.getAttribute("href");
    
    if (currentPage.includes("portfolio.html") && href.includes("portfolio.html")) {
      link.classList.add("active");
    } else if (currentPage.includes("contact.html") && href.includes("contact.html")) {
      link.classList.add("active");
    } else if (currentPage.includes("index.html") || currentPage === "/" || currentPage.endsWith("/")) {
      if (href.includes("index.html") || href === "/") {
        link.classList.add("active");
      }
    }
  });
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

fetch("includes/header.html")
  .then(response => response.text())
  .then(data => {
    document.getElementById("header-placeholder").innerHTML = data;
    initHeader(); // appelle la fonction d'init après chargement
  })
  .catch(error => {
    console.error("Erreur lors du chargement du header:", error);
  });