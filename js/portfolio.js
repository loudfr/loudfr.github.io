document.addEventListener('DOMContentLoaded', function() {
    // Initialize all sections as expanded (not collapsed)
    const contents = document.querySelectorAll('.section-content');
    contents.forEach(content => {
        content.classList.remove('collapsed');
    });

    // Initialize triangles as rotated (expanded state)
    const triangles = document.querySelectorAll('.toggle-triangle');
    triangles.forEach(triangle => {
        triangle.style.transform = 'rotate(90deg)';
    });

    // Add click functionality to toggles
    const toggles = document.querySelectorAll('.section-toggle');
    toggles.forEach(toggle => {
        toggle.style.cursor = 'pointer';
        toggle.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const triangle = this.querySelector('.toggle-triangle');
            
            if (content.classList.contains('collapsed')) {
                content.classList.remove('collapsed');
                triangle.style.transform = 'rotate(90deg)';
            } else {
                content.classList.add('collapsed');
                triangle.style.transform = 'rotate(0deg)';
            }
        });
    });

    const sectionsNav = document.querySelector('.sections-nav');
    const hoverBg = document.querySelector('.sections-hover-bg');
    const sectionLinks = document.querySelectorAll('.section-link');
    let activeLink = null;

    // Move hover background
    function moveHoverBgTo(targetLink) {
        if (!targetLink || !hoverBg) return;
        const linkRect = targetLink.getBoundingClientRect();
        const navRect = sectionsNav.getBoundingClientRect();
        const offsetLeft = linkRect.left - navRect.left;
        hoverBg.style.left = offsetLeft + 'px';
        hoverBg.style.width = linkRect.width + 'px';
        hoverBg.style.opacity = '1';
    }

    // Hover events
    sectionLinks.forEach(link => {
        link.addEventListener('mouseenter', () => moveHoverBgTo(link));
        link.addEventListener('mouseleave', () => {
            if (activeLink) {
                moveHoverBgTo(activeLink);
            } else {
                hoverBg.style.opacity = '0';
            }
        });
    });

    // Scroll to top button
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    if (scrollToTopBtn) {
        window.addEventListener('scroll', function() {
            scrollToTopBtn.classList.toggle('visible', window.pageYOffset > 300);
        });

        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Image modal functionality
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const closeBtn = document.querySelector('.close');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const zoomInBtn = document.getElementById('zoomIn');
    const zoomOutBtn = document.getElementById('zoomOut');
    const resetZoomBtn = document.getElementById('resetZoom');
    const zoomLevel = document.getElementById('zoomLevel');

    let currentImageIndex = 0;
    let images = [];
    let currentZoom = 1;
    let isDragging = false;
    let startX, startY, translateX = 0, translateY = 0;

    // Initialize clickable images
    function initializeImages() {
        images = Array.from(document.querySelectorAll('.clickable-image'));
        
        images.forEach((img, index) => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => openModal(index));
        });
    }

    // Modal functions
    function updateModalImage(index) {
        const img = images[index];
        modalImage.src = img.src;
        modalImage.alt = img.alt;
        modalTitle.textContent = img.dataset.title || img.alt;
        resetImageTransform();
    }

    function openModal(index) {
        currentImageIndex = index;
        updateModalImage(index);
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        resetImageTransform();
    }

    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateModalImage(currentImageIndex);
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateModalImage(currentImageIndex);
    }

    // Zoom functions
    function zoomIn() {
        currentZoom = Math.min(currentZoom * 1.2, 3);
        updateImageTransform();
    }

    function zoomOut() {
        currentZoom = Math.max(currentZoom / 1.2, 0.5);
        updateImageTransform();
    }

    function resetZoom() {
        currentZoom = 1;
        translateX = 0;
        translateY = 0;
        updateImageTransform();
    }

    function resetImageTransform() {
        currentZoom = 1;
        translateX = 0;
        translateY = 0;
        updateImageTransform();
    }

    function updateImageTransform() {
        modalImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentZoom})`;
        zoomLevel.textContent = Math.round(currentZoom * 100) + '%';
    }

    // Drag functionality
    modalImage.addEventListener('mousedown', function(e) {
        if (currentZoom > 1) {
            isDragging = true;
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
            modalImage.style.cursor = 'grabbing';
            e.preventDefault();
        }
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            translateX = e.clientX - startX;
            translateY = e.clientY - startY;
            updateImageTransform();
        }
    });

    document.addEventListener('mouseup', function() {
        if (isDragging) {
            isDragging = false;
            modalImage.style.cursor = currentZoom > 1 ? 'grab' : 'default';
        }
    });

    // Event listeners
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (prevBtn) prevBtn.addEventListener('click', showPrevImage);
    if (nextBtn) nextBtn.addEventListener('click', showNextImage);
    if (zoomInBtn) zoomInBtn.addEventListener('click', zoomIn);
    if (zoomOutBtn) zoomOutBtn.addEventListener('click', zoomOut);
    if (resetZoomBtn) resetZoomBtn.addEventListener('click', resetZoom);

    // Keyboard and modal events
    document.addEventListener('keydown', function(e) {
        if (modal && modal.style.display === 'block') {
            if (e.key === 'Escape') {
                closeModal();
            } else if (e.key === 'ArrowLeft') {
                showPrevImage();
            } else if (e.key === 'ArrowRight') {
                showNextImage();
            }
        }
    });

    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Mouse wheel zoom avec passive: false pour éviter l'avertissement
    if (modalImage) {
        modalImage.addEventListener('wheel', function(e) {
            e.preventDefault();
            if (e.deltaY < 0) {
                zoomIn();
            } else {
                zoomOut();
            }
        }, { passive: false });
    }

    // Initialize images
    initializeImages();

    // PDFViewer - seulement si les éléments PDF existent
    const pdfSection = document.getElementById('portfolio-previous');
    if (pdfSection) {
        // Charger PDF.js si ce n'est pas déjà fait
        if (typeof pdfjsLib === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
            script.onload = () => {
                pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                initializePDFViewer();
            };
            document.head.appendChild(script);
        } else {
            initializePDFViewer();
        }
    }
});

// Modifiez la fonction initializePDFViewer pour prendre en paramètre le fichier PDF :
function initializePDFViewer() {
    class PDFViewer {
        constructor() {
            this.pdf = null;
            this.currentPage = 1;
            this.totalPages = 0;
            this.canvas = document.getElementById('pdf-canvas');
            
            // Vérifiez si les éléments existent avant d'initialiser
            if (!this.canvas) {
                console.log('Canvas PDF non trouvé, ignorer l\'initialisation du PDFViewer');
                return;
            }
            
            this.ctx = this.canvas.getContext('2d');
            this.scale = 1.5;
            
            this.initializeControls();
            this.loadPDF();
        }
        
        initializeControls() {
            const prevBtn = document.getElementById('prev-page');
            const nextBtn = document.getElementById('next-page');
            
            // Vérifiez si les boutons existent
            if (!prevBtn || !nextBtn) {
                console.log('Boutons de navigation PDF non trouvés');
                return;
            }
            
            prevBtn.addEventListener('click', () => this.prevPage());
            nextBtn.addEventListener('click', () => this.nextPage());
            
            // Navigation au clavier uniquement quand on est sur la section PDF
            document.addEventListener('keydown', (e) => {
                // Vérifiez si on est sur la section portfolio et que la modal n'est pas ouverte
                const modal = document.getElementById('imageModal');
                const isModalOpen = modal && modal.style.display === 'block';
                const pdfSection = document.getElementById('portfolio-previous');
                const isInViewport = pdfSection && this.isElementInViewport(pdfSection);
                
                if (!isModalOpen && isInViewport) {
                    if (e.key === 'ArrowLeft') {
                        e.preventDefault();
                        this.prevPage();
                    }
                    if (e.key === 'ArrowRight') {
                        e.preventDefault();
                        this.nextPage();
                    }
                }
            });
        }
        
        // Méthode pour déterminer le fichier PDF selon la page
        getPDFPath() {
            const currentPage = window.location.pathname;
            
            if (currentPage.includes('pf-S4-C1.html')) {
                return '../imgs/pf-S2/portfolios2-1_louise.pdf';
            } else if (currentPage.includes('pf-S4-C2.html')) {
                return '../imgs/pf-S2/portfolios2-2_louise.pdf';
            } else if (currentPage.includes('pf-S4-C3.html')) {
                return '../imgs/pf-S2/portfolios2-3_louise.pdf';
            } else if (currentPage.includes('pf-S4-C4.html')) {
                return '../imgs/pf-S2/portfolios2-4_louise.pdf';
            } else if (currentPage.includes('pf-S4-C5.html')) {
                return '../imgs/pf-S2/portfolios2-5_louise.pdf';
            } else if (currentPage.includes('pf-S4-C6.html')) {
                return '../imgs/pf-S2/portfolios2-6_louise.pdf';
            } else {
                // Fichier par défaut
                return '../imgs/pf-S2/portfolios2-1_louise.pdf';
            }
        }
        
        // Nouvelle méthode pour vérifier si un élément est visible
        isElementInViewport(el) {
            const rect = el.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }
        
        async loadPDF() {
            try {
                // Utilisez le chemin déterminé par la page actuelle
                const pdfUrl = this.getPDFPath();
                
                const loadingTask = pdfjsLib.getDocument(pdfUrl);
                this.pdf = await loadingTask.promise;
                this.totalPages = this.pdf.numPages;
                
                const totalPagesElement = document.getElementById('total-pages');
                const loadingSpinner = document.getElementById('loading-spinner');
                
                if (totalPagesElement) {
                    totalPagesElement.textContent = this.totalPages;
                }
                if (loadingSpinner) {
                    loadingSpinner.style.display = 'none';
                }
                
                this.renderPage(1);
                this.updateControls();
                
            } catch (error) {
                console.error('Erreur lors du chargement du PDF:', error);
                const loadingSpinner = document.getElementById('loading-spinner');
                if (loadingSpinner) {
                    loadingSpinner.innerHTML = `
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Erreur lors du chargement du portfolio de cette compétence</p>
                    `;
                }
            }
        }
        
        async renderPage(pageNum) {
            if (!this.pdf || !this.canvas) return;
            
            try {
                const page = await this.pdf.getPage(pageNum);
                
                // Calculer le ratio pour maintenir les proportions
                const viewport = page.getViewport({ scale: 1.0 });
                const containerWidth = this.canvas.parentElement.clientWidth - 60; // padding
                const containerHeight = window.innerHeight * 0.8; // 80vh max
                
                // Calculer l'échelle pour s'adapter au conteneur tout en gardant les proportions
                const scaleX = containerWidth / viewport.width;
                const scaleY = containerHeight / viewport.height;
                this.scale = Math.min(scaleX, scaleY, 2.0); // Maximum scale de 2.0
                
                const finalViewport = page.getViewport({ scale: this.scale });
                
                // Ajuster la taille du canvas
                this.canvas.width = finalViewport.width;
                this.canvas.height = finalViewport.height;
                
                // Effet de transition
                this.canvas.style.opacity = '0.5';
                
                const renderContext = {
                    canvasContext: this.ctx,
                    viewport: finalViewport
                };
                
                await page.render(renderContext).promise;
                
                // Animation d'apparition
                this.canvas.style.opacity = '1';
                
            } catch (error) {
                console.error('Erreur lors du rendu de la page:', error);
            }
        }
        
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.renderPage(this.currentPage);
                this.updateControls();
            }
        }
        
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                this.renderPage(this.currentPage);
                this.updateControls();
            }
        }
        
        updateControls() {
            const currentPageElement = document.getElementById('current-page');
            const prevBtn = document.getElementById('prev-page');
            const nextBtn = document.getElementById('next-page');
            
            if (currentPageElement) {
                currentPageElement.textContent = this.currentPage;
            }
            if (prevBtn) {
                prevBtn.disabled = this.currentPage === 1;
            }
            if (nextBtn) {
                nextBtn.disabled = this.currentPage === this.totalPages;
            }
        }
    }

    // Créer une instance du PDFViewer
    new PDFViewer();
}


