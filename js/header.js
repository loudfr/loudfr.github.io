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
    
    if (st > lastScrollTop) {
        header.style.top = "-100px";
    } else {
        header.style.top = "15px";
    }
    
    if (st > 50) {
        logo.style.height = "35px";
    } else {
        logo.style.height = "60px";
    }
    
    lastScrollTop = st <= 0 ? 0 : st;
  }, false);

  links.forEach(link => {
    link.addEventListener("mouseenter", () => moveHoverBgTo(link));
    link.addEventListener("mouseleave", () => moveHoverBgTo(activeLink));
  });
}

function setActivePageLink(links) {
  const currentPage = window.location.pathname;
  const fileName = currentPage.split('/').pop(); // Récupère le nom du fichier
  
  // Retirer la classe active de tous les liens
  links.forEach(link => link.classList.remove("active"));
  
  // Ajouter la classe active au bon lien selon l'URL
  links.forEach(link => {
    const href = link.getAttribute("href");
    
    // Si le fichier commence par "pf" ou contient "portfolio", activer Portfolio
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

function moveHoverBgTo(targetLink) {
  if (!targetLink || !hoverBg) return;
  const nav = targetLink.parentElement;
  const linkRect = targetLink.getBoundingClientRect();
  const navRect = nav.getBoundingClientRect();
  const offsetLeft = linkRect.left - navRect.left;
  hoverBg.style.left = offsetLeft + "px";
  hoverBg.style.width = linkRect.width + "px";
}

// Détection automatique du chemin selon l'emplacement du fichier
function getHeaderPath() {
  const currentPath = window.location.pathname;
  
  // Depuis /pages/ (vérifier en PREMIER car plus spécifique)
  if (currentPath.includes('/pages/')) {
    return "../../includes/header.html";
  }
  // Depuis /pages/ (vérifier en SECOND)
  else if (currentPath.includes('/pages/')) {
    return "../includes/header.html";
  }
  // Depuis la racine du site
  else {
    return "includes/header.html";
  }
}

fetch(getHeaderPath())
  .then(response => response.text())
  .then(data => {
    document.getElementById("header-placeholder").innerHTML = data;
    initHeader();
  })
  .catch(error => {
    console.error("Erreur lors du chargement du header:", error);
  });