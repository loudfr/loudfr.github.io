let lastScrollTop = 0;
let hoverBg = null;
let activeLink = null;

function initHeader() {
  const header = document.getElementById("main-header");
  const nav = header.querySelector(".nav-menu");
  const logo = document.querySelector(".logo");
  hoverBg = nav.querySelector(".hover-bg");
  const links = nav.querySelectorAll(".nav-link");

  // Positionner initialement le fond sous l'actif
  activeLink = nav.querySelector(".nav-link.active");
  moveHoverBgTo(activeLink);

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
      links.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
      activeLink = link;
    });
  });
}

function moveHoverBgTo(targetLink) {
  const nav = targetLink.parentElement;
  const linkRect = targetLink.getBoundingClientRect();
  const navRect = nav.getBoundingClientRect();
  const offsetLeft = linkRect.left - navRect.left;
  hoverBg.style.left = offsetLeft + "px";
  hoverBg.style.width = linkRect.width + "px";
}