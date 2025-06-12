/* filepath: c:\Users\louli\Desktop\LOULOU\127.0.0.1:5501\js\footer.js */
function getFooterPath() {
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('/pages/')) {
        return "../includes/footer.html";
    } else {
        return "includes/footer.html";
    }
}

// Charger le footer
fetch(getFooterPath())
    .then(response => response.text())
    .then(data => {
        const footerPlaceholder = document.getElementById("footer-placeholder");
        if (footerPlaceholder) {
            footerPlaceholder.innerHTML = data;
        }
    })
    .catch(error => {
        console.error("Erreur lors du chargement du footer:", error);
    });