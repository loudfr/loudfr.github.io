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
    closeBtn.addEventListener('click', closeModal);
    prevBtn.addEventListener('click', showPrevImage);
    nextBtn.addEventListener('click', showNextImage);
    zoomInBtn.addEventListener('click', zoomIn);
    zoomOutBtn.addEventListener('click', zoomOut);
    resetZoomBtn.addEventListener('click', resetZoom);

    // Keyboard and modal events
    document.addEventListener('keydown', function(e) {
        if (modal.style.display === 'block') {
            if (e.key === 'Escape') {
                closeModal();
            } else if (e.key === 'ArrowLeft') {
                showPrevImage();
            } else if (e.key === 'ArrowRight') {
                showNextImage();
            }
        }
    });

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Mouse wheel zoom
    modalImage.addEventListener('wheel', function(e) {
        e.preventDefault();
        if (e.deltaY < 0) {
            zoomIn();
        } else {
            zoomOut();
        }
    });

    // Initialize
    initializeImages();
});