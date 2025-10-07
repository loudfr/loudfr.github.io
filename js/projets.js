document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const filterHoverBg = document.querySelector('.filter-hover-bg');
    let activeFilterBtn = document.querySelector('.filter-btn.active');

    // Initialiser tous les projets comme visibles
    projectCards.forEach(card => {
        card.style.display = 'block';
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
        card.classList.remove('hidden', 'filtering-out');
    });

    // Initialiser la position du fond glissant
    if (activeFilterBtn && filterHoverBg) {
        moveFilterHoverBgTo(activeFilterBtn);
    }

    // Fonction pour déplacer le fond vers un bouton
    function moveFilterHoverBgTo(targetBtn) {
        if (!targetBtn || !filterHoverBg) return;
        
        const container = targetBtn.parentElement;
        const btnRect = targetBtn.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const offsetLeft = btnRect.left - containerRect.left - 5; // -5 pour compenser le padding du container
        
        filterHoverBg.style.left = offsetLeft + "px";
        filterHoverBg.style.width = btnRect.width + "px";
    }

    // Ajouter les événements de survol
    filterButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            // Si ce n'est pas le bouton actif, rendre le bouton actif temporairement inactif visuellement
            if (this !== activeFilterBtn && activeFilterBtn) {
                activeFilterBtn.classList.add('temp-inactive');
            }
            moveFilterHoverBgTo(this);
        });
    });

    // Remettre le fond sur l'élément actif quand on quitte le container
    const filterContainer = document.querySelector('.filter-container');
    filterContainer.addEventListener('mouseleave', function() {
        // Remettre la couleur normale au bouton actif
        if (activeFilterBtn) {
            activeFilterBtn.classList.remove('temp-inactive');
            moveFilterHoverBgTo(activeFilterBtn);
        }
    });

    // Fonction pour filtrer les projets
    function filterProjects(category) {
        projectCards.forEach(card => {
            const cardCategory = card.dataset.category;
            
            if (category === 'all' || cardCategory === category) {
                // Afficher la carte
                card.style.display = 'block';
                card.classList.remove('hidden', 'filtering-out');
                card.classList.add('filtering-in');
                
                // Petit délai pour l'animation
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 10);
            } else {
                // Masquer la carte avec animation
                card.classList.add('filtering-out');
                card.classList.remove('filtering-in');
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                
                setTimeout(() => {
                    card.style.display = 'none';
                    card.classList.add('hidden');
                }, 300);
            }
        });
    }

    // Gérer les clics sur les boutons de filtre
    filterButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Debug - vérifier que l'événement fonctionne
            console.log('Filtre cliqué:', this.dataset.filter);
            
            // Retirer la classe active et temp-inactive de tous les boutons
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.classList.remove('temp-inactive');
            });
            
            // Ajouter la classe active au bouton cliqué
            this.classList.add('active');
            activeFilterBtn = this;
            
            // Déplacer le fond vers le nouveau bouton actif
            moveFilterHoverBgTo(this);
            
            // Filtrer les projets
            const category = this.dataset.filter;
            console.log('Filtrage par catégorie:', category);
            filterProjects(category);
        });
    });

    // Gérer les clics sur les cartes de projet
    projectCards.forEach(card => {
        card.addEventListener('click', function() {
            const projectTitle = this.querySelector('h4').textContent;
            
            // Mapping des titres vers les fichiers HTML
            const projectRoutes = {
                'Rapidos': 'projets-details/rapidos.html',
                'Chambre Van Gogh 3D': 'projets-details/chambre-van-gogh.html',
                'Gestion des vols': 'projets-details/gestion-vols.html',
                'Chiffrement César': 'projets-details/chiffrement-cesar.html',
                'Skytale': 'projets-details/skytale.html',
                'Algorithme de Kruskal': 'projets-details/kruskal.html',
                'Application Mobile': 'projets-details/app-mobile.html',
                'API Astérix': 'projets-details/api-asterix.html',
                'Portfolio Personnel': 'projets-details/portfolio.html'
            };
            
            const route = projectRoutes[projectTitle];
            if (route) {
                window.location.href = route;
            } else {
                // Page de détail pas encore créée
                alert(`Page de détail pour "${projectTitle}" en cours de création...`);
            }
        });
    });

    // Animation d'entrée des cartes au chargement
    setTimeout(() => {
        projectCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 300);

    // Ajuster la position du fond lors du redimensionnement
    window.addEventListener('resize', function() {
        if (activeFilterBtn) {
            setTimeout(() => {
                moveFilterHoverBgTo(activeFilterBtn);
            }, 100);
        }
    });
});

// Fonction pour créer une page de détail de projet (exemple)
function createProjectDetailPage(projectData) {
    // Cette fonction sera utilisée plus tard pour créer dynamiquement les pages de détail
    const template = `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Louise - ${projectData.title}</title>
            <link rel="stylesheet" href="../css/fonts.css">
            <link rel="stylesheet" href="../css/header.css">
            <link rel="stylesheet" href="../css/project-detail.css">
        </head>
        <body>
            <div id="header-placeholder"></div>
            
            <main>
                <section class="project-detail-hero">
                    <h1>${projectData.title}</h1>
                    <p>${projectData.description}</p>
                    <div class="project-links">
                        <a href="${projectData.githubUrl}" target="_blank" class="github-link">
                            <i class="fab fa-github"></i> Voir sur GitHub
                        </a>
                        ${projectData.liveUrl ? `<a href="${projectData.liveUrl}" target="_blank" class="live-link">Voir le projet</a>` : ''}
                    </div>
                </section>
                
                <section class="project-content">
                    <div class="project-images">
                        ${projectData.images.map(img => `<img src="${img}" alt="${projectData.title}">`).join('')}
                    </div>
                    
                    <div class="project-description">
                        <h3>Description du projet</h3>
                        <p>${projectData.fullDescription}</p>
                        
                        <h3>Technologies utilisées</h3>
                        <ul>
                            ${projectData.technologies.map(tech => `<li>${tech}</li>`).join('')}
                        </ul>
                        
                        <h3>Défis rencontrés</h3>
                        <p>${projectData.challenges}</p>
                        
                        <h3>Compétences développées</h3>
                        <p>${projectData.skills}</p>
                    </div>
                </section>
            </main>
        </body>
        </html>
    `;
    
    return template;
}

// Gestion du menu déroulant mobile
function initMobileDropdown() {
    const filterContainer = document.querySelector('.filter-container');
    if (!filterContainer) return;
    
    // Fonction pour créer et gérer le dropdown mobile
    function setupMobileDropdown() {
        if (window.innerWidth <= 480) {
            // Réinitialiser le container si nécessaire
            if (filterContainer.querySelector('.filter-dropdown-toggle')) {
                return; // Déjà configuré
            }
            
            // Sauvegarder les boutons originaux
            const originalButtons = Array.from(filterContainer.querySelectorAll('.filter-btn'));
            const activeButton = originalButtons.find(btn => btn.classList.contains('active')) || originalButtons[0];
            
            // Créer le bouton toggle
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'filter-dropdown-toggle';
            toggleBtn.textContent = activeButton ? activeButton.textContent : 'Tous les projets';
            
            // Créer le conteneur du menu
            const dropdownMenu = document.createElement('div');
            dropdownMenu.className = 'filter-dropdown-menu';
            
            // Cloner les boutons dans le menu déroulant
            originalButtons.forEach((btn, index) => {
                const newBtn = btn.cloneNode(true);
                newBtn.setAttribute('data-filter', btn.getAttribute('data-filter'));
                dropdownMenu.appendChild(newBtn);
            });
            
            // Nettoyer et reconstruire le container
            filterContainer.innerHTML = '';
            filterContainer.appendChild(toggleBtn);
            filterContainer.appendChild(dropdownMenu);
            
            // Event listener pour le toggle
            toggleBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                filterContainer.classList.toggle('open');
            });
            
            // Event listeners pour les boutons de filtre
            const dropdownButtons = dropdownMenu.querySelectorAll('.filter-btn');
            dropdownButtons.forEach(button => {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    console.log('Filtre mobile cliqué:', this.dataset.filter);
                    
                    // Mettre à jour le texte du toggle
                    toggleBtn.textContent = this.textContent;
                    
                    // Gérer les classes active
                    dropdownButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    
                    // FERMER LE MENU IMMEDIATEMENT
                    filterContainer.classList.remove('open');
                    
                    // Appliquer le filtre
                    const category = this.dataset.filter;
                    if (typeof filterProjects === 'function') {
                        filterProjects(category);
                    }
                });
            });
        }
    }
    
    // Configuration initiale
    setupMobileDropdown();
    
    // Reconfigurer lors du redimensionnement
    window.addEventListener('resize', function() {
        setTimeout(setupMobileDropdown, 100);
    });
    
    // Fermer le dropdown en cliquant à l'extérieur
    document.addEventListener('click', function(e) {
        const filterContainer = document.querySelector('.filter-container');
        if (filterContainer && !filterContainer.contains(e.target)) {
            filterContainer.classList.remove('open');
        }
    });
}

// Initialiser le dropdown mobile
document.addEventListener('DOMContentLoaded', function() {
    if (window.innerWidth <= 480) {
        // Attendre un peu pour s'assurer que tous les autres scripts sont chargés
        setTimeout(initMobileDropdown, 500);
    }
});