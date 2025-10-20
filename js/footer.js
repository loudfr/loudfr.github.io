/* filepath: c:\Users\louli\Desktop\LOULOU\portfolio\js\footer.js */
function getFooterPath() {
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('/pages/pf-S4/') || currentPath.includes('/pages/projets-details/')) {
        return "../../includes/footer.html";
    } else if (currentPath.includes('/pages/')) {
        return "../includes/footer.html";
    } else {
        return "includes/footer.html";
    }
}

function getPathPrefix() {
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('/pages/pf-S4/') || currentPath.includes('/pages/projets-details/')) {
        return "../..";
    } else if (currentPath.includes('/pages/')) {
        return "..";
    } else {
        return "";
    }
}

// Charger le footer
fetch(getFooterPath())
    .then(response => response.text())
    .then(data => {
        const footerPlaceholder = document.getElementById("footer-placeholder");
        if (footerPlaceholder) {
            footerPlaceholder.innerHTML = data;
            
            // Corriger les chemins après avoir injecté le footer
            const pathPrefix = getPathPrefix();
            
            // Logo
            const footerLogo = document.querySelector("#footer-logo");
            if (footerLogo) {
                footerLogo.src = `${pathPrefix}/imgs/logojaune.png`;
            }
            
            // Liens de navigation
            document.querySelector("#home-link").href = `${pathPrefix}/`;
            document.querySelector("#projects-link").href = `${pathPrefix}/pages/projets.html`;
            document.querySelector("#portfolio-link").href = `${pathPrefix}/pages/portfolio.html`;
            // document.querySelector("#contact-link").href = `${pathPrefix}/pages/contact.html`;
            
            // Lien de téléchargement du CV
            document.querySelector("#cv-download-link").href = `${pathPrefix}/imgs/CV_Louise_Dufour.pdf`;
        }
    })
    .catch(error => {
        console.error("Erreur lors du chargement du footer:", error);
    });