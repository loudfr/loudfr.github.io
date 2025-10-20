document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const sectionsNav = document.querySelector('.sections-nav');
    const hoverBg = document.querySelector('.sections-hover-bg');
    let activeFilterBtn = document.querySelector('.filter-btn.active');
    
    // Éléments pour le menu déroulant mobile
    const dropdownTrigger = document.getElementById('dropdownTrigger');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const currentSectionSpan = document.getElementById('currentSection');
    
    // Initialiser le texte du dropdown avec le filtre actif
    if (currentSectionSpan && activeFilterBtn) {
        currentSectionSpan.textContent = activeFilterBtn.textContent.trim();
    }

    // Initialiser tous les projets comme visibles
    projectCards.forEach(card => {
        card.style.display = 'block';
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
        card.classList.remove('hidden', 'filtering-out');
    });

    // Initialiser la position du fond glissant
    if (activeFilterBtn && hoverBg) {
        moveHoverBgTo(activeFilterBtn);
    }

    // Fonction pour déplacer le fond vers un lien
    function moveHoverBgTo(targetLink) {
        if (!targetLink || !hoverBg || !sectionsNav) return;
        
        const linkRect = targetLink.getBoundingClientRect();
        const navRect = sectionsNav.getBoundingClientRect();
        
        const offsetLeft = linkRect.left - navRect.left;
        hoverBg.style.left = offsetLeft + "px";
        hoverBg.style.width = linkRect.width + "px";
        hoverBg.style.opacity = '1';
    }

    // Ajouter les événements de survol
    filterButtons.forEach(link => {
        link.addEventListener('mouseenter', () => {
            if (activeFilterBtn !== link && activeFilterBtn) {
                activeFilterBtn.classList.add('temp-inactive');
            }
            moveHoverBgTo(link);
        });
    });

    // Remettre le fond sur l'élément actif quand on quitte le container
    if (sectionsNav) {
        sectionsNav.addEventListener('mouseleave', () => {
            if (activeFilterBtn) {
                activeFilterBtn.classList.remove('temp-inactive');
                moveHoverBgTo(activeFilterBtn);
            } else {
                hoverBg.style.opacity = '0';
            }
        });
    }

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
            
            // Retirer la classe active et temp-inactive de tous les boutons
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.classList.remove('temp-inactive');
            });
            
            // Ajouter la classe active au bouton cliqué
            this.classList.add('active');
            activeFilterBtn = this;
            
            // Déplacer le fond vers le nouveau bouton actif
            moveHoverBgTo(this);
            
            // Mettre à jour le texte du dropdown (pour la version mobile)
            if (currentSectionSpan) {
                currentSectionSpan.textContent = this.textContent.trim();
            }
            
            // Filtrer les projets
            const category = this.dataset.filter;
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
                'WikiCoaster': 'projets-details/wikicoaster.html',
                'Algorithme de Kruskal': 'projets-details/kruskal.html',
                'Application Mobile': 'projets-details/app-mobile.html',
                'Portfolio Personnel': 'projets-details/portfolio-site.html',
                'Site Z&V': 'projets-details/site-ZV.html',
                'Jikan': 'projets-details/jikan.html',
                'My Band': 'projets-details/my-band.html',
                'Projets en C': 'projets-details/app-C.html',
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
                moveHoverBgTo(activeFilterBtn);
            }, 100);
        }
    });
    
    // Gestion du menu déroulant mobile
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

        // Fermer le dropdown si on clique ailleurs
        document.addEventListener('click', function(e) {
            if (!dropdownTrigger.contains(e.target) && !dropdownMenu.contains(e.target)) {
                closeDropdown();
            }
        });

        // Gérer les clics sur les liens du menu mobile
        const mobileSectionLinks = document.querySelectorAll('.mobile-section-link');
        mobileSectionLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Mettre à jour le texte du dropdown avec la catégorie sélectionnée
                const filterText = this.textContent.trim();
                currentSectionSpan.textContent = filterText;
                
                // Mettre à jour l'état actif
                filterButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.classList.remove('temp-inactive');
                });
                
                // Activer le bouton cliqué
                this.classList.add('active');
                activeFilterBtn = this;
                
                // Filtrer les projets
                const category = this.dataset.filter;
                filterProjects(category);
                
                // Fermer le dropdown
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
    }
});